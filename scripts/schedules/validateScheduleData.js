const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const INPUT_DATA_DIRECTORY = path.resolve(__dirname, '../../schedules/data');

const dataFilenames = fs.readdirSync(INPUT_DATA_DIRECTORY);

dataFilenames.forEach((dataFilename) => {
  const year = dataFilename.split('.')[0];
  const yearData = require(`${INPUT_DATA_DIRECTORY}/${dataFilename}`);

  let previousGameDate;
  yearData.forEach((gameData) => {
    const currentGameDate = new Date(gameData.date || gameData.fullDate || gameData.timestamp);
    if (typeof previousGameDate !== 'undefined' && currentGameDate < previousGameDate) {
      console.log('DATE WRONG:', year, gameData.opponentId);
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
        console.log('RESULT WRONG:', year, gameData.opponentId);
      }

      if (_.size(gameData.linescore.away) !== 0) {
        if (gameData.score.away !== _.sum(gameData.linescore.away)) {
          console.log(
            'AWAY LINESCORE WRONG:',
            year,
            gameData.opponentId,
            gameData.score.away,
            gameData.linescore.away
          );
        }

        if (gameData.score.home !== _.sum(gameData.linescore.home)) {
          console.log(
            'HOME LINESCORE WRONG:',
            year,
            gameData.opponentId,
            gameData.score.home,
            gameData.linescore.home
          );
        }

        gameData.linescore.away.forEach((score, i) => {
          if (i >= 4 && score > 8) {
            console.log(year, gameData.opponentId, i, score);
          }
        });
      }
    }
  });
});
