const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const request = require('request-promise');

const logger = require('../lib/logger');
const ndSchedules = require('../lib/ndSchedules');

const INPUT_DATA_DIRECTORY = path.resolve(__dirname, '../../data/ndSchedules');

const years = [
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
  // '2017',
  // '2018',
  '2019',
];

logger.info('Updating ESPN game IDs...');

/**
 * Returns the number of games with an ESPN game ID for the provided season.
 *
 * @param {number} season The current season.
 */
const getEspnGameIdCountForSeason = (season) => {
  const seasonScheduleData = ndSchedules.getForSeason(season);
  return _.chain(seasonScheduleData)
    .filter(({espnGameId}) => !!espnGameId)
    .size()
    .value();
};

const getHtmlForUrl = (url) => {
  return request({
    uri: url,
    transform: (body) => {
      return cheerio.load(body);
    },
  });
};

const promises = years.map((year) => {
  return getHtmlForUrl(`http://www.espn.com/college-football/team/schedule/_/id/87/season/${year}`)
    .then(($) => {
      const gameIds = [];

      const $rows = $('tr.Table__TR');

      $rows.each((i, row) => {
        const $cols = $(row).find('td');
        if (
          $cols.length === 7 &&
          $cols
            .eq(0)
            .text()
            .trim() !== 'Date'
        ) {
          const $spans = $cols.eq(2).find('span');

          const gameId = $spans
            .eq(1)
            .find('a')
            .attr('href')
            .split('gameId/')[1]
            .trim();

          gameIds.push(gameId);
        }
      });

      const previousEspnGameIdCount = getEspnGameIdCountForSeason(year);
      const espnGameIdCountDifference = gameIds.length - previousEspnGameIdCount;
      if (espnGameIdCountDifference === 0) {
        logger.info('No new ESPN game IDs found.');
      } else if (espnGameIdCountDifference > 0) {
        logger.info(
          `${espnGameIdCountDifference} new ESPN game ${
            espnGameIdCountDifference === 1 ? 'ID' : 'IDs'
          } found.`
        );
      } else {
        logger.error(`Found fewer ESPN game IDs than expected.`);
      }

      return gameIds;
    })
    .catch((error) => {
      logger.error(`Error fetching game IDs for ${year}`, {error});
      throw error;
    });
});

return Promise.all(promises)
  .then((results) => {
    _.forEach(results, (gameIds, i) => {
      const filename = `${INPUT_DATA_DIRECTORY}/${years[i]}.json`;
      const data = require(filename);
      _.forEach(gameIds, (gameId, j) => {
        data[j].espnGameId = Number(gameId);
      });
      fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    });

    logger.info('Successfully updated ESPN game IDs!');
  })
  .catch((error) => {
    logger.error(`Error fetching ESPN game IDs.`, {error});
  });
