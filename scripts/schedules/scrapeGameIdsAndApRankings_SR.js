const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const request = require('request-promise');

const INPUT_DATA_DIRECTORY = path.resolve(__dirname, '../../data/schedules');

const CURRENT_YEAR = 2017;
const AP_POLL_START_YEAR = 1936;
const SPORTS_REFERENCE_GAME_STATS_START_YEAR = 2000;

const years = [2018];
// const years = _.range(AP_POLL_START_YEAR, CURRENT_YEAR + 1);

const getHtmlForUrl = (url) => {
  return request({
    uri: url,
    transform: (body) => {
      return cheerio.load(body);
    },
  });
};

const promises = years.map((year) => {
  return getHtmlForUrl(
    `https://www.sports-reference.com/cfb/schools/notre-dame/${year}-schedule.html`
  )
    .then(($) => {
      const gameIds = [];
      const opponentApRankings = [];
      const notreDameApRankings = [];

      const $games = $('#schedule tbody tr td');
      $games.each((i, $game) => {
        const statName = $($game).attr('data-stat');

        if (statName === 'date_game' && year >= SPORTS_REFERENCE_GAME_STATS_START_YEAR) {
          const gameUrl = $($game)
            .find('a')
            .attr('href');
          const gameId = gameUrl.split('/cfb/boxscores/')[1].split('.html')[0];
          gameIds.push(gameId);
        } else if (statName === 'school_name') {
          const notreDameName = $($game).text();
          const notreDameApRanking = Number(notreDameName.match(/\d+/g)) || null;
          notreDameApRankings.push(notreDameApRanking);
        } else if (statName === 'opp_name') {
          const opponentName = $($game).text();
          const opponentApRanking = Number(opponentName.match(/\d+/g)) || null;
          opponentApRankings.push(opponentApRanking);
        }
      });

      return {
        gameIds,
        opponentApRankings,
        notreDameApRankings,
      };
    })
    .catch((error) => {
      console.log(`Error fetching game IDs and AP rankings for ${year}`, error);
    });
});

return Promise.all(promises)
  .then((results) => {
    _.forEach(results, (result, i) => {
      const filename = `${INPUT_DATA_DIRECTORY}/${years[i]}.json`;
      const yearData = require(filename);
      _.forEach(yearData, (gameData, j) => {
        if (result.gameIds) {
          gameData.sportsReferenceGameId = result.gameIds[j];
        }

        if (result.notreDameApRankings[j] || result.opponentApRankings[j]) {
          if (gameData.isHomeGame) {
            gameData.rankings = {
              home: {
                ap: result.notreDameApRankings[j],
              },
              away: {
                ap: result.opponentApRankings[j],
              },
            };
          } else {
            gameData.rankings = {
              home: {
                ap: result.opponentApRankings[j],
              },
              away: {
                ap: result.notreDameApRankings[j],
              },
            };
          }

          if (!gameData.rankings.home.ap) {
            delete gameData.rankings.home;
          } else if (!gameData.rankings.away.ap) {
            delete gameData.rankings.away;
          }
        }
      });

      fs.writeFileSync(filename, JSON.stringify(yearData, null, 2));
    });

    console.log('Success!');
  })
  .catch((error) => {
    console.log(`Error fetching all game IDs`, error);
  });
