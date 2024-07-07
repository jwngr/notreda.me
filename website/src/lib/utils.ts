import {GameResult, TVNetwork} from '../models';
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
  // TODO: Audit these for freshness.
  switch (network) {
    case TVNetwork.ABC:
      return 'https://abc.com/watch-live/';
    case TVNetwork.ACCN:
      return 'http://theacc.com/watch/';
    case TVNetwork.CBS:
      return 'https://www.cbs.com/all-access/';
    case TVNetwork.CBSSN:
      return 'https://www.cbssports.com/cbs-sports-network/';
    case TVNetwork.ESPN:
      return 'https://www.espn.com/watch/';
    case TVNetwork.ESPN2:
      return 'https://www.espn.com/watch/';
    case TVNetwork.FOX:
      return 'https://www.fox.com/live/';
    case TVNetwork.NBC:
      return 'https://www.nbc.com/apps/';
    case TVNetwork.NBCSN:
      return 'https://www.nbc.com/apps/';
    case TVNetwork.TBS:
      return 'https://www.tbs.com/watchtbs';
    case TVNetwork.CSTV:
    case TVNetwork.Peacock:
    case TVNetwork.USA:
    case TVNetwork.Unknown:
      return null;
    default:
      assertNever(network);
  }
};
