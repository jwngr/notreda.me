import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

import range from 'lodash/range';

import {Logger} from '../lib/logger';
import {Scraper} from '../lib/scraper';

const logger = new Logger({isSentryEnabled: false});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DATA_DIRECTORY = path.resolve(__dirname, '../../data/schedules');

const fetchGameDetailsForYear = (year) => {
  logger.info(`Fetching year ${year}.`);

  return Scraper.get(
    `https://en.wikipedia.org/wiki/${year}_Notre_Dame_Fighting_Irish_football_team`
  )
    .then(($) => {
      let $scheduleTable = $('#Schedule').parent().next();

      if ($scheduleTable[0].name !== 'table') {
        $scheduleTable = $scheduleTable.next();
      }

      const $scheduleTableRows = $scheduleTable.find('tr');

      const filename = `${INPUT_DATA_DIRECTORY}/${year}.json`;
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const gamesData = require(filename);

      const headerNames = [];
      $scheduleTableRows.each((i, row) => {
        if (i === 0) {
          $(row)
            .children('th')
            .each((j, elem) => {
              headerNames.push($(elem).text().trim());
            });
        } else if (i <= gamesData.length) {
          const rowCellValues = [];
          $(row)
            .children('td')
            .each((j, elem) => {
              let rowCellText = $(elem).text().trim();

              // Fix formatting issue in 1961 site data.
              if (j === headerNames.indexOf('Site') && !rowCellText.includes(' • ')) {
                let lastCharWasLowercase = false;
                rowCellText.split('').forEach((char, k) => {
                  if (char >= 'A' && char <= 'Z' && lastCharWasLowercase) {
                    rowCellText = rowCellText.slice(0, k) + ' • ' + rowCellText.slice(k);
                  } else {
                    lastCharWasLowercase = char >= 'a' && char <= 'z';
                  }
                });
              }

              if (j === headerNames.indexOf('Site')) {
                if (!rowCellText.includes(' • ')) {
                  rowCellText = ` • ${rowCellText}`;
                }
              }

              rowCellValues.push(rowCellText);
            });

          try {
            // TIME
            const timeIndex = headerNames.indexOf('Time');
            if (timeIndex !== -1) {
              gamesData[i - 1].time = rowCellValues[timeIndex]
                .replace('p.m.', 'PM')
                .replace('p.m', 'PM')
                .replace('a.m.', 'AM')
                .replace('a.m', 'AM');
            }

            // TV COVERAGE
            const coverageIndex = headerNames.indexOf('TV');
            if (coverageIndex !== -1) {
              gamesData[i - 1].coverage = rowCellValues[coverageIndex].toUpperCase() || undefined;
            }

            // OPPONENT
            let opponentIndex = headerNames.indexOf('Opponent');
            if (opponentIndex === -1) {
              opponentIndex = headerNames.indexOf('Opponent#');
            }
            if (opponentIndex !== -1) {
              const opponent = rowCellValues[opponentIndex];
              const isHomeGame = !opponent.startsWith('at');
              if (gamesData[i - 1].isHomeGame !== isHomeGame) {
                // logger.info('HOME / AWAY MISMATCH:', year, i - 1, opponent);
              }
            }

            // RESULT
            let resultIndex = headerNames.indexOf('Result');
            if (resultIndex !== -1) {
              const result = rowCellValues[resultIndex][0];
              if (gamesData[i - 1].result !== result) {
                // logger.info('RESULT MISMATCH:', year, i - 1);
              }
            }

            const siteIndex = headerNames.indexOf('Site');
            if (siteIndex !== -1) {
              // STADIUM
              const [stadium, location] = rowCellValues[siteIndex].split(' • ');
              let city;
              let state;
              let stateAndParens;
              if (location.includes(',')) {
                [city, stateAndParens] = location.split(', ');
                state = stateAndParens.split(' (')[0];
              } else {
                city = location.split(' (')[0];
              }

              if (stadium) {
                let correctedStadium = stadium
                  .replace('–', '-')
                  .split(' [')[0]
                  .split('[')[0]
                  .split(' (')[0];
                if (correctedStadium === 'FedExField') {
                  correctedStadium = 'FedEx Field';
                } else if (correctedStadium === 'LA Memorial Coliseum') {
                  correctedStadium = 'LA Memorial Coliseum';
                }
                gamesData[i - 1].location.stadium = correctedStadium;
              }

              // CITY / STATE
              if (
                gamesData[i - 1].location.city !== 'Notre Dame' &&
                !gamesData[i - 1].location.country
              ) {
                gamesData[i - 1].location.city = city;
                if (state) {
                  gamesData[i - 1].location.state = state[0] + state[1];
                }
              }
            }
          } catch (error) {
            logger.error(`Failed to parse schedule for ${year}:`, {error, rowCellValues});
            throw error;
          }
        }
      });

      fs.writeFileSync(filename, JSON.stringify(gamesData, null, 2));

      logger.info(`Success ${year}!`);
    })
    .catch((error) => {
      let errorMessage = error.message;
      if (error.statusCode === 404) {
        errorMessage = '404 page not found.';
      }
      logger.error(`Failed to fetch schedule for ${year}:`, {errorMessage});
    });
};

range(1900, 2017).forEach((year) => {
  fetchGameDetailsForYear(year);
});
