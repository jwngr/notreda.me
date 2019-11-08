const _ = require('lodash');

const espn = require('../lib/espn');
const logger = require('../lib/logger');
const ndSchedules = require('../lib/ndSchedules');

const SEASON = ndSchedules.CURRENT_SEASON;

const updateNdSchedule = async () => {
  const seasonScheduleData = ndSchedules.getForSeason(SEASON);

  logger.info(`Fetching ESPN game IDs for ${SEASON}...`);
  const espnGameIds = await espn.fetchGameIdsForSeason(SEASON);
  espnGameIds.forEach((espnGameId, i) => {
    seasonScheduleData[i].espnGameId = Number(espnGameId);
  });

  logger.info(`Fetching ESPN game stats for ${SEASON}...`);
  const espnGameStats = await Promise.all(
    _.map(seasonScheduleData, (gameData) => {
      if ('espnGameId' in gameData && !('stats' in gameData)) {
        // Only fetch stats for games which have an ESPN game ID and do not already have stats.
        return espn.fetchStatsForGame(gameData.espnGameId);
      }
    })
  );

  espnGameStats.forEach((gameStats, i) => {
    if (typeof gameStats !== 'undefined') {
      const homeTeamWon = gameStats.score.home > gameStats.score.away;
      seasonScheduleData[i] = {
        ...seasonScheduleData[i],
        ...gameStats,
        result: seasonScheduleData[i].isHomeGame === homeTeamWon ? 'W' : 'L',
      };
    }
  });

  logger.info(`Fetching ESPN team records for ${SEASON}...`);
  const [notreDameWeeklyRecords, opponentRecords] = await Promise.all([
    espn.fetchNotreDameWeeklyRecordsForCurrentSeason(),
    Promise.all(_.map(seasonScheduleData, ({opponentId}) => espn.fetchTeamRecordUpThroughNotreDameGameForCurrentSeason(opponentId)))
  ]);

  seasonScheduleData.forEach((gameData, i) => {
    gameData.records = {
      home: gameData.isHomeGame ? notreDameWeeklyRecords[i] : opponentRecords[i],
      away: gameData.isHomeGame ? opponentRecords[i] : notreDameWeeklyRecords[i],
    };
  });

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
