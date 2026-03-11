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
];

export function validateCoverage({season, coverage}, assert) {
  const wrappedAssert = (statement, message) => {
    assert(statement, message, {coverage});
  };

  if (season === CURRENT_SEASON) {
    // Current season game.
    wrappedAssert(
      coverage === 'TBD' || coverage.every((network) => EXPECTED_TV_CHANNELS.includes(network)),
      'Current season game has unexpected coverage value.'
    );
  } else if (season < CURRENT_SEASON) {
    // Previous season game.
    wrappedAssert(
      typeof coverage === 'undefined' ||
        coverage === 'TBD' ||
        coverage.every((network) => EXPECTED_TV_CHANNELS.includes(network)),
      'Previous season game has unexpected coverage value.'
    );
  } else {
    // Future season game.
    wrappedAssert(
      typeof coverage === 'undefined' ||
        coverage.every((network) => EXPECTED_TV_CHANNELS.includes(network)),
      'Future season game has unexpected coverage value.'
    );
  }
}
