import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEAM_SCHEDULES_DATA_DIRECTORY = path.resolve(__dirname, '../../data/teamSchedules');

const teamFilenames = fs.readdirSync(TEAM_SCHEDULES_DATA_DIRECTORY);

type TeamScheduleData = Record<string, unknown>;
type TeamScheduleCallback = (teamName: string, teamScheduleData: TeamScheduleData) => void;

const loadTeamScheduleData = (teamFilename: string): TeamScheduleData => {
  const rawData = fs.readFileSync(`${TEAM_SCHEDULES_DATA_DIRECTORY}/${teamFilename}`, 'utf-8');
  return JSON.parse(rawData) as TeamScheduleData;
};

const getForSeason = (teamName: string, season: number | string): unknown => {
  const teamScheduleData = loadTeamScheduleData(`${teamName}.json`);
  return teamScheduleData[String(season)];
};

const get = (teamName: string, season?: number | string): unknown => {
  const teamScheduleData = loadTeamScheduleData(`${teamName}.json`);
  return season ? teamScheduleData[String(season)] : teamScheduleData;
};

const forEach = (callback: TeamScheduleCallback): void => {
  teamFilenames.forEach((teamFilename) => {
    const teamName = teamFilename.replace('.json', '');
    const teamScheduleData = loadTeamScheduleData(teamFilename);
    callback(teamName, teamScheduleData);
  });
};

export default {getForSeason, get, forEach};
