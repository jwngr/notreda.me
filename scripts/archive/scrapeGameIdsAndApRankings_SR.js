import fs from 'fs';
import path from 'path';

import cheerio from 'cheerio';
import _ from 'lodash';
import request from 'request-promise';

import {CURRENT_SEASON} from '../lib/constants';
import {Logger} from '../lib/logger';

const INPUT_DATA_DIRECTORY = path.resolve(__dirname, '../../website/src/resources/schedules');

const SPORTS_REFERENCE_GAME_STATS_START_YEAR = 2000;

const years = [CURRENT_SEASON];

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
          const gameUrl = $($game).find('a').attr('href');
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
      Logger.error(`Error fetching game IDs and AP rankings for ${year}`, {error});
    });
});

Promise.all(promises)
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

    Logger.success('Success!');
  })
  .catch((error) => {
    Logger.fail(`Error fetching all game IDs`, error);
  });
