import _ from 'lodash';
import range from 'lodash/range';
import update from 'lodash/update';

import {Logger} from '../../../lib/logger';
import teamSchedules from '../../../lib/teamSchedules';

const logger = new Logger({isSentryEnabled: false});

type Season = number;

type WeekLossCounts = number[];

type SeasonLossCounts = Record<Season, WeekLossCounts>;
type TeamLossCounts = Record<string, WeekLossCounts>;
type WeekLosslessCounts = Record<Season, number[]>;

const seasonCountsPerTeam: Record<string, number> = {};
const teamCountsPerSeason: Record<Season, number> = {};
const weekOfFirstLossPerTeam: TeamLossCounts = {};
const weekOfFirstLossPerSeason: SeasonLossCounts = {};
const undefeatedTeamsPerSeason: Record<Season, number> = {};
const numTeamsWithLosslessRecordPerSeason: WeekLosslessCounts = {};

logger.info('Analyzing first loss of season for all teams...');

interface TeamScheduleGame {
  result?: string;
}

teamSchedules.forEach((teamName, teamScheduleData) => {
  _.forEach(teamScheduleData as Record<string, TeamScheduleGame[]>, (games, season) => {
    const seasonNumber = Number(season);

    if (seasonNumber < 2018) {
      range(0, games.length).forEach((i) => {
        update(numTeamsWithLosslessRecordPerSeason, [seasonNumber, i], (x) => x || 0);
      });

      teamCountsPerSeason[seasonNumber] = (teamCountsPerSeason[seasonNumber] || 0) + 1;
      seasonCountsPerTeam[teamName] = (seasonCountsPerTeam[teamName] || 0) + 1;

      const firstLossWeekIndex = (games as TeamScheduleGame[]).findIndex(
        (game) => game.result === 'L'
      );

      if (firstLossWeekIndex === -1) {
        undefeatedTeamsPerSeason[seasonNumber] = (undefeatedTeamsPerSeason[seasonNumber] || 0) + 1;
        range(0, games.length).forEach((i) => {
          update(numTeamsWithLosslessRecordPerSeason, [seasonNumber, i], (x) => (x || 0) + 1);
        });
      } else {
        update(weekOfFirstLossPerTeam, [teamName, firstLossWeekIndex], (x) => (x || 0) + 1);
        update(weekOfFirstLossPerSeason, [seasonNumber, firstLossWeekIndex], (x) => (x || 0) + 1);
        range(0, firstLossWeekIndex).forEach((i) => {
          update(numTeamsWithLosslessRecordPerSeason, [seasonNumber, i], (x) => (x || 0) + 1);
        });
      }
    }
  });
});

/***************************************/
/* WEEK OF FIRST LOSS SEASON AVERAGES  */
/***************************************/
const weekOfFirstLossSeasonAverages: Record<
  string,
  {teamCount: number; undefeatedTeamCount: number; firstWeekLossPercentages: number[]}
> = {};
Object.entries(weekOfFirstLossPerSeason).forEach(([season, weekLossCounts]) => {
  const seasonNumber = Number(season);
  const teamCount = teamCountsPerSeason[seasonNumber] || 0;

  let lossCount = 0;

  weekOfFirstLossSeasonAverages[season] = {
    teamCount,
    undefeatedTeamCount: undefeatedTeamsPerSeason[seasonNumber] || 0,
    firstWeekLossPercentages: [],
  };

  weekLossCounts.forEach((currentWeekLossCount = 0) => {
    lossCount += currentWeekLossCount || 0;
    weekOfFirstLossSeasonAverages[season].firstWeekLossPercentages.push(
      Number(((lossCount * 100) / teamCount).toFixed(2))
    );
  });
});

const weeks: number[][] = [];
Object.entries(weekOfFirstLossSeasonAverages).forEach(([season, seasonData]) => {
  if (Number(season) >= 1990) {
    seasonData.firstWeekLossPercentages.forEach((val, i) => {
      weeks[i] = weeks[i] || [];
      weeks[i].push(val);
    });
  }
});

const weekOfFirstLossSeasonAveragesAverages: number[] = [];
weeks.forEach((week) => {
  weekOfFirstLossSeasonAveragesAverages.push(Number((_.sum(week) / _.size(week)).toFixed(2)));
});
void weekOfFirstLossSeasonAveragesAverages;

/************************************/
/* WEEK OF FIRST LOSS TEAM LEADERS  */
/************************************/
const runningTeamCounts: Record<string, number> = {};
range(0, 15)
  .reverse()
  .forEach((weekIndex) => {
    const currentWeekTeams: {teamName: string; lossCount: number; lossCountPercentage: number}[] =
      [];
    Object.entries(weekOfFirstLossPerTeam).forEach(([teamName, weekLossCounts]) => {
      runningTeamCounts[teamName] = runningTeamCounts[teamName] || 0;
      runningTeamCounts[teamName] += weekLossCounts?.[weekIndex] || 0;
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
        numTeams: teamCountsPerSeason[Number(season)],
      };
    }
  )
);

logger.success('Successfully analyzed first loss of season for all teams!');
