import _ from 'lodash';

import {ALL_SEASONS, CURRENT_SEASON} from '../lib/constants';
import {Logger} from '../lib/logger';
import {NDSchedules} from '../lib/ndSchedules';
import {AssertFunc, ExtendedGameInfo} from '../models';
import {validateCoverage} from './validators/validateCoverage';
import {validateDate} from './validators/validateDate';
import {validateLocation} from './validators/validateLocation';
import {validateMiscellaneous} from './validators/validateMiscellaneous';
import {validateRankings} from './validators/validateRankings';
import {validateRecords} from './validators/validateRecords';
import {validateScoreAndResult} from './validators/validateScoreAndResult';
import {validateStats} from './validators/validateStats';
import {validateWeather} from './validators/validateWeather';

// Enable Sentry logging.
const logger = new Logger({isSentryEnabled: true});

async function main() {
  logger.info('Validating schedule data...');

  let numErrorsFound = 0;
  let currentGameInfo: ExtendedGameInfo | null = null;
  let numIgnoredErrorsFound = 0;

  const assert: AssertFunc = (statement, message, extraContext) => {
    if (Boolean(statement) === false) {
      numErrorsFound++;
      logger.error(message, {
        ..._.pick(currentGameInfo, ['season', 'opponentId']),
        ...extraContext,
      });
    }
  };

  // TODO: Remove all usages of this once historical data is properly normalized.
  const ignoredAssert = (statement: boolean) => {
    if (Boolean(statement) === false) {
      numIgnoredErrorsFound++;
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

    let previousGameInfo: ExtendedGameInfo | null = null;
    seasonScheduleData.forEach((gameData, weekIndex) => {
      currentGameInfo = {
        ...gameData,
        season,
        weekIndex,
        isGameOver: typeof gameData.result !== 'undefined',
        isNextUnplayedGame: weekIndex === nextUnplayedGameWeekIndex,
        isLatestCompletedGame: weekIndex === latestCompletedGameWeekIndex,
        completedGameCountForSeason: _.filter(
          seasonScheduleData,
          ({result}) => typeof result === 'string'
        ).length,
      };

      validateDate({currentGameInfo, previousGameInfo, assert});
      validateStats({currentGameInfo, assert, ignoredAssert});
      validateRecords({currentGameInfo, assert, ignoredAssert});
      validateWeather({currentGameInfo, assert, ignoredAssert});
      validateCoverage({currentGameInfo, assert});
      validateLocation({currentGameInfo, assert});
      validateRankings({currentGameInfo, assert});
      validateMiscellaneous({currentGameInfo, seasonScheduleData, assert});
      validateScoreAndResult({currentGameInfo, assert});

      previousGameInfo = currentGameInfo;
    });
  }

  if (numIgnoredErrorsFound !== 0) {
    logger.info(`${numIgnoredErrorsFound} errors ignored in schedule data!`);
  }

  if (numErrorsFound !== 0) {
    logger.error(`${numErrorsFound} errors found in schedule data!`);
    process.exit(1);
  }

  logger.info('Schedule data successfully validated with no errors!');
}

main();
