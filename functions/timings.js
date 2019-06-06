const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

const getRecords = async (collection, title) => {
  const data = {};
  const dbRef = await db
    .collection(collection)
  // .where("title", "<", "E")
    .where("title", "==", title)
    .get();

  for(doc of dbRef.docs) {
    const item = doc.data();
    data[item.email.toLowerCase()] = item.createdAt.toDate();
  }
  return data;
}

const main = async () => {
  const starts = await getRecords("startScenario", "Welcome to the Deputy District Judge (Civil) Online Scenario Test");
  const finishes = await getRecords("finishScenario", "Deputy District Judge (Civil) Online Scenario Test");

  return console.log(starts);
}

main();
