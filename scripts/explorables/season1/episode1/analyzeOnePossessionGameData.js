import _ from 'lodash';

import {Logger} from '../../../lib/logger';
import onePossessionNdCoachData from './data/ndCoachesOnePossessionGames.json';
import onePossessionGameData from './data/top25OnePossessionGames.json';

_.forEach(onePossessionGameData, (data, teamName) => {
  onePossessionGameData[teamName].teamName = teamName;
  onePossessionGameData[teamName].percentageOfGamesWhichAreOnePossessionGames = (
    (data.onePossesssionGamesCount * 100.0) /
    data.totalGamesCount
  ).toFixed(1);
});

_.forEach(onePossessionNdCoachData, (data, coachName) => {
  onePossessionNdCoachData[coachName].percentageOfGamesWhichAreOnePossessionGames = (
    (data.onePossesssionGamesCount * 100.0) /
    data.totalGamesCount
  ).toFixed(1);
});

const teamsSortedByPercentOfGamesWhichAreOnePossessionGames = _.sortBy(
  onePossessionGameData,
  'percentageOfGamesWhichAreOnePossessionGames'
);

Logger.newline(2);

teamsSortedByPercentOfGamesWhichAreOnePossessionGames.forEach(
  ({teamName, top25Finishes, percentageOfGamesWhichAreOnePossessionGames}) => {
    Logger.info(
      `["${teamName}", ${top25Finishes}, "", "${percentageOfGamesWhichAreOnePossessionGames}%"],`
    );
  }
);

Logger.newline(2);

const coachesSortedByPercentOfGamesWhichAreOnePossessionGames = _.sortBy(
  onePossessionNdCoachData,
  'percentageOfGamesWhichAreOnePossessionGames'
);

coachesSortedByPercentOfGamesWhichAreOnePossessionGames.forEach(
  ({name, totalGamesCount, percentageOfGamesWhichAreOnePossessionGames}) => {
    if (totalGamesCount > 10 && name !== 'No coach') {
      Logger.info(
        `["${name}", ${totalGamesCount}, "${percentageOfGamesWhichAreOnePossessionGames}%"],`
      );
    }
  }
);
