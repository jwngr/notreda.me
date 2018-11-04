const _ = require('lodash');

const polls = require('../../../lib/polls');
const logger = require('../../../lib/logger');
const ndSchedules = require('../../../lib/ndSchedules');

let numSeasonsPlayed = 0;
let firstLossOfSeasonsIndexTotal = 0;
const undefeatedSeasons = [];
const firstLossOfSeasonIndexes = [];
const weekOfFirstLossPerSeason = {};

ndSchedules.ALL_PLAYED_SEASONS.forEach((season) => {
  numSeasonsPlayed++;

  let finalNdRankingInApPoll;
  const seasonScheduleData = ndSchedules.getForSeason(season);

  const seasonPolls = polls.getForSeason(season);
  if (seasonPolls !== null) {
    const finalApPoll = _.find(seasonPolls.ap, ['date', 'Final']);
    finalNdRankingInApPoll = _.get(finalApPoll, ['teams', 'Notre Dame', 'ranking'], 'NR');
  }

  let firstLossOfSeasonEncountered = false;
  seasonScheduleData.forEach((gameData, i) => {
    if (!firstLossOfSeasonEncountered && gameData.result === 'L') {
      if (typeof firstLossOfSeasonIndexes[i] === 'undefined') {
        firstLossOfSeasonIndexes[i] = [{season, ranking: finalNdRankingInApPoll}];
      } else {
        firstLossOfSeasonIndexes[i].push({season, ranking: finalNdRankingInApPoll});
      }

      weekOfFirstLossPerSeason[season] = {
        weekOfFirstLossIndex: i,
        numGames: seasonScheduleData.length,
      };
      firstLossOfSeasonEncountered = true;
      firstLossOfSeasonsIndexTotal += i + 1;
    }

    if (!firstLossOfSeasonEncountered) {
      weekOfFirstLossPerSeason[season] = {
        weekOfFirstLossIndex: null,
        numGames: seasonScheduleData.length,
      };
    }
  });

  if (!firstLossOfSeasonEncountered) {
    undefeatedSeasons.push(season);
  }
});

const numSeasonsWithLoss = _.flatten(firstLossOfSeasonIndexes).length;

logger.info('NUM SEASONS:', numSeasonsPlayed);

logger.info('NUM UNDEFEATED SEASONS:', undefeatedSeasons.length);
logger.info('UNDEFEATED SEASONS:', undefeatedSeasons);

logger.info('NUM SEASONS WITH LOSS:', numSeasonsWithLoss);
logger.info('FIRST LOSS OF SEASON INDEXES:', firstLossOfSeasonIndexes.map((years) => years.length));
logger.info(
  'FIRST LOSS OF SEASON INDEXES PERCENTAGES:',
  firstLossOfSeasonIndexes.map((years) =>
    Number(((years.length / (numSeasonsWithLoss + undefeatedSeasons.length)) * 100).toFixed(2))
  )
);
logger.info('FIRST LOSS OF SEASON YEARS:', firstLossOfSeasonIndexes);
logger.info(
  'AVERAGE WEEK OF FIRST LOSS:',
  (firstLossOfSeasonsIndexTotal / numSeasonsPlayed).toFixed(2)
);

// const result = [];
// let lossCount = 0;
// console.log('NUM SEASONS PLAYED:', numSeasonsPlayed);
// _.forEach(firstLossOfSeasonIndexes, (years) => {
//   lossCount += _.size(years);
//   result.push(Number(((lossCount * 100) / numSeasonsPlayed).toFixed(2)));
// });
// logger.info(result);

logger.info('WEEK OF FIRST LOSS:', weekOfFirstLossPerSeason);
