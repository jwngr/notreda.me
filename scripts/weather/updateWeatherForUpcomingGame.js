const logger = require('../lib/logger');
const weather = require('../lib/weather');

logger.info('Updating weather for upcoming game...');

return weather
  .fetchForecast(37.8267, -122.4233)
  .then((forecast) => {
    console.log('FORECAST:', JSON.stringify(forecast));
    logger.success('Updated weather for upcoming game!');
  })
  .catch((error) => {
    logger.error(`Failed to update weather for upcoming game: ${error.message}`);
  });
