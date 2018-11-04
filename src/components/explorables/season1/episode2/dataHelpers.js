import _ from 'lodash';
import React from 'react';

import weekOfFirstLoss_nd from './data/weekOfFirstLoss_nd.json';
import weekOfFirstLoss_all from './data/weekOfFirstLoss_all.json';

export const getNdFirstLossSeriesData = (startSeason, endSeason) => {
  const firstLossOfSeasonIndexes = [];
  const numSeasonsWithAtLeastThisManyGames = [];

  _.range(startSeason, endSeason + 1).forEach((season) => {
    // Exclude years ND did not play.
    if (season !== 1890 && season !== 1891) {
      const seasonData = weekOfFirstLoss_nd[season];

      let gamesWonBeforeFirstLoss;
      if (seasonData.weekOfFirstLossIndex === null) {
        // Undefeated season.
        gamesWonBeforeFirstLoss = seasonData.numGames;
      } else {
        // Season with loss.
        gamesWonBeforeFirstLoss = seasonData.weekOfFirstLossIndex;
      }

      _.range(0, gamesWonBeforeFirstLoss).forEach((i) => {
        _.update(firstLossOfSeasonIndexes, [i], (x) => (x || 0) + 1);
      });

      _.range(0, seasonData.numGames).forEach((i) => {
        _.update(numSeasonsWithAtLeastThisManyGames, [i], (x) => (x || 0) + 1);
      });
    }
  });

  const weeklyLossPercentages = [];
  _.range(0, 13).forEach((weekIndex) => {
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
