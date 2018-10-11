const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const POLLS_DATA_DIRECTORY = path.resolve(__dirname, '../../data/polls');

module.exports.AP_POLL_SEASONS = _.range(1936, 2019);

module.exports.getForSeason = (season) => {
  return require(`${POLLS_DATA_DIRECTORY}/${season}.json`);
};
