var _ = require('lodash');
var fs = require('fs');
var RSVP = require('rsvp');
var cheerio = require('cheerio');
var request = require('request-promise');

if (process.argv.length !== 3) {
  console.log('USAGE: node scrapeGameStats.js <output_file>');
  process.exit(1);
}

var getHtmlForUrl = (url) => {
  return request({
    uri: url,
    transform: (body) => {
      return cheerio.load(body);
    }
  });
}


/**
 * Returns a list of game data for the provided year's games.
 *
 * @param  {number} year The year whose game data to fetch.
 * @return {Promise<Array<Object>>} A promise fulfilled with an array of objects containing game data.
 */
var getStatsForGame = (gameUrl) => {
  return getHtmlForUrl(gameUrl).then(($) => {
    var games = [];

    var $statsTable = $('.team-stats-list');

    // Loop through each row in the schedule table
    var stats = {};
    $statsTable.find('tr').each((i, row) => {
      var rowCells = $(row).children('td');
      if (rowCells.length !== 0) {
        var statName = $(rowCells[0]).text().trim();
        var awayValue = $(rowCells[1]).text().trim();
        var homeValue = $(rowCells[2]).text().trim();

        stats[statName] = {
          home: homeValue,
          away: awayValue
        }
      }
    });

    return stats;
  });
}


var statsUrlsInfo = require('./statsUrls');

var promises = _.map(statsUrlsInfo[2015], (urlInfo) => {
  return getStatsForGame(urlInfo.url).catch((error) => {
    console.log(`Error scraping ${ gameUrl } stats:`, error);
  });
});


return RSVP.all(promises).then((result) => {
  fs.writeFileSync(process.argv[2], JSON.stringify(result, null, 2));
  console.log(`Stats written to ${ process.argv[2] }!`);
}).catch((error) => {
  console.log('Failed to scrape stats for all games:', error);
});
