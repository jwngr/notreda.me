const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const format = require('date-fns/format');
const puppeteer = require('puppeteer');

const logger = require('../../../lib/logger');

process.setMaxListeners(Infinity);

let browser;

const getText = async (element) => {
  return getProperty(element, 'textContent');
};

const getProperty = async (element, propertyName) => {
  return await (await element.getProperty(propertyName)).jsonValue();
};

const scrapeTeamUrls = async (gameId) => {
  const page = await browser.newPage();

  const url = `http://www.jhowell.net/cf/scores/byName.htm`;

  logger.info(`Scraping team URLs...`);

  await page.goto(url, {
    waitUntil: 'networkidle2',
  });

  const teamUrls = [];

  const teamAnchors = await page.$$('hr + p > a');

  for (const teamAnchor of teamAnchors) {
    teamUrls.push({
      name: (await getText(teamAnchor)).split(' (')[0],
      url: await getProperty(teamAnchor, 'href'),
    });
  }

  return teamUrls;
};

const scrapeTeamScores = async (teamName, teamUrl) => {
  const page = await browser.newPage();

  logger.info(`Scraping historical scores for ${teamName}...`);

  await page.goto(teamUrl, {
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
      date = format(date, 'MM/dd/yyyy');

      // Location
      let isHomeGame = await getText(tds[1]);
      isHomeGame = isHomeGame !== '@';

      // Opponent
      let opponent = await tds[2].$('a');
      if (opponent === null) {
        opponent = tds[2];
      }
      opponent = (await getText(opponent)).replace('*', '');

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

const fn = async () => {
  browser = await puppeteer.launch({
    headless: true,
    handleSIGINT: false,
  });

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
  } catch (error) {
    logger.error('Failed to scrape team records.', {error});
  } finally {
    browser.close();
  }
};

fn();
