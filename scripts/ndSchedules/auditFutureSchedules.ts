import _ from 'lodash';

import {fetchFutureNdSchedules} from '../lib/futureSchedules';
import {Logger} from '../lib/logger';
import {NDSchedules} from '../lib/ndSchedules';
import {Teams} from '../lib/teams';

// Enable Sentry logging.
const logger = new Logger({isSentryEnabled: true});

const auditFutureNdSchedules = async (): Promise<void> => {
  logger.info(`Auditing future ND schedules...`);
  logger.newline(1);

  const futureNdSchedules = await fetchFutureNdSchedules();

  let needsUpdating = false;

  for (const [futureSeason, newFutureSeasonNdSchedule] of Object.entries(futureNdSchedules)) {
    const priorFutureSeasonNdSchedule = await NDSchedules.getForSeason(Number(futureSeason));

    const priorOpponentNames = priorFutureSeasonNdSchedule.map(({opponentId}) => {
      return Teams.getById(opponentId).name;
    });
    const newOpponentNames = newFutureSeasonNdSchedule.map(({opponentName}) => opponentName);

    const priorFirstDiff = _.chain(priorOpponentNames)
      .difference(newOpponentNames)
      .map((val) => `-${val}`)
      .value();
    const newFirstDiff = _.chain(newOpponentNames)
      .difference(priorOpponentNames)
      .map((val) => `+${val}`)
      .value();
    const diffGames = _.union(priorFirstDiff, newFirstDiff);

    const gamesWithWrongDate: string[] = [];
    const gamesWithWrongHomeStatus: string[] = [];
    newFutureSeasonNdSchedule.forEach((newGameData) => {
      const team = Teams.getByName(newGameData.opponentName);

      // Only check for changes if the game is already in the prior games list.
      const priorGameData = priorFutureSeasonNdSchedule.find((a) => team.id === a.opponentId);
      if (typeof priorGameData !== 'undefined') {
        if (priorGameData.isHomeGame !== newGameData.isHomeGame) {
          gamesWithWrongHomeStatus.push('@' + newGameData.opponentName);
        }

        const priorDate: Date | 'TBD' | null =
          priorGameData.date === 'TBD'
            ? 'TBD'
            : priorGameData.date
              ? new Date(priorGameData.date)
              : priorGameData.fullDate
                ? new Date(priorGameData.fullDate)
                : null;

        // Ensure both dates are either "TBD" or within 1 day of each other.
        let hasWrongGameDate = false;
        if (!priorDate) {
          hasWrongGameDate = true;
        } else if (priorDate === 'TBD') {
          if (newGameData.date !== 'TBD') {
            hasWrongGameDate = true;
          }
        } else {
          if (newGameData.date === 'TBD') {
            hasWrongGameDate = true;
          } else {
            // Calculate the difference between the dates in days, leaving 30 hours of potential
            // difference.
            const timeDiffInMilliseconds = Math.abs(
              priorDate.getTime() - newGameData.date.getTime()
            );
            const timeDiffInDays = timeDiffInMilliseconds / (1000 * 60 * 60 * 30);
            if (timeDiffInDays >= 1) {
              hasWrongGameDate = true;
            }
          }
        }

        if (hasWrongGameDate) {
          gamesWithWrongDate.push('*' + newGameData.opponentName);
        }
      }
    });

    const gamesNeedingUpdating = _.union(diffGames, gamesWithWrongDate, gamesWithWrongHomeStatus);
    if (gamesNeedingUpdating.length === 0) {
      logger.info(`${futureSeason}: CLEAR`);
    } else {
      needsUpdating = true;
      const gameOrGames = gamesNeedingUpdating.length === 1 ? 'GAME' : 'GAMES';
      logger.warning(
        `${futureSeason}: ${
          gamesNeedingUpdating.length
        } ${gameOrGames} (${gamesNeedingUpdating.join(', ')})`
      );
    }
  }

  if (needsUpdating) {
    logger.newline(2);

    // Log a message to Sentry to manually update the future ND schedules.
    logger.fail('MANUALLY UPDATE FUTURE ND SCHEDULES');
    logger.fail('See https://fbschedules.com/ncaa/notre-dame/ for game information to update.');
  }

  logger.newline();
};

async function main() {
  try {
    await auditFutureNdSchedules();
    logger.success(`Successfully audited future ND schedules!`);
  } catch (error) {
    logger.fail(`Failed to audit future ND schedules.`, {error});
    process.exit(1);
  }
}

main();
