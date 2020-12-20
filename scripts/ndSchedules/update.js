const _ = require('lodash');

const espn = require('../lib/espn');
const polls = require('../lib/polls');
const utils = require('../lib/utils');
const logger = require('../lib/logger');
const sentry = require('../lib/sentry');
const weather = require('../lib/weather');
const ndSchedules = require('../lib/ndSchedules');
const {CURRENT_SEASON, ND_HEAD_COACH} = require('../lib/constants');

const SEASON = CURRENT_SEASON;

sentry.initialize();

const updateNdSchedule = async () => {
  const currentSeasonSchedule = ndSchedules.getForCurrentSeason();

  logger.info(`Updating data for ${SEASON} season...`);

  logger.info(`Updating game stats...`);
  const espnGameIds = await espn.fetchGameIdsForSeason(SEASON);
  espnGameIds.forEach((espnGameId, i) => {
    currentSeasonSchedule[i].espnGameId = Number(espnGameId);
  });

  // Check for new games, such as bowl games, being added to the schedule. If there are new games
  // added, exit early since future updates will not work properly.
  if (currentSeasonSchedule.length < espnGameIds.length) {
    const errorMessage = `Manually add new game(s) for ${SEASON} season`;
    sentry.captureMessage(errorMessage, 'warning');
    throw new Error(errorMessage);
  }

  const espnGameStats = await Promise.all(
    _.map(currentSeasonSchedule, (gameData) => {
      // Determine how many days it has been since the game kicked off.
      const millisecondsSinceGame = Date.now() - new Date(gameData.fullDate).getTime();
      const daysSinceGame = Math.floor(millisecondsSinceGame / (1000 * 60 * 60 * 24));

      // If the game was completed within the last month and is no more than one day out, attempt to
      // fetch stats for it. If the game has not yet ended, this will exit early. Re-fetching game
      // stats for a month allows time for ESPN to update the stats later, which they often do.
      const MAX_DAYS_SINCE_GAME_TO_FETCH = 30;
      if (daysSinceGame < MAX_DAYS_SINCE_GAME_TO_FETCH && daysSinceGame >= -1) {
        return espn.fetchStatsForGame(gameData.espnGameId);
      }
    })
  );

  espnGameStats.forEach((gameStats, i) => {
    if (typeof gameStats !== 'undefined') {
      if (!('result' in currentSeasonSchedule[i])) {
        // If this is the initial stats dump for a game which just ended, log a message to Sentry to
        // manually add a highlights video for the game.
        sentry.captureMessage(
          `Add highlights video for ${SEASON} game versus ${currentSeasonSchedule[i].opponentId}`,
          'warning'
        );

        // Also add the ND head coach as a top-level key to the game data.
        currentSeasonSchedule[i].headCoach = ND_HEAD_COACH;
      }

      const homeTeamWon = gameStats.score.home > gameStats.score.away;
      currentSeasonSchedule[i] = {
        ...currentSeasonSchedule[i],
        ...gameStats,
        result: currentSeasonSchedule[i].isHomeGame === homeTeamWon ? 'W' : 'L',
      };
    }
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

    const priorGameDate = utils.getGameDate(currentSeasonUpcomingGameData);
    const newGameDate = await espn.fetchKickoffTimeForGame(
      currentSeasonUpcomingGameData.espnGameId
    );

    const priorIsTimeTbd = typeof currentSeasonUpcomingGameData.fullDate === 'undefined';
    const newIsTimeTbd = newGameDate === 'TBD';

    if (priorIsTimeTbd && !newIsTimeTbd) {
      sentry.captureMessage(
        `Manually add newly announced kickoff time for ${SEASON} ${currentSeasonUpcomingGameData.opponentId} game`,
        'warning'
      );
    } else if (newIsTimeTbd && !priorIsTimeTbd) {
      sentry.captureMessage(
        `Manually remove kickoff time for ${SEASON} ${currentSeasonUpcomingGameData.opponentId} game`,
        'warning'
      );
    } else if (!newIsTimeTbd && newGameDate.getTime() !== priorGameDate.getTime()) {
      sentry.captureMessage(
        `Manually update kickoff time for ${SEASON} ${currentSeasonUpcomingGameData.opponentId} game`,
        'warning'
      );
    }
  }

  logger.info(`Updating team records...`);
  const [notreDameWeeklyRecords, opponentRecords] = await Promise.all([
    espn.fetchNotreDameWeeklyRecordsForSeason(SEASON),
    Promise.all(
      _.map(currentSeasonSchedule, ({opponentId}) =>
        espn.fetchTeamRecordUpThroughNotreDameGameForSeason(SEASON, opponentId)
      )
    ),
  ]);

  currentSeasonSchedule.forEach((gameData, i) => {
    gameData.records = {
      home: gameData.isHomeGame ? notreDameWeeklyRecords[i] : opponentRecords[i],
      away: gameData.isHomeGame ? opponentRecords[i] : notreDameWeeklyRecords[i],
    };
  });

  logger.info(`Updating polls...`);
  const currentSeasonPollsData = await espn.fetchPollsForSeason(SEASON);
  polls.updateForSeason(SEASON, currentSeasonPollsData, currentSeasonSchedule);

  logger.info(`Updating weather for upcoming game...`);
  const nextUpcomingCurrentSeasonGame = _.find(
    currentSeasonSchedule,
    ({result, isPostponed, isCanceled}) =>
      !isPostponed && !isCanceled && typeof result === 'undefined'
  );

  if (typeof nextUpcomingCurrentSeasonGame === 'undefined') {
    logger.info('Not fetching weather since current season is over.');
  } else if (typeof nextUpcomingCurrentSeasonGame.fullDate === 'undefined') {
    logger.info('Not fetching weather since next upcoming game has no kickoff time.');
  } else {
    const millisecondsUntilNextUpcomingGame =
      new Date(nextUpcomingCurrentSeasonGame.fullDate).getTime() - Date.now();
    const daysUntilNextUpcomingGame = Math.floor(
      millisecondsUntilNextUpcomingGame / (1000 * 60 * 60 * 24)
    );

    if (daysUntilNextUpcomingGame >= 7) {
      logger.info('Not fetching weather since next upcoming game is more than 7 days away.');
    } else {
      const gameInfoString = `${ndSchedules.CURRENT_SEASON} game against ${nextUpcomingCurrentSeasonGame.opponentId}`;
      logger.info(`Fetching weather for ${gameInfoString}...`);

      nextUpcomingCurrentSeasonGame.weather = await weather.fetchForGame(
        nextUpcomingCurrentSeasonGame.location.coordinates,
        utils.getGameTimestampInSeconds(nextUpcomingCurrentSeasonGame)
      );
    }
  }

  logger.info(`Updating ND schedule data file for ${SEASON}...`);
  return ndSchedules.updateForSeason(SEASON, currentSeasonSchedule);
};

return updateNdSchedule()
  .then(() => {
    logger.info(`Successfully updated ND schedule for ${SEASON}!`);
  })
  .catch((error) => {
    logger.error(`Error updating ND schedule.`, {error, SEASON});
  });
