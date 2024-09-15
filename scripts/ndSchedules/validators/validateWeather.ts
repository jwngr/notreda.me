import {ValidatorFuncWithIgnore} from '../../models';

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

export const validateWeather: ValidatorFuncWithIgnore = ({
  currentGameInfo,
  assert,
  ignoredAssert,
}) => {
  const {weather, isGameOver, isNextUnplayedGame} = currentGameInfo;

  const wrappedAssert = (statement: boolean, message: string) => {
    assert(statement, message, {weather, isGameOver, isNextUnplayedGame});
  };

  const wrappedIgnoredAssert = (statement: boolean, message: string) => {
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

    if (weather) {
      wrappedAssert(
        EXPECTED_WEATHER_ICONS.includes(weather.icon),
        'Weather icon has unexpected value.'
      );

      wrappedAssert(
        weather.temperature > -20 && weather.temperature < 110,
        'Weather temperature has unexpected value.'
      );
    }
  } else {
    // Future game (excluding the next unplayed game).
    wrappedAssert(typeof weather === 'undefined', 'Future game unexpectedly has weather object.');
  }
};
