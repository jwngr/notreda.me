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

interface TeamStats {
  readonly firstDowns: number;
  readonly thirdDownAttempts: number;
  readonly thirdDownConversions: number;
  readonly fourthDownAttempts: number;
  readonly fourthDownConversions: number;
  readonly totalYards: number;
  readonly passYards: number;
  readonly passCompletions: number;
  readonly passAttempts: number;
  readonly yardsPerPass: number;
  readonly interceptionsThrown: number;
  readonly rushYards: number;
  readonly rushAttempts: number;
  readonly yardsPerRush: number;
  readonly penalties: number;
  readonly penaltyYards: number;
  readonly possession: string;
  /** How many times the ball was fumbled, including lost and recovered fumbles. This is not available for some historical games. */
  readonly fumbles?: number;
  /** How many times the ball was fumbled and lost. */
  readonly fumblesLost: number;
}

export interface GameStats {
  readonly away: TeamStats;
  readonly home: TeamStats;
}

interface GameWeather {
  readonly temperature: number;
  readonly icon: string;
}

interface TeamRecords {
  readonly overall: string;
  readonly home: string;
  readonly away: string;
  readonly neutral?: string;
}

interface GameRecords {
  readonly home: TeamRecords;
  readonly away: TeamRecords;
}

interface TeamRankings {
  readonly ap?: number;
  readonly bcs?: number;
  readonly coaches?: number;
  readonly cfbPlayoff?: number;
}

interface GameRankings {
  // Either team may be unranked.
  readonly home?: TeamRankings;
  readonly away?: TeamRankings;
}

// TODO: Introduce a `LocationId` enum.
interface GameLocation {
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
  // TODO: Unify `date` and `fullDate` between past and future games.
  // TODO: Find a better way to represent 'TBD' dates.
  readonly date?: string | 'TBD';
  readonly fullDate?: string;

  /** Which network broadcasted the game. */
  readonly coverage?: TVNetwork | 'TBD';

  /** The YouTube video ID for the game highlights. */
  readonly highlightsYouTubeVideoId?: string;

  /** Stadium location information. */
  readonly location: GameLocation | 'TBD';

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
  Peacock = 'PEACOCK',
  TBS = 'TBS',
  USA = 'USA',
  SPORTSCHANNEL = 'SPORTSCHANNEL',
  WGN_TV = 'WGN-TV',
  // TODO: Consider removing this type and using `null` instead.
  Unknown = 'UNKNOWN',
  // TODO: Handle multi-network broadcasts explicitly in the data model as an array of networks.
  ABC_ESPN = 'ABC / ESPN',
  ABC_ESPN2 = 'ABC / ESPN2',
  RAYCOM_WGN = 'RAYCOM / WGN-TV',
  USA_WGN_TV = 'USA / WGN-TV',
}

export interface Team {
  readonly name: string;
  readonly shortName?: string;
  readonly nickname?: string;
  readonly color?: string;
  readonly espnId?: number;
}

export enum TeamId {
  ADRN = 'ADRN',
  AF = 'AF',
  AKR = 'AKR',
  ALB = 'ALB',
  ALMA = 'ALMA',
  ARIZ = 'ARIZ',
  ARK = 'ARK',
  ARMY = 'ARMY',
  AZST = 'AZST',
  BALL = 'BALL',
  BAMA = 'BAMA',
  BAY = 'BAY',
  BC = 'BC',
  BEL = 'BEL',
  BGSU = 'BGSU',
  BUT = 'BUT',
  BYU = 'BYU',
  CAL = 'CAL',
  CAR = 'CAR',
  CARL = 'CARL',
  CASE = 'CASE',
  CB = 'CB',
  CHI = 'CHI',
  CINCY = 'CINCY',
  CLEM = 'CLEM',
  CMU = 'CMU',
  COE = 'COE',
  COL = 'COL',
  CREI = 'CREI',
  DART = 'DART',
  DEP = 'DEP',
  DET = 'DET',
  DLS = 'DLS',
  DRKE = 'DRKE',
  DUKE = 'DUKE',
  FLA = 'FLA',
  FRA = 'FRA',
  FSU = 'FSU',
  GOSH = 'GOSH',
  GT = 'GT',
  HARP = 'HARP',
  HASK = 'HASK',
  HAW = 'HAW',
  HILLS = 'HILLS',
  HOU = 'HOU',
  ILL = 'ILL',
  IND = 'IND',
  IOWA = 'IOWA',
  ISU = 'ISU',
  KAL = 'KAL',
  KNOX = 'KNOX',
  KU = 'KU',
  LAK = 'LAK',
  LIL = 'LIL',
  LLA = 'LLA',
  LOU = 'LOU',
  LSU = 'LSU',
  MARQ = 'MARQ',
  MD = 'MD',
  MIAMI = 'MIAMI',
  MICH = 'MICH',
  MINN = 'MINN',
  MISS = 'MISS',
  MIZ = 'MIZ',
  MOH = 'MOH',
  MORN = 'MORN',
  MORR = 'MORR',
  MRSH = 'MRSH',
  MSU = 'MSU',
  MTU = 'MTU',
  NAVY = 'NAVY',
  NCST = 'NCST',
  ND = 'ND',
  NEB = 'NEB',
  NEV = 'NEV',
  NIU = 'NIU',
  NW = 'NW',
  NWL = 'NWL',
  OKLA = 'OKLA',
  OKST = 'OKST',
  OLIV = 'OLIV',
  ONU = 'ONU',
  ORE = 'ORE',
  ORST = 'ORST',
  OSU = 'OSU',
  PAC = 'PAC',
  PENN = 'PENN',
  PITT = 'PITT',
  PRIN = 'PRIN',
  PSU = 'PSU',
  PUR = 'PUR',
  RICE = 'RICE',
  ROSE = 'ROSE',
  RUSH = 'RUSH',
  RUTG = 'RUTG',
  SBON = 'SBON',
  SCAR = 'SCAR',
  SD = 'SD',
  SDSU = 'SDSU',
  SLU = 'SLU',
  SMU = 'SMU',
  STAN = 'STAN',
  SYR = 'SYR',
  TAAM = 'TA&M',
  TCU = 'TCU',
  TEM = 'TEM',
  TENN = 'TENN',
  TEX = 'TEX',
  TNST = 'TNST',
  TOL = 'TOL',
  TULN = 'TULN',
  TULSA = 'TULSA',
  UCLA = 'UCLA',
  UCONN = 'UCONN',
  UGA = 'UGA',
  UMASS = 'UMASS',
  UNC = 'UNC',
  UNLV = 'UNLV',
  UNM = 'UNM',
  USC = 'USC',
  USF = 'USF',
  UTAH = 'UTAH',
  UVA = 'UVA',
  VALPO = 'VALPO',
  VANDY = 'VANDY',
  VINC = 'VINC',
  VT = 'VT',
  WJ = 'W&J',
  WAB = 'WAB',
  WAKE = 'WAKE',
  WASH = 'WASH',
  WASHU = 'WASHU',
  WIS = 'WIS',
  WMU = 'WMU',
  WSU = 'WSU',
  WVU = 'WVU',
  YALE = 'YALE',
}

export interface BlogPostInfo {
  readonly slug: string;
  readonly title: string;
  readonly subtitle: string;
  readonly date: string;
  readonly description: string;
}
