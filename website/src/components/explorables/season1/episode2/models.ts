export interface AllWeekOfFirstLossData {
  readonly [season: string]: {
    readonly losslessRecordsAttained: readonly number[];
    readonly numTeams: number;
  };
}

export interface AlabamaWeekOfFirstLossData {
  readonly [season: string]: {
    // `null` if season was undefeated.
    readonly numGamesPlayedBeforeFirstLoss: number | null;
    readonly numGamesInSeason: number;
  };
}

export interface NDWeekOfFirstLossData {
  readonly [season: string]: {
    readonly numGamesInSeason: number;
    // `null` if season was undefeated.
    readonly numGamesPlayedBeforeFirstLoss: number | null;
    readonly recordBeforeFirstLoss: string;
  };
}

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
