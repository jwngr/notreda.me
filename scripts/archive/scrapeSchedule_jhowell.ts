import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

import {format} from 'date-fns/format';
import range from 'lodash/range';
import puppeteer, {Browser, ElementHandle} from 'puppeteer';

import {Logger} from '../lib/logger';

const logger = new Logger({isSentryEnabled: false});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.setMaxListeners(Infinity);

const ND_YEARS = range(1887, 2018).filter((year) => ![1890, 1891].includes(year));
const SCHEDULE_DATA_DIRECTORY = path.resolve(__dirname, '../../schedules/data');

let browser: Browser;

const getText = async (element: ElementHandle): Promise<string> => {
  return (await element.getProperty('textContent')).jsonValue() as Promise<string>;
};

const scrapeNotreDameSchedule = async () => {
  const page = await browser.newPage();

  await page.goto('http://www.jhowell.net/cf/scores/notredame.htm', {waitUntil: 'networkidle2'});

  interface ScrapedGame {
    date: string;
    result: string;
    opponent: string;
    isHomeGame: boolean;
    score: {home: number; away: number};
  }

  const games: Record<number, ScrapedGame[]> = {};

  const bodyHandle = await page.$('body');
  if (!bodyHandle) {
    throw new Error('Unable to find body element.');
  }

  const tables = await bodyHandle.$$('table');

  // Remove the first table (legend)
  tables.shift();

  // Reverse the array since it is in reverse chronological order
  tables.reverse();

  // Loop through every season
  for (const table of tables) {
    const currentYearGames = [];

    const trs = await table.$$('tr');

    // Remove the first (header) and last (record) trs
    const header = trs.shift();
    trs.pop();

    if (!header) {
      continue;
    }

    const yearLink = await header.$('a');
    if (!yearLink) {
      continue;
    }

    const yearProperty = await yearLink.getProperty('name');
    const year = (await yearProperty.jsonValue()) as string;

    // Loop through every game
    for (const tr of trs) {
      const tds = await tr.$$('td');
      if (!tds[0] || !tds[1] || !tds[2] || !tds[3] || !tds[4] || !tds[5]) {
        continue;
      }

      // Date
      let dateText = await getText(tds[0]);
      dateText += `/${year}`;
      const date = format(new Date(dateText), 'MM/dd/yyyy');

      // Location
      const isHomeGameText = await getText(tds[1]);
      const isHomeGame = isHomeGameText !== '@';

      // Opponent
      let opponent = await tds[2].$('a');
      if (opponent === null) {
        opponent = tds[2];
      }
      const opponentName = await getText(opponent);

      // Result
      const result = await getText(tds[3]);

      // Scores
      let homeScore: string;
      let awayScore: string;
      if (result === 'W' || result === 'T') {
        homeScore = await getText(tds[4]);
        awayScore = await getText(tds[5]);
      } else {
        homeScore = await getText(tds[5]);
        awayScore = await getText(tds[4]);
      }

      currentYearGames.push({
        date,
        result,
        opponent: opponentName,
        isHomeGame,
        score: {home: Number(homeScore), away: Number(awayScore)},
      });
    }

    games[Number(year)] = currentYearGames;
  }

  await page.close();

  return games;
};

(async () => {
  browser = await puppeteer.launch({headless: true, handleSIGINT: false});

  try {
    logger.info('Scraping Notre Dame schedule');

    const ndSchedule = await scrapeNotreDameSchedule();

    await browser.close();

    logger.success('Successfully scraped Notre Dame schedule');

    ND_YEARS.forEach((year) => {
      if (year in ndSchedule) {
        const filename = `${SCHEDULE_DATA_DIRECTORY}/${year}.json`;
        const games = JSON.parse(fs.readFileSync(filename, 'utf-8')) as {
          opponentId: string;
          isHomeGame: boolean;
          result: string;
          score: {home: number; away: number};
        }[];

        games.forEach((game, i) => {
          const scheduleGame = ndSchedule[year][i] as {
            isHomeGame: boolean;
            result: string;
            score: {home: number; away: number};
          };
          if (game.isHomeGame !== scheduleGame.isHomeGame) {
            logger.error('HOME / AWAY MISMATCH', {year, opponentId: game.opponentId, index: i});
          }

          if (game.result !== scheduleGame.result) {
            logger.error('RESULT MISMATCH', {year, opponentId: game.opponentId, index: i});
          }

          if (
            (game.score.home !== scheduleGame.score.home &&
              game.score.home !== scheduleGame.score.away) ||
            (game.score.away !== scheduleGame.score.home &&
              game.score.away !== scheduleGame.score.away)
          ) {
            logger.error('SCORE MISMATCH', {
              year,
              opponentId: game.opponentId,
              index: i,
              gameScore: game.score,
              ndScheduleScore: scheduleGame.score,
            });
          }
        });
      }
    });

    logger.success('Scraped Notre Dame schedule!');
  } catch (error) {
    logger.error('Failed to scraped Notre Dame schedule', {error});
    process.exit(1);
  }
})();
