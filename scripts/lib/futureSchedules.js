const _ = require('lodash');

const logger = require('./logger');
const scraper = require('./scraper');
const {CURRENT_SEASON} = require('./constants');

const AWAY_GAMES_WITHOUT_AT = {
  2020: ['Navy', 'Wake Forest', 'Wisconsin'],
};

const OPPONENT_NAME_MAPPINGS = {
  'Bowling Green': 'Bowling Green State',
  Pitt: 'Pittsburgh',
  'Miami (FL)': 'Miami',
};

const _getNormalizedOpponentName = (rawOpponentNameString) => {
  const val = _.clone(rawOpponentNameString)
    .replace(/^at /g, '')
    .replace(/^vs /g, '')
    .replace(/\(in .*$/g, '')
    .trim();

  return OPPONENT_NAME_MAPPINGS[val] || val;
};

/**
 * Returns all scheduled future ND games.
 *
 * @return {Promise<Object>} An object of arrays, keyed by year, of future ND schedules.
 */
const fetchFutureNdSchedules = () => {
  return scraper
    .get(`https://fbschedules.com/ncaa/notre-dame/`)
    .then(($) => {
      const schedules = {};

      $('.col-sm-6.schedu-list').each((seasonIndex, futureSeasonScheduleCol) => {
        const season = $(futureSeasonScheduleCol).find('.team-hd').text().trim();

        // Ignore columns under the "FUTURE NOTRE DAME FOOTBALL SCHEDULES" section which do not
        // have a "team-hd" class.
        if (season !== '' && Number(season) > CURRENT_SEASON) {
          schedules[season] = [];

          $(futureSeasonScheduleCol)
            .find('li')
            .each((gameIndex, gameli) => {
              const gameInfoTokens = $(gameli)
                .text()
                .trim()
                .split(' - ')
                .map((val) => val.trim());

              const date =
                gameInfoTokens[0] === 'TBA' ? 'TBD' : new Date(`${gameInfoTokens[0]}/${season}`);

              const opponentName = _getNormalizedOpponentName(gameInfoTokens[1]);

              const isHomeGame =
                !_.startsWith(gameInfoTokens[1], 'at') &&
                !_.includes(AWAY_GAMES_WITHOUT_AT[season], opponentName);

              const gameData = {
                date,
                isHomeGame,
                opponentName,
              };

              if (_.includes(gameInfoTokens[1], '(in ')) {
                gameData.location = gameInfoTokens[1].split('(in ')[1].replace(')', '');
              }

              schedules[season].push(gameData);
            });
        }
      });

      return schedules;
    })
    .catch((error) => {
      logger.error(`Error fetching future ND schedules.`, {error});
      throw error;
    });
};

module.exports = {
  fetchFutureNdSchedules,
};
