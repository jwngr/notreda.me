import _ from 'lodash';
import range from 'lodash/range';
import update from 'lodash/update';

import {Logger} from '../../../lib/logger';
import teamSchedules from '../../../lib/teamSchedules';

const logger = new Logger({isSentryEnabled: false});

const seasonCountsPerTeam = {};
const teamCountsPerSeason = {};
const weekOfFirstLossPerTeam = {};
const weekOfFirstLossPerSeason = {};
const undefeatedTeamsPerSeason = {};
const numTeamsWithLosslessRecordPerSeason = {};

logger.info('Analyzing first loss of season for all teams...');

teamSchedules.forEach((teamName, teamScheduleData) => {
  teamScheduleData.forEach((games, season) => {
    season = Number(season);

    if (season < 2018) {
      range(0, games.length).forEach((i) => {
        update(numTeamsWithLosslessRecordPerSeason, [season, i], (x) => x || 0);
      });

      teamCountsPerSeason[season] = (teamCountsPerSeason[season] || 0) + 1;
      seasonCountsPerTeam[teamName] = (seasonCountsPerTeam[teamName] || 0) + 1;

      const firstLossWeekIndex = games.findIndex((game) => game.result === 'L');

      if (firstLossWeekIndex === -1) {
        undefeatedTeamsPerSeason[season] = (undefeatedTeamsPerSeason[season] || 0) + 1;
        range(0, games.length).forEach((i) => {
          update(numTeamsWithLosslessRecordPerSeason, [season, i], (x) => (x || 0) + 1);
        });
      } else {
        update(weekOfFirstLossPerTeam, [teamName, firstLossWeekIndex], (x) => (x || 0) + 1);
        update(weekOfFirstLossPerSeason, [season, firstLossWeekIndex], (x) => (x || 0) + 1);
        range(0, firstLossWeekIndex).forEach((i) => {
          update(numTeamsWithLosslessRecordPerSeason, [season, i], (x) => (x || 0) + 1);
        });
      }
    }
  });
});

/***************************************/
/* WEEK OF FIRST LOSS SEASON AVERAGES  */
/***************************************/
const weekOfFirstLossSeasonAverages = {};
Object.entries(weekOfFirstLossPerSeason).forEach(([season, weekLossCounts]) => {
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
Object.entries(weekOfFirstLossSeasonAverages).forEach(([season, seasonData]) => {
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
range(0, 15)
  .reverse()
  .forEach((weekIndex) => {
    const currentWeekTeams = [];
    Object.entries(weekOfFirstLossPerTeam).forEach(([teamName, weekLossCounts]) => {
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

    logger.info(
      `WEEK ${weekIndex + 1} LEADERS BY LOSS COUNT:`,
      currentWeekTeamsSortedByLossCount
        .slice(0, 5)
        .map(({teamName, lossCount}) => `${teamName}-${lossCount}`)
    );

    logger.info(
      `WEEK ${weekIndex + 1} LEADERS BY LOSS COUNT PERCENTAGE:`,
      currentWeekTeamsSortedByLossCountPercentage.slice(0, 5)
    );
  });

logger.info(
  'NUM TEAMS PER SEASON W/ LOSSLESS RECORD:',
  Object.entries(numTeamsWithLosslessRecordPerSeason).map(
    ([season, numTeamswithLosslessRecordPerWeek]) => {
      return {
        losslessRecordsAttained: numTeamswithLosslessRecordPerWeek,
        numTeams: teamCountsPerSeason[season],
      };
    }
  )
);

logger.success('Successfully analyzed first loss of season for all teams!');
