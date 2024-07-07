import clone from 'lodash/clone';
import React from 'react';

import {FullSchedule, TeamId} from '../../models';
import scheduleJson from '../../resources/schedule.json';
import {CompletedGameSummary} from './CompletedGameSummary';
import {FutureGameSummary} from './FutureGameSummary';

const schedule = scheduleJson as FullSchedule;

export const GameSummary: React.FC<{
  readonly selectedSeason: number;
  readonly selectedGameIndex: number;
}> = ({selectedSeason, selectedGameIndex}) => {
  const games = schedule[selectedSeason];
  const game = clone(games[selectedGameIndex]);

  const homeTeamId = game.isHomeGame ? TeamId.ND : game.opponentId;
  const awayTeamId = game.isHomeGame ? game.opponentId : TeamId.ND;

  return game.result ? (
    <CompletedGameSummary
      game={game}
      homeTeamId={homeTeamId}
      awayTeamId={awayTeamId}
      season={selectedSeason}
    />
  ) : (
    <FutureGameSummary
      game={game}
      homeTeamId={homeTeamId}
      awayTeamId={awayTeamId}
      selectedSeason={selectedSeason}
    />
  );
};
