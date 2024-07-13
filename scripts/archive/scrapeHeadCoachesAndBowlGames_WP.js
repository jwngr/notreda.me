import fs from 'fs';
import path from 'path';

import cheerio from 'cheerio';
import _ from 'lodash';
import request from 'request-promise';

import {Logger} from '../lib/logger';

const logger = new Logger({isSentryEnabled: false});

const INPUT_DATA_DIRECTORY = path.resolve(__dirname, '../../data/schedules');

const getHtmlForUrl = (url) => {
  return request({
    uri: url,
    transform: (body) => {
      return cheerio.load(body);
    },
  });
};

logger.info(`Fetching head coaches and bowl games.`);

getHtmlForUrl(`https://en.wikipedia.org/wiki/List_of_Notre_Dame_Fighting_Irish_football_seasons`)
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
            if (!_.includes(bowlGame, ' ') || bowlGame === 'Champs Sports') {
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
