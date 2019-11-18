const _ = require('lodash');

const logger = require('./logger');
const scraper = require('./scraper');
const ndSchedules = require('./ndSchedules');

const _normalizeOpponentName = (val) => {
  return (
    {
      'Bowling Green': 'Bowling Green State',
      Pitt: 'Pittsburgh',
      'Miami (FL)': 'Miami',
    }[val] || val
  ).trim();
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
        const season = $(futureSeasonScheduleCol)
          .find('.team-hd')
          .text()
          .trim();

        // Ignore columns under the "FUTURE NOTRE DAME FOOTBALL SCHEDULES" section which do not
        // have a "team-hd" class.
        if (season !== '' && Number(season) > ndSchedules.CURRENT_SEASON) {
          schedules[season] = [];

          $(futureSeasonScheduleCol)
            .find('li')
            .each((gameIndex, gameli) => {
              const gameInfoTokens = $(gameli)
                .text()
                .trim()
                .split(' - ');

              const date =
                gameInfoTokens[0] === 'TBA' ? 'TBD' : new Date(`${gameInfoTokens[0]}/${season}`);
              // TODO: this is not correct.
              const isHomeGame = !_.startsWith(gameInfoTokens[1], 'at');
              const opponentName = _.clone(gameInfoTokens[1])
                .replace(/^at /g, '')
                .replace(/^vs /g, '')
                .replace(/\(in .*$/g, '');

              const gameData = {
                date,
                isHomeGame,
                opponentName: _normalizeOpponentName(opponentName),
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
