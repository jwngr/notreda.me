const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const request = require('request-promise');

const INPUT_DATA_DIRECTORY = path.resolve(__dirname, '../../data/schedules');

const getHtmlForUrl = (url) => {
  return request({
    uri: url,
    transform: (body) => {
      return cheerio.load(body);
    },
  });
};

console.log(`[INFO] Fetching head coaches and bowl games.`);

return getHtmlForUrl(
  `https://en.wikipedia.org/wiki/List_of_Notre_Dame_Fighting_Irish_football_seasons`
)
  .then(($) => {
    let $scheduleTable = $('#Seasons')
      .parent()
      .next();

    const $scheduleTableRows = $scheduleTable.find('tr');

    const headerNames = [];
    $scheduleTableRows.each((i, row) => {
      if (i === 0) {
        $(row)
          .children('th')
          .each((j, elem) => {
            headerNames.push(
              $(elem)
                .text()
                .trim()
            );
          });
      } else if (i > 0) {
        const rowCellValues = [];
        $(row)
          .children('td')
          .each((j, elem) => {
            let rowCellText = $(elem)
              .text()
              .trim();

            rowCellValues.push(rowCellText);
          });

        if (rowCellValues.length === 8) {
          const year = rowCellValues[0];
          const headCoach = rowCellValues[1];

          const filename = `${INPUT_DATA_DIRECTORY}/${year}.json`;
          const gamesData = require(filename);

          gamesData.forEach((game) => {
            game.headCoach = headCoach;
          });

          let bowlGame = rowCellValues[5];
          if (bowlGame) {
            bowlGame = bowlGame.slice(2).replace('†', '');
            if (!_.includes(bowlGame, ' ') || bowlGame === 'Champs Sports') {
              bowlGame += ' Bowl';
            }
            gamesData[gamesData.length - 1].isBowlGame = true;
            gamesData[gamesData.length - 1].nickname = bowlGame;
          }

          fs.writeFileSync(filename, JSON.stringify(gamesData, null, 2));
        }
      }
    });

    console.log(`Success!`);
  })
  .catch((error) => {
    console.log(`[ERROR] Failed to fetch head coaches and bowl games:`, error.message);
  });
