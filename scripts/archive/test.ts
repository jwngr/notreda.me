import fs from 'fs';
import path from 'path';

import {ALL_SEASONS} from '../lib/constants';
import {Logger} from '../lib/logger';
import {getForSeason} from '../lib/ndSchedules';

const logger = new Logger({isSentryEnabled: false});

const GAME_STATS_DATA_DIRECTORY = path.resolve(__dirname, '../../website/resources/gamesStats');

async function main() {
  for (const season of ALL_SEASONS) {
    const seasonScheduleData = await getForSeason(season);
    seasonScheduleData.forEach((gameData) => {
      fs.writeFileSync(
        GAME_STATS_DATA_DIRECTORY + `/${season}.json`,
        JSON.stringify(gameData, null, 2)
      );
    });
  }

  logger.success('Stats copied');
}

main();
