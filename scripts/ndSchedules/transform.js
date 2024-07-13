import {Logger} from '../lib/logger';
import {transformForAllSeasons} from '../lib/ndSchedules';

const logger = new Logger({isSentryEnabled: false});

logger.info('Transforming schedule data...');

transformForAllSeasons(() => {});

logger.success('Schedule data transformed!');
