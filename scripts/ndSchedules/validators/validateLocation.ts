import isEqual from 'lodash/isEqual';

import {ValidatorFunc} from '../../models';

export const validateLocation: ValidatorFunc = ({currentGameInfo, assert}) => {
  const {location, isGameOver} = currentGameInfo;

  const wrappedAssert = (statement: boolean, message: string) => {
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
      isEqual(actualLocationKeys, expectedKeysDomesticGames) ||
        isEqual(actualLocationKeys, expectedKeysInternationalGames) ||
        isEqual(actualLocationKeys, expectedKeysDomesticGamesNoStadium),
      'Location does not have expected keys.'
    );

    wrappedAssert(location.coordinates.length === 2, 'Location has invalid coordinates.');

    if (location.coordinates) {
      const [lat, lon] = location.coordinates;
      wrappedAssert(lat >= -90 && lat <= 90, 'Location latitude is invalid.');
      wrappedAssert(lon >= -180 && lon <= 180, 'Location longitude is invalid.');
    }
  }
};
