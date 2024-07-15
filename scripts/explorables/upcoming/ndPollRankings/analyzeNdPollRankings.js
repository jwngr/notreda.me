import _ from 'lodash';

import {getForSeason} from '../../../../website/src/resources/schedules';
import {ALL_SEASONS} from '../../../lib/constants';
import {Logger} from '../../../lib/logger';

const logger = new Logger({isSentryEnabled: false});

let pollRankings = {
  ap: Array(25).fill(0),
  bcs: Array(25).fill(0),
  coaches: Array(25).fill(0),
  cfbPlayoff: Array(25).fill(0),
};

async function main() {
  for (const season of ALL_SEASONS) {
    const seasonScheduleData = await getForSeason(season);
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
  }

  logger.log('AP Rankings');
  logger.log(pollRankings.ap.join(' '));

  logger.log('\nBCS Rankings');
  logger.log(pollRankings.bcs.join(' '));

  logger.log('\nCoaches Rankings');
  logger.log(pollRankings.coaches.join(' '));

  logger.log('\nCFB Playoff Rankings');
  logger.log(pollRankings.cfbPlayoff.join(' '));
}

main();
