import _ from 'lodash';

import {getForSeason} from '../../../../website/src/resources/schedules';
import {ALL_SEASONS} from '../../../lib/constants';
import {Logger} from '../../../lib/logger';

let pollRankings = {
  ap: Array(25).fill(0),
  bcs: Array(25).fill(0),
  coaches: Array(25).fill(0),
  cfbPlayoff: Array(25).fill(0),
};

ALL_SEASONS.forEach((season) => {
  const seasonScheduleData = getForSeason(season);
  seasonScheduleData
    .filter(({result}) => typeof result !== 'undefined')
    .forEach((gameData) => {
      const ndPollRankings = gameData.isHomeGame
        ? _.get(gameData, 'rankings.home')
        : _.get(gameData, 'rankings.away');

      _.forEach(ndPollRankings, (ranking, poll) => {
        pollRankings[poll][ranking - 1]++;
      });
    });
});

Logger.log('AP Rankings');
Logger.log(pollRankings.ap.join(' '));

Logger.log('\nBCS Rankings');
Logger.log(pollRankings.bcs.join(' '));

Logger.log('\nCoaches Rankings');
Logger.log(pollRankings.coaches.join(' '));

Logger.log('\nCFB Playoff Rankings');
Logger.log(pollRankings.cfbPlayoff.join(' '));
