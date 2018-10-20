const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const SCHEDULE_DATA_DIRECTORY = path.resolve(__dirname, '../../../../schedules/data');

const schedulesDataFilenames = fs.readdirSync(SCHEDULE_DATA_DIRECTORY);

let apRankingsCounts = [];

schedulesDataFilenames.forEach((schedulesDataFilename) => {
  const year = schedulesDataFilename.split('.')[0];
  const schedule = require(`${SCHEDULE_DATA_DIRECTORY}/${schedulesDataFilename}`);

  let previousGameAlreadyPlayed = true;
  schedule.forEach((gameData) => {
    if (previousGameAlreadyPlayed) {
      let homeApRanking = _.get(gameData, 'rankings.home.ap');
      let awayApRanking = _.get(gameData, 'rankings.away.ap');
      if (gameData.isHomeGame && homeApRanking) {
        apRankingsCounts[homeApRanking - 1] = (apRankingsCounts[homeApRanking - 1] || 0) + 1;
      } else if (!gameData.isHomeGame && awayApRanking) {
        apRankingsCounts[awayApRanking - 1] = (apRankingsCounts[awayApRanking - 1] || 0) + 1;
      }
    }

    previousGameAlreadyPlayed = 'result' in gameData;
  });
});

console.log('AP RANKINGS COUNTS:', apRankingsCounts);
