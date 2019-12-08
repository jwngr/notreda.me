const _ = require('lodash');
const fs = require('fs');

const utils = require('../../../lib/utils');
const logger = require('../../../lib/logger');

const teamRecordsAndSalaryData = require('./data/teamRecordsAndSalaries.json');

const teamCostPerWinData = _.map(
  teamRecordsAndSalaryData,
  ({wins, salary, headCoach}, teamName) => {
    let costPerWin;

    if (wins === 0) {
      costPerWin = Infinity;
    } else if (salary === 'Unknown') {
      costPerWin = 'Unknown';
    } else {
      costPerWin = Number((salary / wins).toFixed(0));
    }

    return {
      wins,
      teamName,
      headCoach,
      costPerWin,
    };
  }
);

const sortedTeamCostPerWinData = teamCostPerWinData
  .filter(({costPerWin}) => {
    return typeof costPerWin === 'number';
  })
  .sort((a, b) => {
    return a.costPerWin - b.costPerWin;
  });

sortedTeamCostPerWinData.forEach(({wins, teamName, headCoach, costPerWin}, i) => {
  logger.log(i + 1, teamName, headCoach, wins, utils.withCommas(costPerWin));
});

teamCostPerWinData
  .filter(({costPerWin}) => {
    return costPerWin === 'Unknown';
  })
  .forEach(({wins, teamName, headCoach, costPerWin}, i) => {
    logger.log(sortedTeamCostPerWinData.length + i + 1, teamName, headCoach, wins, costPerWin);
  });

fs.writeFileSync('./data/costPerWin.json', JSON.stringify(sortedTeamCostPerWinData, null, 2));
