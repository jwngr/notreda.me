import range from 'lodash/range';

export const LATEST_SEASON = 2037;
export const CURRENT_SEASON = 2025;

export const ALL_SEASONS = [1887, 1888, 1889, ...range(1892, LATEST_SEASON + 1)];
export const ALL_PLAYED_SEASONS = [1887, 1888, 1889, ...range(1892, CURRENT_SEASON + 1)];
export const AP_POLL_SEASONS = range(1936, CURRENT_SEASON + 1);
export const ND_HEAD_COACH = 'Marcus Freeman';
