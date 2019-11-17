const _ = require('lodash');

const teams = require('../lib/teams');
const logger = require('../lib/logger');
const sentry = require('../lib/sentry');
const ndSchedules = require('../lib/ndSchedules');
const futureSchedules = require('../lib/futureSchedules');

sentry.initialize();

const auditFutureNdSchedules = async () => {
  logger.info(`Auditing future ND schedules...`);
  logger.newline(1);

  const futureNdSchedules = await futureSchedules.fetchFutureNdSchedules();

  let needsUpdating = false;

  _.forEach(futureNdSchedules, (newFutureSeasonNdSchedule, futureSeason) => {
    const priorFutureSeasonNdSchedule = ndSchedules.getForSeason(futureSeason);

    const priorOpponentNames = priorFutureSeasonNdSchedule.map(({opponentId}) => {
      return teams.get(opponentId).name;
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

    const wrongDateGames = [];
    newFutureSeasonNdSchedule.forEach((newGameData) => {
      const team = teams.getFromName(newGameData.opponentName);
      const priorGameData = _.find(
        priorFutureSeasonNdSchedule,
        ({opponentId}) => team.id === opponentId
      );
      if (typeof priorGameData !== 'undefined') {
        // Only check for date changes if the game is already in the prior games list.
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
            // Calculate the difference between the dates in days.
            var timeDiffInMilliseconds = Math.abs(priorDate.getTime() - newGameData.date.getTime());
            var timeDiffInDays = timeDiffInMilliseconds / (1000 * 60 * 60 * 24);
            if (timeDiffInDays >= 1) {
              hasWrongGameDate = true;
            }
          }
        }

        if (hasWrongGameDate) {
          wrongDateGames.push('*' + newGameData.opponentName);
        }
      }
    });

    const gamesNeedingUpdating = _.union(diffGames, wrongDateGames);
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
  });

  if (needsUpdating) {
    logger.newline(2);
    logger.todo('MANUALLY UPDATE FUTURE ND SCHEDULES');
    logger.todo('See https://fbschedules.com/ncaa/notre-dame/ for game information to update.');

    // Log a message to Sentry to manually update the future ND schedules.
    sentry.captureMessage('Manually update future ND schedules', 'warning');
  }

  logger.newline();
};

return auditFutureNdSchedules()
  .then(() => {
    logger.success(`Successfully audited future ND schedules!`);
  })
  .catch((error) => {
    logger.fail(`Failed to audit future ND schedules: ${error.message}.`, {error});
  });
