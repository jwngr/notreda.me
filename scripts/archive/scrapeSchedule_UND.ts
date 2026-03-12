import fs from 'fs';

import type {Cheerio} from 'cheerio';
import type {AnyNode} from 'domhandler';
import range from 'lodash/range';

import {Logger} from '../lib/logger';
import {Scraper} from '../lib/scraper';
import {Teams} from '../lib/teams';

const logger = new Logger({isSentryEnabled: false});

if (process.argv.length !== 3) {
  logger.error('USAGE: npx tsx scrapeSchedule_UND.ts <output_file>');
  process.exit(1);
}

interface RawScheduleGame {
  result: string;
  isHomeGame: boolean;
  isBowlGame: boolean;
  opponent: string;
  date: string;
  location: string;
  scores?: {home: number; away: number};
  numOvertimes?: number;
  time?: string;
}

const getHtmlScheduleDataForYear = (year: number) =>
  Scraper.get(`http://www.und.com/sports/m-footbl/sched/data/nd-m-footbl-sched-${year}.html`);

/**
 * Returns a list of game data for the provided year's games.
 *
 * @param  {number} year The year whose game data to fetch.
 * @return {Promise<Array<Object>>} A promise fulfilled with an array of objects containing game data.
 */
const getGamesForYear = async (year: number): Promise<RawScheduleGame[]> => {
  const $ = await getHtmlScheduleDataForYear(year);
  const $scheduleTable = $('#schedtable');

  // Loop through each row in the schedule table
  let $rows: Cheerio<AnyNode>[] = [];
  $scheduleTable.find('tr').each((i: number, row: AnyNode) => {
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
        let mappedOpponent = opponent;
        try {
          mappedOpponent = Teams.getByName(opponent).id;
        } catch {
          mappedOpponent = opponent;
        }

        return {
          result,
          isHomeGame,
          isBowlGame,
          opponent: mappedOpponent,
          date: $(rowCells[0]).text().trim(),
          location: $(rowCells[2]).text().trim(),
        } satisfies RawScheduleGame;
      }
    })
    .filter((game): game is RawScheduleGame => Boolean(game));

  return games;
};

const years = range(1887, 2016);
const tasks = years.map(async (year) => {
  // Skip 1890 and 1891 since und.com doesn't have data for those years
  if (year === 1890 || year === 1891) {
    return [year, null] as const;
  }

  try {
    const games = await getGamesForYear(year);
    const normalizedGames = games.map((game) => {
      let numOvertimes = 0;

      // If the game has already been played, get the results and scores
      if (game.result[0] === 'W' || game.result[0] === 'L') {
        const resultData = game.result.split(', ');
        game.result = resultData[0];
        const scores = resultData[1].split('-');

        // Calculate the number of overtimes, if applicable
        if (scores[1].includes('OT') || scores[1].includes('ot')) {
          const overtimeToken = scores[1].split('(')[1][0];
          numOvertimes = Number.parseInt(overtimeToken, 10);
          if (Number.isNaN(numOvertimes)) {
            numOvertimes = 1;
          }
          scores[1] = scores[1].split('(')[0];
        }

        // Get the home and away scores
        let homeTeamScore: number;
        let awayTeamScore: number;
        if ((game.result === 'W' && game.isHomeGame) || (game.result === 'L' && !game.isHomeGame)) {
          homeTeamScore = Number.parseInt(scores[0], 10);
          awayTeamScore = Number.parseInt(scores[1], 10);
        } else {
          homeTeamScore = Number.parseInt(scores[1], 10);
          awayTeamScore = Number.parseInt(scores[0], 10);
        }
        // Add the score and number of overtimes to the game
        game.scores = {home: homeTeamScore, away: awayTeamScore};
        game.numOvertimes = numOvertimes;
      } else {
        // Add the time to the game
        game.time = game.result;
      }

      return game;
    });

    return [year, normalizedGames] as const;
  } catch (error) {
    logger.error(`Error scraping ${year} schedule:`, {error});
    return [year, null] as const;
  }
});

Promise.all(tasks)
  .then((results) => {
    const output: Record<number, RawScheduleGame[]> = {};
    results.forEach(([year, games]) => {
      if (games) {
        output[year] = games;
      }
    });

    fs.writeFileSync(process.argv[2], JSON.stringify(output, null, 2));
    logger.success(`Schedule written to ${process.argv[2]}!`);
  })
  .catch((error) => {
    logger.fail('Failed to scrape schedule for all years:', {error});
  });
