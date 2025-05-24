import {TeamId, TeamRankings, TeamRecords, TeamStats} from './teams.models';

export interface GameScore {
  readonly home: number;
  readonly away: number;
}

export interface GameLinescore {
  readonly home: number[];
  readonly away: number[];
}

export enum GameResult {
  Win = 'W',
  Loss = 'L',
  Tie = 'T',
}

export interface GameStats {
  readonly away: TeamStats;
  readonly home: TeamStats;
}

export interface GameWeather {
  readonly icon: WeatherIcon;
  readonly temperature: number;
}

// TODO: Make this a proper enum based on https://openweathermap.org/weather-conditions.
export type WeatherIcon = string;

interface GameRecords {
  readonly home: TeamRecords;
  readonly away: TeamRecords;
}

interface GameRankings {
  // Either team may be unranked.
  readonly home?: TeamRankings;
  readonly away?: TeamRankings;
}

// TODO: Introduce a `LocationId` enum.
export interface GameLocation {
  readonly city: string;
  readonly state?: string;
  readonly country?: string;
  readonly stadium?: string;
  readonly coordinates: number[];
}

export interface GameInfo {
  /** Notre Dame's result in the game. */
  // TODO: Consider making this required and introducing a `None` type, or using `null`.
  readonly result?: GameResult;

  /** The team Notre Dame played. */
  readonly opponentId: TeamId;

  /** The ID used by ESPN for this game. */
  readonly espnGameId?: number;

  // TODO: Combine `isHomeGame` and `isNeutralSiteGame` into a single `HomeAwayStatus` enum.
  /** True if this was a home game for Notre Dame. */
  readonly isHomeGame: boolean;
  /** True if the game was played on a neutral field rather than either team's home field. */
  readonly isNeutralSiteGame?: boolean;
  /** True if the game is a playoff / bowl game. */
  readonly isBowlGame?: boolean;
  /** True if this was a game in the Shamrock Series. */
  readonly isShamrockSeries?: boolean;
  /** True if the game was canceled. */
  readonly isCanceled?: boolean;
  /** True if the game was postponed. */
  readonly isPostponed?: boolean;

  // Handle dates which are in the past or future and which may not have a time nor date.
  // TODO: Unify `date`/`time` and `fullDate` between past and future games.
  // TODO: Find a better way to represent 'TBD' dates.
  readonly date?: string | 'TBD';
  readonly time?: string;
  readonly fullDate?: string;

  /** Which network broadcasted the game. */
  readonly coverage?: TVNetwork | 'TBD';

  /** The YouTube video ID for the game highlights. */
  readonly highlightsYouTubeVideoId?: string;

  /** Stadium location information. Optional for Notre Dame home games (computed at runtime). */
  readonly location?: GameLocation | 'TBD';

  readonly numOvertimes?: number;

  readonly score?: GameScore;
  readonly linescore?: GameLinescore;
  readonly stats?: GameStats;
  readonly weather?: GameWeather;
  readonly records?: GameRecords;
  readonly rankings?: GameRankings;

  // TODO: Introduce a `HeadCoach` enum.
  readonly headCoach?: string;

  /** A nickname for the game, if one exists (e.g. "CFP Final"). */
  readonly nickname?: string;
}

export interface FutureGameInfo {
  readonly date: Date | 'TBD';
  readonly isHomeGame: boolean;
  readonly opponentName: string;
  readonly location?: string;
}

export enum TVNetwork {
  ABC = 'ABC',
  ACCN = 'ACCN',
  CBS = 'CBS',
  CBSSN = 'CBSSN',
  CSTV = 'CSTV',
  ESPN = 'ESPN',
  ESPN2 = 'ESPN2',
  FOX = 'FOX',
  KATZ = 'KATZ',
  NBC = 'NBC',
  NBCSN = 'NBCSN',
  Pac12Network = 'PACN',
  Peacock = 'PEACOCK',
  TBS = 'TBS',
  USA = 'USA',
  SportsChannel = 'SPORTSCHANNEL',
  WGN_TV = 'WGN-TV',
  // TODO: Consider removing this type and using `null` instead.
  Unknown = 'UNKNOWN',
  // TODO: Handle multi-network broadcasts explicitly in the data model as an array of networks.
  ABC_ESPN = 'ABC / ESPN',
  ABC_ESPN2 = 'ABC / ESPN2',
  RAYCOM_WGN = 'RAYCOM / WGN-TV',
  USA_WGN_TV = 'USA / WGN-TV',
}
