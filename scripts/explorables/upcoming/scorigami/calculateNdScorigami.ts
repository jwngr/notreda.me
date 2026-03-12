import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

import _ from 'lodash';

import {ALL_SEASONS} from '../../../lib/constants';
import {Logger} from '../../../lib/logger';
import {NDSchedules} from '../../../lib/ndSchedules';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DATA_DIRECTORY = path.resolve(__dirname, './data');

const logger = new Logger({isSentryEnabled: false});

type ScorigamiMatrix = (number | undefined)[][];

async function main() {
  let gamesPlayedCount = 0;
  const scorigamiMatrix: ScorigamiMatrix = [];

  for (const season of ALL_SEASONS) {
    const seasonScheduleData = await NDSchedules.getForSeason(season);
    seasonScheduleData.forEach((gameData) => {
      if (gameData.result) {
        if (!gameData.score) {
          return;
        }

        gamesPlayedCount++;

        const highScore = Math.max(gameData.score.home, gameData.score.away);
        const lowScore = Math.min(gameData.score.home, gameData.score.away);

        _.update(scorigamiMatrix, [highScore, lowScore], (val) => (val || 0) + 1);
      }
    });
  }

  logger.log('Games played count:', gamesPlayedCount);

  logger.log('\nScorigami matrix:');
  logger.log(JSON.stringify(scorigamiMatrix));

  fs.writeFileSync(
    `${OUTPUT_DATA_DIRECTORY}/scorigami.json`,
    JSON.stringify(scorigamiMatrix, null, 2)
  );
}

main();
