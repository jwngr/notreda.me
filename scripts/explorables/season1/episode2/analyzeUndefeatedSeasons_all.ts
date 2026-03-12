import range from 'lodash/range';

import {Logger} from '../../../lib/logger';
import teamSchedules, {TeamScheduleData} from '../../../lib/teamSchedules';
import undefeatedTeamNamesMap from './undefeatedTeamNamesMap.json';

const logger = new Logger({isSentryEnabled: false});

let totalUndefeatedTeamsCount = 0;
const undefeatedTeamsPerSeason: Record<number, string[]> = {};
const undefeatedSeasonsPerTeam: Record<string, number> = {};
const undefeatedTeamCountsPerSeason: Record<number, number> = {};

logger.info('Analyzing undefeated seasons...');

let earliestSeason = 2000;

const undefeatedNameMap = undefeatedTeamNamesMap as Record<string, string>;

teamSchedules.forEach((teamName, teamScheduleData) => {
  Object.entries(teamScheduleData).forEach(([season, games]) => {
    // if (season >= 1887) {
    const seasonNumber = Number(season);
    earliestSeason = Math.min(seasonNumber, earliestSeason);

    undefeatedTeamsPerSeason[seasonNumber] = undefeatedTeamsPerSeason[seasonNumber] || [];

    const firstLossWeek = games.findIndex((game) => game.result === 'L');

    if (firstLossWeek === -1) {
      totalUndefeatedTeamsCount++;
      const displayName = undefeatedNameMap[teamName] ?? teamName;
      undefeatedTeamsPerSeason[seasonNumber].push(displayName);
      undefeatedTeamCountsPerSeason[seasonNumber] =
        (undefeatedTeamCountsPerSeason[seasonNumber] || 0) + 1;
      undefeatedSeasonsPerTeam[displayName] = (undefeatedSeasonsPerTeam[displayName] || 0) + 1;
    }
    // }
  });
});

logger.info('TOTAL NUMBER OF UNDEFEATED TEAMS:', {totalUndefeatedTeamsCount});
logger.newline(2);

logger.info('NUMBER OF UNDEFEATED TEAMS PER SEASON:');

range(1869, 2018).forEach((season) => {
  logger.info(`${season}:`, {count: undefeatedTeamCountsPerSeason[season] || 0});
});

logger.newline(2);
logger.info('UNDEFEATED TEAMS PER SEASON:');

range(1869, 2018).forEach((season) => {
  logger.info(`${season}:`, {teams: undefeatedTeamsPerSeason[season] || []});
});

logger.newline(2);
logger.info('MOST UNDEFEATED SEASONS PER TEAM:');

const sortedUndefeatedSeasonsPerTeam = Object.entries(undefeatedSeasonsPerTeam)
  .map(([teamName, count]) => ({count, teamName}))
  .sort((a, b) => b.count - a.count);

sortedUndefeatedSeasonsPerTeam.forEach(({count, teamName}) => {
  logger.info(teamName, {count});
});

logger.info(JSON.stringify(undefeatedTeamsPerSeason, null, 2));

logger.success('Successfully analyzed undefeated seasons!');
