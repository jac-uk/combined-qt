#!/usr/bin/env node
const argv = require('yargs')
  .usage('Usage: $0 [options]')
  .alias('e', 'exercise')
  .describe('e', 'The name of the exercise as recorded in firestore ("recorder2019" for example).')
  .help('h')
  .version(false)
  .demandOption(['e'])
  .argv;

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');
admin.initializeApp({credential: admin.credential.cert(serviceAccount)});
const firestore = admin.firestore();

// NOTE: Firestore query limits mean that this will only get duplicates in the first 1,000 records it reads. This is fine for my
// puropose as the count is only meant to be indicative.
const checkDuplicates = async () => {
  const snapshot = await firestore
    .collection('timings')
    .where('exercise', '=', argv.e)
    .get();

  let sjStartDuplicates = 0;
  let sjFinishDuplicates = 0;
  let caStartDuplicates = 0;
  let caFinishDuplicates = 0;
  snapshot.forEach(doc => {
    const data = doc.data();
    const sjStarts = data.situationalJudgementStart && data.situationalJudgementStart.length || 0
    const sjFinishes = data.situationalJudgementFinish && data.situationalJudgementFinish.length || 0
    const caStarts = data.criticalAnalysisStart && data.criticalAnalysisStart.length || 0
    const caFinishes = data.criticalAnalysisFinish && data.criticalAnalysisFinish.length || 0
    if (sjStarts > 1) sjStartDuplicates += 1;
    if (sjFinishes> 1) sjFinishDuplicates += 1;
    if (caStarts > 1) caStartDuplicates += 1;
    if (caFinishes> 1) caFinishDuplicates += 1;
  })
  return { sjStartDuplicates, sjFinishDuplicates, caStartDuplicates, caFinishDuplicates };
}

const main = async () => {
  console.log(await checkDuplicates());
  return
}

main();
