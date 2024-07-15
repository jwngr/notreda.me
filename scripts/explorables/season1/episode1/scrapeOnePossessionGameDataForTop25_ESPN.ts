import range from 'lodash/range';

import {Logger} from '../../../lib/logger';
import {Scraper} from '../../../lib/scraper';

const logger = new Logger({isSentryEnabled: false});

const BK_ERA_YEARS = range(2010, 2019);

async function fetchTop25TeamEspnIds(year: number): Promise<Record<string, number>> {
  const $ = await Scraper.get(
    `http://www.espn.com/college-football/rankings/_/week/1/year/${year}/seasontype/3`
  );

  const top25TeamUrls: Record<string, number> = {};

  const $tableCaption = $('.table-caption');
  const $teamRows = $tableCaption.next().find('tr:not(.footer)');

  $teamRows.each((_, row) => {
    const $tds = $(row).find('td');
    const $teamLink = $tds.eq(1).children().eq(1);

    const teamName = $teamLink.children().eq(0).text().trim();

    if (teamName) {
      const espnTeamId = Number($teamLink.attr('href')?.split('/')[7]);
      if (!isNaN(espnTeamId)) {
        top25TeamUrls[teamName] = espnTeamId;
      }
    }
  });

  return top25TeamUrls;
}

async function fetchYearlyResults(
  teamEspnId: number,
  year: number
): Promise<Array<{result: string; score: string; pointDifferential: number}>> {
  const $ = await Scraper.get(
    `http://www.espn.com/college-football/team/schedule/_/id/${teamEspnId}/season/${year}`
  );

  const results: Array<{result: string; score: string; pointDifferential: number}> = [];

  const $rows = $('.Table2__tr');

  $rows.each((_, row) => {
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
}

async function fetchOnePossessionGameDataDuringBrianKellyEra(
  teamEspnId: number,
  top25Finishes: number
): Promise<{
  readonly totalWinsCount: number;
  readonly totalGamesCount: number;
  readonly totalLossesCount: number;
  readonly totalDifferential: number;
  readonly onePossesssionGamesCount: number;
  readonly onePossesssionWinsCount: number;
  readonly onePossesssionLossesCount: number;
  readonly top25Finishes: number;
}> {
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

      allYearResults.forEach((individualYearResults) => {
        individualYearResults.forEach(({result, pointDifferential}) => {
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
}

async function main() {
  try {
    const yearlyResults = await Promise.all(
      BK_ERA_YEARS.map((year) => fetchTop25TeamEspnIds(year))
    );

    const top25TeamIds: Record<
      string,
      {readonly teamEspnId: number; readonly top25Finishes: number}
    > = {};

    for (const teamEspnIds of yearlyResults) {
      for (const [teamName, teamEspnId] of Object.entries(teamEspnIds)) {
        top25TeamIds[teamName] = {
          teamEspnId,
          top25Finishes: top25TeamIds[teamName]?.top25Finishes + 1 || 1,
        };
      }
    }

    const top25CloseGameData: Record<
      string,
      {
        readonly totalWinsCount: number;
        readonly totalGamesCount: number;
        readonly totalLossesCount: number;
        readonly totalDifferential: number;
        readonly onePossesssionGamesCount: number;
        readonly onePossesssionWinsCount: number;
        readonly onePossesssionLossesCount: number;
        readonly top25Finishes: number;
      }
    > = {};
    for (const teamName of Object.keys(top25TeamIds)) {
      logger.info(`Fetching one possession game data for ${teamName}.`);
      top25CloseGameData[teamName] = await fetchOnePossessionGameDataDuringBrianKellyEra(
        top25TeamIds[teamName].teamEspnId,
        top25TeamIds[teamName].top25Finishes
      );
    }

    logger.info('RESULTS:', {top25CloseGameData});

    logger.success('Success!');
  } catch (error) {
    logger.error('Error fetching top 25 teams:', {error});
  }
}

main();
