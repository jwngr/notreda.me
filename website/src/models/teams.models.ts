export interface TeamStats {
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

export interface TeamRecords {
  readonly overall: string;
  readonly home: string;
  readonly away: string;
  readonly neutral?: string;
}

export interface TeamRankings {
  readonly ap?: number;
  readonly bcs?: number;
  readonly coaches?: number;
  readonly cfbPlayoff?: number;
}

export interface Team {
  readonly name: string;
  readonly shortName?: string;
  readonly nickname?: string;
  readonly color?: string;
  readonly espnId?: number;
}

export interface TeamWithId extends Team {
  readonly id: TeamId;
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
  ASU = 'ASU',
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
