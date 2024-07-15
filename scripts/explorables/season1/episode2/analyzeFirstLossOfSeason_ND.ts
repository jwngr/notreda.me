import {ALL_PLAYED_SEASONS} from '../../../lib/constants';
import {Logger} from '../../../lib/logger';
import {NDSchedules} from '../../../lib/ndSchedules';
import {Polls} from '../../../lib/polls';

const logger = new Logger({isSentryEnabled: false});

interface FirstLossOfSeasonData {
  readonly season: number;
  readonly ranking: number | 'NR';
}

interface WeekOfFirstLossPerSeasonData {
  readonly numGamesInSeason: number;
  readonly numGamesPlayedBeforeFirstLoss: number;
  readonly recordBeforeFirstLoss: string;
}

async function main() {
  let numSeasonsPlayed = 0;
  let firstLossOfSeasonsIndexTotal = 0;
  const undefeatedSeasons: number[] = [];
  const firstLossOfSeasonIndexes: {
    [key: number]: FirstLossOfSeasonData[];
  } = {};
  const weekOfFirstLossPerSeason: {
    [key: number]: WeekOfFirstLossPerSeasonData;
  } = {};

  for (const season of ALL_PLAYED_SEASONS) {
    numSeasonsPlayed++;

    const seasonPolls = Polls.getForSeason(season);
    const seasonScheduleData = await NDSchedules.getForSeason(season);

    let finalNdRankingInApPoll: number | 'NR';
    if (seasonPolls !== null) {
      const finalApPoll = seasonPolls.ap.find((poll) => poll.date === 'Final');
      finalNdRankingInApPoll = finalApPoll?.teams['Notre Dame']?.ranking ?? 'NR';
    }

    let firstLossOfSeasonEncountered = false;
    let winsBeforeFirstLoss = 0;
    let tiesBeforeFirstLoss = 0;
    seasonScheduleData.forEach((gameData, i) => {
      if (gameData.result === 'L') {
        if (!firstLossOfSeasonEncountered) {
          if (typeof firstLossOfSeasonIndexes[i] === 'undefined') {
            firstLossOfSeasonIndexes[i] = [{season, ranking: finalNdRankingInApPoll}];
          } else {
            firstLossOfSeasonIndexes[i].push({season, ranking: finalNdRankingInApPoll});
          }

          let recordBeforeFirstLoss = `${winsBeforeFirstLoss}-0`;
          if (tiesBeforeFirstLoss > 0) {
            recordBeforeFirstLoss += `-${tiesBeforeFirstLoss}`;
          }

          weekOfFirstLossPerSeason[season] = {
            numGamesInSeason: seasonScheduleData.length,
            numGamesPlayedBeforeFirstLoss: i,
            recordBeforeFirstLoss,
          };

          firstLossOfSeasonEncountered = true;
          firstLossOfSeasonsIndexTotal += i + 1;
        }
      } else if (gameData.result === 'W') {
        winsBeforeFirstLoss++;
      } else {
        tiesBeforeFirstLoss++;
      }
    });

    if (!firstLossOfSeasonEncountered) {
      undefeatedSeasons.push(season);

      let recordBeforeFirstLoss = `${winsBeforeFirstLoss}-0`;
      if (tiesBeforeFirstLoss > 0) {
        recordBeforeFirstLoss += `-${tiesBeforeFirstLoss}`;
      }

      weekOfFirstLossPerSeason[season] = {
        numGamesInSeason: seasonScheduleData.length,
        numGamesPlayedBeforeFirstLoss: seasonScheduleData.length,
        recordBeforeFirstLoss,
      };
      logger.info(`Record before first loss for season ${season}: ${recordBeforeFirstLoss}`);
    }
  }

  const numSeasonsWithLoss = Object.keys(firstLossOfSeasonIndexes).length;

  logger.info('RESULTS:', {
    numSeasonsPlayed,
    numSeasonsWithLoss,
    undefeatedSeasons,
    numUndefeatedSeason: undefeatedSeasons.length,
    weekOfFirstLossPerSeason,
    firstLossOfSeasonsYears: firstLossOfSeasonIndexes,
    firstLossOfSeasonsIndexes: Object.values(firstLossOfSeasonIndexes).map(
      (seasons) => Object.keys(seasons).length
    ),
    firstLossOfSeasonsIndexesPercentages: Object.keys(firstLossOfSeasonIndexes).map((years) =>
      Number(
        (
          (Object.keys(years).length / (numSeasonsWithLoss + undefeatedSeasons.length)) *
          100
        ).toFixed(2)
      )
    ),
    averageWeekOfFirstLoss: (firstLossOfSeasonsIndexTotal / numSeasonsPlayed).toFixed(2),
  });
}

main();
