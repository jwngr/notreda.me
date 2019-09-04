const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const puppeteer = require('puppeteer');

const red = chalk.bold.red;
const green = chalk.bold.green;

const INPUT_DATA_DIRECTORY = path.resolve(__dirname, '../../data/ndSchedules');

process.setMaxListeners(Infinity);

let browser;

const scrapeGameStats = async (gameId) => {
  const page = await browser.newPage();

  const url = `https://www.sports-reference.com/cfb/boxscores/${gameId}.html`;

  console.log(`[INFO] Scraping ${url}`);

  await page.goto(url, {
    waitUntil: 'networkidle2',
  });

  const stats = {};

  const statsTable = await page.$('#team_stats');
  const statTrs = await statsTable.$$('tbody tr');

  for (let statTr of statTrs) {
    const th = await statTr.$('th');

    let statName = await th.getProperty('innerHTML');
    statName = await statName.jsonValue();

    if (statName === 'Fumbles-Lost') {
      const tds = await statTr.$$('td');

      let awayTd = await tds[0].getProperty('innerHTML');
      awayTd = await awayTd.jsonValue();

      const [awayFumbles, awayFumblesLost] = awayTd.split('-');

      let homeTd = await tds[1].getProperty('innerHTML');
      homeTd = await homeTd.jsonValue();

      const [homeFumbles, homeFumblesLost] = homeTd.split('-');

      _.set(stats, 'away', {
        fumbles: +awayFumbles,
        fumblesLost: +awayFumblesLost,
      });

      _.set(stats, 'home', {
        fumbles: +homeFumbles,
        fumblesLost: +homeFumblesLost,
      });
    }
  }

  return stats;
};

const fn = async () => {
  const year = 2019;
  const filename = `${INPUT_DATA_DIRECTORY}/${year}.json`;
  const yearData = require(filename);

  browser = await puppeteer.launch({
    headless: true,
    handleSIGINT: false,
  });

  const promises = _.map(yearData, (gameData) => {
    if ('sportsReferenceGameId' in gameData) {
      return scrapeGameStats(gameData.sportsReferenceGameId).catch((error) => {
        console.log(
          red(`[ERROR] Failed to scrape game stats for ${gameData.sportsReferenceGameId}:`, error)
        );
        throw error;
      });
    } else {
      return Promise.resolve();
    }
  });

  let results;
  try {
    results = await Promise.all(promises);

    // TODO: filter out undefined values caused by failures

    _.forEach(results, (result, index) => {
      _.merge(yearData[index], {stats: result});
    });

    fs.writeFileSync(filename, JSON.stringify(yearData, null, 2));

    console.log(green('Success!'));
  } catch (error) {
    console.log(red(error));
  } finally {
    browser.close();
  }

  // results.forEach((result, i) => {
  //   if (result) {
  //     // yearData[i].linescore = result.linescore;
  //     if ('firstDowns' in result.stats.home) {
  //       yearData[i].stats = result.stats;
  //     }
  //   }
  // });

  // fs.writeFileSync(filename, JSON.stringify(yearData, null, 2));
};

fn();
