const _ = require('lodash');
const fs = require('fs');

const logger = require('../../../lib/logger');
const teamSchedules = require('../../../lib/teamSchedules');

const undefeatedTeamsPerSeason = {};
const undefeatedSeasonsPerTeam = {};

logger.info('Analyzing undefeated seasons...');

teamSchedules.forEach((teamName, teamScheduleData) => {
  _.forEach(teamScheduleData, (games, season) => {
    if (season >= 1887) {
      season = Number(season);

      const firstLossWeek = _.findIndex(games, ['result', 'L']);

      if (firstLossWeek === -1) {
        undefeatedTeamsPerSeason[season] = (undefeatedTeamsPerSeason[season] || 0) + 1;
        undefeatedSeasonsPerTeam[teamName] = (undefeatedSeasonsPerTeam[teamName] || 0) + 1;
      }
    }
  });
});

logger.info('NUMBER OF UNDEFEATED TEAMS PER SEASON:');
_.range(1887, 2018).forEach((season) => {
  logger.info(`${season}:`, undefeatedTeamsPerSeason[season] || 0);
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

logger.success('Successfully analyzed undefeated seasons!');
