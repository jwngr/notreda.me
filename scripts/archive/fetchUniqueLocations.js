const logger = require('../lib/logger');
const ndSchedules = require('../lib/ndSchedules');

logger.info('Fetching unique locations...');

let gamesCount = 0;
let locations = new Set();
ndSchedules.transformForAllSeasons((gameData) => {
  gamesCount++;

  if (gameData.location === 'TBD') {
    return;
  }

  const {city, state, country, stadium} = gameData.location;
  locations.add(`${city}|||${state || country}|||${stadium || ''}`);
});

logger.info('GAMES COUNT:', gamesCount);
logger.info('LOCATIONS COUNT:', locations.size);

locations.forEach((location) => {
  const [city, stateOrCountry, stadium] = location.split('|||');
  // eslint-disable-next-line no-console
  console.log(`${city}\t${stateOrCountry}\t${stadium}`);
});

logger.success('Unique locations fetched!');
