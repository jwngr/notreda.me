export type AllWeekOfFirstLossData = Record<
  string,
  {readonly losslessRecordsAttained: readonly number[]; readonly numTeams: number}
>;

export type AlabamaWeekOfFirstLossData = Record<
  string,
  {
    // `null` if season was undefeated.
    readonly numGamesPlayedBeforeFirstLoss: number | null;
    readonly numGamesInSeason: number;
  }
>;

export type NDWeekOfFirstLossData = Record<
  string,
  {
    readonly numGamesInSeason: number;
    // `null` if season was undefeated.
    readonly numGamesPlayedBeforeFirstLoss: number | null;
    readonly recordBeforeFirstLoss: string;
  }
>;

export interface FirstLossSeriesData {
  readonly id: string;
  readonly values: readonly {
    readonly x: number;
    readonly y: number;
    readonly radius: number;
    readonly tooltipChildren: React.ReactNode;
  }[];
}

export interface PerSeasonChartData {
  readonly season: number;
  readonly value: number;
  readonly tooltipChildren: React.ReactNode;
}
