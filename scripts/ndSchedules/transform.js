const logger = require('../lib/logger');
const ndSchedules = require('../lib/ndSchedules');

logger.info('Transforming schedule data...');

ndSchedules.transformForAllSeasons((gameData, season, gameIndex) => {});

logger.success('Schedule data transformed!');
