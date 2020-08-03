const _ = require('lodash');

const LATEST_SEASON = 2037;
const CURRENT_SEASON = 2020;

module.exports = {
  LATEST_SEASON,
  CURRENT_SEASON,
  ALL_SEASONS: [1887, 1888, 1889, ..._.range(1892, LATEST_SEASON + 1)],
  ALL_PLAYED_SEASONS: [1887, 1888, 1889, ..._.range(1892, CURRENT_SEASON + 1)],
  AP_POLL_SEASONS: _.range(1936, CURRENT_SEASON + 1),
  ND_HEAD_COACH: 'Brian Kelly',
};
