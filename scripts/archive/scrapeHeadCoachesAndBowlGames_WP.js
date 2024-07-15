import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

import {Logger} from '../lib/logger';
import {Scraper} from '../lib/scraper';

const logger = new Logger({isSentryEnabled: false});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DATA_DIRECTORY = path.resolve(__dirname, '../../data/schedules');

logger.info(`Fetching head coaches and bowl games.`);

Scraper.get(`https://en.wikipedia.org/wiki/List_of_Notre_Dame_Fighting_Irish_football_seasons`)
  .then(($) => {
    let $scheduleTable = $('#Seasons').parent().next();

    const $scheduleTableRows = $scheduleTable.find('tr');

    const headerNames = [];
    $scheduleTableRows.each((i, row) => {
      if (i === 0) {
        $(row)
          .children('th')
          .each((j, elem) => {
            headerNames.push($(elem).text().trim());
          });
      } else if (i > 0) {
        const rowCellValues = [];
        $(row)
          .children('td')
          .each((j, elem) => {
            let rowCellText = $(elem).text().trim();

            rowCellValues.push(rowCellText);
          });

        if (rowCellValues.length === 8) {
          const year = rowCellValues[0];
          const headCoach = rowCellValues[1];

          const filename = `${INPUT_DATA_DIRECTORY}/${year}.json`;
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const gamesData = require(filename);

          gamesData.forEach((game) => {
            game.headCoach = headCoach;
          });

          let bowlGame = rowCellValues[5];
          if (bowlGame) {
            bowlGame = bowlGame.slice(2).replace('†', '');
            if (!bowlGame.includes(' ') || bowlGame === 'Champs Sports') {
              bowlGame += ' Bowl';
            }
            gamesData[gamesData.length - 1].isBowlGame = true;
            gamesData[gamesData.length - 1].nickname = bowlGame;
          }

          fs.writeFileSync(filename, JSON.stringify(gamesData, null, 2));
        }
      }
    });

    logger.success('Fetched head coaches and bowl games');
  })
  .catch((error) => {
    logger.error(`Failed to fetch head coaches and bowl games:`, error.message);
  });
