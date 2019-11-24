const _ = require('lodash');

const espn = require('../lib/espn');
const polls = require('../lib/polls');
const utils = require('../lib/utils');
const logger = require('../lib/logger');
const sentry = require('../lib/sentry');
const weather = require('../lib/weather');
const ndSchedules = require('../lib/ndSchedules');

const SEASON = ndSchedules.CURRENT_SEASON;

sentry.initialize();

const updateNdSchedule = async () => {
  const currentSeasonSchedule = ndSchedules.getForCurrentSeason();

  logger.info(`Updating data for ${SEASON} season...`);

  logger.info(`Updating game stats...`);
  const espnGameIds = await espn.fetchGameIdsForSeason(SEASON);
  espnGameIds.forEach((espnGameId, i) => {
    currentSeasonSchedule[i].espnGameId = Number(espnGameId);
  });

  const espnGameStats = await Promise.all(
    _.map(currentSeasonSchedule, (gameData) => {
      // Determine how many days it has been since the game kicked off.
      const millisecondsSinceGame = Date.now() - new Date(gameData.fullDate).getTime();
      const daysSinceGame = Math.floor(millisecondsSinceGame / (1000 * 60 * 60 * 24));

      // If the game was completed within the last week and is no more than one day out, attempt to
      // fetch stats for it. If the game has not yet ended, this will exit early. Re-fetching game
      // stats for one week allows time for ESPN to update the stats later, which they often do.
      if (daysSinceGame < 7 && daysSinceGame >= -1) {
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

  for (gameData of currentSeasonUpcomingGames) {
    const priorGameDate = utils.getGameDate(gameData);
    const newGameDate = await espn.fetchKickoffTimeForGame(gameData.espnGameId);

    const priorIsTimeTbd = typeof gameData.fullDate === 'undefined';
    const newIsTimeTbd = newGameDate === 'TBD';

    if (priorIsTimeTbd && !newIsTimeTbd) {
      sentry.captureMessage(
        `Manually add newly announced kickoff time for ${SEASON} ${gameData.opponentId} game`,
        'warning'
      );
    } else if (newIsTimeTbd && !priorIsTimeTbd) {
      sentry.captureMessage(
        `Manually remove kickoff time for ${SEASON} ${gameData.opponentId} game`,
        'warning'
      );
    } else if (newGameDate.getTime() !== priorGameDate.getTime()) {
      sentry.captureMessage(
        `Manually update kickoff time for ${SEASON} ${gameData.opponentId} game`,
        'warning'
      );
    }
  }

  logger.info(`Updating team records...`);
  const [notreDameWeeklyRecords, opponentRecords] = await Promise.all([
    espn.fetchNotreDameWeeklyRecordsForCurrentSeason(),
    Promise.all(
      _.map(currentSeasonSchedule, ({opponentId}) =>
        espn.fetchTeamRecordUpThroughNotreDameGameForCurrentSeason(opponentId)
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
    ({result}) => typeof result === 'undefined'
  );

  if (typeof nextUpcomingCurrentSeasonGame === 'undefined') {
    logger.info('Not fetching weather since current season is over.');
  } else {
    const gameInfoString = `${ndSchedules.CURRENT_SEASON} game against ${nextUpcomingCurrentSeasonGame.opponentId}`;
    logger.info(`Fetching weather for ${gameInfoString}...`);

    nextUpcomingCurrentSeasonGame.weather = await weather.fetchForGame(
      nextUpcomingCurrentSeasonGame.location.coordinates,
      utils.getGameTimestampInSeconds(nextUpcomingCurrentSeasonGame)
    );
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
