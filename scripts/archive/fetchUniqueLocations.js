import {transformForAllSeasons} from '../../website/src/resources/schedules';
import {Logger} from '../lib/logger';

const logger = new Logger({isSentryEnabled: false});

logger.info('Fetching unique locations...');

let gamesCount = 0;
let locations = new Set();
transformForAllSeasons((gameData) => {
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
  logger.info(`${city}\t${stateOrCountry}\t${stadium}`);
});

logger.success('Unique locations fetched!');
