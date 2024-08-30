import {CURRENT_SEASON} from '../../lib/constants';

const EXPECTED_TV_CHANNELS = [
  'ABC',
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
  'PACN',
  'PEACOCK',
  'SPORTSCHANNEL',
  'TBS',
  'USA',
  'WGN-TV',
  // TODO: Handle multi-network broadcasts explicitly in the data model as an array of networks.
  'ABC / ESPN',
  'ABC / ESPN2',
  'RAYCOM / WGN-TV',
  'USA / WGN-TV',
];

export function validateCoverage({season, coverage}, assert) {
  const wrappedAssert = (statement, message) => {
    assert(statement, message, {coverage});
  };

  if (season === CURRENT_SEASON) {
    // Current season game.
    wrappedAssert(
      coverage === 'TBD' || EXPECTED_TV_CHANNELS.includes(coverage),
      'Current season game has unexpected coverage value.'
    );
  } else if (season < CURRENT_SEASON) {
    // Previous season game.
    wrappedAssert(
      typeof coverage === 'undefined' ||
        coverage === 'TBD' ||
        EXPECTED_TV_CHANNELS.includes(coverage),
      'Previous season game has unexpected coverage value.'
    );
  } else {
    // Future season game.
    wrappedAssert(
      typeof coverage === 'undefined' || EXPECTED_TV_CHANNELS.includes(coverage),
      'Future season game has unexpected coverage value.'
    );
  }
}
