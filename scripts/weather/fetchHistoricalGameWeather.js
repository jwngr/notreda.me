const _ = require('lodash');

const utils = require('../lib/utils');
const logger = require('../lib/logger');
const weather = require('../lib/weather');
const ndSchedules = require('../lib/ndSchedules');

logger.info('Updating weather for historical games...');

const fetchWeatherPromises = [];
_.forEach(ndSchedules.getForAllSeasons(), (seasonScheduleData, season) => {
  let currentSeasonFetchWeatherPromises = [];

  _.forEach(seasonScheduleData, (gameData) => {
    if (gameData.result && !gameData.weather && season === '2019') {
      const [lat, lon] = gameData.location.coordinates;

      currentSeasonFetchWeatherPromises.push(
        weather
          .fetchForGame([lat, lon], utils.getGameTimestampInSeconds(gameData))
          .then((weather) => {
            if (!weather.temperature) {
              logger.warning('NO FORECAST!', {
                season,
                opponentId: gameData.opponentId,
                location: gameData.location.city + ', ' + gameData.location.state,
                timestamp,
              });
            } else {
              weather.icon = weather.icon || 'unknown';
              gameData.weather = weather;
            }
          })
      );
    }
  });

  fetchWeatherPromises.push(
    Promise.all(currentSeasonFetchWeatherPromises).then(() => {
      ndSchedules.updateForSeason(season, seasonScheduleData);
    })
  );
});

return Promise.all(fetchWeatherPromises)
  .then(() => {
    logger.success('Updated weather for historical games!');
  })
  .catch((error) => {
    logger.error(`Failed to update weather for historical games: ${error.message}`);
  });
