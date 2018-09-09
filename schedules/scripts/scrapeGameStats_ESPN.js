const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const request = require('request-promise');

const INPUT_DATA_DIRECTORY = path.resolve(__dirname, '../data');

const getHtmlForUrl = (url) => {
  return request({
    uri: url,
    transform: (body) => {
      return cheerio.load(body);
    },
  });
};

/**
 * Returns a list of game stats and line scores for the provided game.
 *
 * @param  {number} gameId The game ID of the game whose data to fetch.
 * @return {Promise<Object>} A promise fulfilled with game stats and line scores.
 */
const getGameStats = (gameId) => {
  return getHtmlForUrl(`http://www.espn.com/college-football/matchup?gameId=${gameId}`).then(
    ($) => {
      const $statsTable = $('.team-stats-list');

      // Loop through each row in the stats table
      const stats = {
        away: {},
        home: {},
      };
      $statsTable.find('tr').each((i, row) => {
        const rowCells = $(row).children('td');
        if (rowCells.length !== 0) {
          const statName = $(rowCells[0])
            .text()
            .trim();
          const awayValue = $(rowCells[1])
            .text()
            .trim();
          const homeValue = $(rowCells[2])
            .text()
            .trim();

          switch (statName) {
            case '1st Downs':
              stats.away['firstDowns'] = Number(awayValue);
              stats.home['firstDowns'] = Number(homeValue);
              break;
            case '3rd down efficiency':
              stats.away['thirdDownAttempts'] = Number(awayValue.split('-')[0]);
              stats.home['thirdDownAttempts'] = Number(homeValue.split('-')[0]);
              stats.away['thirdDownConversions'] = Number(awayValue.split('-')[1]);
              stats.home['thirdDownConversions'] = Number(homeValue.split('-')[1]);
              break;
            case '4th down efficiency':
              stats.away['fourthDownAttempts'] = Number(awayValue.split('-')[0]);
              stats.home['fourthDownAttempts'] = Number(homeValue.split('-')[0]);
              stats.away['fourthDownConversions'] = Number(awayValue.split('-')[1]);
              stats.home['fourthDownConversions'] = Number(homeValue.split('-')[1]);
              break;
            case 'Total Yards':
              stats.away['totalYards'] = Number(awayValue);
              stats.home['totalYards'] = Number(homeValue);
              break;
            case 'Passing':
              stats.away['passYards'] = Number(awayValue);
              stats.home['passYards'] = Number(homeValue);
              break;
            case 'Comp-Att':
              stats.away['passCompletions'] = Number(awayValue.split('-')[0]);
              stats.home['passCompletions'] = Number(homeValue.split('-')[0]);
              stats.away['passAttempts'] = Number(awayValue.split('-')[1]);
              stats.home['passAttempts'] = Number(homeValue.split('-')[1]);
              break;
            case 'Yards per pass':
              stats.away['yardsPerPass'] = Number(awayValue);
              stats.home['yardsPerPass'] = Number(homeValue);
              break;
            case 'Interceptions thrown':
              stats.away['interceptionsThrown'] = Number(awayValue);
              stats.home['interceptionsThrown'] = Number(homeValue);
              break;
            case 'Rushing':
              stats.away['rushYards'] = Number(awayValue);
              stats.home['rushYards'] = Number(homeValue);
              break;
            case 'Rushing Attempts':
              stats.away['rushAttempts'] = Number(awayValue);
              stats.home['rushAttempts'] = Number(homeValue);
              break;
            case 'Yards per rush':
              stats.away['yardsPerRush'] = Number(awayValue);
              stats.home['yardsPerRush'] = Number(homeValue);
              break;
            case 'Penalties':
              stats.away['penalties'] = Number(awayValue.split('-')[0]);
              stats.home['penalties'] = Number(homeValue.split('-')[0]);
              stats.away['penaltyYards'] = Number(awayValue.split('-')[1]);
              stats.home['penaltyYards'] = Number(homeValue.split('-')[1]);
              break;
            case 'Fumbles lost':
              stats.away['fumblesLost'] = Number(awayValue);
              stats.home['fumblesLost'] = Number(homeValue);
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
      const $linescore = $('#linescore');

      // Loop through each row in the stats table
      const linescore = {
        away: [],
        home: [],
      };
      $linescore
        .find('tbody')
        .find('tr')
        .each((i, row) => {
          const rowCells = $(row).children('td');

          const homeOrAway = linescore.away.length === 0 ? 'away' : 'home';

          _.forEach(rowCells, (rowCell, index) => {
            // Skip first (team abbreviation) and last (total score) cells
            if (index > 0 && index !== rowCells.length - 1) {
              const score = Number(
                $(rowCell)
                  .text()
                  .trim()
              );
              linescore[homeOrAway].push(score);
            }
          });
        });

      return {
        stats,
        linescore,
      };
    }
  );
};

const year = 2018;
const filename = `${INPUT_DATA_DIRECTORY}/${year}.json`;
const yearData = require(filename);

const promises = _.map(yearData, (gameData) => {
  if ('stats' in gameData || !('espnGameId' in gameData)) {
    // Stats already retrieved for this game
    return Promise.resolve();
  } else {
    return getGameStats(gameData.espnGameId).catch((error) => {
      console.log(`Error scraping stats for game ${gameData.espnGameId}:`, error);
    });
  }
});

return Promise.all(promises)
  .then((results) => {
    results.forEach((result, i) => {
      if (result) {
        yearData[i].linescore = result.linescore;

        // Determine the total score
        const homeScore = _.reduce(result.linescore.home, (sum, n) => sum + n, 0);
        const awayScore = _.reduce(result.linescore.away, (sum, n) => sum + n, 0);

        yearData[i].score = {
          home: homeScore,
          away: awayScore,
        };

        // Determine the game result
        const homeTeamWon = homeScore > awayScore;
        if (yearData[i].isHomeGame === homeTeamWon) {
          yearData[i].result = 'W';
        } else {
          yearData[i].result = 'L';
        }

        if ('firstDowns' in result.stats.home) {
          yearData[i].stats = result.stats;
        }
      }
    });

    fs.writeFileSync(filename, JSON.stringify(yearData, null, 2));

    console.log('Success!');
  })
  .catch((error) => {
    console.log('Failed to scrape stats:', error);
  });
