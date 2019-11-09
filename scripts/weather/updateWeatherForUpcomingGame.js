const logger = require('../lib/logger');
const openWeatherMap = require('../lib/openWeatherMap');

logger.info('Updating weather for upcoming game...');

const CITY_ID = 235123;
return openWeatherMap.fetchForecastByCityId(CITY_ID).then((forecast) => {
  console.log('FORECAST:', JSON.stringify(forecast));
  logger.success('Updated weather for upcoming game!');
}).catch((error) => {
  logger.error(`Failed to update weather for upcoming game: ${error.message}`)
});
