const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const firestore = admin.firestore();
const NotifyClient = require('notifications-node-client').NotifyClient;

const sendEmail = async (record) => {
  if (record.simpleKey !== functions.config().simple.key) {
    console.warn('Attempted unauthorised use');
    return false;
  } else {
    console.info({ sendingEmail: record.email });

    const client = new NotifyClient(functions.config().notify.key);
    await client.sendEmail(record.template, record.email, {});

    console.info({ sentEmail: record.email });
    return true;
  }
}

exports.sendEmail = functions.https.onRequest((request, response) => {
  return sendEmail(request.body, "startScenario")
    .then(() => {
      return response.status(200).send({status: 'OK'});
    })
    .catch((e) => {
      console.error(e);
      return response.status(500).send({status: 'Error'});
    });
});

