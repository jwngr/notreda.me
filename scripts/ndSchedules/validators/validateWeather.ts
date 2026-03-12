import _ from 'lodash';

import {isNumber} from '../../lib/utils';
import {ExtendedGameInfo} from '../../models';
import type {AssertFn, IgnoredAssertFn} from './types';

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

const OPENWEATHER_ICON_MAP: Record<string, string> = {
  '02d': 'partly-cloudy-day',
  '02n': 'partly-cloudy-night',
  '04d': 'cloudy',
  '04n': 'cloudy',
};

export function validateWeather(
  {weather, isGameOver, isNextUnplayedGame}: ExtendedGameInfo,
  assert: AssertFn,
  ignoredAssert: IgnoredAssertFn
): void {
  const wrappedAssert = (statement: boolean, message: string) => {
    assert(statement, message, {weather, isGameOver, isNextUnplayedGame});
  };

  if (isGameOver || isNextUnplayedGame) {
    // Completed game or next unplayed game.

    const completedGameOrNextUnplayedGame = isGameOver ? 'Completed game' : 'Next unplayed game';

    // TODO: Fully enable this assert when all completed games have weather.
    ignoredAssert(
      typeof weather !== 'undefined',
      `${completedGameOrNextUnplayedGame} has no weather object.`,
      {weather}
    );

    if (typeof weather !== 'undefined') {
      wrappedAssert(
        _.isEqual(Object.keys(weather).sort(), ['icon', 'temperature'].sort()),
        'Weather object has unexpected keys.'
      );

      wrappedAssert(
        EXPECTED_WEATHER_ICONS.includes(OPENWEATHER_ICON_MAP[weather.icon] ?? weather.icon),
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
