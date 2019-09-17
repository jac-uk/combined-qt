const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const firestore = admin.firestore();
const increment = admin.firestore.FieldValue.increment(1);
const NotifyClient = require('notifications-node-client').NotifyClient;

const sendEmail = async (record) => {
  if (record.template === undefined) return;
  if (record.simpleKey !== functions.config().simple.key) {
    console.warn(`Attempted unauthorised use ${record.simpleKey}`);
  } else {
    console.info({ sendingEmail: record.email });

    const client = new NotifyClient(functions.config().notify.key);
    await client.sendEmail(record.template, record.email, {});

    console.info({ sentEmail: record.email });
  }
}

const writeRecord = async (record) => {
  if (record.simpleKey !== functions.config().simple.key) {
    console.warn(`Attempted unauthorised use ${record.simpleKey}`);
    record.badSimpleKey = record.simpleKey;
  }
  if (typeof record.submittedAt === 'string') record.submittedAt = new Date(record.submittedAt);
  delete record.simpleKey;
  record.createdAt = new Date();
  await firestore.collection('submissions').add(record);
  return true;
};

exports.sendEmail = functions.https.onRequest(async (request, response) => {
  await sendEmail(request.body);
  await writeRecord(request.body);
  return response.status(200).send({status: 'OK'})
});

const updateCount = async (exercise, phase) => {
  const numShards = 10;
  const shardId = Math.floor(Math.random() * numShards).toString();
  const count = admin.firestore.FieldValue.increment(1);
  await firestore
    .collection('counters')
    .doc(`${exercise}${phase}${shardId}`)
    .set({ count, exercise, phase }, { merge: true })
  return
}

exports.updateTimings = functions.firestore.document('submissions/{submissionId}').onCreate(async (snap, context) => {
	const submission = await snap.data();
  const email = submission.email.toLowerCase();
	const exercise = submission.exercise;
  const phase = submission.phase;
  const phaseSubmissionsKey = `${phase}Submissions`;
  const phaseDurationKey = `${phase}Duration`;
	const timing = {
		email,
    exercise,
	};
	timing[phase] = admin.firestore.FieldValue.arrayUnion(submission.submittedAt);
  timing[phaseSubmissionsKey] = admin.firestore.FieldValue.arrayUnion(context.params.submissionId);
  console.info(JSON.stringify({ updateTimings: email, phase }));

  const timingRef = await firestore
    .collection('timings')
    .where('email', '=', email)
    .where('exercise', '=', exercise)
    .limit(1)

  const snapshot = await timingRef.get();

  if (snapshot.empty) {
    await firestore.collection('timings').doc().set(timing);
  } else {
    snapshot.forEach(async (doc) => {
      const data = doc.data();
      const situationalJudgementStart = data.situationalJudgementStart || [];
      const criticalAnalysisStart = data.criticalAnalysisStart || [];

      // Calculate timings.
      if (submission.submittedAt && situationalJudgementStart.length > 0 && phase === 'situationalJudgementFinish') {
        timing[phaseDurationKey] = Math.ceil((submission.submittedAt.toDate() - situationalJudgementStart[0].toDate()) / 60000);
      }
      if (submission.submittedAt && criticalAnalysisStart.length > 0 && phase === 'criticalAnalysisFinish') {
        timing[phaseDurationKey] = Math.ceil((submission.submittedAt.toDate() - criticalAnalysisStart[0].toDate()) / 60000);
      }
      await doc.ref.set(timing, { merge: true });
    });
  }

  // NOTE: it counts duplicate submissions.
  await updateCount(exercise, phase);
  return true;
});

