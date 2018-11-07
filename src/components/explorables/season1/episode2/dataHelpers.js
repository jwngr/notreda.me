import _ from 'lodash';
import React from 'react';

import weekOfFirstLoss_nd from './data/weekOfFirstLoss_nd.json';
import weekOfFirstLoss_all from './data/weekOfFirstLoss_all.json';
import undefeatedSeasons_nd from './data/undefeatedSeasons_nd.json';
import undefeatedSeasons_all from './data/undefeatedSeasons_all.json';
import weekOfFirstLoss_alabama from './data/weekOfFirstLoss_alabama.json';

const TEAM_NAMES_MAP = {
  army: 'Army',
  yale: 'Yale',
  utah: 'Utah',
  alabama: 'Alabama',
  harvard: 'Harvard',
  michigan: 'Michigan',
  nebraska: 'Nebraska',
  oklahoma: 'Oklahoma',
  princeton: 'Princeton',
  minnesota: 'Minnesota',
  notreDame: 'Notre Dame',
  ohioState: 'Ohio State',
  pennState: 'Penn State',
  southernCalifornia: 'USC',
};

const getFirstLossSeriesData = (weekOfFirstLossData, startSeason, endSeason) => {
  const firstLossOfSeasonIndexes = [];
  const numSeasonsWithAtLeastThisManyGames = [];

  _.range(startSeason, endSeason + 1).forEach((season) => {
    // Exclude years ND did not play.
    if (season !== 1890 && season !== 1891) {
      const {numGamesInSeason, numGamesPlayedBeforeFirstLoss} = weekOfFirstLossData[season];

      _.range(0, numGamesPlayedBeforeFirstLoss).forEach((i) => {
        _.update(firstLossOfSeasonIndexes, [i], (x) => (x || 0) + 1);
      });

      _.range(0, numGamesInSeason).forEach((i) => {
        _.update(numSeasonsWithAtLeastThisManyGames, [i], (x) => (x || 0) + 1);
      });
    }
  });

  const weeklyLossPercentages = [];
  _.range(0, _.size(firstLossOfSeasonIndexes) + 1).forEach((weekIndex) => {
    let percentageOfSeasonsWithFirstLossLaterThanThisWeek = 100;
    if (firstLossOfSeasonIndexes[weekIndex]) {
      percentageOfSeasonsWithFirstLossLaterThanThisWeek =
        ((numSeasonsWithAtLeastThisManyGames[weekIndex] - firstLossOfSeasonIndexes[weekIndex]) /
          numSeasonsWithAtLeastThisManyGames[weekIndex]) *
        100;
    }

    weeklyLossPercentages.push(
      Number(percentageOfSeasonsWithFirstLossLaterThanThisWeek.toFixed(2))
    );
  });

  return [
    {
      id: 'firstLoss',
      values: weeklyLossPercentages.map((val, i) => ({
        x: i + 1,
        y: 100 - val,
        radius: 6,
        tooltipChildren: (
          <div>
            <p>{(100 - val).toFixed(1)}%</p>
          </div>
        ),
      })),
    },
  ];
};

export const getNdFirstLossSeriesData = (startSeason, endSeason) => {
  return getFirstLossSeriesData(weekOfFirstLoss_nd, startSeason, endSeason);
};

export const getAlabamaFirstLossSeriesData = (startSeason, endSeason) => {
  return getFirstLossSeriesData(weekOfFirstLoss_alabama, startSeason, endSeason);
};

export const getNdFirstLossOverTimeLineChartData = (startSeason, endSeason) => {
  const gamesPlayedBeforeFirstLossPerSeason = [];

  _.range(startSeason, endSeason + 1).forEach((season) => {
    // Exclude years ND did not play.
    if (season !== 1890 && season !== 1891) {
      gamesPlayedBeforeFirstLossPerSeason.push({
        season,
        ...weekOfFirstLoss_nd[season],
      });
    }
  });

  return [
    {
      id: 'firstLoss',
      values: gamesPlayedBeforeFirstLossPerSeason.map(
        ({season, recordBeforeFirstLoss, numGamesInSeason, numGamesPlayedBeforeFirstLoss}) => {
          const gameOrGames = numGamesPlayedBeforeFirstLoss === 1 ? 'game' : 'games';
          const withoutLossOrBeforeFirstLoss =
            numGamesInSeason === numGamesPlayedBeforeFirstLoss
              ? 'without loss'
              : 'before first loss';

          return {
            x: season,
            y: numGamesPlayedBeforeFirstLoss,
            radius: 2,
            tooltipChildren: (
              <div>
                <p>
                  <b>{season}:</b> {numGamesPlayedBeforeFirstLoss} {gameOrGames} played{' '}
                  {withoutLossOrBeforeFirstLoss} ({recordBeforeFirstLoss})
                </p>
              </div>
            ),
          };
        }
      ),
    },
  ];
};

export const getAllTeamFirstLossSeriesData = (startSeason, endSeason) => {
  const firstLossOfSeasonIndexes = [];
  const numSeasonsWithAtLeastThisManyGames = [];

  _.range(startSeason, endSeason + 1).forEach((season) => {
    const {losslessRecordsAttained, numTeams} = weekOfFirstLoss_all[season];

    _.range(0, _.size(losslessRecordsAttained)).forEach((i) => {
      _.update(firstLossOfSeasonIndexes, [i], (x) => (x || 0) + losslessRecordsAttained[i]);
      _.update(numSeasonsWithAtLeastThisManyGames, [i], (x) => (x || 0) + numTeams);
    });
  });

  const weeklyLossPercentages = [];
  _.range(0, 15).forEach((weekIndex) => {
    let percentageOfSeasonsWithFirstLossLaterThanThisWeek = 100;
    if (firstLossOfSeasonIndexes[weekIndex]) {
      percentageOfSeasonsWithFirstLossLaterThanThisWeek =
        ((numSeasonsWithAtLeastThisManyGames[weekIndex] - firstLossOfSeasonIndexes[weekIndex]) /
          numSeasonsWithAtLeastThisManyGames[weekIndex]) *
        100;
    }

    weeklyLossPercentages.push(
      Number(percentageOfSeasonsWithFirstLossLaterThanThisWeek.toFixed(2))
    );
  });

  return [
    {
      id: 'firstLoss',
      values: weeklyLossPercentages.map((val, i) => ({
        x: i + 1,
        y: 100 - val,
        radius: 6,
        tooltipChildren: (
          <div>
            <p>{(100 - val).toFixed(1)}%</p>
          </div>
        ),
      })),
    },
  ];
};

export const getUndefeatedTeamCountsPerSeasonTableData = (startSeason, endSeason) => {
  const undefeatedTeamCounts = [];
  const latestYearWithUndefeatedTeamCounts = [];

  _.range(startSeason, endSeason + 1).forEach((season) => {
    const undefeatedTeamCountForSeason = _.size(undefeatedSeasons_all[season]);
    latestYearWithUndefeatedTeamCounts[undefeatedTeamCountForSeason] = season;
    _.update(undefeatedTeamCounts, [undefeatedTeamCountForSeason], (x) => (x || 0) + 1);
  });

  return _.range(0, _.size(undefeatedTeamCounts)).map((i) => [
    i,
    undefeatedTeamCounts[i],
    latestYearWithUndefeatedTeamCounts[i],
  ]);
};

export const getUndefeatedTeamCountsPerSeasonLineChartData = (startSeason, endSeason) => {
  const undefeatedTeamCountsPerSeason = _.range(startSeason, endSeason + 1).map((season) => {
    return {
      season,
      undefeatedTeams: undefeatedSeasons_all[season] || [],
    };
  });

  return [
    {
      id: 'undefeatedTeamCounts',
      values: undefeatedTeamCountsPerSeason.map(({season, undefeatedTeams}) => {
        const undefeatedTeamsCount = _.size(undefeatedTeams);

        const teamOrTeams = undefeatedTeamsCount === 1 ? 'team' : 'teams';
        const undefeatedTeamList =
          undefeatedTeamsCount === 0 ? null : ` (${undefeatedTeams.join(', ')})`;

        return {
          x: season,
          y: undefeatedTeamsCount,
          radius: 2,
          tooltipChildren: (
            <div>
              <p>
                <b>{season}:</b> {undefeatedTeamsCount} undefeated {teamOrTeams}
                {undefeatedTeamList}
              </p>
            </div>
          ),
        };
      }),
    },
  ];
};

export const getUndefeatedSeasonCountsPerTeamTableData = (startSeason, endSeason) => {
  const undefeatedSeasonCountsPerTeam = {};

  _.range(startSeason, endSeason + 1).forEach((season) => {
    if (season !== 1871) {
      // No games were played in 1871.
      undefeatedSeasons_all[season].forEach((teamName) => {
        undefeatedSeasonCountsPerTeam[teamName] = undefeatedSeasonCountsPerTeam[teamName] || {
          teamName,
          count: 0,
        };

        undefeatedSeasonCountsPerTeam[teamName].count++;
        undefeatedSeasonCountsPerTeam[teamName].latestSeason = season;
      });
    }
  });

  return _.chain(undefeatedSeasonCountsPerTeam)
    .sortBy(({count}) => -count)
    .map(({count, teamName, latestSeason}) => [TEAM_NAMES_MAP[teamName], count, latestSeason])
    .take(10)
    .value();
};

export const getNdUndefeatedSeasonTableData = () => {
  return _.map(undefeatedSeasons_nd, ({season, numGames, record}) => [season, numGames, record]);
};
