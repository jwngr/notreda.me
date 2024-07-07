const _ = require('lodash');

const {CURRENT_SEASON} = require('../../lib/constants');

const EXPECTED_TV_CHANNELS = [
  'ABC',
  'ABC / ESPN',
  'ABC / ESPN2',
  'ACCN',
  'CBS',
  'CBSSN',
  'CSTV',
  'ESPN',
  'ESPN2',
  'FOX',
  'KATZ',
  'NBC',
  'NBCSN',
  'PEACOCK',
  'RAYCOM / WGN',
  'SPORTSCHANNEL',
  'TBS',
  'USA',
  'USA / WGN-TV',
  'WGN-TV',
];

module.exports = ({season, coverage}, assert) => {
  const wrappedAssert = (statement, message) => {
    assert(statement, message, {coverage});
  };

  if (season === CURRENT_SEASON) {
    // Current season game.
    wrappedAssert(
      coverage === 'TBD' || _.includes(EXPECTED_TV_CHANNELS, coverage),
      'Current season game has unexpected coverage value.'
    );
  } else if (season < CURRENT_SEASON) {
    // Previous season game.
    wrappedAssert(
      typeof coverage === 'undefined' ||
        coverage === 'TBD' ||
        _.includes(EXPECTED_TV_CHANNELS, coverage),
      'Previous season game has unexpected coverage value.'
    );
  } else {
    // Future season game.
    wrappedAssert(
      typeof coverage === 'undefined' || _.includes(EXPECTED_TV_CHANNELS, coverage),
      'Future season game has unexpected coverage value.'
    );
  }
};
