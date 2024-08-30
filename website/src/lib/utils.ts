import {GameResult, TVNetwork} from '../models/games.models';
import theme from '../resources/theme.json';

export function assertNever(x: never): never {
  throw new Error(`Unexpected object: ${x}`);
}

/**
 * Returns the theme color for the provided result.
 */
export const getColorForResult = (result: GameResult): string => {
  switch (result) {
    case GameResult.Win:
      return theme.colors.green;
    case GameResult.Loss:
      return theme.colors.red;
    case GameResult.Tie:
      return theme.colors.gold;
    default:
      assertNever(result);
  }
};

/**
 * Returns an array of years in which Notre Dame won the National Championship.
 */
export const getNationalChampionshipYears = (): readonly number[] => {
  return [1924, 1929, 1930, 1943, 1946, 1947, 1949, 1966, 1973, 1977, 1988];
};

/**
 * Returns the dimensions of the window.
 */
export const getWindowDimensions = (): {
  readonly width: number;
  readonly height: number;
} => {
  const e = document.documentElement;
  const g = document.getElementsByTagName('body')[0];

  return {
    width: window.innerWidth || e.clientWidth || g.clientWidth,
    height: window.innerHeight || e.clientHeight || g.clientHeight,
  };
};

/**
 * Returns the user's local time zone string
 */
export const getTimeZoneString = (date: Date): string | null => {
  return date.toTimeString().match(new RegExp('[A-Z](?!.*[(])', 'g'))?.join('') ?? null;
};

/**
 * Returns the URL for the provided TV channel which can be used to stream the game.
 */
export const getTvChannelUrl = (network: TVNetwork): string | null => {
  switch (network) {
    case TVNetwork.ABC:
      return 'https://abc.com/watch-live/';
    case TVNetwork.ACCN:
      return 'http://theacc.com/watch/';
    case TVNetwork.CBS:
      return 'https://www.paramountplus.com/';
    case TVNetwork.CBSSN:
      return 'https://www.cbssports.com/watch/cbs-sports-network';
    case TVNetwork.ESPN:
      return 'https://www.espn.com/watch/';
    case TVNetwork.ESPN2:
      return 'https://www.espn.com/watch/';
    case TVNetwork.FOX:
      return 'https://www.fox.com/live/';
    case TVNetwork.NBC:
      return 'https://www.nbc.com/live/';
    case TVNetwork.NBCSN:
      return 'https://www.nbcsports.com/watch/';
    case TVNetwork.Peacock:
      return 'https://www.peacocktv.com/';
    case TVNetwork.TBS:
      return 'https://www.tbs.com/watchtbs/';
    case TVNetwork.USA:
      return 'https://www.usanetwork.com/live/';
    case TVNetwork.Pac12Network:
    case TVNetwork.CSTV:
    case TVNetwork.KATZ:
    case TVNetwork.SportsChannel:
    case TVNetwork.WGN_TV:
    case TVNetwork.ABC_ESPN:
    case TVNetwork.ABC_ESPN2:
    case TVNetwork.RAYCOM_WGN:
    case TVNetwork.USA_WGN_TV:
    case TVNetwork.Unknown:
      return null;
    default:
      assertNever(network);
  }
};

export const getNumberWithCommas = (val: number): string => {
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
