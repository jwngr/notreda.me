import {transformForAllSeasons} from '../../website/src/resources/schedules';
import {Logger} from '../lib/logger';

Logger.info('Fetching unique locations...');

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

Logger.info('GAMES COUNT:', gamesCount);
Logger.info('LOCATIONS COUNT:', locations.size);

locations.forEach((location) => {
  const [city, stateOrCountry, stadium] = location.split('|||');
  Logger.info(`${city}\t${stateOrCountry}\t${stadium}`);
});

Logger.success('Unique locations fetched!');
