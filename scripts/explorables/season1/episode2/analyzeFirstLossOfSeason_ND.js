import _ from 'lodash';

import {ALL_PLAYED_SEASONS} from '../../../lib/constants';
import {Logger} from '../../../lib/logger';
import {getForSeason} from '../../../lib/ndSchedules';
import polls from '../../../lib/polls';

let numSeasonsPlayed = 0;
let firstLossOfSeasonsIndexTotal = 0;
const undefeatedSeasons = [];
const firstLossOfSeasonIndexes = [];
const weekOfFirstLossPerSeason = {};

ALL_PLAYED_SEASONS.forEach((season) => {
  numSeasonsPlayed++;

  let finalNdRankingInApPoll;
  const seasonScheduleData = getForSeason(season);

  const seasonPolls = polls.getForSeason(season);
  if (seasonPolls !== null) {
    const finalApPoll = _.find(seasonPolls.ap, ['date', 'Final']);
    finalNdRankingInApPoll = _.get(finalApPoll, ['teams', 'Notre Dame', 'ranking'], 'NR');
  }

  let firstLossOfSeasonEncountered = false;
  let winsBeforeFirstLoss = 0;
  let tiesBeforeFirstLoss = 0;
  seasonScheduleData.forEach((gameData, i) => {
    if (gameData.result === 'L') {
      if (!firstLossOfSeasonEncountered) {
        if (typeof firstLossOfSeasonIndexes[i] === 'undefined') {
          firstLossOfSeasonIndexes[i] = [{season, ranking: finalNdRankingInApPoll}];
        } else {
          firstLossOfSeasonIndexes[i].push({season, ranking: finalNdRankingInApPoll});
        }

        let recordBeforeFirstLoss = `${winsBeforeFirstLoss}-0`;
        if (tiesBeforeFirstLoss > 0) {
          recordBeforeFirstLoss += `-${tiesBeforeFirstLoss}`;
        }

        weekOfFirstLossPerSeason[season] = {
          numGamesInSeason: seasonScheduleData.length,
          numGamesPlayedBeforeFirstLoss: i,
          recordBeforeFirstLoss,
        };

        firstLossOfSeasonEncountered = true;
        firstLossOfSeasonsIndexTotal += i + 1;
      }
    } else if (gameData.result === 'W') {
      winsBeforeFirstLoss++;
    } else {
      tiesBeforeFirstLoss++;
    }
  });

  if (!firstLossOfSeasonEncountered) {
    undefeatedSeasons.push(season);

    let recordBeforeFirstLoss = `${winsBeforeFirstLoss}-0`;
    if (tiesBeforeFirstLoss > 0) {
      recordBeforeFirstLoss += `-${tiesBeforeFirstLoss}`;
    }

    weekOfFirstLossPerSeason[season] = {
      numGamesInSeason: seasonScheduleData.length,
      numGamesPlayedBeforeFirstLoss: seasonScheduleData.length,
      recordBeforeFirstLoss,
    };
    Logger.info(season, recordBeforeFirstLoss);
  }
});

const numSeasonsWithLoss = _.flatten(firstLossOfSeasonIndexes).length;

Logger.info('NUM SEASONS:', numSeasonsPlayed);

Logger.info('NUM UNDEFEATED SEASONS:', undefeatedSeasons.length);
Logger.info('UNDEFEATED SEASONS:', undefeatedSeasons);

Logger.info('NUM SEASONS WITH LOSS:', numSeasonsWithLoss);
Logger.info(
  'FIRST LOSS OF SEASON INDEXES:',
  firstLossOfSeasonIndexes.map((years) => years.length)
);
Logger.info(
  'FIRST LOSS OF SEASON INDEXES PERCENTAGES:',
  firstLossOfSeasonIndexes.map((years) =>
    Number(((years.length / (numSeasonsWithLoss + undefeatedSeasons.length)) * 100).toFixed(2))
  )
);
Logger.info('FIRST LOSS OF SEASON YEARS:', firstLossOfSeasonIndexes);
Logger.info(
  'AVERAGE WEEK OF FIRST LOSS:',
  (firstLossOfSeasonsIndexTotal / numSeasonsPlayed).toFixed(2)
);

// const result = [];
// let lossCount = 0;
// Logger.info('NUM SEASONS PLAYED:', numSeasonsPlayed);
// _.forEach(firstLossOfSeasonIndexes, (years) => {
//   lossCount += _.size(years);
//   result.push(Number(((lossCount * 100) / numSeasonsPlayed).toFixed(2)));
// });
// Logger.info(result);

Logger.info('WEEK OF FIRST LOSS:', weekOfFirstLossPerSeason);
