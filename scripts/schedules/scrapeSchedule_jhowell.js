const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const format = require('date-fns/format');
const puppeteer = require('puppeteer');

const red = chalk.bold.red;
const green = chalk.bold.green;

process.setMaxListeners(Infinity);

const ND_YEARS = _.range(1887, 2018).filter((year) => !_.includes([1890, 1891], year));
const SCHEDULE_DATA_DIRECTORY = path.resolve(__dirname, '../../schedules/data');

let browser;

const getText = async (element) => {
  return await (await element.getProperty('textContent')).jsonValue();
};

const scrapeNotreDameSchedule = async () => {
  const page = await browser.newPage();

  await page.goto('http://www.jhowell.net/cf/scores/notredame.htm', {
    waitUntil: 'networkidle2',
  });

  const games = {};

  const bodyHandle = await page.$('body');

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

    let year = await header.$('a');
    year = await year.getProperty('name');
    year = await year.jsonValue();

    // Loop through every game
    for (let tr of trs) {
      const tds = await tr.$$('td');

      // Date
      let date = await getText(tds[0]);
      date += `/${year}`;
      date = new Date(date);
      date = format(date, 'MM/DD/YYYY');

      // Location
      let isHomeGame = await getText(tds[1]);
      isHomeGame = isHomeGame !== '@';

      // Opponent
      let opponent = await tds[2].$('a');
      if (opponent === null) {
        opponent = tds[2];
      }
      opponent = await getText(opponent);

      // Result
      let result = await getText(tds[3]);

      // Scores
      let homeScore;
      let awayScore;
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
        opponent,
        isHomeGame,
        score: {
          home: Number(homeScore),
          away: Number(awayScore),
        },
      });
    }

    games[Number(year)] = currentYearGames;
  }

  await page.close();

  return games;
};

(async () => {
  browser = await puppeteer.launch({
    headless: true,
    handleSIGINT: false,
  });

  try {
    console.log(`[INFO] Scraping Notre Dame schedule.`);

    const ndSchedule = await scrapeNotreDameSchedule();

    await browser.close();

    console.log(green(`[INFO] Successfully scraped Notre Dame schedule.`));

    ND_YEARS.forEach((year) => {
      if (year in ndSchedule) {
        const filename = `${SCHEDULE_DATA_DIRECTORY}/${year}.json`;
        const games = require(filename);

        games.forEach((game, i) => {
          if (game.isHomeGame !== ndSchedule[year][i].isHomeGame) {
            console.log('HOME / AWAY MISMATCH:', year, game.opponentId, i);
          }

          if (game.result !== ndSchedule[year][i].result) {
            console.log('RESULT MISMATCH:', year, game.opponentId, i);
          }

          if (
            (game.score.home !== ndSchedule[year][i].score.home &&
              game.score.home !== ndSchedule[year][i].score.away) ||
            (game.score.away !== ndSchedule[year][i].score.home &&
              game.score.away !== ndSchedule[year][i].score.away)
          ) {
            console.log('SCORE MISMATCH:', year, game.opponentId, i);
            console.log(game.score, ndSchedule[year][i].score);
          }
        });
      }
    });
  } catch (error) {
    console.log(red(`[ERROR] Failed to scraped Notre Dame schedule:`, error));
  }

  console.log(green('[INFO] Success!'));
})();
