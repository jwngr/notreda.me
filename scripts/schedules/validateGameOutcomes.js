const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const INPUT_DATA_DIRECTORY = path.resolve(__dirname, '../../schedules/data');

const dataFilenames = fs.readdirSync(INPUT_DATA_DIRECTORY);

dataFilenames.forEach((dataFilename) => {
  const year = dataFilename.split('.')[0];
  const yearData = require(`${INPUT_DATA_DIRECTORY}/${dataFilename}`);

  yearData.forEach((gameData) => {
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
        console.log(year, gameData.opponentId);
      }
    }
  });
});
