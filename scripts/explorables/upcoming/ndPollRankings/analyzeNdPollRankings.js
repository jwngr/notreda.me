const _ = require('lodash');

const logger = require('../../../lib/logger');
const ndSchedules = require('../../../lib/ndSchedules');

let pollRankings = {
  ap: Array(25).fill(0),
  bcs: Array(25).fill(0),
  coaches: Array(25).fill(0),
  cfbPlayoff: Array(25).fill(0),
};

_.forEach(ndSchedules.getForAllSeasons(), (seasonScheduleData) => {
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

logger.log('AP Rankings');
logger.log(pollRankings.ap.join(' '));

logger.log('\nBCS Rankings');
logger.log(pollRankings.bcs.join(' '));

logger.log('\nCoaches Rankings');
logger.log(pollRankings.coaches.join(' '));

logger.log('\nCFB Playoff Rankings');
logger.log(pollRankings.cfbPlayoff.join(' '));
