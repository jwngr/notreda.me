import {Logger} from '../lib/logger';
import {NDSchedules} from '../lib/ndSchedules';

const logger = new Logger({isSentryEnabled: false});

logger.info('Transforming schedule data...');

NDSchedules.transformForAllSeasons(() => {});

logger.success('Schedule data transformed!');
