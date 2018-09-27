const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const INPUT_DATA_DIRECTORY = path.resolve(__dirname, '../../schedules/data');

const dataFilenames = fs.readdirSync(INPUT_DATA_DIRECTORY);

dataFilenames.forEach((dataFilename) => {
  const year = dataFilename.split('.')[0];
  const yearData = require(`${INPUT_DATA_DIRECTORY}/${dataFilename}`);

  yearData.forEach((gameData) => {
    if (gameData.score && _.size(gameData.linescore.away) !== 0) {
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
  });
});
