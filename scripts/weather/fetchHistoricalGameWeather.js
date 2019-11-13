const _ = require('lodash');

const logger = require('../lib/logger');
const weather = require('../lib/weather');
const ndSchedules = require('../lib/ndSchedules');

logger.info('Updating weather for historical games...');

const fetchWeatherPromises = [];
_.forEach(ndSchedules.getForAllSeasons(), (seasonScheduleData, season) => {
  let currentSeasonFetchWeatherPromises = [];

  _.forEach(seasonScheduleData, (gameData) => {
    // TODO: already fetched weather for seasons after and including 1950.
    if (gameData.result && !gameData.weather && season < '1950') {
      let d;
      if (gameData.fullDate) {
        d = new Date(gameData.fullDate);
      } else if (gameData.time) {
        d = new Date(gameData.date + ' ' + gameData.time);
      } else {
        d = new Date(gameData.date);
      }

      const timestamp = d.getTime() / 1000;
      const [lat, lon] = gameData.location.coordinates;

      currentSeasonFetchWeatherPromises.push(
        weather.fetchForecast([lat, lon], timestamp).then((weather) => {
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
