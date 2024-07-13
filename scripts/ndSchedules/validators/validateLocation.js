import _ from 'lodash';

import {isNumber} from '../../lib/utils';

export function validateLocation({location, isGameOver}, assert) {
  const wrappedAssert = (statement, message) => {
    assert(statement, message, {location, isGameOver});
  };

  if (location === 'TBD') {
    wrappedAssert(!isGameOver, 'Completed games should not have a TBD location.');
  } else {
    const actualLocationKeys = Object.keys(location).sort();
    const expectedKeysDomesticGames = ['city', 'state', 'stadium', 'coordinates'].sort();
    const expectedKeysInternationalGames = ['city', 'country', 'stadium', 'coordinates'].sort();

    // TODO: Remove the next line once all games have stadiums.
    const expectedKeysDomesticGamesNoStadium = ['city', 'state', 'coordinates'].sort();

    wrappedAssert(
      _.isEqual(actualLocationKeys, expectedKeysDomesticGames) ||
        _.isEqual(actualLocationKeys, expectedKeysInternationalGames) ||
        _.isEqual(actualLocationKeys, expectedKeysDomesticGamesNoStadium),
      'Location does not have expected keys.'
    );

    wrappedAssert(
      location.coordinates instanceof Array && location.coordinates.length === 2,
      'Location has invalid coordinates.'
    );

    if (location.coordinates) {
      const [lat, lon] = _.get(location, 'coordinates', []);

      wrappedAssert(isNumber(lat) && lat >= -90 && lat <= 90, 'Location latitude is invalid.');
      wrappedAssert(isNumber(lon) && lon >= -180 && lon <= 180, 'Location longitude is invalid.');
    }
  }
}
