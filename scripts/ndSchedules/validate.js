import _ from 'lodash';

import {getForSeason} from '../../website/src/resources/schedules';
import {ALL_SEASONS, CURRENT_SEASON} from '../lib/constants';
import {Logger} from '../lib/logger';
import sentry from '../lib/sentry';
import validators from './validators';

sentry.initialize();

Logger.info('Validating schedule data...');

let _numErrorsFound = 0;
let _currentGameData = null;
let _numIgnoredErrorsFound = 0;

const assert = (statement, message, extraContext) => {
  if (Boolean(statement) === false) {
    _numErrorsFound++;
    Logger.error(message, {
      ..._.pick(_currentGameData, ['season', 'opponentId']),
      ...extraContext,
    });
  }
};

// TODO: Remove all usages of this once historical data is properly normalized.
const ignoredAssert = (statement) => {
  if (Boolean(statement) === false) {
    _numIgnoredErrorsFound++;
  }
};

ALL_SEASONS.forEach((season) => {
  const seasonScheduleData = getForSeason(season);

  let nextUnplayedGameWeekIndex;
  let latestCompletedGameWeekIndex;
  if (season === CURRENT_SEASON) {
    latestCompletedGameWeekIndex = _.findLastIndex(
      seasonScheduleData,
      ({result}) => typeof result !== 'undefined'
    );
    nextUnplayedGameWeekIndex = _.findIndex(
      seasonScheduleData,
      ({result}) => typeof result === 'undefined'
    );
  }

  let previousGameData = null;
  seasonScheduleData.forEach((gameData, weekIndex) => {
    _currentGameData = {
      ...gameData,
      season,
      weekIndex,
      isGameOver: typeof gameData.result !== 'undefined',
      isNextUnplayedGame: weekIndex === nextUnplayedGameWeekIndex,
      isLatestGameCompletedGame: weekIndex === latestCompletedGameWeekIndex,
      completedGameCountForSeason: _.filter(
        seasonScheduleData,
        ({result}) => typeof result === 'string'
      ).length,
    };

    validators.validateDate([_currentGameData, previousGameData], assert, ignoredAssert);
    validators.validateStats(_currentGameData, assert, ignoredAssert);
    validators.validateRecords(_currentGameData, assert, ignoredAssert);
    validators.validateWeather(_currentGameData, assert, ignoredAssert);
    validators.validateCoverage(_currentGameData, assert, ignoredAssert);
    validators.validateLocation(_currentGameData, assert, ignoredAssert);
    validators.validateRankings(_currentGameData, assert, ignoredAssert);
    validators.validateMiscellaneous([_currentGameData, seasonScheduleData], assert, ignoredAssert);
    validators.validateScoreAndResult(_currentGameData, assert, ignoredAssert);

    previousGameData = _currentGameData;
  });
});

if (_numIgnoredErrorsFound !== 0) {
  Logger.warning(`${_numIgnoredErrorsFound} errors ignored in schedule data!`);
}

if (_numErrorsFound === 0) {
  Logger.info('Schedule data successfully validated with no errors!');
} else {
  Logger.error(`${_numErrorsFound} errors found in schedule data!`);
  sentry.captureMessage(`${_numErrorsFound} errors found in schedule data`, 'warning');

  // Exit with a non-zero error code.
  process.exit(-1);
}
