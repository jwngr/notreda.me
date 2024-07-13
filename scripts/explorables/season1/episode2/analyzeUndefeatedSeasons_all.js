import _ from 'lodash';

import {Logger} from '../../../lib/logger';
import teamSchedules from '../../../lib/teamSchedules';
import undefeatedTeamNamesMap from './undefeatedTeamNamesMap.json';

let totalUndefeatedTeamsCount = 0;
const undefeatedTeamsPerSeason = {};
const undefeatedSeasonsPerTeam = {};
const undefeatedTeamCountsPerSeason = {};

Logger.info('Analyzing undefeated seasons...');

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

Logger.info('TOTAL NUMBER OF UNDEFEATED TEAMS:', totalUndefeatedTeamsCount);
Logger.newline(2);

Logger.info('NUMBER OF UNDEFEATED TEAMS PER SEASON:');

_.range(1869, 2018).forEach((season) => {
  Logger.info(`${season}:`, undefeatedTeamCountsPerSeason[season] || 0);
});

Logger.newline(2);
Logger.info('UNDEFEATED TEAMS PER SEASON:');

_.range(1869, 2018).forEach((season) => {
  Logger.info(`${season}:`, undefeatedTeamsPerSeason[season] || []);
});

Logger.newline(2);
Logger.info('MOST UNDEFEATED SEASONS PER TEAM:');

const sortedUndefeatedSeasonsPerTeam = _.chain(undefeatedSeasonsPerTeam)
  .mapValues((count, teamName) => ({
    count,
    teamName,
  }))
  .sortBy(({count}) => -count)
  .value();
_.forEach(sortedUndefeatedSeasonsPerTeam, ({count, teamName}) => {
  Logger.info(teamName, count);
});

Logger.info(JSON.stringify(undefeatedTeamsPerSeason, null, 2));

Logger.success('Successfully analyzed undefeated seasons!');
