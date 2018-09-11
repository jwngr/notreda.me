const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const request = require('request-promise');

const INPUT_DATA_DIRECTORY = path.resolve(__dirname, '../data');

const year = 2018;

const teams = {
  'Notre Dame': 'ND',
  Michigan: 'MICH',
  'Ball State': 'BALL',
  Vanderbilt: 'VANDY',
  'Wake Forest': 'WAKE',
  Stanford: 'STAN',
  'Virginia Tech': 'VT',
  Pittsburgh: 'PITT',
  Navy: 'NAVY',
  Northwestern: 'NW',
  'Florida State': 'FSU',
  Syracuse: 'SYR',
  USC: 'USC',
};

const getHtmlForUrl = (url) => {
  return request({
    uri: url,
    transform: (body) => {
      return cheerio.load(body);
    },
  });
};

return getHtmlForUrl('https://www.ncaa.com/standings/football/fbs')
  .then(($) => {
    const teamRecords = {};

    const $tableRows = $('.table-wrap tr');
    $tableRows.each((i, row) => {
      const $teamNameCell = $(row).find('.standings-team');

      const teamName = $teamNameCell.text().trim();
      if (_.has(teams, teamName)) {
        const siblings = $teamNameCell.siblings();
        const wins = Number(
          $(siblings[2])
            .text()
            .trim()
        );
        const losses = Number(
          $(siblings[3])
            .text()
            .trim()
        );
        teamRecords[teams[teamName]] = {
          overall: `${wins}-${losses}`,
          home: $(siblings[6])
            .text()
            .trim(),
          away: $(siblings[7])
            .text()
            .trim(),
        };
      }
    });

    const filename = `${INPUT_DATA_DIRECTORY}/${year}.json`;
    const data = require(filename);

    _.forEach(data, (game, i) => {
      if (!game.result) {
        if (!_.has(teamRecords, game.opponentId)) {
          throw new Error(`Opponent ${game.opponentId} is not in team records dictionary`);
        }

        if (game.isHomeGame) {
          game.records = {
            home: teamRecords['ND'],
            away: teamRecords[game.opponentId],
          };
        } else {
          game.records = {
            home: teamRecords[game.opponentId],
            away: teamRecords['ND'],
          };
        }
      }
    });

    fs.writeFileSync(filename, JSON.stringify(data, null, 2));

    console.log('Success!');
  })
  .catch((error) => {
    console.log('Error fetching team records:', error);
  });
