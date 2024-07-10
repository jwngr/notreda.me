import range from 'lodash/range';

import {TableRowData} from '../../../../models';
import {ALL_UNDEFEATED_SEASONS} from './data/undefeatedSeasons_all';
import {ND_UNDEFEATED_SEASONS} from './data/undefeatedSeasons_nd';
import {ALABAMA_WEEK_OF_FIRST_LOSS} from './data/weekOfFirstLoss_alabama';
import {ALL_TEAMS_WEEK_OF_FIRST_LOSS} from './data/weekOfFirstLoss_all';
import {ND_WEEK_OF_FIRST_LOSS} from './data/weekOfFirstLoss_nd';
import {
  AlabamaWeekOfFirstLossData,
  FirstLossSeriesData,
  NDWeekOfFirstLossData,
  PerSeasonChartData,
} from './models';

const getFirstLossSeriesData = (
  weekOfFirstLossData: NDWeekOfFirstLossData | AlabamaWeekOfFirstLossData,
  startSeason: number,
  endSeason: number
): FirstLossSeriesData => {
  const firstLossOfSeasonIndexes: number[] = [];
  const numSeasonsWithAtLeastThisManyGames: number[] = [];

  range(startSeason, endSeason + 1).forEach((season) => {
    // Exclude years ND did not play.
    if (season !== 1890 && season !== 1891) {
      const {numGamesInSeason, numGamesPlayedBeforeFirstLoss} = weekOfFirstLossData[season];

      range(0, numGamesPlayedBeforeFirstLoss ?? numGamesInSeason).forEach((i) => {
        firstLossOfSeasonIndexes[i] = (firstLossOfSeasonIndexes[i] || 0) + 1;
      });

      range(0, numGamesInSeason).forEach((i) => {
        numSeasonsWithAtLeastThisManyGames[i] = (numSeasonsWithAtLeastThisManyGames[i] || 0) + 1;
      });
    }
  });

  const weeklyLossPercentages: number[] = [];
  range(0, firstLossOfSeasonIndexes.length + 1).forEach((weekIndex) => {
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

  return {
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
  };
};

export const getNdFirstLossSeriesData = (
  startSeason: number,
  endSeason: number
): FirstLossSeriesData => {
  return getFirstLossSeriesData(ND_WEEK_OF_FIRST_LOSS, startSeason, endSeason);
};

export const getAlabamaFirstLossSeriesData = (
  startSeason: number,
  endSeason: number
): FirstLossSeriesData => {
  return getFirstLossSeriesData(ALABAMA_WEEK_OF_FIRST_LOSS, startSeason, endSeason);
};

export const getNdFirstLossOverTimeBarChartData = (
  startSeason: number,
  endSeason: number
): PerSeasonChartData[] => {
  const gamesPlayedBeforeFirstLossPerSeason: PerSeasonChartData[] = [];

  range(startSeason, endSeason + 1).forEach((season) => {
    // Exclude years ND did not play.
    if (season !== 1890 && season !== 1891) {
      const {numGamesInSeason, recordBeforeFirstLoss, numGamesPlayedBeforeFirstLoss} =
        ND_WEEK_OF_FIRST_LOSS[season];

      const tooltipText =
        numGamesPlayedBeforeFirstLoss === null
          ? 'Undefeated'
          : `First loss in game ${numGamesPlayedBeforeFirstLoss + 1}`;

      gamesPlayedBeforeFirstLossPerSeason.push({
        season,
        value: numGamesPlayedBeforeFirstLoss ?? numGamesInSeason,
        tooltipChildren: (
          <div>
            <p>
              <b>{season}:</b> {tooltipText} ({recordBeforeFirstLoss})
            </p>
          </div>
        ),
      });
    }
  });

  return gamesPlayedBeforeFirstLossPerSeason;
};

export const getAllTeamFirstLossSeriesData = (
  startSeason: number,
  endSeason: number
): FirstLossSeriesData => {
  const firstLossOfSeasonIndexes: number[] = [];
  const numSeasonsWithAtLeastThisManyGames: number[] = [];

  range(startSeason, endSeason + 1).forEach((season) => {
    const {losslessRecordsAttained, numTeams} = ALL_TEAMS_WEEK_OF_FIRST_LOSS[season];

    range(0, losslessRecordsAttained.length).forEach((i) => {
      firstLossOfSeasonIndexes[i] = (firstLossOfSeasonIndexes[i] || 0) + losslessRecordsAttained[i];
      numSeasonsWithAtLeastThisManyGames[i] =
        (numSeasonsWithAtLeastThisManyGames[i] || 0) + numTeams;
    });
  });

  const weeklyLossPercentages: number[] = [];
  range(0, 15).forEach((weekIndex) => {
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

  return {
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
  };
};

export const getUndefeatedTeamCountsPerSeasonTableData = (
  startSeason: number,
  endSeason: number
): TableRowData => {
  const undefeatedTeamCounts: number[] = [];
  const latestYearWithUndefeatedTeamCounts: number[] = [];

  range(startSeason, endSeason + 1).forEach((season) => {
    const undefeatedTeamCountForSeason = (ALL_UNDEFEATED_SEASONS[season] ?? []).length;
    latestYearWithUndefeatedTeamCounts[undefeatedTeamCountForSeason] = season;
    undefeatedTeamCounts[undefeatedTeamCountForSeason] =
      (undefeatedTeamCounts[undefeatedTeamCountForSeason] || 0) + 1;
  });

  return range(0, undefeatedTeamCounts.length).map((i) => [
    i.toString(),
    undefeatedTeamCounts[i].toString(),
    latestYearWithUndefeatedTeamCounts[i].toString(),
  ]);
};

export const getUndefeatedTeamCountsPerSeasonBarChartData = (
  startSeason: number,
  endSeason: number
): PerSeasonChartData[] => {
  const undefeatedTeamCountsPerSeason = range(startSeason, endSeason + 1).map((season) => {
    return {
      season,
      undefeatedTeams: ALL_UNDEFEATED_SEASONS[season] || [],
    };
  });

  return undefeatedTeamCountsPerSeason.map(({season, undefeatedTeams}) => {
    const undefeatedTeamsCount = undefeatedTeams.length;

    const teamOrTeams = undefeatedTeamsCount === 1 ? 'team' : 'teams';
    const undefeatedTeamList =
      undefeatedTeamsCount === 0 ? null : ` (${undefeatedTeams.join(', ')})`;

    return {
      season,
      value: undefeatedTeamsCount,
      tooltipChildren: (
        <div style={{maxWidth: '160px'}}>
          <p>
            <b>{season}:</b> {undefeatedTeamsCount} undefeated {teamOrTeams}
            {undefeatedTeamList}
          </p>
        </div>
      ),
    };
  });
};

export const getUndefeatedSeasonCountsPerTeamTableData = (
  startSeason: number,
  endSeason: number
): TableRowData => {
  const undefeatedSeasonCountsPerTeam: Record<
    string,
    {readonly count: number; readonly teamName: string; readonly latestSeason: number}
  > = {};

  range(startSeason, endSeason + 1).forEach((season) => {
    // No games were played in 1871.
    if (season === 1871) return;

    const undefeatedTeams = ALL_UNDEFEATED_SEASONS[season];
    if (!undefeatedTeams) return;

    undefeatedTeams.forEach((teamName) => {
      const existing = undefeatedSeasonCountsPerTeam[teamName];
      undefeatedSeasonCountsPerTeam[teamName] = {
        teamName,
        count: (existing?.count || 0) + 1,
        latestSeason: season,
      };
    });
  });

  return Object.values(undefeatedSeasonCountsPerTeam)
    .sort(({count}) => -count)
    .map(({count, teamName, latestSeason}) => [teamName, count.toString(), latestSeason.toString()])
    .slice(0, 10);
};

export const getNdUndefeatedSeasonTableData = (): TableRowData => {
  return ND_UNDEFEATED_SEASONS.map(({season, numGames, record}) => [
    season.toString(),
    numGames.toString(),
    record,
  ]);
};
