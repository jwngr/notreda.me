import _ from 'lodash';

import {getForSeason} from '../../website/src/resources/schedules';
import futureSchedules from '../lib/futureSchedules';
import {Logger} from '../lib/logger';
import sentry from '../lib/sentry';
import teams from '../lib/teams';

sentry.initialize();

const auditFutureNdSchedules = async () => {
  Logger.info(`Auditing future ND schedules...`);
  Logger.newline(1);

  const futureNdSchedules = await futureSchedules.fetchFutureNdSchedules();

  let needsUpdating = false;

  _.forEach(futureNdSchedules, (newFutureSeasonNdSchedule, futureSeason) => {
    const priorFutureSeasonNdSchedule = getForSeason(futureSeason);

    const priorOpponentNames = priorFutureSeasonNdSchedule.map(({opponentId}) => {
      return teams.getById(opponentId).name;
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

    const gamesWithWrongDate = [];
    const gamesWithWrongHomeStatus = [];
    newFutureSeasonNdSchedule.forEach((newGameData) => {
      const team = teams.getByName(newGameData.opponentName);

      // Only check for changes if the game is already in the prior games list.
      const priorGameData = _.find(
        priorFutureSeasonNdSchedule,
        ({opponentId}) => team.id === opponentId
      );

      if (typeof priorGameData !== 'undefined') {
        if (priorGameData.isHomeGame !== newGameData.isHomeGame) {
          gamesWithWrongHomeStatus.push('@' + newGameData.opponentName);
        }

        const priorDate =
          priorGameData.date === 'TBD'
            ? 'TBD'
            : new Date(priorGameData.date || priorGameData.fullDate);

        // Ensure both dates are either "TBD" or within 1 day of each other.
        let hasWrongGameDate = false;
        if (priorDate === 'TBD') {
          if (newGameData.date !== 'TBD') {
            hasWrongGameDate = true;
          }
        } else {
          if (newGameData.date === 'TBD') {
            hasWrongGameDate = true;
          } else {
            // Calculate the difference between the dates in days, leaving 30 hours of potential
            // difference.
            var timeDiffInMilliseconds = Math.abs(priorDate.getTime() - newGameData.date.getTime());
            var timeDiffInDays = timeDiffInMilliseconds / (1000 * 60 * 60 * 30);
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
      Logger.info(`${futureSeason}: CLEAR`);
    } else {
      needsUpdating = true;
      const gameOrGames = gamesNeedingUpdating.length === 1 ? 'GAME' : 'GAMES';
      Logger.warning(
        `${futureSeason}: ${
          gamesNeedingUpdating.length
        } ${gameOrGames} (${gamesNeedingUpdating.join(', ')})`
      );
    }
  });

  if (needsUpdating) {
    Logger.newline(2);

    Logger.fail('MANUALLY UPDATE FUTURE ND SCHEDULES');
    Logger.fail('See https://fbschedules.com/ncaa/notre-dame/ for game information to update.');

    // Log a message to Sentry to manually update the future ND schedules.
    sentry.captureMessage('Manually update future ND schedules', 'warning');
  }

  Logger.newline();
};

auditFutureNdSchedules()
  .then(() => {
    Logger.success(`Successfully audited future ND schedules!`);
  })
  .catch((error) => {
    Logger.fail(`Failed to audit future ND schedules: ${error.message}.`, {error});
  });
