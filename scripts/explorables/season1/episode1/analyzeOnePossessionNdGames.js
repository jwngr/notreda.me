import fs from 'fs';
import path from 'path';

import _ from 'lodash';

import {Logger} from '../../../lib/logger';

const INPUT_DATA_DIRECTORY = path.resolve(__dirname, '../../data/schedules');

const dataFilenames = fs.readdirSync(INPUT_DATA_DIRECTORY);

const games = {};
const coaches = {};
const coachOrder = [];

const getPercentage = (top, bottom) => {
  if (bottom === 0) {
    return '0.00';
  }

  return ((top * 100.0) / bottom).toFixed(1);
};

Logger.info('YEARS:');

dataFilenames.forEach((dataFilename) => {
  const year = dataFilename.split('.')[0];

  if (year <= 2018) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const yearData = require(`${INPUT_DATA_DIRECTORY}/${dataFilename}`);

    games[year] = {
      totalTiesCount: 0,
      totalWinsCount: 0,
      totalGamesCount: 0,
      totalLossesCount: 0,
      totalDifferential: 0,
      onePossesssionGamesCount: 0,
      onePossesssionTiesCount: 0,
      onePossesssionWinsCount: 0,
      onePossesssionLossesCount: 0,
    };

    yearData.forEach((gameData) => {
      if (!_.includes(coachOrder, gameData.headCoach)) {
        coachOrder.push(gameData.headCoach);
      }

      coaches[gameData.headCoach] = coaches[gameData.headCoach] || {
        name: gameData.headCoach,
        totalTiesCount: 0,
        totalWinsCount: 0,
        totalGamesCount: 0,
        totalLossesCount: 0,
        totalDifferential: 0,
        onePossesssionGamesCount: 0,
        onePossesssionTiesCount: 0,
        onePossesssionWinsCount: 0,
        onePossesssionLossesCount: 0,
      };

      if (gameData.result) {
        games[year].totalGamesCount += 1;
        coaches[gameData.headCoach].totalGamesCount += 1;

        if (gameData.result === 'W') {
          games[year].totalWinsCount += 1;
          coaches[gameData.headCoach].totalWinsCount += 1;
        } else if (gameData.result === 'L') {
          games[year].totalLossesCount += 1;
          coaches[gameData.headCoach].totalLossesCount += 1;
        } else {
          games[year].totalTiesCount += 1;
          coaches[gameData.headCoach].totalTiesCount += 1;
        }

        const differential = Math.abs(gameData.score.home - gameData.score.away);
        games[year].totalDifferential += differential;
        coaches[gameData.headCoach].totalDifferential += differential;

        if (differential <= 8) {
          games[year].onePossesssionGamesCount += 1;
          coaches[gameData.headCoach].onePossesssionGamesCount += 1;

          if (gameData.result === 'W') {
            games[year].onePossesssionWinsCount += 1;
            coaches[gameData.headCoach].onePossesssionWinsCount += 1;
          } else if (gameData.result === 'L') {
            games[year].onePossesssionLossesCount += 1;
            coaches[gameData.headCoach].onePossesssionLossesCount += 1;
          } else {
            games[year].onePossesssionTiesCount += 1;
            coaches[gameData.headCoach].onePossesssionTiesCount += 1;
          }
        }
      }
    });

    Logger.newline();
    Logger.info(year);
    Logger.info({
      ...games[year],
      record: `${games[year].onePossesssionWinsCount}-${games[year].onePossesssionLossesCount}-${games[year].onePossesssionTiesCount}`,
      overallWinPercentage:
        getPercentage(games[year].totalWinsCount, games[year].totalGamesCount) + '%',
      onePossesssionGameWinPercentage:
        getPercentage(games[year].onePossesssionWinsCount, games[year].onePossesssionGamesCount) +
        '%',
    });
  }
});

Logger.info(coaches);
Logger.info('\n\nCOACHES');

_.forEach(coachOrder, (coach) => {
  const coachData = coaches[coach];

  Logger.info(
    coach,
    coachData.onePossesssionGamesCount,
    `${coachData.onePossesssionWinsCount}-${coachData.onePossesssionLossesCount}-${coachData.onePossesssionTiesCount}`,
    getPercentage(coachData.onePossesssionWinsCount, coachData.onePossesssionGamesCount) + '%',
    getPercentage(coachData.onePossesssionGamesCount, coachData.totalGamesCount) + '%',
    ((coachData.totalDifferential * 1.0) / coachData.totalGamesCount).toFixed(2)
  );
});
