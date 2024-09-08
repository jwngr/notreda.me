export enum PollType {
  AP = 'ap',
  Coaches = 'coaches',
  CFBPlayoff = 'cfbPlayoff',
}

export interface IndividualTeamPollData {
  readonly record: string;
  readonly ranking: number;
  readonly previousRanking: number | 'NR';
  readonly points?: number;
}

export interface WeeklyIndividualPollRanking {
  readonly date: string;
  // TODO: Key by `TeamId` to make this more typesafe.
  readonly teams: Record<string, IndividualTeamPollData>;
}

export type SeasonAllPollRankings = Record<PollType, WeeklyIndividualPollRanking[]>;
