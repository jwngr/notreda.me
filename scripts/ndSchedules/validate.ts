import _ from 'lodash';

import {ALL_SEASONS, CURRENT_SEASON} from '../lib/constants';
import {Logger} from '../lib/logger';
import {NDSchedules} from '../lib/ndSchedules';
import {ExtendedGameInfo} from '../models';
import {
  validateCoverage,
  validateDate,
  validateLocation,
  validateMiscellaneous,
  validateRankings,
  validateRecords,
  validateScoreAndResult,
  validateStats,
  validateWeather,
} from './validators';

// Enable Sentry logging.
const logger = new Logger({isSentryEnabled: true});

async function main() {
  logger.info('Validating schedule data...');

  let _numErrorsFound = 0;
  let _currentGameData: ExtendedGameInfo | null = null;

  const assert = (statement: boolean, message: string, extraContext?: Record<string, unknown>) => {
    if (Boolean(statement) === false) {
      _numErrorsFound++;
      logger.error(message, {
        ..._.pick(_currentGameData, ['season', 'opponentId']),
        ...extraContext,
      });
    }
  };

  // TODO: Remove all usages of this once historical data is properly normalized.
  const ignoredAssert = (statement: boolean) => {
    if (Boolean(statement) === false) {
      // Intentionally left blank.
    }
  };

  for (const season of ALL_SEASONS) {
    const seasonScheduleData = await NDSchedules.getForSeason(season);

    let nextUnplayedGameWeekIndex: number | null = null;
    let latestCompletedGameWeekIndex: number | null = null;
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

    let previousGameData: ExtendedGameInfo | null = null;
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

      validateDate([_currentGameData, previousGameData], assert);
      validateStats(_currentGameData, assert, ignoredAssert);
      validateRecords(_currentGameData, assert, ignoredAssert);
      validateWeather(_currentGameData, assert, ignoredAssert);
      validateCoverage(_currentGameData, assert);
      validateLocation(_currentGameData, assert);
      validateRankings(_currentGameData, assert);
      validateMiscellaneous([_currentGameData, seasonScheduleData], assert);
      validateScoreAndResult(_currentGameData, assert);

      previousGameData = _currentGameData;
    });
  }

  if (_numErrorsFound !== 0) {
    logger.error(`${_numErrorsFound} errors found in schedule data!`);
    process.exit(1);
  }

  logger.info('Schedule data successfully validated with no errors!');
}

main();
