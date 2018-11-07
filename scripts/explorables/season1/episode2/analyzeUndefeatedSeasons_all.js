const _ = require('lodash');

const logger = require('../../../lib/logger');
const teamSchedules = require('../../../lib/teamSchedules');
const undefeatedTeamNamesMap = require('./undefeatedTeamNamesMap.json');

let totalUndefeatedTeamsCount = 0;
const undefeatedTeamsPerSeason = {};
const undefeatedSeasonsPerTeam = {};
const undefeatedTeamCountsPerSeason = {};

logger.info('Analyzing undefeated seasons...');

let earliestSeason = 2000;

teamSchedules.forEach((teamName, teamScheduleData) => {
  _.forEach(teamScheduleData, (games, season) => {
    // if (season >= 1887) {
    season = Number(season);
    earliestSeason = Math.min(season, earliestSeason);

    undefeatedTeamsPerSeason[season] = undefeatedTeamsPerSeason[season] || [];

    const firstLossWeek = _.findIndex(games, ['result', 'L']);

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
console.log('\n\n');

logger.info('NUMBER OF UNDEFEATED TEAMS PER SEASON:');

_.range(1869, 2018).forEach((season) => {
  logger.info(`${season}:`, undefeatedTeamCountsPerSeason[season] || 0);
});

console.log('\n\n');
logger.info('UNDEFEATED TEAMS PER SEASON:');

_.range(1869, 2018).forEach((season) => {
  logger.info(`${season}:`, undefeatedTeamsPerSeason[season] || []);
});

console.log('\n\n');
logger.info('MOST UNDEFEATED SEASONS PER TEAM:');

const sortedUndefeatedSeasonsPerTeam = _.chain(undefeatedSeasonsPerTeam)
  .mapValues((count, teamName) => ({
    count,
    teamName,
  }))
  .sortBy(({count}) => -count)
  .value();
_.forEach(sortedUndefeatedSeasonsPerTeam, ({count, teamName}) => {
  logger.info(teamName, count);
});

console.log(JSON.stringify(undefeatedTeamsPerSeason, null, 2));

logger.success('Successfully analyzed undefeated seasons!');
