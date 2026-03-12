import {GameInfo} from '../../website/src/models/games.models';
import {ALL_SEASONS} from '../lib/constants';
import {Logger} from '../lib/logger';
import {NDSchedules} from '../lib/ndSchedules';

const logger = new Logger({isSentryEnabled: false});

const run = async () => {
  logger.info('Fetching unique locations...');

  let gamesCount = 0;
  const locations = new Set<string>();
  for (const season of ALL_SEASONS) {
    const seasonData = await NDSchedules.getForSeason(season);
    seasonData.forEach((gameData: GameInfo) => {
      gamesCount++;

      if (!gameData.location) {
        // Home games have no location.
        return;
      }

      if (gameData.location === 'TBD') {
        // Some future games have a TBD location.
        return;
      }

      const {city, state, country, stadium} = gameData.location;
      locations.add(`${city}|||${state || country}|||${stadium || ''}`);
    });
  }

  logger.info('GAMES COUNT:', {gamesCount});
  logger.info('LOCATIONS COUNT:', {locationsCount: locations.size});

  locations.forEach((location) => {
    const [city, stateOrCountry, stadium] = location.split('|||');
    logger.info(`${city}\t${stateOrCountry}\t${stadium}`);
  });

  logger.success('Unique locations fetched!');
};

run().catch((error) => {
  logger.fail('Failed to fetch unique locations.', {error});
});
