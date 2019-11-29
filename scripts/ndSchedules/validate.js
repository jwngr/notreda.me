const _ = require('lodash');

const logger = require('../lib/logger');
const validators = require('./validators');
const ndSchedules = require('../lib/ndSchedules');
const {ALL_SEASONS, CURRENT_SEASON} = require('../lib/constants');

logger.info('Validating schedule data...');

let _numErrorsFound = 0;
let _currentGameData = null;
let _numIgnoredErrorsFound = 0;

const assert = (statement, message, extraContext) => {
  if (Boolean(statement) === false) {
    _numErrorsFound++;
    logger.error(message, {
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
  const seasonScheduleData = ndSchedules.getForSeason(season);

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

  // TODO: ensure game coverage corresponds to an actual PNG in the webstie images directory.
});

if (_numIgnoredErrorsFound !== 0) {
  logger.warning(`${_numIgnoredErrorsFound} errors ignored in schedule data!`);
}

if (_numErrorsFound === 0) {
  logger.info('Schedule data successfully validated with no errors!');
} else {
  logger.error(`${_numErrorsFound} errors found in schedule data!`);
}
