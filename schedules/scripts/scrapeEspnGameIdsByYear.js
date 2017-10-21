var _ = require('lodash');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request-promise');


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
  '2017',
];

var getHtmlForUrl = (url) => {
  return request({
    uri: url,
    transform: (body) => {
      return cheerio.load(body);
    }
  });
}

const promises = years.map(year => {
  return getHtmlForUrl(`http://www.espn.com/college-football/team/schedule/_/id/87/year/${year}`)
    .then($ => {
      const gameIds = [];

      const $scores = $('.score > a');
      $scores.each((i, $score) => {
        const gameUrl = $($score).attr('href');
        const gameId = gameUrl.split('//www.espn.com/ncf/recap/_/id/')[1];

        gameIds.push(gameId);
      });

      return gameIds;
    })
    .catch(error => {
      console.log(`Error fetching game IDs for ${year}`, error);
    });
});

return Promise.all(promises)
  .then(results => {
    _.forEach(results, (gameIds, i) => {
      const filename = `../data/${years[i]}.json`;
      const data = require(filename);
      _.forEach(gameIds, (gameId, j) => {
        data[j].espnGameId = Number(gameId);
      });
      fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    });

    console.log('Success!');
  })
  .catch(error => {
    console.log(`Error fetching all game IDs`, error);
  });


