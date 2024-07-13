import cheerio from 'cheerio';
import _ from 'lodash';
import request from 'request-promise';

import {Logger} from '../../../lib/logger';

const logger = new Logger({isSentryEnabled: false});

const BK_ERA_YEARS = _.range(2010, 2019);

const getHtmlForUrl = (url) => {
  return request({
    uri: url,
    transform: (body) => {
      return cheerio.load(body);
    },
  });
};

const fetchTop25TeamEspnIds = (year) => {
  return getHtmlForUrl(
    `http://www.espn.com/college-football/rankings/_/week/1/year/${year}/seasontype/3`
  ).then(($) => {
    const top25TeamUrls = {};

    const $tableCaption = $('.table-caption');
    const $teamRows = $tableCaption.next().find('tr:not(.footer)');

    $teamRows.each((i, row) => {
      const $tds = $(row).find('td');
      const $teamLink = $tds.eq(1).children().eq(1);

      const teamName = $teamLink.children().eq(0).text().trim();

      if (teamName) {
        top25TeamUrls[teamName] = Number($teamLink.attr('href').split('/')[7]);
      }
    });

    return top25TeamUrls;
  });
};

const fetchYearlyResults = (teamEspnId, year) => {
  return getHtmlForUrl(
    `http://www.espn.com/college-football/team/schedule/_/id/${teamEspnId}/season/${year}`
  ).then(($) => {
    const results = [];

    const $rows = $('.Table2__tr');

    $rows.each((i, row) => {
      const $cols = $(row).find('td');
      if ($cols.length === 7 && $cols.eq(0).text().trim() !== 'Date') {
        const $spans = $cols.eq(2).find('span');

        const result = $spans.eq(0).text().trim();

        const score = $spans.eq(1).text().trim().split(' ')[0];

        if (result !== '') {
          results.push({
            result,
            score,
            pointDifferential: Math.abs(Number(score.split('-')[0]) - Number(score.split('-')[1])),
          });
        }
      }
    });

    return results;
  });
};

const fetchOnePossessionGameDataDuringBrianKellyEra = async ({teamEspnId, top25Finishes}) => {
  return Promise.all(BK_ERA_YEARS.map((year) => fetchYearlyResults(teamEspnId, year))).then(
    (allYearResults) => {
      const onePossesssionGameData = {
        totalWinsCount: 0,
        totalGamesCount: 0,
        totalLossesCount: 0,
        totalDifferential: 0,
        onePossesssionGamesCount: 0,
        onePossesssionWinsCount: 0,
        onePossesssionLossesCount: 0,
        top25Finishes,
      };

      _.forEach(allYearResults, (individualYearResults) => {
        _.forEach(individualYearResults, ({result, pointDifferential}) => {
          onePossesssionGameData.totalGamesCount += 1;
          onePossesssionGameData.totalDifferential += pointDifferential;

          if (result === 'W') {
            onePossesssionGameData.totalWinsCount += 1;
          } else if (result === 'L') {
            onePossesssionGameData.totalLossesCount += 1;
          }

          if (pointDifferential <= 8) {
            onePossesssionGameData.onePossesssionGamesCount += 1;

            if (result === 'W') {
              onePossesssionGameData.onePossesssionWinsCount += 1;
            } else if (result === 'L') {
              onePossesssionGameData.onePossesssionLossesCount += 1;
            }
          }
        });
      });

      return onePossesssionGameData;
    }
  );
};

Promise.all(BK_ERA_YEARS.map((year) => fetchTop25TeamEspnIds(year)))
  .then(async (yearlyResults) => {
    const top25TeamIds = {};
    _.forEach(yearlyResults, (teamEspnIds) => {
      _.forEach(teamEspnIds, (teamEspnId, teamName) => {
        top25TeamIds[teamName] = {
          teamEspnId,
          top25Finishes: _.get(top25TeamIds, [teamName, 'top25Finishes'], 0) + 1,
        };
      });
    });

    const top25CloseGameData = {};
    for (const teamName of Object.keys(top25TeamIds)) {
      logger.info(`Fetching one possession game data for ${teamName}.`);
      top25CloseGameData[teamName] = await fetchOnePossessionGameDataDuringBrianKellyEra(
        top25TeamIds[teamName]
      );
    }

    logger.info('RESULTS:', {top25CloseGameData});

    logger.success('Success!');
  })
  .catch((error) => {
    logger.error('Error fetching top 25 teams:', {error});
  });
