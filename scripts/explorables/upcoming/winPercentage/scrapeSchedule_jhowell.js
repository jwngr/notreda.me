const fs = require('fs');
const format = require('date-fns/format');
const puppeteer = require('puppeteer');

const scrapeTeamSchedule = async (team, filename) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`http://www.jhowell.net/cf/scores/${team}.htm`);
  await page.waitFor(1000);

  const games = [];

  const bodyHandle = await page.$('body');

  const tables = await bodyHandle.$$('table');

  // Remove the first table (legend)
  tables.shift();

  // Reverse the array since it is in reverse chronological order
  tables.reverse();

  // Loop through every season
  for (table of tables) {
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
      let date = await tds[0].getProperty('innerHTML');
      date = await date.jsonValue();
      date += `/${year}`;
      date = new Date(date);
      date = format(date, 'MM/DD/YYYY');

      // Opponent
      let opponent = await tds[2].$('a');
      if (opponent === null) {
        opponent = tds[2];
      }
      opponent = await opponent.getProperty('innerHTML');
      opponent = await opponent.jsonValue();

      // Result
      let result = await tds[3].getProperty('innerHTML');
      result = await result.jsonValue();

      // console.log(`${date} ${result} ${opponent}`);
      currentYearGames.push({
        date,
        result,
        opponent,
      });
    }

    games.push(currentYearGames);
  }

  // const wins = games.filter((game) => game.result === 'W');
  // const losses = games.filter((game) => game.result === 'L');
  // const ties = games.filter((game) => game.result === 'T');

  // console.log(wins.length, losses.length, ties.length);

  fs.writeFileSync(filename, JSON.stringify(games, null, 2));

  await browser.close();
};

// List of top win percentages take from https://en.wikipedia.org/wiki/NCAA_Division_I_FBS_football_win-loss_records
return Promise.all([
  scrapeTeamSchedule('Michigan', '../data/michigan.json'),
  scrapeTeamSchedule('NotreDame', '../data/notreDame.json'),
  scrapeTeamSchedule('OhioState', '../data/ohioState.json'),
  scrapeTeamSchedule('BoiseState', '../data/boiseState.json'),
  scrapeTeamSchedule('Alabama', '../data/alabama.json'),
  scrapeTeamSchedule('Oklahoma', '../data/oklahoma.json'),
  scrapeTeamSchedule('Texas', '../data/texas.json'),
  scrapeTeamSchedule('SouthernCalifornia', '../data/usc.json'),
  scrapeTeamSchedule('Nebraska', '../data/nebraska.json'),
  scrapeTeamSchedule('OldDominion', '../data/oldDominion.json'),
]).then(() => {
  console.log('Success!');
});
