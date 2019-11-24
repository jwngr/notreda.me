const _ = require('lodash');

const utils = require('../lib/utils');
const logger = require('../lib/logger');
const weather = require('../lib/weather');
const ndSchedules = require('../lib/ndSchedules');

const currentSeasonSchedule = ndSchedules.getForCurrentSeason();

const nextUpcomingCurrentSeasonGame = _.find(
  currentSeasonSchedule,
  ({result}) => typeof result === 'undefined'
);

if (typeof nextUpcomingCurrentSeasonGame === 'undefined') {
  logger.warning('Not fetching weather since current season is over.');
  process.exit(-1);
}

const gameInfoString = `${ndSchedules.CURRENT_SEASON} game against ${nextUpcomingCurrentSeasonGame.opponentId}`;
logger.info(`Fetching weather for ${gameInfoString}...`);

return weather
  .fetchForGame(
    nextUpcomingCurrentSeasonGame.location.coordinates,
    utils.getGameTimestampInSeconds(nextUpcomingCurrentSeasonGame)
  )
  .then((weather) => {
    nextUpcomingCurrentSeasonGame.weather = weather;

    ndSchedules.updateForCurrentSeason(currentSeasonSchedule);

    logger.success(`Updated weather for ${gameInfoString}!`);
  })
  .catch((error) => {
    logger.error(`Failed to update weather for upcoming game: ${error.message}`);
  });
