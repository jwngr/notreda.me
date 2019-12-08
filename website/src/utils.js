import theme from './resources/theme';

// TODO: Move this file into ./lib.

/**
 * Returns the theme color for the provided result.
 *
 */
export const getColorForResult = (result) => {
  switch (result) {
    case 'W':
      return theme.colors.green;
    case 'L':
      return theme.colors.red;
    case 'T':
      return theme.colors.gold;
    default:
      throw new Error(`Unexpected game result provided: "${result}"`);
  }
};

/**
 * Returns an array of years in which Notre Dame won the National Championship.
 */
export const getNationalChampionshipYears = () => {
  return [1924, 1929, 1930, 1943, 1946, 1947, 1949, 1966, 1973, 1977, 1988];
};

/**
 * Returns the dimensions of the window.
 */
export const getWindowDimensions = () => {
  const e = document.documentElement;
  const g = document.getElementsByTagName('body')[0];

  return {
    width: window.innerWidth || e.clientWidth || g.clientWidth,
    height: window.innerHeight || e.clientHeight || g.clientHeight,
  };
};

/**
 * Returns an array of all historical games against the specified opponent.
 *
 * @param {Date} date The date to use to determine the user's local time zone.
 *
 * @return {string} The user's local time zone string (e.g. "PST", "EDT") for the provided date.
 */
export const getTimeZoneString = (date) => {
  return date
    .toTimeString()
    .match(new RegExp('[A-Z](?!.*[(])', 'g'))
    .join('');
};

/**
 * Returns the URL for the provided TV channel which can be used to stream the game.
 *
 * @param {string} channel The TV channel whose streaming URL to return.
 *
 * @return {string|undefined} The streaming URL for the provided channel.
 */
export const getTvChannelUrl = (channel) => {
  const channelUrls = {
    ABC: 'https://abc.com/watch-live/',
    ACCN: 'http://theacc.com/watch/',
    CBS: 'https://www.cbs.com/all-access/',
    CBSSN: 'https://www.cbssports.com/cbs-sports-network/',
    ESPN: 'https://www.espn.com/watch/',
    ESPN2: 'https://www.espn.com/watch/',
    FOX: 'https://www.fox.com/live/',
    NBC: 'https://www.nbc.com/apps/',
    NBCSN: 'https://www.nbc.com/apps/',
    TBS: 'https://www.tbs.com/watchtbs',
  };

  return channelUrls[channel.toUpperCase()];
};
