const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const POLLS_DATA_DIRECTORY = path.resolve(__dirname, '../../../../data/polls');
const SCHEDULE_DATA_DIRECTORY = path.resolve(__dirname, '../../../../schedules/data');

const pollsDataFilenames = fs.readdirSync(POLLS_DATA_DIRECTORY);
const scheduleDataFilenames = fs.readdirSync(SCHEDULE_DATA_DIRECTORY);

let numSeasonsPlayed = 0;
let firstLossOfSeasonsIndexTotal = 0;
const undefeatedSeasons = [];
const firstLossOfSeasonIndexes = [];

scheduleDataFilenames.forEach((scheduleDataFilename) => {
  const year = scheduleDataFilename.split('.')[0];

  if (year >= 1945 && year <= 2018) {
    numSeasonsPlayed++;

    let finalNdRankingInApPoll;
    const games = require(`${SCHEDULE_DATA_DIRECTORY}/${scheduleDataFilename}`);
    if (_.includes(pollsDataFilenames, scheduleDataFilename)) {
      const polls = require(`${POLLS_DATA_DIRECTORY}/${scheduleDataFilename}`);
      const finalApPoll = _.find(polls.ap, ['date', 'Final']);
      finalNdRankingInApPoll = _.get(finalApPoll, ['teams', 'Notre Dame', 'ranking'], 'NR');
    }

    let firstLossOfSeasonEncountered = false;
    games.forEach((gameData, i) => {
      if (!firstLossOfSeasonEncountered && gameData.result === 'L') {
        if (typeof firstLossOfSeasonIndexes[i] === 'undefined') {
          firstLossOfSeasonIndexes[i] = [{year, ranking: finalNdRankingInApPoll}];
        } else {
          firstLossOfSeasonIndexes[i].push({year, ranking: finalNdRankingInApPoll});
        }

        firstLossOfSeasonEncountered = true;
        firstLossOfSeasonsIndexTotal += i + 1;
      }
    });

    if (!firstLossOfSeasonEncountered) {
      undefeatedSeasons.push(year);
    }
  }
});

const numSeasonsWithLoss = _.flatten(firstLossOfSeasonIndexes).length;

console.log('NUM SEASONS:', numSeasonsPlayed);

console.log('NUM UNDEFEATED SEASONS:', undefeatedSeasons.length);
console.log('UNDEFEATED SEASONS:', undefeatedSeasons);

console.log('NUM SEASONS WITH LOSS:', numSeasonsWithLoss);
console.log('FIRST LOSS OF SEASON INDEXES:', firstLossOfSeasonIndexes.map((years) => years.length));
console.log(
  'FIRST LOSS OF SEASON INDEXES PERCENTAGES:',
  firstLossOfSeasonIndexes.map((years) => ((years.length / numSeasonsWithLoss) * 100).toFixed(2))
);
console.log('FIRST LOSS OF SEASON YEARS:', firstLossOfSeasonIndexes);
console.log(
  'AVERAGE WEEK OF FIRST LOSS:',
  (firstLossOfSeasonsIndexTotal / numSeasonsPlayed).toFixed(2)
);
