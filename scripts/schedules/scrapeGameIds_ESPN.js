const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const request = require('request-promise');

const INPUT_DATA_DIRECTORY = path.resolve(__dirname, '../../data/schedules');

const years = [
  // '2002',
  // '2003',
  // '2004',
  // '2005',
  // '2006',
  // '2007',
  // '2008',
  // '2009',
  // '2010',
  // '2011',
  // '2012',
  // '2013',
  // '2014',
  // '2015',
  // '2016',
  // '2017',
  '2018',
];

const getHtmlForUrl = (url) => {
  return request({
    uri: url,
    transform: (body) => {
      return cheerio.load(body);
    },
  });
};

const promises = years.map((year) => {
  return getHtmlForUrl(`http://www.espn.com/college-football/team/schedule/_/id/87/season/${year}`)
    .then(($) => {
      const gameIds = [];

      const $rows = $('.Table2__tr');

      $rows.each((i, row) => {
        const $cols = $(row).find('td');
        if (
          $cols.length === 7 &&
          $cols
            .eq(0)
            .text()
            .trim() !== 'Date'
        ) {
          const $spans = $cols.eq(2).find('span');

          const gameId = $spans
            .eq(1)
            .find('a')
            .attr('href')
            .split('gameId=')[1]
            .trim();

          gameIds.push(gameId);
        }
      });

      return gameIds;
    })
    .catch((error) => {
      console.log(`Error fetching game IDs for ${year}`, error);
    });
});

return Promise.all(promises)
  .then((results) => {
    _.forEach(results, (gameIds, i) => {
      const filename = `${INPUT_DATA_DIRECTORY}/${years[i]}.json`;
      const data = require(filename);
      _.forEach(gameIds, (gameId, j) => {
        data[j].espnGameId = Number(gameId);
      });
      fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    });

    console.log('Success!');
  })
  .catch((error) => {
    console.log(`Error fetching all game IDs`, error);
  });
