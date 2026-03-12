import fs from 'fs';

import _ from 'lodash';

import {Logger} from '../../../lib/logger';
import {withCommas} from '../../../lib/utils';
import teamRecordsAndSalaryData from './data/teamRecordsAndSalaries.json';

const logger = new Logger({isSentryEnabled: false});

interface TeamRecordAndSalary {
  wins: number;
  headCoach: string;
  salary: number | 'Unknown';
}

interface TeamCostPerWin {
  wins: number;
  teamName: string;
  headCoach: string;
  costPerWin: number | 'Unknown';
}

const teamCostPerWinData = _.map(
  teamRecordsAndSalaryData as Record<string, TeamRecordAndSalary>,
  ({wins, salary, headCoach}, teamName): TeamCostPerWin => {
    let costPerWin: TeamCostPerWin['costPerWin'];

    if (wins === 0) {
      costPerWin = Infinity;
    } else if (salary === 'Unknown') {
      costPerWin = 'Unknown';
    } else if (typeof salary === 'number') {
      costPerWin = Number((salary / wins).toFixed(0));
    } else {
      costPerWin = 'Unknown';
    }

    return {wins, teamName, headCoach, costPerWin};
  }
);

const sortedTeamCostPerWinData = teamCostPerWinData
  .filter((team): team is TeamCostPerWin & {costPerWin: number} => {
    return typeof team.costPerWin === 'number';
  })
  .sort((a, b) => {
    return a.costPerWin - b.costPerWin;
  });

sortedTeamCostPerWinData.forEach(({wins, teamName, headCoach, costPerWin}, i) => {
  logger.info(`${i + 1}\t${teamName}\t${headCoach}\t${wins}\t${withCommas(costPerWin)}`);
});

teamCostPerWinData
  .filter(({costPerWin}) => {
    return costPerWin === 'Unknown';
  })
  .forEach(({wins, teamName, headCoach, costPerWin}, i) => {
    const costPerWinString =
      costPerWin === 'Unknown' ? 'Unknown' : isFinite(costPerWin) ? costPerWin : 'Infinite';
    logger.info(
      `${sortedTeamCostPerWinData.length + i + 1}\t${teamName}\t${headCoach}\t${wins}\t${costPerWinString}`
    );
  });

fs.writeFileSync('./data/costPerWin.json', JSON.stringify(sortedTeamCostPerWinData, null, 2));
