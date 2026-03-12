import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

import _ from 'lodash';
import puppeteer, {Browser} from 'puppeteer';

import {CURRENT_SEASON} from '../lib/constants';
import {Logger} from '../lib/logger';

const logger = new Logger({isSentryEnabled: false});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DATA_DIRECTORY = path.resolve(__dirname, '../../website/src/resources/schedules');

process.setMaxListeners(Infinity);

let browser: Browser;

const scrapeGameStats = async (gameId: string) => {
  const page = await browser.newPage();

  const url = `https://www.sports-reference.com/cfb/boxscores/${gameId}.html`;

  logger.info(`Scraping ${url}`);

  await page.goto(url, {waitUntil: 'networkidle2'});

  const stats: Record<string, unknown> = {};

  const statsTable = await page.$('#team_stats');
  if (!statsTable) {
    throw new Error('Unable to find team stats table.');
  }
  const statTrs = await statsTable.$$('tbody tr');

  for (const statTr of statTrs) {
    const th = await statTr.$('th');
    if (!th) {
      continue;
    }

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

      _.set(stats, 'away', {fumbles: +awayFumbles, fumblesLost: +awayFumblesLost});

      _.set(stats, 'home', {fumbles: +homeFumbles, fumblesLost: +homeFumblesLost});
    }
  }

  return stats;
};

const fn = async () => {
  const year = CURRENT_SEASON;
  const filename = `${INPUT_DATA_DIRECTORY}/${year}.json`;
  const yearData = JSON.parse(fs.readFileSync(filename, 'utf-8')) as Record<string, unknown>[];

  browser = await puppeteer.launch({headless: true, handleSIGINT: false});

  const promises = _.map(yearData, (gameData) => {
    const sportsReferenceGameId = gameData.sportsReferenceGameId as string | undefined;
    if (typeof sportsReferenceGameId === 'string') {
      return scrapeGameStats(sportsReferenceGameId).catch((error) => {
        logger.error(`Failed to scrape game stats for ${sportsReferenceGameId}:`, {error});
        throw error;
      });
    } else {
      return Promise.resolve();
    }
  });

  let results;
  try {
    // Filter out undefined values caused by failures.
    results = _.filter(await Promise.all(promises), _.identity);

    _.forEach(results, (result, index) => {
      _.merge(yearData[index], {stats: result});
    });

    fs.writeFileSync(filename, JSON.stringify(yearData, null, 2));

    logger.success('Scraped game stats');
    browser.close();
  } catch (error) {
    logger.error('Failed to scrape game stats', {error});
    browser.close();
    process.exit(1);
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
