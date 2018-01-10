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
  return getHtmlForUrl(`https://www.sports-reference.com/cfb/boxscores/${gameId}.html`).then(
    ($) => {
      // Stats
      const $statsTable = $('#all_team_stats');

      const stats = {
        away: {},
        home: {},
      };

      console.log($statsTable.find('div').html());

      $statsTable
        .find('table tbody')
        .find('tr')
        .each((i, row) => {
          console.log('INDEX:', i, $(row).text());
          // var statName = $($(row).child('th')).text().trim();
          // console.log(statName);

          // var statName = $(rowCells[0]).text().trim();
          // var awayValue = $(rowCells[1]).text().trim();
          // var homeValue = $(rowCells[2]).text().trim();

          // switch (statName) {
          //   case '1st Downs':
          //     stats.away['firstDowns'] = Number(awayValue);
          //     stats.home['firstDowns'] = Number(homeValue);
          //     break;
          //   case '3rd down efficiency':
          //     stats.away['thirdDownAttempts'] = Number(awayValue.split('-')[0]);
          //     stats.home['thirdDownAttempts'] = Number(homeValue.split('-')[0]);
          //     stats.away['thirdDownConversions'] = Number(awayValue.split('-')[1]);
          //     stats.home['thirdDownConversions'] = Number(homeValue.split('-')[1]);
          //     break;
          //   case '4th down efficiency':
          //     stats.away['fourthDownAttempts'] = Number(awayValue.split('-')[0]);
          //     stats.home['fourthDownAttempts'] = Number(homeValue.split('-')[0]);
          //     stats.away['fourthDownConversions'] = Number(awayValue.split('-')[1]);
          //     stats.home['fourthDownConversions'] = Number(homeValue.split('-')[1]);
          //     break;
          //   case 'Total Yards':
          //     stats.away['totalYards'] = Number(awayValue);
          //     stats.home['totalYards'] = Number(homeValue);
          //     break;
          //   case 'Passing':
          //     stats.away['passYards'] = Number(awayValue);
          //     stats.home['passYards'] = Number(homeValue);
          //     break;
          //   case 'Comp-Att':
          //     stats.away['passCompletions'] = Number(awayValue.split('-')[0]);
          //     stats.home['passCompletions'] = Number(homeValue.split('-')[0]);
          //     stats.away['passAttempts'] = Number(awayValue.split('-')[1]);
          //     stats.home['passAttempts'] = Number(homeValue.split('-')[1]);
          //     break;
          //   case 'Yards per pass':
          //     stats.away['yardsPerPass'] = Number(awayValue);
          //     stats.home['yardsPerPass'] = Number(homeValue);
          //     break;
          //   case 'Interceptions thrown':
          //     stats.away['interceptionsThrown'] = Number(awayValue);
          //     stats.home['interceptionsThrown'] = Number(homeValue);
          //     break;
          //   case 'Rushing':
          //     stats.away['rushYards'] = Number(awayValue);
          //     stats.home['rushYards'] = Number(homeValue);
          //     break;
          //   case 'Rushing Attempts':
          //     stats.away['rushAttempts'] = Number(awayValue);
          //     stats.home['rushAttempts'] = Number(homeValue);
          //     break;
          //   case 'Yards per rush':
          //     stats.away['yardsPerRush'] = Number(awayValue);
          //     stats.home['yardsPerRush'] = Number(homeValue);
          //     break;
          //   case 'Penalties':
          //     stats.away['penalties'] = Number(awayValue.split('-')[0]);
          //     stats.home['penalties'] = Number(homeValue.split('-')[0]);
          //     stats.away['penaltyYards'] = Number(awayValue.split('-')[1]);
          //     stats.home['penaltyYards'] = Number(homeValue.split('-')[1]);
          //     break;
          //   case 'Fumbles lost':
          //     stats.away['fumblesLost'] = Number(awayValue);
          //     stats.home['fumblesLost'] = Number(homeValue);
          //     break;
          //   case 'Possession':
          //     stats.away['possession'] = awayValue;
          //     stats.home['possession'] = homeValue;
          //     break;
          // }
        });

      // Line score
      const $linescore = $('.linescore');

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
            // Skip first (team logo), second (team name), and last (total score) cells
            if (index > 1 && index !== rowCells.length - 1) {
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

const year = 2017;
const filename = `${INPUT_DATA_DIRECTORY}/${year}.json`;
const yearData = require(filename);

const promises = _.map(yearData, (gameData) => {
  if (!('sportsReferenceGameId' in gameData)) {
    return Promise.resolve();
  } else {
    return getGameStats(gameData.sportsReferenceGameId).catch((error) => {
      console.log(`Error scraping stats for game ${gameId}:`, error);
    });
  }
});

return Promise.all(promises)
  .then((results) => {
    results.forEach((result, i) => {
      if (result) {
        // yearData[i].linescore = result.linescore;
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
