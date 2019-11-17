const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const ND_SCHEDULES_DATA_DIRECTORY = path.resolve(__dirname, '../../data/ndSchedules');
const COMBINED_SCHEDULE_FILENAME = path.resolve(
  __dirname,
  '../../website/src/resources/schedule.json'
);

const CURRENT_SEASON = 2019;
module.exports.CURRENT_SEASON = CURRENT_SEASON;
const LATEST_SEASON = 2037;
module.exports.LATEST_SEASON = LATEST_SEASON;
const ALL_SEASONS = [1887, 1888, 1889, ..._.range(1892, LATEST_SEASON + 1)];
module.exports.ALL_SEASONS = ALL_SEASONS;
module.exports.ALL_PLAYED_SEASONS = [1887, 1888, 1889, ..._.range(1892, CURRENT_SEASON + 1)];
module.exports.AP_POLL_SEASONS = _.range(1936, CURRENT_SEASON + 1);

const getForSeason = (season) => {
  try {
    return require(`${ND_SCHEDULES_DATA_DIRECTORY}/${season}.json`);
  } catch (error) {
    // If no file exists for the provided season, either Notre Dame did not play any games that
    // season or it is a future season with no games scheduled yet.
    return [];
  }
};
module.exports.getForSeason = getForSeason;

module.exports.getForCurrentSeason = () => {
  return getForSeason(CURRENT_SEASON);
};

const getForAllSeasons = () => {
  return require(COMBINED_SCHEDULE_FILENAME);
};
module.exports.getForAllSeasons = getForAllSeasons;

const updateForSeason = (season, seasonScheduleData) => {
  // TODO: handle file not existing.

  fs.writeFileSync(
    `${ND_SCHEDULES_DATA_DIRECTORY}/${season}.json`,
    JSON.stringify(seasonScheduleData, null, 2)
  );

  updateForAllSeasons({
    ...getForAllSeasons(),
    [season]: seasonScheduleData,
  });
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

  const updateForSeasonPromises = [];
  ALL_SEASONS.forEach((season) => {
    const seasonScheduleData = getForSeason(season);

    seasonScheduleData.forEach((gameData, i) => {
      transform(gameData, season, i);
    });

    allSeasonsScheduleData[season] = seasonScheduleData;

    updateForSeasonPromises.push(updateForSeason(season, seasonScheduleData));
  });

  await Promise.all([...updateForSeasonPromises, updateForAllSeasons(allSeasonsScheduleData)]);
};
