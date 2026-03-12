import {TeamRankings} from '../../../../website/src/models/teams.models';
import {ALL_SEASONS} from '../../../lib/constants';
import {Logger} from '../../../lib/logger';
import {NDSchedules} from '../../../lib/ndSchedules';

const logger = new Logger({isSentryEnabled: false});

const pollRankings: Record<keyof TeamRankings, number[]> = {
  ap: Array(25).fill(0),
  bcs: Array(25).fill(0),
  coaches: Array(25).fill(0),
  cfbPlayoff: Array(25).fill(0),
};

async function main() {
  for (const season of ALL_SEASONS) {
    const seasonScheduleData = await NDSchedules.getForSeason(season);
    seasonScheduleData
      .filter(({result}) => typeof result !== 'undefined')
      .forEach((gameData) => {
        if (!gameData.rankings) {
          return;
        }

        const ndPollRankings = gameData.isHomeGame
          ? gameData.rankings.home
          : gameData.rankings.away;

        if (!ndPollRankings) {
          return;
        }

        for (const [poll, ranking] of Object.entries(ndPollRankings)) {
          if (typeof ranking !== 'number') {
            continue;
          }

          pollRankings[poll as keyof TeamRankings][ranking - 1]++;
        }
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
