const _ = require('lodash');

const logger = require('../lib/logger');
const ndSchedules = require('../lib/ndSchedules');

logger.info('Validating schedule data...');

let numErrorsFound = 0;

ndSchedules.ALL_SEASONS.forEach((season) => {
  const seasonScheduleData = ndSchedules.getForSeason(season);

  let previousGameDate;
  seasonScheduleData.forEach((gameData) => {
    const currentGameDate = new Date(gameData.date || gameData.fullDate || gameData.timestamp);
    if (typeof previousGameDate !== 'undefined' && currentGameDate < previousGameDate) {
      logger.error('Date for game is before prior game.', {
        season,
        ..._.pick(gameData, ['date', 'opponentId']),
      });
      numErrorsFound++;
    }
    previousGameDate = currentGameDate;

    if (gameData.score) {
      const opponentScore = gameData.isHomeGame ? gameData.score.away : gameData.score.home;
      const notreDameScore = gameData.isHomeGame ? gameData.score.home : gameData.score.away;

      let calculatedResult;
      if (notreDameScore > opponentScore) {
        calculatedResult = 'W';
      } else if (opponentScore > notreDameScore) {
        calculatedResult = 'L';
      } else {
        calculatedResult = 'T';
      }

      if (gameData.result !== calculatedResult) {
        logger.error('Result does not match up with scores.', {
          season,
          ..._.pick(gameData, ['result', 'score', 'opponentId']),
        });
        numErrorsFound++;
      }

      if (_.size(gameData.linescore.away) !== 0) {
        if (gameData.score.away !== _.sum(gameData.linescore.away)) {
          logger.error('Away team linescore does not add up to away team score.', {
            season,
            ..._.pick(gameData, ['score', 'linescore', 'opponentId']),
          });
          numErrorsFound++;
        }

        if (gameData.score.home !== _.sum(gameData.linescore.home)) {
          logger.error('Home team linescore does not add up to home team score.', {
            season,
            ..._.pick(gameData, ['score', 'linescore', 'opponentId']),
          });
          numErrorsFound++;
        }
      }
    }

    if (gameData.stats) {
      if (_.get(gameData, 'stats.away.thirdDownConversions', 0) > _.get(gameData, 'stats.away.thirdDownAttempts', 0)) {
        logger.error('Game has more away 3rd down conversions than attempts.', {
          season,
          ..._.pick(gameData, ['date', 'opponentId']),
        });
        numErrorsFound++;
      }

      if (_.get(gameData, 'stats.away.fourthDownConversions', 0) > _.get(gameData, 'stats.away.fourthDownAttempts', 0)) {
        logger.error('Game has more away 4th down conversions than attempts.', {
          season,
          ..._.pick(gameData, ['date', 'opponentId']),
        });
        numErrorsFound++;
      }

      if (_.get(gameData, 'stats.home.thirdDownConversions', 0) > _.get(gameData, 'stats.home.thirdDownAttempts', 0)) {
        logger.error('Game has more home 3rd down conversions than attempts.', {
          season,
          ..._.pick(gameData, ['date', 'opponentId']),
        });
        numErrorsFound++;
      }

      if (_.get(gameData, 'stats.home.fourthDownConversions', 0) > _.get(gameData, 'stats.home.fourthDownAttempts', 0)) {
        logger.error('Game has more home 4th down conversions than attempts.', {
          season,
          ..._.pick(gameData, ['date', 'opponentId']),
        });
        numErrorsFound++;
      }
    }
  });
});

if (numErrorsFound === 0) {
  logger.info('Schedule data validated!');
} else {
  logger.error(`${numErrorsFound} errors found in schedule data!`);
}