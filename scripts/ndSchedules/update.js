const _ = require('lodash');

const espn = require('../lib/espn');
const polls = require('../lib/polls');
const logger = require('../lib/logger');
const sentry = require('../lib/sentry');
const ndSchedules = require('../lib/ndSchedules');

const SEASON = ndSchedules.CURRENT_SEASON;

sentry.initialize();
sentry.captureMessage('TEST 3', 'debug');

const updateNdSchedule = async () => {
  const seasonScheduleData = ndSchedules.getForSeason(SEASON);

  logger.info(`Updating data for ${SEASON} season...`);

  logger.info(`Updating game stats...`);
  const espnGameIds = await espn.fetchGameIdsForSeason(SEASON);
  espnGameIds.forEach((espnGameId, i) => {
    seasonScheduleData[i].espnGameId = Number(espnGameId);
  });

  const espnGameStats = await Promise.all(
    _.map(seasonScheduleData, (gameData) => {
      // Only fetch stats for games which have an ESPN game ID...
      if ('espnGameId' in gameData) {
        // Determine how many days it has been since the game.
        const millisecondsSinceGame = Date.now() - new Date(gameData.fullDate).getTime();
        const daysSinceGame = Math.floor(millisecondsSinceGame / (1000 * 60 * 60 * 24));

        // ... and were completed less than a week ago. This provides for ESPN to update the stats,
        // which they often do.
        if (daysSinceGame < 7) {
          return espn.fetchStatsForGame(gameData.espnGameId);
        }
      }
    })
  );

  espnGameStats.forEach((gameStats, i) => {
    if (typeof gameStats !== 'undefined') {
      if (!('result' in seasonScheduleData[i])) {
        // If this is the initial stats dump for a game which just ended, log a message to Sentry to
        // manually add a highlights video for the game.
        sentry.captureMessage(
          `Add highlights video for ${SEASON} game versus ${seasonScheduleData[i].opponentId}`,
          'warning'
        );
      }

      const homeTeamWon = gameStats.score.home > gameStats.score.away;
      seasonScheduleData[i] = {
        ...seasonScheduleData[i],
        ...gameStats,
        result: seasonScheduleData[i].isHomeGame === homeTeamWon ? 'W' : 'L',
      };
    }
  });

  logger.info(`Updating team records...`);
  const [notreDameWeeklyRecords, opponentRecords] = await Promise.all([
    espn.fetchNotreDameWeeklyRecordsForCurrentSeason(),
    Promise.all(
      _.map(seasonScheduleData, ({opponentId}) =>
        espn.fetchTeamRecordUpThroughNotreDameGameForCurrentSeason(opponentId)
      )
    ),
  ]);

  seasonScheduleData.forEach((gameData, i) => {
    gameData.records = {
      home: gameData.isHomeGame ? notreDameWeeklyRecords[i] : opponentRecords[i],
      away: gameData.isHomeGame ? opponentRecords[i] : notreDameWeeklyRecords[i],
    };
  });

  logger.info(`Updating polls...`);
  const currentSeasonPollsData = await espn.fetchPollsForSeason(SEASON);
  polls.updateForSeason(SEASON, currentSeasonPollsData, seasonScheduleData);

  logger.info(`Updating ND schedule data file for ${SEASON}...`);
  return ndSchedules.updateForSeason(SEASON, seasonScheduleData);
};

return updateNdSchedule()
  .then(() => {
    logger.info(`Successfully updated ND schedule for ${SEASON}!`);
  })
  .catch((error) => {
    logger.error(`Error updating ND schedule.`, {error, SEASON});
  });
