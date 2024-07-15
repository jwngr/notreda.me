import _ from 'lodash';

import {Logger} from '../../../lib/logger';
import onePossessionNdCoachDataJson from './data/ndCoachesOnePossessionGames.json';
import onePossessionGameDataJson from './data/top25OnePossessionGames.json';
import {ExpS1E1CoachInfo, ExpS1E1TeamRecordsInfo} from './models';

const logger = new Logger({isSentryEnabled: false});

const onePossessionNdCoachData = onePossessionNdCoachDataJson as Record<string, ExpS1E1CoachInfo>;
const onePossessionTeamData = onePossessionGameDataJson as Record<string, ExpS1E1TeamRecordsInfo>;

interface ExtraTeamData {
  readonly teamName: string;
  readonly top25Finishes: number;
  readonly percentageOfGamesWhichAreOnePossessionGames: number;
}

interface ExtraCoachData {
  readonly coachName: string;
  readonly totalGamesCount: number;
  readonly percentageOfGamesWhichAreOnePossessionGames: number;
}

async function main() {
  const extraTeamData: ExtraTeamData[] = [];
  const extraCoachData: ExtraCoachData[] = [];

  for (const [teamName, data] of Object.entries(onePossessionTeamData)) {
    extraTeamData.push({
      teamName: teamName,
      top25Finishes: data.top25Finishes,
      percentageOfGamesWhichAreOnePossessionGames:
        (data.onePossesssionGamesCount * 100.0) / data.totalGamesCount,
    });
  }

  for (const [coachName, data] of Object.entries(onePossessionNdCoachData)) {
    extraCoachData.push({
      coachName: coachName,
      totalGamesCount: data.totalGamesCount,
      percentageOfGamesWhichAreOnePossessionGames:
        (data.onePossesssionGamesCount * 100.0) / data.totalGamesCount,
    });
  }

  const teamsSortedByPercentOfGamesWhichAreOnePossessionGames = extraTeamData.sort(
    (a, b) =>
      a.percentageOfGamesWhichAreOnePossessionGames - b.percentageOfGamesWhichAreOnePossessionGames
  );

  logger.newline(2);

  for (const teamData of teamsSortedByPercentOfGamesWhichAreOnePossessionGames) {
    logger.info(
      `["${teamData.teamName}", ${teamData.top25Finishes}, "${teamData.percentageOfGamesWhichAreOnePossessionGames.toFixed(1)}%"],`
    );
  }

  logger.newline(2);

  const coachesSortedByPercentOfGamesWhichAreOnePossessionGames = extraCoachData.sort(
    (a, b) =>
      a.percentageOfGamesWhichAreOnePossessionGames - b.percentageOfGamesWhichAreOnePossessionGames
  );

  for (const coachData of coachesSortedByPercentOfGamesWhichAreOnePossessionGames) {
    if (coachData.totalGamesCount > 10 && coachData.coachName !== 'No coach') {
      logger.info(
        `["${coachData.coachName}", ${coachData.totalGamesCount}, "${coachData.percentageOfGamesWhichAreOnePossessionGames.toFixed(1)}%"],`
      );
    }
  }
}

main();
