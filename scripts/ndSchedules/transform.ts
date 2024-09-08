import {Logger} from '../lib/logger';
import {NDSchedules} from '../lib/ndSchedules';

const logger = new Logger({isSentryEnabled: false});

logger.info('Transforming schedule data...');

NDSchedules.transformForAllSeasons((gameData) => {
  // Add code here. The returned value is the transformed schedule data.
  return gameData;
});

logger.success('Schedule data transformed!');
