const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const logger = require('../../../lib/logger');
const ndSchedules = require('../../../../website/src/resources/schedules');
const {ALL_SEASONS} = require('../../../lib/constants');

const OUTPUT_DATA_DIRECTORY = path.resolve(__dirname, './data');

let gamesPlayedCount = 0;
const scorigamiMatrix = [];

ALL_SEASONS.forEach((season) => {
  const seasonScheduleData = ndSchedules.getForSeason(season);
  seasonScheduleData.forEach((gameData) => {
    if (gameData.result) {
      gamesPlayedCount++;

      const highScore = Math.max(gameData.score.home, gameData.score.away);
      const lowScore = Math.min(gameData.score.home, gameData.score.away);

      _.update(scorigamiMatrix, [highScore, lowScore], (val) => (val || 0) + 1);
    }
  });
});

logger.log('Games played count:', gamesPlayedCount);

logger.log('\nScorigami matrix:');
logger.log(JSON.stringify(scorigamiMatrix));

fs.writeFileSync(
  `${OUTPUT_DATA_DIRECTORY}/scorigami.json`,
  JSON.stringify(scorigamiMatrix, null, 2)
);
