const logger = require('../lib/logger');
const ndSchedules = require('../lib/ndSchedules');

logger.info('Generating combined schedule...');

const allSeasonsScheduleData = {};

ndSchedules.ALL_SEASONS.forEach((season) => {
  const seasonScheduleData = ndSchedules.getForSeason(season);

  // Optional: perform any updates to the yearly data here.
  seasonScheduleData.forEach((gameData, i) => {
    delete gameData.foo;
  });

  allSeasonsScheduleData[season] = seasonScheduleData;

  ndSchedules.updateForSeason(season, seasonScheduleData);
});

ndSchedules.updateForAllSeasons(allSeasonsScheduleData);

logger.success('Combined schedule generated!');
