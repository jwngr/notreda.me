export enum GameResult {
  Win = 'W',
  Loss = 'L',
  Tie = 'T',
}

interface GameStats {
  // TODO: Improve this type.
  readonly away: Record<string, number | string>;
  readonly home: Record<string, number | string>;
}

interface GameWeather {
  readonly temperature: number;
  readonly icon: string;
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
  /** True if this was a game in the Shamrock Series. */
  readonly isShamrockSeries: boolean;

  // Handle dates which are in the past or future and which may not have a time nor date.
  // TODO: Unify `date` and `fullDate` between past and future .
  readonly date: string;
  readonly fullDate?: string;

  /** Which network broadcasted the game. */
  readonly coverage?: TVNetwork;

  /** Stadium location information. */
  // TODO: Introduce a `Location` enum.
  readonly location: {
    readonly city: string;
    readonly state: string;
    readonly stadium: string;
    readonly coordinates: [number, number];
  };
  readonly score: {
    readonly away: number;
    readonly home: number;
  };
  readonly linescore: {
    readonly away: number[];
    readonly home: number[];
  };
  readonly stats?: GameStats;
  readonly weather?: GameWeather;
  readonly rankings?: {
    readonly home: Record<string, number>;
    readonly away: Record<string, number>;
  };

  // TODO: Introduce a `HeadCoach` enum.
  readonly headCoach: string;

  /** True if the game is a playoff / bowl game. */
  readonly isBowlGame?: boolean;

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
  NBC = 'NBC',
  NBCSN = 'NBCSN',
  Peacock = 'PEACOCK',
  TBS = 'TBS',
  USA = 'USA',
}

export interface Team {
  readonly abbreviation: TeamId;
  readonly name: string;
  readonly shortName?: string;
  readonly nickname: string;
  readonly color?: string;
  readonly espnId?: string;
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
  LIL = 'LIL',
  LLA = 'LLA',
  LAK = 'LAK',
  LOU = 'LOU',
  LSU = 'LSU',
  MOH = 'MOH',
  MARQ = 'MARQ',
  MD = 'MD',
  MIAMI = 'MIAMI',
  MICH = 'MICH',
  MINN = 'MINN',
  MISS = 'MISS',
  MIZ = 'MIZ',
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
  NWL = 'NW_L',
  NW = 'NW',
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
