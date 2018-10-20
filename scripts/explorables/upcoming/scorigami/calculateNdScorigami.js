const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const OUTPUT_DATA_DIRECTORY = path.resolve(__dirname, './data');
const SCHEDULE_DATA_DIRECTORY = path.resolve(__dirname, '../../../../schedules/data');

const scheduleDataFilenames = fs.readdirSync(SCHEDULE_DATA_DIRECTORY);

let numGames = 0;
const scorigamiMatrix = [];

scheduleDataFilenames.forEach((scheduleDataFilename) => {
  const games = require(`${SCHEDULE_DATA_DIRECTORY}/${scheduleDataFilename}`);

  games.forEach((gameData) => {
    if (gameData.result) {
      numGames++;

      const highScore = Math.max(gameData.score.home, gameData.score.away);
      const lowScore = Math.min(gameData.score.home, gameData.score.away);

      const currentEntry = _.get(scorigamiMatrix, [highScore, lowScore], 0);
      _.set(scorigamiMatrix, [highScore, lowScore], currentEntry + 1);

      if (scheduleDataFilename === `2018.json`) {
        console.log('2018', gameData.opponentId, currentEntry);
      }
    }
  });
});

console.log('NUM GAMES:', numGames);
console.log('SCORIGAMI MATRIX:', JSON.stringify(scorigamiMatrix));

fs.writeFileSync(
  `${OUTPUT_DATA_DIRECTORY}/scorigami.json`,
  JSON.stringify(scorigamiMatrix, null, 2)
);
