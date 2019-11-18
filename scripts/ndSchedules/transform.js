const logger = require('../lib/logger');
const ndSchedules = require('../lib/ndSchedules');

logger.info('Transforming schedule data...');

const coordinates = {};
ndSchedules.transformForAllSeasons((gameData, season, gameIndex) => {
  // if (season === 2018) {
  //   delete gameData.result;
  // }
  const {location} = gameData;
  if (location !== 'TBD') {
    const key = `${location.city}-${location.state || location.country}-${location.stadium}`;
    if (!location.coordinates) {
      const c = coordinates[key];
      console.log(season, gameData.opponentId, c, key);
      gameData.location.coordinates = c;
    } else {
      coordinates[key] = location.coordinates;
    }
  }
});

logger.success('Schedule data transformed!');
