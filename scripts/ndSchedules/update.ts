import _ from 'lodash';

import {GameInfo, GameResult} from '../../website/src/models/games.models';
import {Writable} from '../../website/src/models/utils.models';
import {CURRENT_SEASON, ND_HEAD_COACH} from '../lib/constants';
import {
  fetchGameIdsForSeason,
  fetchKickoffTimeForGame,
  fetchNotreDameWeeklyRecordsForSeason,
  fetchStatsForGame,
  fetchTeamRecordUpThroughNotreDameGameForSeason,
} from '../lib/espn';
import {Logger} from '../lib/logger';
import {NDSchedules} from '../lib/ndSchedules';
import {Polls} from '../lib/polls';
import {getGameDate, getGameTimestampInSeconds} from '../lib/utils';
import {Weather} from '../lib/weather';

const SEASON = CURRENT_SEASON;

// Enable Sentry logging.
const logger = new Logger({isSentryEnabled: true});

const updateNdSchedule = async () => {
  const currentSeasonSchedule = await NDSchedules.getForCurrentSeason();

  logger.info(`Updating data for ${SEASON} season...`);

  logger.info(`Updating game stats...`);
  const espnGameIds = await fetchGameIdsForSeason(SEASON);
  espnGameIds.forEach((espnGameId, i) => {
    (currentSeasonSchedule[i] as Writable<GameInfo>).espnGameId = Number(espnGameId);
  });

  // Check for new games, such as bowl games, being added to the schedule. If there are new games
  // added, exit early since future updates will not work properly.
  if (currentSeasonSchedule.length < espnGameIds.length) {
    const errorMessage = `Manually add new game(s) for ${SEASON} season`;
    logger.warning(errorMessage);
    throw new Error(errorMessage);
  }

  const espnGameStats = await Promise.all(
    _.map(currentSeasonSchedule, (gameData) => {
      if (!gameData.fullDate) {
        logger.error(`Full date missing for ${gameData.opponentId} game`);
        return;
      }

      if (!gameData.espnGameId) {
        logger.error(`ESPN game ID missing for ${gameData.opponentId} game`);
        return;
      }

      // Determine how many days it has been since the game kicked off.
      const millisecondsSinceGame = Date.now() - new Date(gameData.fullDate).getTime();
      const daysSinceGame = Math.floor(millisecondsSinceGame / (1000 * 60 * 60 * 24));

      // If the game was completed within the last month and is no more than one day out, attempt to
      // fetch stats for it. If the game has not yet ended, this will exit early. Re-fetching game
      // stats for a month allows time for ESPN to update the stats later, which they often do.
      const MAX_DAYS_SINCE_GAME_TO_FETCH = 30;
      if (daysSinceGame < MAX_DAYS_SINCE_GAME_TO_FETCH && daysSinceGame >= -1) {
        return fetchStatsForGame(gameData.espnGameId);
      }
    })
  );

  espnGameStats.forEach((gameStats, i) => {
    if (!gameStats) return;

    if (!('result' in currentSeasonSchedule[i])) {
      // If this is the initial stats dump for a game which just ended, log a message to Sentry to
      // manually add a highlights video for the game.
      logger.warning(
        `Add highlights video for ${SEASON} game versus ${currentSeasonSchedule[i].opponentId}`
      );

      // Also add the ND head coach as a top-level key to the game data.
      (currentSeasonSchedule[i] as Writable<GameInfo>).headCoach = ND_HEAD_COACH;
    }

    const homeTeamWon = gameStats.score.home > gameStats.score.away;
    (currentSeasonSchedule[i] as Writable<GameInfo>) = {
      ...currentSeasonSchedule[i],
      ...gameStats,
      result:
        currentSeasonSchedule[i].isHomeGame === homeTeamWon ? GameResult.Win : GameResult.Loss,
    };
  });

  logger.info(`Auditing current season kickoff times...`);

  const currentSeasonUpcomingGames = currentSeasonSchedule.filter(
    ({result}) => typeof result === 'undefined'
  );

  // Audit the kickoff time for upcoming games.
  for (const currentSeasonUpcomingGameData of currentSeasonUpcomingGames) {
    // Skip auditing games which have been cancelled or postponed.
    if (currentSeasonUpcomingGameData.isCanceled || currentSeasonUpcomingGameData.isPostponed) {
      continue;
    }

    if (!currentSeasonUpcomingGameData.espnGameId) {
      throw new Error(
        `ESPN game ID missing for ${SEASON} ${currentSeasonUpcomingGameData.opponentId} game`
      );
    }

    const priorGameDate = getGameDate(currentSeasonUpcomingGameData);
    const newGameDate = await fetchKickoffTimeForGame(currentSeasonUpcomingGameData.espnGameId);

    const priorIsTimeTbd = typeof currentSeasonUpcomingGameData.fullDate === 'undefined';
    const newIsTimeTbd = newGameDate === 'TBD';

    let warningMessage: string | undefined;
    if (priorIsTimeTbd && !newIsTimeTbd) {
      warningMessage = `Manually add newly announced kickoff time for ${SEASON} ${currentSeasonUpcomingGameData.opponentId} game`;
    } else if (newIsTimeTbd && !priorIsTimeTbd) {
      warningMessage = `Manually remove kickoff time for ${SEASON} ${currentSeasonUpcomingGameData.opponentId} game`;
    } else if (!newIsTimeTbd && newGameDate.getTime() !== priorGameDate.getTime()) {
      warningMessage = `Manually update kickoff time for ${SEASON} ${currentSeasonUpcomingGameData.opponentId} game`;
    }
    if (warningMessage) {
      logger.warning(warningMessage);
    }
  }

  logger.info(`Updating team records...`);
  const [notreDameWeeklyRecords, opponentRecords] = await Promise.all([
    fetchNotreDameWeeklyRecordsForSeason(SEASON),
    Promise.all(
      _.map(currentSeasonSchedule, ({opponentId}) =>
        fetchTeamRecordUpThroughNotreDameGameForSeason(SEASON, opponentId)
      )
    ),
  ]);

  currentSeasonSchedule.forEach((gameData, i) => {
    (gameData as Writable<GameInfo>).records = {
      home: gameData.isHomeGame ? notreDameWeeklyRecords[i] : opponentRecords[i],
      away: gameData.isHomeGame ? opponentRecords[i] : notreDameWeeklyRecords[i],
    };
  });

  logger.info(`Updating polls...`);
  const currentSeasonPollsData = await Polls.getForSeason(SEASON);
  if (currentSeasonPollsData) {
    Polls.updateForSeason({
      season: SEASON,
      seasonPollsData: currentSeasonPollsData,
      seasonScheduleData: currentSeasonSchedule,
    });
  }

  logger.info(`Updating weather for upcoming game...`);
  const nextUpcomingCurrentSeasonGame = currentSeasonSchedule.find(
    ({result, isPostponed, isCanceled}) =>
      !isPostponed && !isCanceled && typeof result === 'undefined'
  );

  if (!nextUpcomingCurrentSeasonGame) {
    logger.info('Not fetching weather since current season is over.');
  } else if (!nextUpcomingCurrentSeasonGame.fullDate) {
    logger.info('Not fetching weather since next upcoming game has no kickoff time.');
  } else if (nextUpcomingCurrentSeasonGame.location === 'TBD') {
    logger.info('Not fetching weather since next upcoming game location is TBD.');
  } else {
    const millisecondsUntilNextUpcomingGame =
      new Date(nextUpcomingCurrentSeasonGame.fullDate).getTime() - Date.now();
    const daysUntilNextUpcomingGame = Math.floor(
      millisecondsUntilNextUpcomingGame / (1000 * 60 * 60 * 24)
    );

    if (daysUntilNextUpcomingGame >= 7) {
      logger.info('Not fetching weather since next upcoming game is more than 7 days away.');
    } else {
      const gameInfoString = `${CURRENT_SEASON} game against ${nextUpcomingCurrentSeasonGame.opponentId}`;
      logger.info(`Fetching weather for ${gameInfoString}...`);

      (nextUpcomingCurrentSeasonGame as Writable<GameInfo>).weather =
        await Weather.fetchForFutureGame({
          latitude: nextUpcomingCurrentSeasonGame.location.coordinates[0],
          longitude: nextUpcomingCurrentSeasonGame.location.coordinates[1],
          timestamp: getGameTimestampInSeconds(nextUpcomingCurrentSeasonGame),
        });
    }
  }

  logger.info(`Updating ND schedule data file for ${SEASON}...`);
  return NDSchedules.updateForSeason(SEASON, currentSeasonSchedule);

  // Uncomment to run a data transformation on all seasons.
  // logger.info(`Running data tranformation on all seasons...`);
  // return transformForAllSeasons(() => {});
};

async function runScript() {
  try {
    await updateNdSchedule();
    logger.info(`Successfully updated ND schedule for ${SEASON}!`);
  } catch (error) {
    logger.error(`Error updating ND schedule.`, {error, SEASON});
    process.exit(1);
  }
}

runScript();
