const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const firestore = admin.firestore();

const createRecord = async (record, collection) => {
  console.info({ collection: "received" });

  const titleFormat = /^(.+)\s*:\s*([^:]+)$/;
  testDetails = record.title.match(titleFormat);
  if (testDetails === null) {
    throw new Error("Title is incorrectly formatted " + record.title);
  } else {
    record.testName = testDetails[1];
    record.testPhase = testDetails[2];
  }

  record.createdAt = new Date();
  await firestore
    .collection(collection)
    .doc()
    .set(record);
  return true;
}

exports.startScenario = functions.https.onRequest((request, response) => {
  return createRecord(request.body, "startScenario")
    .then(() => {
      return response.status(200).send({status: 'OK'});
    })
    .catch((e) => {
      console.error(e);
      return response.status(500).send({status: 'Error'});
    });
});

exports.finishScenario = functions.https.onRequest((request, response) => {
  return createRecord(request.body, "finishScenario")
    .then(() => {
      return response.status(200).send({status: 'OK'});
    })
    .catch((e) => {
      console.error(e);
      return response.status(500).send({status: 'Error'});
    });
});
