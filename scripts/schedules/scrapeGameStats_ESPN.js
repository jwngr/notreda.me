const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const espn = require('../lib/espn');
const logger = require('../lib/logger');

const INPUT_DATA_DIRECTORY = path.resolve(__dirname, '../../data/ndSchedules');

logger.info('Scraping game stats from ESPN...');

const year = 2019;
const filename = `${INPUT_DATA_DIRECTORY}/${year}.json`;
const yearData = require(filename);

const promises = _.map(yearData, (gameData) => {
  if ('stats' in gameData || !('espnGameId' in gameData)) {
    // Stats already retrieved for this game
    return Promise.resolve();
  } else {
    return espn.fetchStatsForGame(gameData.espnGameId).catch((error) => {
      logger.error(`Failed to scrape stats from ESPN for game ${gameData.espnGameId}.`, {error});
    });
  }
});

return Promise.all(promises)
  .then((results) => {
    results.forEach((result, i) => {
      if (result) {
        yearData[i].linescore = result.linescore;

        // Determine the total score
        const homeScore = _.reduce(result.linescore.home, (sum, n) => sum + n, 0);
        const awayScore = _.reduce(result.linescore.away, (sum, n) => sum + n, 0);

        yearData[i].score = {
          home: homeScore,
          away: awayScore,
        };

        // Determine the game result
        const homeTeamWon = homeScore > awayScore;
        if (yearData[i].isHomeGame === homeTeamWon) {
          yearData[i].result = 'W';
        } else {
          yearData[i].result = 'L';
        }

        if ('firstDowns' in result.stats.home) {
          yearData[i].stats = result.stats;
        }
      }
    });

    fs.writeFileSync(filename, JSON.stringify(yearData, null, 2));

    logger.info('Successfuly scraped game stats from ESPN!');
  })
  .catch((error) => {
    logger.error('Failed to scrape game stats from ESPN.', {error});
  });
