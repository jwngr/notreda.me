import range from 'lodash/range';

import {Logger} from '../../../lib/logger';
import teamSchedules from '../../../lib/teamSchedules';
import undefeatedTeamNamesMap from './undefeatedTeamNamesMap.json';

const logger = new Logger({isSentryEnabled: false});

let totalUndefeatedTeamsCount = 0;
const undefeatedTeamsPerSeason = {};
const undefeatedSeasonsPerTeam = {};
const undefeatedTeamCountsPerSeason = {};

logger.info('Analyzing undefeated seasons...');

let earliestSeason = 2000;

teamSchedules.forEach((teamName, teamScheduleData) => {
  teamScheduleData.forEach((games, season) => {
    // if (season >= 1887) {
    season = Number(season);
    earliestSeason = Math.min(season, earliestSeason);

    undefeatedTeamsPerSeason[season] = undefeatedTeamsPerSeason[season] || [];

    const firstLossWeek = games.findIndex((game) => game.result === 'L');

    if (firstLossWeek === -1) {
      totalUndefeatedTeamsCount++;
      undefeatedTeamsPerSeason[season].push(undefeatedTeamNamesMap[teamName]);
      undefeatedTeamCountsPerSeason[season] = (undefeatedTeamCountsPerSeason[season] || 0) + 1;
      undefeatedSeasonsPerTeam[undefeatedTeamNamesMap[teamName]] =
        (undefeatedSeasonsPerTeam[undefeatedTeamNamesMap[teamName]] || 0) + 1;
    }
    // }
  });
});

logger.info('TOTAL NUMBER OF UNDEFEATED TEAMS:', totalUndefeatedTeamsCount);
logger.newline(2);

logger.info('NUMBER OF UNDEFEATED TEAMS PER SEASON:');

range(1869, 2018).forEach((season) => {
  logger.info(`${season}:`, undefeatedTeamCountsPerSeason[season] || 0);
});

logger.newline(2);
logger.info('UNDEFEATED TEAMS PER SEASON:');

range(1869, 2018).forEach((season) => {
  logger.info(`${season}:`, undefeatedTeamsPerSeason[season] || []);
});

logger.newline(2);
logger.info('MOST UNDEFEATED SEASONS PER TEAM:');

const sortedUndefeatedSeasonsPerTeam = Object.entries(undefeatedSeasonsPerTeam)
  .map(([teamName, count]) => ({count, teamName}))
  .sort((a, b) => b.count - a.count);

sortedUndefeatedSeasonsPerTeam.forEach(({count, teamName}) => {
  logger.info(teamName, count);
});

logger.info(JSON.stringify(undefeatedTeamsPerSeason, null, 2));

logger.success('Successfully analyzed undefeated seasons!');
