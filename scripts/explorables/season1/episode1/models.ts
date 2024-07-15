export interface ExpS1E1TeamRecordsInfo {
  // Note: This does not include ties.
  readonly totalWinsCount: number;
  readonly totalGamesCount: number;
  readonly totalLossesCount: number;
  readonly totalDifferential: number;
  readonly onePossesssionGamesCount: number;
  readonly onePossesssionWinsCount: number;
  readonly onePossesssionLossesCount: number;
  readonly top25Finishes: number;
}

export interface ExpS1E1CoachInfo {
  readonly name: string;
  readonly totalTiesCount: number;
  readonly totalWinsCount: number;
  readonly totalGamesCount: number;
  readonly totalLossesCount: number;
  readonly totalDifferential: number;
  readonly onePossesssionGamesCount: number;
  readonly onePossesssionTiesCount: number;
  readonly onePossesssionWinsCount: number;
  readonly onePossesssionLossesCount: number;
}
