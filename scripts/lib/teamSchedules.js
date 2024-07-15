import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEAM_SCHEDULES_DATA_DIRECTORY = path.resolve(__dirname, '../../data/teamSchedules');

const teamFilenames = fs.readdirSync(TEAM_SCHEDULES_DATA_DIRECTORY);

module.exports.getForSeason = (teamName, season) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(`${TEAM_SCHEDULES_DATA_DIRECTORY}/${teamName}.json`)[String(season)];
};

module.exports.get = (teamName, season) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const teamScheduleData = require(`${TEAM_SCHEDULES_DATA_DIRECTORY}/${teamName}.json`);
  return season ? teamScheduleData[String(season)] : teamScheduleData;
};

module.exports.forEach = (callback) => {
  teamFilenames.forEach((teamFilename) => {
    const teamName = teamFilename.replace('.json', '');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const teamScheduleData = require(`${TEAM_SCHEDULES_DATA_DIRECTORY}/${teamFilename}`);
    callback(teamName, teamScheduleData);
  });
};
