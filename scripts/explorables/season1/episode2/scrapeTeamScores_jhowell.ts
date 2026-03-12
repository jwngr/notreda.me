import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

import {format} from 'date-fns/format';
import _ from 'lodash';
import puppeteer, {Browser, ElementHandle} from 'puppeteer';

import {Logger} from '../../../lib/logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = new Logger({isSentryEnabled: false});

process.setMaxListeners(Infinity);

let browser: Browser;

const getText = async (element: ElementHandle): Promise<string> => {
  return getProperty(element, 'textContent');
};

const getProperty = async (element: ElementHandle, propertyName: string): Promise<string> => {
  return (await element.getProperty(propertyName)).jsonValue() as Promise<string>;
};

const scrapeTeamUrls = async (): Promise<{name: string; url: string}[]> => {
  const page = await browser.newPage();

  const url = `http://www.jhowell.net/cf/scores/byName.htm`;

  logger.info(`Scraping team URLs...`);

  await page.goto(url, {waitUntil: 'networkidle2'});

  const teamUrls: {name: string; url: string}[] = [];

  const teamAnchors = await page.$$('hr + p > a');

  for (const teamAnchor of teamAnchors) {
    teamUrls.push({
      name: (await getText(teamAnchor)).split(' (')[0],
      url: await getProperty(teamAnchor, 'href'),
    });
  }

  return teamUrls;
};

const scrapeTeamScores = async (teamName: string, teamUrl: string) => {
  const page = await browser.newPage();

  logger.info(`Scraping historical scores for ${teamName}...`);

  await page.goto(teamUrl, {waitUntil: 'networkidle2'});

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
      const opponentName = (await getText(opponent)).replace(/\*/g, '');

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

const fn = async () => {
  browser = await puppeteer.launch({headless: true, handleSIGINT: false});

  try {
    const teamUrls = await scrapeTeamUrls();

    for (const teamUrl of teamUrls) {
      const games = await scrapeTeamScores(teamUrl.name, teamUrl.url);

      const teamNameTokens = teamUrl.name.replace(/-/g, ' ').split(' ');
      let teamNameSlug = _.lowerCase(teamNameTokens[0]);
      teamNameTokens.forEach((token, i) => {
        if (i > 0) {
          teamNameSlug += _.capitalize(token);
        }
      });

      const filename = path.resolve(__dirname, `./data/${teamNameSlug}.json`);
      fs.writeFileSync(filename, JSON.stringify(games, null, 2));
    }

    logger.success('Successfully scraped team records!');
    browser.close();
  } catch (error) {
    logger.error('Failed to scrape team records.', {error});
    browser.close();
    process.exit(1);
  }
};

fn();
