import React from 'react';

import {Schedules} from '../../lib/schedules';
import {TeamId} from '../../models';
import {CompletedGameSummary} from './CompletedGameSummary';
import {FutureGameSummary} from './FutureGameSummary';

export const GameSummary: React.FC<{
  readonly selectedSeason: number;
  readonly selectedGameIndex: number;
}> = ({selectedSeason, selectedGameIndex}) => {
  const seasonSchedule = Schedules.getForSeason(selectedSeason);
  const game = seasonSchedule[selectedGameIndex];

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
