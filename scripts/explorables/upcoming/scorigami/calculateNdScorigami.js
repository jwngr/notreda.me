const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const logger = require('../../../lib/logger');
const {ALL_PLAYED_SEASONS} = require('../../../lib/constants');

const OUTPUT_DATA_DIRECTORY = path.resolve(__dirname, './data');

let numGames = 0;
const scorigamiMatrix = [];

ALL_PLAYED_SEASONS.forEach((season) => {
  const seasonScheduleData = ndSchedules.getForSeason(season);

  seasonScheduleData.forEach((gameData) => {
    if (gameData.result) {
      numGames++;

      const highScore = Math.max(gameData.score.home, gameData.score.away);
      const lowScore = Math.min(gameData.score.home, gameData.score.away);

      const currentEntry = _.get(scorigamiMatrix, [highScore, lowScore], 0);
      _.set(scorigamiMatrix, [highScore, lowScore], currentEntry + 1);

      if (season === 2018) {
        console.log('2018', gameData.opponentId, currentEntry);
      }
    }
  });
});

logger.info('NUM GAMES:', numGames);
logger.info('SCORIGAMI MATRIX:', JSON.stringify(scorigamiMatrix));

fs.writeFileSync(
  `${OUTPUT_DATA_DIRECTORY}/scorigami.json`,
  JSON.stringify(scorigamiMatrix, null, 2)
);
