const logger = require('../lib/logger');
const schedules = require('../lib/schedules');

logger.info('Generating combined schedule...');

const allSeasonsScheduleData = {};

schedules.ALL_SEASONS.forEach((season) => {
  const seasonScheduleData = schedules.getForSeason(season);

  // Optional: perform any updates to the yearly data here.
  seasonScheduleData.forEach((gameData, i) => {
    delete gameData.foo;
  });

  allSeasonsScheduleData[season] = seasonScheduleData;

  schedules.updateForSeason(season, seasonScheduleData);
});

schedules.updateForAllSeasons(allSeasonsScheduleData);

logger.success('Combined schedule generated!');
