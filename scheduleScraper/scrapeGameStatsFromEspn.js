var _ = require('lodash');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request-promise');


var getHtmlForUrl = (url) => {
  return request({
    uri: url,
    transform: (body) => {
      return cheerio.load(body);
    }
  });
}

/**
 * Returns a list of game stats and line scores for the provided game.
 *
 * @param  {number} gameId The game ID of the game whose data to fetch.
 * @return {Promise<Object>} A promise fulfilled with game stats and line scores.
 */
var getGameData = (gameId) => {
  return getHtmlForUrl(`http://www.espn.com/college-football/matchup?gameId=${gameId}`)
    .then(($) => {
      var $statsTable = $('.team-stats-list');

      // Loop through each row in the stats table
      var stats = {
        away: {},
        home: {}
      };
      $statsTable.find('tr').each((i, row) => {
        var rowCells = $(row).children('td');
        if (rowCells.length !== 0) {
          var statName = $(rowCells[0]).text().trim();
          var awayValue = $(rowCells[1]).text().trim();
          var homeValue = $(rowCells[2]).text().trim();

          switch (statName) {
            case '1st Downs':
              stats.away['firstDowns'] = parseInt(awayValue);
              stats.home['firstDowns'] = parseInt(homeValue);
              break;
            case '3rd down efficiency':
              stats.away['thirdDownAttempts'] = parseInt(awayValue.split('-')[0]);
              stats.home['thirdDownAttempts'] = parseInt(homeValue.split('-')[0]);
              stats.away['thirdDownConversions'] = parseInt(awayValue.split('-')[1]);
              stats.home['thirdDownConversions'] = parseInt(homeValue.split('-')[1]);
              break;
            case '4th down efficiency':
              stats.away['fourthDownAttempts'] = parseInt(awayValue.split('-')[0]);
              stats.home['fourthDownAttempts'] = parseInt(homeValue.split('-')[0]);
              stats.away['fourthDownConversions'] = parseInt(awayValue.split('-')[1]);
              stats.home['fourthDownConversions'] = parseInt(homeValue.split('-')[1]);
              break;
            case 'Total Yards':
              stats.away['totalYards'] = parseInt(awayValue);
              stats.home['totalYards'] = parseInt(homeValue);
              break;
            case 'Passing':
              stats.away['passYards'] = parseInt(awayValue);
              stats.home['passYards'] = parseInt(homeValue);
              break;
            case 'Comp-Att':
              stats.away['passAttempts'] = parseInt(awayValue.split('-')[0]);
              stats.home['passAttempts'] = parseInt(homeValue.split('-')[0]);
              stats.away['passCompletions'] = parseInt(awayValue.split('-')[1]);
              stats.home['passCompletions'] = parseInt(homeValue.split('-')[1]);
              break;
            case 'Interceptions thrown':
              stats.away['interceptionsThrown'] = parseInt(awayValue);
              stats.home['interceptionsThrown'] = parseInt(homeValue);
              break;
            case 'Rushing':
              stats.away['rushYards'] = parseInt(awayValue);
              stats.home['rushYards'] = parseInt(homeValue);
              break;
            case 'Rushing Attempts':
              stats.away['rushAttempts'] = parseInt(awayValue);
              stats.home['rushAttempts'] = parseInt(homeValue);
              break;
            case 'Penalties':
              stats.away['penalties'] = parseInt(awayValue.split('-')[0]);
              stats.home['penalties'] = parseInt(homeValue.split('-')[0]);
              stats.away['penaltyYards'] = parseInt(awayValue.split('-')[1]);
              stats.home['penaltyYards'] = parseInt(homeValue.split('-')[1]);
              break;
            case 'Fumbles lost':
              stats.away['fumblesLost'] = parseInt(awayValue);
              stats.home['fumblesLost'] = parseInt(homeValue);
              break;
            case 'Possession':
              stats.away['possession'] = awayValue;
              stats.home['possession'] = homeValue;
              break;
          }
        }
      });

      stats.away['fumbles'] = -1;
      stats.home['fumbles'] = -1;

      // Line score
      var $linescoresTable = $('#linescore');

      // Loop through each row in the stats table
      var linescores = {
        away: [],
        home: []
      };
      $linescoresTable.find('tbody').find('tr').each((i, row) => {
        var rowCells = $(row).children('td');

        const homeOrAway = (linescores.away.length === 0) ? 'away' : 'home';

        let firstCell = true;
        _.forEach(rowCells, (rowCell, index) => {
          if (firstCell) {
            // Skip first cell, which is the team abbreviation
            firstCell = false
          } else if (index !== rowCells.length - 1) {
            // Skip the last cell, which is the total score
            const score = parseInt($(rowCell).text().trim());
            linescores[homeOrAway].push(score);
          }
        });
      });

      return {
        stats,
        linescores
      };
    });
}

const year = 2017;
const yearData = require(`../schedules/data/${year}.json`);

const gameIds = [
  400934573,
  400933845
];

const promises = _.map(gameIds, gameId => {
  return getGameData(gameId)
    .catch(error => {
      console.log(`Error scraping stats for game ${gameId}:`, error);
    });
});

return Promise.all(promises).then(results => {
  results.forEach((result, i) => {
    yearData[i].linescores = result.linescores;
    if ('firstDowns' in result.stats.home) {
      yearData[i].stats = result.stats;
    }
  });

  fs.writeFileSync(`../schedules/data/${year}.json`, JSON.stringify(yearData, null, 2));

  console.log('Success!');
}).catch((error) => {
  console.log('Failed to scrape stats:', error);
});
