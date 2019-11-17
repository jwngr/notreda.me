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

  let hasDiff = false;

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
    const diff = _.union(priorFirstDiff, newFirstDiff);
    if (diff.length === 0) {
      hasDiff = true;
      logger.info(`${futureSeason}: CLEAR`);
    } else {
      logger.warning(
        `${futureSeason}: ${diff.length} GAME${diff.length === 1 ? '' : 'S'} (${diff.join(', ')})`
      );
    }
  });

  if (hasDiff) {
    logger.newline(2);
    logger.todo('MANUALLY UPDATE FUTURE ND SCHEDULES');
    logger.todo('See https://fbschedules.com/ncaa/notre-dame/ for game information to update.');
    logger.newline(2);

    // Log a message to Sentry to manually update the future ND schedules.
    sentry.captureMessage('Manually update future ND schedules', 'warning');
  }
};

return auditFutureNdSchedules()
  .then(() => {
    logger.success(`Successfully audited future ND schedules!`);
  })
  .catch((error) => {
    logger.fail(`Failed to audit future ND schedules: ${error.message}.`, {error});
  });
