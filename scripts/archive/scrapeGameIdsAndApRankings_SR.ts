import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

import _ from 'lodash';

import {CURRENT_SEASON} from '../lib/constants';
import {Logger} from '../lib/logger';
import {Scraper} from '../lib/scraper';

const logger = new Logger({isSentryEnabled: false});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DATA_DIRECTORY = path.resolve(__dirname, '../../website/src/resources/schedules');

const SPORTS_REFERENCE_GAME_STATS_START_YEAR = 2000;

const years = [CURRENT_SEASON];

interface ScheduleDetails {
  gameIds: string[];
  opponentApRankings: (number | null)[];
  notreDameApRankings: (number | null)[];
}

interface YearGameData {
  isHomeGame?: boolean;
  sportsReferenceGameId?: string;
  rankings?: {home?: {ap?: number | null}; away?: {ap?: number | null}};
  [key: string]: unknown;
}

const promises = years.map((year) => {
  return Scraper.get(
    `https://www.sports-reference.com/cfb/schools/notre-dame/${year}-schedule.html`
  )
    .then(($) => {
      const gameIds: string[] = [];
      const opponentApRankings: (number | null)[] = [];
      const notreDameApRankings: (number | null)[] = [];

      const $games = $('#schedule tbody tr td');
      $games.each((i, $game) => {
        const statName = $($game).attr('data-stat');

        if (statName === 'date_game' && year >= SPORTS_REFERENCE_GAME_STATS_START_YEAR) {
          const gameUrl = $($game).find('a').attr('href');
          if (!gameUrl) {
            return;
          }
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

      return {gameIds, opponentApRankings, notreDameApRankings} satisfies ScheduleDetails;
    })
    .catch((error) => {
      logger.error(`Error fetching game IDs and AP rankings for ${year}`, {error});
      return null;
    });
});

Promise.all(promises)
  .then((results) => {
    _.forEach(results, (result, i) => {
      if (!result) {
        return;
      }

      const filename = `${INPUT_DATA_DIRECTORY}/${years[i]}.json`;
      const yearData = JSON.parse(fs.readFileSync(filename, 'utf-8')) as YearGameData[];
      _.forEach(yearData, (gameData, j) => {
        gameData.sportsReferenceGameId = result.gameIds[j];

        if (result.notreDameApRankings[j] || result.opponentApRankings[j]) {
          if (gameData.isHomeGame) {
            gameData.rankings = {
              home: {ap: result.notreDameApRankings[j]},
              away: {ap: result.opponentApRankings[j]},
            };
          } else {
            gameData.rankings = {
              home: {ap: result.opponentApRankings[j]},
              away: {ap: result.notreDameApRankings[j]},
            };
          }

          if (!gameData.rankings?.home?.ap) {
            delete gameData.rankings.home;
          } else if (!gameData.rankings?.away?.ap) {
            delete gameData.rankings.away;
          }
        }
      });

      fs.writeFileSync(filename, JSON.stringify(yearData, null, 2));
    });

    logger.success('Success!');
  })
  .catch((error) => {
    logger.fail(`Error fetching all game IDs`, error);
  });
