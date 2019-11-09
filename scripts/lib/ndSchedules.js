const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const ND_SCHEDULES_DATA_DIRECTORY = path.resolve(__dirname, '../../data/ndSchedules');
const COMBINED_SCHEDULE_FILENAME = path.resolve(__dirname, '../../src/resources/schedule.json');

const CURRENT_SEASON = 2019;
module.exports.CURRENT_SEASON = CURRENT_SEASON;
const ALL_SEASONS = [1887, 1888, 1889, ..._.range(1892, 2030)];
module.exports.ALL_SEASONS = ALL_SEASONS;
module.exports.ALL_PLAYED_SEASONS = [1887, 1888, 1889, ..._.range(1892, CURRENT_SEASON + 1)];
module.exports.AP_POLL_SEASONS = _.range(1936, CURRENT_SEASON + 1);

const getForSeason = (season) => {
  return require(`${ND_SCHEDULES_DATA_DIRECTORY}/${season}.json`);
};
module.exports.getForSeason = getForSeason;

module.exports.getForCurrentSeason = () => {
  return getForSeason(CURRENT_SEASON);
};

module.exports.getForAllSeasons = () => {
  return require(COMBINED_SCHEDULE_FILENAME);
};

const updateForSeason = (season, seasonScheduleData) => {
  fs.writeFileSync(
    `${ND_SCHEDULES_DATA_DIRECTORY}/${season}.json`,
    JSON.stringify(seasonScheduleData, null, 2)
  );
};
module.exports.updateForSeason = updateForSeason;

module.exports.updateForCurrentSeason = (seasonScheduleData) => {
  return updateForSeason(CURRENT_SEASON, seasonScheduleData);
};

const updateForAllSeasons = (allSeasonsScheduleData) => {
  fs.writeFileSync(COMBINED_SCHEDULE_FILENAME, JSON.stringify(allSeasonsScheduleData, null, 2));
};
module.exports.updateForAllSeasons = updateForAllSeasons;

module.exports.transformForAllSeasons = async (transform) => {
  const allSeasonsScheduleData = {};

  const updateForSeasonPromises = []
  ALL_SEASONS.forEach((season) => {
    const seasonScheduleData = getForSeason(season);

    seasonScheduleData.forEach((gameData, i) => {
      transform(gameData, season, i);
    });

    allSeasonsScheduleData[season] = seasonScheduleData;

    updateForSeasonPromises.push(updateForSeason(season, seasonScheduleData));
  });

  await Promise.all([
    ...updateForSeasonPromises,
    updateForAllSeasons(allSeasonsScheduleData)
  ])
};
