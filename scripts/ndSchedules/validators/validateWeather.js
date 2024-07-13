import _ from 'lodash';

import {isNumber} from '../../lib/utils';

const EXPECTED_WEATHER_ICONS = [
  'clear-day',
  'clear-night',
  'cloudy',
  'fog',
  'partly-cloudy-day',
  'partly-cloudy-night',
  'rain',
  'snow',
  'unknown',
];

export function validateWeather({weather, isGameOver, isNextUnplayedGame}, assert, ignoredAssert) {
  const wrappedAssert = (statement, message) => {
    assert(statement, message, {weather, isGameOver, isNextUnplayedGame});
  };

  const wrappedIgnoredAssert = (statement, message) => {
    ignoredAssert(statement, message, {weather});
  };

  if (isGameOver || isNextUnplayedGame) {
    // Completed game or next unplayed game.

    const completedGameOrNextUnplayedGame = isGameOver ? 'Completed game' : 'Next unplayed game';

    // TODO: Fully enable this assert when all completed games have weather.
    wrappedIgnoredAssert(
      typeof weather !== 'undefined',
      `${completedGameOrNextUnplayedGame} has no weather object.`
    );

    if (typeof weather !== 'undefined') {
      wrappedAssert(
        _.isEqual(_.keys(weather).sort(), ['icon', 'temperature'].sort()),
        'Weather object has unexpected keys.'
      );

      wrappedAssert(
        _.includes(EXPECTED_WEATHER_ICONS, weather.icon),
        'Weather icon has unexpected value.'
      );

      wrappedAssert(
        isNumber(weather.temperature) && weather.temperature > -20 && weather.temperature < 110,
        'Weather temperature has unexpected value.'
      );
    }
  } else {
    // Future game (excluding the next unplayed game).
    wrappedAssert(typeof weather === 'undefined', 'Future game unexpectedly has weather object.');
  }
}
