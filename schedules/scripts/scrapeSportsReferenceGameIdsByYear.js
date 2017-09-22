var _ = require('lodash');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request-promise');


const years = [
  // '2000',
  // '2001',
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
  return getHtmlForUrl(`https://www.sports-reference.com/cfb/schools/notre-dame/${year}-schedule.html`)
    .then($ => {
      const gameIds = [];

      const $games = $('#schedule tbody tr td a');
      $games.each((i, $game) => {
        const gameUrl = $($game).attr('href');
        if (_.includes(gameUrl, 'boxscore')) {
          const gameId = gameUrl.split('/cfb/boxscores/')[1].split('.html')[0];
          gameIds.push(gameId);
        }
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
        data[j].sportsReferenceGameId = gameId;
      });
      fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    });
  })
  .catch(error => {
    console.log(`Error fetching all game IDs`, error);
  });
