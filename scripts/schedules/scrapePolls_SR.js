const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const puppeteer = require('puppeteer');

const teams = require('../../src/resources/teams.json');

const red = chalk.bold.red;
const green = chalk.bold.green;

const OUTPUT_DATA_DIRECTORY = path.resolve(__dirname, '../../data/polls');

const CURRENT_YEAR = 2019;
const AP_POLL_YEARS = _.range(1936, CURRENT_YEAR + 1);

const unknownTeams = new Set();

process.setMaxListeners(Infinity);

let browser;

const teamNamesMap = {
  Pitt: 'Pittsburgh',
  'Miami (FL)': 'Maimi',
  'Texas Christian': 'TCU',
  SMU: 'Southern Methodist',
  'North Carolina State': 'NC State',
};

const normalizeTeamName = (teamName) => {
  return teamNamesMap[teamName] || teamName;
};

const getText = async (element) => {
  return await (await element.getProperty('textContent')).jsonValue();
};

const parsePollRows = async (pollRows) => {
  const pollResults = [];

  for (const row of pollRows) {
    const headerCells = await row.$$('th');
    if (headerCells.length === 1) {
      const rowValues = [await getText(headerCells[0])];
      const rowCells = await row.$$('td');

      for (const cell of rowCells) {
        let cellText = await getText(cell);
        rowValues.push(cellText.trim());
      }

      const weekIndex = Number(rowValues[0]) - 1;
      const date = rowValues[1];
      const ranking = Number(rowValues[2]);
      const teamNameAndRecord = rowValues[3];
      const previousRanking = rowValues[4] || 'NR';
      const conference = rowValues[6];

      let record;
      let teamName;
      if (_.includes(teamNameAndRecord, '(')) {
        teamName = teamNameAndRecord.split(' (')[0];
        record = teamNameAndRecord.split(' (')[1].split(')')[0];
      } else {
        teamName = teamNameAndRecord;
        if (date === 'Preseason') {
          record = '0-0';
        }
      }

      teamName = normalizeTeamName(teamName);

      if (!_.find(teams, ['name', teamName])) {
        unknownTeams.add(teamName);
      }

      if (typeof pollResults[weekIndex] === 'undefined') {
        pollResults[weekIndex] = {
          date,
          teams: {},
        };
      }

      pollResults[weekIndex].teams[teamName] = {
        record,
        ranking,
        conference,
        previousRanking,
      };
    }
  }

  return pollResults;
};

const scrapePollsForYear = async (year) => {
  const page = await browser.newPage();

  const url = `https://www.sports-reference.com/cfb/years/${year}-polls.html`;

  await page.goto(url, {
    waitUntil: 'networkidle2',
  });

  const apPollRows = await page.$$('#ap tbody tr');
  const bcsPollRows = await page.$$('#div_bcs tbody tr');
  const coachesPollRows = await page.$$('#usatoday tbody tr');
  const cfbPlayoffRankingsRows = await page.$$('#cfbplayoff tbody tr');

  const pollResults = {};

  if (_.size(apPollRows) !== 0) {
    pollResults.ap = await parsePollRows(apPollRows);
  }

  if (_.size(bcsPollRows) !== 0) {
    pollResults.bcs = await parsePollRows(bcsPollRows);
  }

  if (_.size(coachesPollRows) !== 0) {
    pollResults.coaches = await parsePollRows(coachesPollRows);
  }

  if (_.size(cfbPlayoffRankingsRows) !== 0) {
    pollResults.cfbPlayoff = await parsePollRows(cfbPlayoffRankingsRows);
  }

  await page.close();

  return pollResults;
};

(async () => {
  browser = await puppeteer.launch({
    headless: true,
    handleSIGINT: false,
  });

  // for (const year of AP_POLL_YEARS) {
  for (const year of [2019]) {
    console.log(`[INFO] Scraping polls for ${year}.`);

    try {
      const pollResults = await scrapePollsForYear(year);

      const filename = `${OUTPUT_DATA_DIRECTORY}/${year}.json`;
      fs.writeFileSync(filename, JSON.stringify(pollResults, null, 2));

      console.log(green(`[INFO] Successfully scraped polls for ${year}.`));
    } catch (error) {
      console.log(red(`[ERROR] Failed to scraped polls for ${year}:`, error));
    }
  }

  await browser.close();

  console.log(green('[INFO] Success!'));
})();
