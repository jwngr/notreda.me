import fs from 'fs';
import path from 'path';

const TEAM_SCHEDULES_DATA_DIRECTORY = path.resolve(__dirname, '../../data/teamSchedules');

const teamFilenames = fs.readdirSync(TEAM_SCHEDULES_DATA_DIRECTORY);

module.exports.getForSeason = (teamName, season) => {
  return require(`${TEAM_SCHEDULES_DATA_DIRECTORY}/${teamName}.json`)[String(season)];
};

module.exports.get = (teamName, season) => {
  const teamScheduleData = require(`${TEAM_SCHEDULES_DATA_DIRECTORY}/${teamName}.json`);
  return season ? teamScheduleData[String(season)] : teamScheduleData;
};

module.exports.forEach = (callback) => {
  teamFilenames.forEach((teamFilename) => {
    const teamName = teamFilename.replace('.json', '');
    const teamScheduleData = require(`${TEAM_SCHEDULES_DATA_DIRECTORY}/${teamFilename}`);
    callback(teamName, teamScheduleData);
  });
};
