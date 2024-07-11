import range from 'lodash/range';

import theme from '../resources/theme.json';

export const LATEST_SEASON = 2037;
export const CURRENT_SEASON = 2022;
export const DEFAULT_TEAM_COLOR = theme.colors.red;

export const ALL_SEASONS = [1887, 1888, 1889, ...range(1892, LATEST_SEASON + 1)];
export const ALL_PLAYED_SEASONS = [1887, 1888, 1889, ...range(1892, CURRENT_SEASON + 1)];
export const AP_POLL_SEASONS = range(1936, CURRENT_SEASON + 1);

export const POSTHOG_API_KEY = 'phc_DUpm7hrMnobq3JB9qO4f5XWZEtyx4gxretXjgNoBBwR';
export const POSTHOG_API_HOST = 'https://us.i.posthog.com';
