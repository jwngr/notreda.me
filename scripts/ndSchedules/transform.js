const logger = require('../lib/logger');
const ndSchedules = require('../lib/ndSchedules');

logger.info('Transforming schedule data...');

ndSchedules.transformForAllSeasons((gameData, season, gameIndex) => {
  // if (season === 2018) {
  //   delete gameData.result;
  // }
  delete gameData.sportsReferenceGameId;
});

logger.success('Schedule data transformed!');
