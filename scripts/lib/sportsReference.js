const _ = require('lodash');
const puppeteer = require('puppeteer');

process.setMaxListeners(Infinity);

const NORMALIZED_TEAM_NAMES = {
  Pitt: 'Pittsburgh',
  'Miami (FL)': 'Maimi',
  'Texas Christian': 'TCU',
  SMU: 'Southern Methodist',
  'North Carolina State': 'NC State',
};

const _normalizeTeamName = (teamName) => {
  return NORMALIZED_TEAM_NAMES[teamName] || teamName;
};

const _getText = async (element) => {
  return await (await element.getProperty('textContent')).jsonValue();
};

const _parsePollRows = async (pollRows) => {
  const pollResults = [];

  for (const row of pollRows) {
    const headerCells = await row.$$('th');
    if (headerCells.length === 1) {
      const rowValues = [await _getText(headerCells[0])];
      const rowCells = await row.$$('td');

      for (const cell of rowCells) {
        let cellText = await _getText(cell);
        rowValues.push(cellText.trim());
      }

      const weekIndex = Number(rowValues[0]) - 1;
      const date = rowValues[1];
      const ranking = Number(rowValues[2]);
      const teamNameAndRecord = rowValues[3];
      const previousRanking = rowValues[4] || 'NR';
      const conference = rowCells.length === 8 ? rowValues[7] : rowValues[6];

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

      teamName = _normalizeTeamName(teamName);

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

module.exports.fetchPollsForSeason = async (season) => {
  const browser = await puppeteer.launch({
    headless: true,
    handleSIGINT: false,
  });
  const page = await browser.newPage();
  const url = `https://www.sports-reference.com/cfb/years/${season}-polls.html`;

  await page.goto(url, {
    waitUntil: 'networkidle2',
  });

  const apPollRows = await page.$$('#ap tbody tr');
  const bcsPollRows = await page.$$('#div_bcs tbody tr');
  const coachesPollRows = await page.$$('#usatoday tbody tr');
  const cfbPlayoffRankingsRows = await page.$$('#cfbplayoff tbody tr');

  const pollResults = {};

  if (_.size(apPollRows) !== 0) {
    pollResults.ap = await _parsePollRows(apPollRows);
  }

  if (_.size(bcsPollRows) !== 0) {
    pollResults.bcs = await _parsePollRows(bcsPollRows);
  }

  if (_.size(coachesPollRows) !== 0) {
    pollResults.coaches = await _parsePollRows(coachesPollRows);
  }

  if (_.size(cfbPlayoffRankingsRows) !== 0) {
    pollResults.cfbPlayoff = await _parsePollRows(cfbPlayoffRankingsRows);
  }

  await page.close();

  await browser.close();

  return pollResults;
};
