const _ = require('lodash');
const fs = require('fs');

const logger = require('../../../lib/logger');
const teamSchedules = require('../../../lib/teamSchedules');

const seasonCountsPerTeam = {};
const teamCountsPerSeason = {};
const weekOfFirstLossPerTeam = {};
const weekOfFirstLossPerSeason = {};
const undefeatedTeamsPerSeason = {};
const numTeamsWithLosslessRecordPerSeason = {};

logger.info('Analyzing first loss of season for all teams...');

teamSchedules.forEach((teamName, teamScheduleData) => {
  _.forEach(teamScheduleData, (games, season) => {
    season = Number(season);

    if (season < 2018) {
      _.range(0, _.size(games)).forEach((i) => {
        _.update(numTeamsWithLosslessRecordPerSeason, [season, i], (x) => x || 0);
      });

      teamCountsPerSeason[season] = (teamCountsPerSeason[season] || 0) + 1;
      seasonCountsPerTeam[teamName] = (seasonCountsPerTeam[teamName] || 0) + 1;

      const firstLossWeekIndex = _.findIndex(games, ['result', 'L']);

      if (firstLossWeekIndex === -1) {
        undefeatedTeamsPerSeason[season] = (undefeatedTeamsPerSeason[season] || 0) + 1;
        _.range(0, _.size(games)).forEach((i) => {
          _.update(numTeamsWithLosslessRecordPerSeason, [season, i], (x) => (x || 0) + 1);
        });
      } else {
        _.update(weekOfFirstLossPerTeam, [teamName, firstLossWeekIndex], (x) => (x || 0) + 1);
        _.update(weekOfFirstLossPerSeason, [season, firstLossWeekIndex], (x) => (x || 0) + 1);
        _.range(0, firstLossWeekIndex).forEach((i) => {
          _.update(numTeamsWithLosslessRecordPerSeason, [season, i], (x) => (x || 0) + 1);
        });
      }
    }
  });
});

/***************************************/
/* WEEK OF FIRST LOSS SEASON AVERAGES  */
/***************************************/
const weekOfFirstLossSeasonAverages = {};
_.forEach(weekOfFirstLossPerSeason, (weekLossCounts, season) => {
  const teamCount = teamCountsPerSeason[season];

  let lossCount = 0;

  weekOfFirstLossSeasonAverages[season] = {
    teamCount,
    undefeatedTeamCount: undefeatedTeamsPerSeason[season] || 0,
    firstWeekLossPercentages: [],
  };

  weekLossCounts.forEach((currentWeekLossCount) => {
    lossCount += currentWeekLossCount || 0;
    weekOfFirstLossSeasonAverages[season].firstWeekLossPercentages.push(
      Number(((lossCount * 100) / teamCount).toFixed(2))
    );
  });
});

const weeks = [];
_.forEach(weekOfFirstLossSeasonAverages, (seasonData, season) => {
  if (season >= 1990) {
    seasonData.firstWeekLossPercentages.forEach((val, i) => {
      weeks[i] = weeks[i] || [];
      weeks[i].push(val);
    });
  }
});

weekOfFirstLossSeasonAverages.averages = [];
weeks.forEach((week) => {
  weekOfFirstLossSeasonAverages.averages.push(Number((_.sum(week) / _.size(week)).toFixed(2)));
});

/************************************/
/* WEEK OF FIRST LOSS TEAM LEADERS  */
/************************************/
const runningTeamCounts = {};
_.range(0, 15)
  .reverse()
  .forEach((weekIndex) => {
    const currentWeekTeams = [];
    _.forEach(weekOfFirstLossPerTeam, (weekLossCounts, teamName) => {
      runningTeamCounts[teamName] = runningTeamCounts[teamName] || 0;
      runningTeamCounts[teamName] += weekLossCounts[weekIndex];
      currentWeekTeams.push({
        teamName,
        lossCount: runningTeamCounts[teamName],
        lossCountPercentage: Number(
          ((runningTeamCounts[teamName] * 100) / seasonCountsPerTeam[teamName]).toFixed(2)
        ),
      });
    });

    const currentWeekTeamsSortedByLossCount = _.sortBy(
      currentWeekTeams,
      ({lossCount}) => -lossCount
    );
    const currentWeekTeamsSortedByLossCountPercentage = _.sortBy(
      currentWeekTeams,
      ({lossCountPercentage}) => -lossCountPercentage
    );

    console.log(
      `WEEK ${weekIndex + 1} LEADERS BY LOSS COUNT:`,
      _.take(currentWeekTeamsSortedByLossCount, 5).map(
        ({teamName, lossCount}) => `${teamName}-${lossCount}`
      )
    );

    // console.log(
    //   `WEEK ${weekIndex + 1} LEADERS BY LOSS COUNT PERCENTAGE:`,
    //   _.take(currentWeekTeamsSortedByLossCountPercentage, 5)
    // );
  });

logger.info(
  'NUM TEAMS PER SEASON W/ LOSSLESS RECORD:',
  _.mapValues(numTeamsWithLosslessRecordPerSeason, (numTeamswithLosslessRecordPerWeek, season) => {
    return {
      losslessRecordsAttained: numTeamswithLosslessRecordPerWeek,
      numTeams: teamCountsPerSeason[season],
    };
  })
);

logger.success('Successfully analyzed first loss of season for all teams!');
