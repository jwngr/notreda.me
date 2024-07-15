import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

import {Writable} from '../../../../website/src/models';
import {Logger} from '../../../lib/logger';
import {NDSchedules} from '../../../lib/ndSchedules';
import {ExpS1E1CoachInfo, ExpS1E1TeamRecordsInfo} from './models';

const logger = new Logger({isSentryEnabled: false});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const INPUT_DATA_DIRECTORY = path.resolve(__dirname, '../../../../website/src/resources/schedules');

async function main() {
  const dataFilenames = fs.readdirSync(INPUT_DATA_DIRECTORY);

  const seasons: Record<number, ExpS1E1TeamRecordsInfo> = {};
  const coaches: Record<string, ExpS1E1CoachInfo> = {};
  const coachOrder: string[] = [];

  const getPercentage = (top: number, bottom: number): string => {
    if (bottom === 0) {
      return '0.00';
    }

    return ((top * 100.0) / bottom).toFixed(1);
  };

  logger.info('YEARS:');

  for (const dataFilename of dataFilenames) {
    const season = Number(dataFilename.split('.')[0]);

    if (season <= 2018) {
      const seasonSchedule = await NDSchedules.getForSeason(season);

      const teamRecordsInfo: Writable<ExpS1E1TeamRecordsInfo> = {
        totalWinsCount: 0,
        totalGamesCount: 0,
        totalLossesCount: 0,
        totalDifferential: 0,
        top25Finishes: 0,
        onePossesssionGamesCount: 0,
        onePossesssionWinsCount: 0,
        onePossesssionLossesCount: 0,
      };

      seasonSchedule.forEach((gameData) => {
        if (!gameData.headCoach) return;

        if (!coachOrder.includes(gameData.headCoach)) {
          coachOrder.push(gameData.headCoach);
        }

        const coachInfo: Writable<ExpS1E1CoachInfo> = coaches[gameData.headCoach] || {
          name: gameData.headCoach,
          totalTiesCount: 0,
          totalWinsCount: 0,
          totalGamesCount: 0,
          totalLossesCount: 0,
          totalDifferential: 0,
          onePossesssionGamesCount: 0,
          onePossesssionTiesCount: 0,
          onePossesssionWinsCount: 0,
          onePossesssionLossesCount: 0,
        };

        if (gameData.result && gameData.score) {
          teamRecordsInfo.totalGamesCount += 1;
          coachInfo.totalGamesCount += 1;

          if (gameData.result === 'W') {
            teamRecordsInfo.totalWinsCount += 1;
            coachInfo.totalWinsCount += 1;
          } else if (gameData.result === 'L') {
            teamRecordsInfo.totalLossesCount += 1;
            coachInfo.totalLossesCount += 1;
          } else {
            coachInfo.totalTiesCount += 1;
          }

          const differential = Math.abs(gameData.score.home - gameData.score.away);
          teamRecordsInfo.totalDifferential += differential;
          coachInfo.totalDifferential += differential;

          if (differential <= 8) {
            teamRecordsInfo.onePossesssionGamesCount += 1;
            coachInfo.onePossesssionGamesCount += 1;

            if (gameData.result === 'W') {
              teamRecordsInfo.onePossesssionWinsCount += 1;
              coachInfo.onePossesssionWinsCount += 1;
            } else if (gameData.result === 'L') {
              teamRecordsInfo.onePossesssionLossesCount += 1;
              coachInfo.onePossesssionLossesCount += 1;
            } else {
              coachInfo.onePossesssionTiesCount += 1;
            }
          }
        }

        coaches[gameData.headCoach] = coachInfo;
      });

      seasons[season] = teamRecordsInfo;

      logger.newline();
      logger.info(`Processed ${season}`, {
        ...seasons[season],
        record: `${seasons[season].onePossesssionWinsCount}-${seasons[season].onePossesssionLossesCount}}`,
        overallWinPercentage:
          getPercentage(seasons[season].totalWinsCount, seasons[season].totalGamesCount) + '%',
        onePossesssionGameWinPercentage:
          getPercentage(
            seasons[season].onePossesssionWinsCount,
            seasons[season].onePossesssionGamesCount
          ) + '%',
      });
    }
  }

  logger.newline(2);
  logger.info('COACHES:');

  coachOrder.forEach((coach) => {
    const coachData = coaches[coach];

    logger.info(coach, {
      ...coachData,
      record: `${coachData.onePossesssionWinsCount}-${coachData.onePossesssionLossesCount}-${coachData.onePossesssionTiesCount}`,
      overallWinPercentage:
        getPercentage(coachData.totalWinsCount, coachData.totalGamesCount) + '%',
      onePossesssionGameWinPercentage:
        getPercentage(coachData.onePossesssionWinsCount, coachData.onePossesssionGamesCount) + '%',
    });
  });
}

main();
