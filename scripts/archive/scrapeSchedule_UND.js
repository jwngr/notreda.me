import fs from 'fs';

import range from 'lodash/range';
import RSVP from 'rsvp';

import {Logger} from '../../lib/logger';
import {Scraper} from '../../lib/scraper';
import teamMappings from './teamMappings.json';

const logger = new Logger({isSentryEnabled: false});

if (process.argv.length !== 3) {
  logger.error('USAGE: node scrapeSchedule.js <output_file>');
  process.exit(1);
}

/**
 * Fetches the raw HTML schedule data for a given year.
 *
 * @param  {number} year The year whose schedule to fetch.
 * @return {Promise<cheerio.Root>} The HTML schedule data.
 */
const getHtmlScheduleDataForYear = (year) => {
  return Scraper.get(
    'http://www.und.com/sports/m-footbl/sched/data/nd-m-footbl-sched-' + year + '.html'
  );
};

/**
 * Returns a list of game data for the provided year's games.
 *
 * @param  {number} year The year whose game data to fetch.
 * @return {Promise<Array<Object>>} A promise fulfilled with an array of objects containing game data.
 */
const getGamesForYear = (year) => {
  return getHtmlScheduleDataForYear(year).then(($) => {
    const $scheduleTable = $('#schedtable');

    // Loop through each row in the schedule table
    let $rows = [];
    $scheduleTable.find('tr').each((i, row) => {
      $rows.push($(row));
    });

    // Ignore the headings row
    $rows = $rows.filter(($row) => {
      return !$row.hasClass('event-table-headings');
    });

    // Rows with four cells constitute an actual game
    $rows = $rows.filter(($row) => {
      return $row.children('td').length === 4;
    });

    const games = $rows
      .map(($row) => {
        const rowCells = $row.children('td');

        const result = $(rowCells[3]).text().trim();
        let opponent = $(rowCells[1]).text().trim();

        const isHomeGame = opponent.startsWith('vs.');

        // Strip off the 'vs.' or 'at' at the beginning of the opponent
        opponent = opponent.slice(3).trim();

        // Remove '(**** Bowl)' from any bowl games
        let isBowlGame = false;
        if (opponent.indexOf('Bowl') !== -1) {
          isBowlGame = true;
          opponent = opponent.split('(')[0].trim();
        }

        // Clean up state abbreviations
        // ???

        // Ignore Blue-Gold spring games and cancelled games
        if (!opponent.includes('Game') && result !== 'Cancelled') {
          return {
            result,
            isHomeGame,
            isBowlGame,
            opponent: teamMappings[opponent],
            date: $(rowCells[0]).text().trim(),
            location: $(rowCells[2]).text().trim(),
          };
        }
      })
      .filter((game) => !!game);

    return games;
  });
};

const years = range(1887, 2016);
const promises = {};
years.forEach((year) => {
  // Skip 1890 and 1891 since und.com doesn't have data for those years
  if (year === 1890 || year === 1891) {
    return;
  }

  promises[year] = getGamesForYear(year)
    .then((games) => {
      games.map((game) => {
        let numOvertimes = 0;

        // If the game has already been played, get the results and scores
        if (game.result[0] === 'W' || game.result[0] === 'L') {
          const resultData = game.result.split(', ');
          game.result = resultData[0];
          const scores = resultData[1].split('-');

          // Calculate the number of overtimes, if applicable
          if (scores[1].indexOf('OT') !== -1 || scores[1].indexOf('ot') !== -1) {
            numOvertimes = scores[1].split('(')[1][0];
            if (numOvertimes.toUpperCase() === 'O') {
              numOvertimes = 1;
            }
            scores[1] = scores[1].split('(')[0];
          }

          // Get the home and away scores
          let homeTeamScore;
          let awayTeamScore;
          if (
            (game.result === 'W' && game.isHomeGame) ||
            (game.result === 'L' && !game.isHomeGame)
          ) {
            homeTeamScore = parseInt(scores[0]);
            awayTeamScore = parseInt(scores[1]);
          } else {
            homeTeamScore = parseInt(scores[1]);
            awayTeamScore = parseInt(scores[0]);
          }

          // Add the score and number of overtimes to the game
          game.scores = {
            home: homeTeamScore,
            away: awayTeamScore,
          };
          game.numOvertimes = numOvertimes;
        } else {
          // Add the time to the game
          game.time = game.result;
        }

        return game;
      });
    })
    .catch(function (error) {
      logger.error(`Error scraping ${year} schedule:`, {error});
    });
});

RSVP.hash(promises)
  .then(function (result) {
    fs.writeFileSync(process.argv[2], JSON.stringify(result, null, 2));
    logger.success(`Schedule written to ${process.argv[2]}!`);
  })
  .catch(function (error) {
    logger.fail('Failed to scrape schedule for all years:', {error});
  });
