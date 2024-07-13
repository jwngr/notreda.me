import {Logger} from '../lib/logger';
import {transformForAllSeasons} from '../lib/ndSchedules';

Logger.info('Transforming schedule data...');

transformForAllSeasons(() => {});

Logger.success('Schedule data transformed!');
