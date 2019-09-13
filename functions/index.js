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

const writeTiming = async (data) => {
	console.log({data});
  // await firestore.collection('submissions').doc(data.email).set(data, { merge: true });
  return true;
};

exports.updateTimings = functions.firestore.document('submissions/{submissionId}').onCreate(async (snap, context) => {
	const submission = await snap.data();
	const email = submission.email;
	const exercise = submission.exercise;
  const phase = submission.phase;
  const phaseCountKey = `${phase}Count`;
	const timing = {
		email,
		exercise,
	};
	timing[phase] =  submission.submittedAt;
  timing[phaseCountKey] = increment;

  const timingDoc = await firestore.collection('timings').doc(email).get();

  if (timingDoc.exists) {
    const existingData = timingDoc.data();
    // They've already submitted this once.
    if (existingData[phaseCountKey] !== undefined) {
      await firestore.collection('timings').doc(email).set({ [phaseCountKey]: increment }, { merge: true });
      return
    }
  } else {
    await firestore.collection('timings').doc(email).set(timing, { merge: true });
  }
	return true
});
