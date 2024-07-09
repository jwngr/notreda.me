import React, {useEffect, useMemo, useState} from 'react';

import {Schedules} from '../../lib/schedules';
import {GameInfo, TeamId} from '../../models';
import {CompletedGameSummary} from './CompletedGameSummary/CompletedGameSummary';
import {FutureGameSummary} from './FutureGameSummary';

export const GameSummary: React.FC<{
  readonly selectedSeason: number;
  readonly selectedGameIndex: number;
}> = ({selectedSeason, selectedGameIndex}) => {
  const [game, setGame] = useState<GameInfo | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      const seasonSchedule = await Schedules.getForSeason(selectedSeason);
      setGame(seasonSchedule[selectedGameIndex]);
    };
    fetchGame();
  }, [selectedSeason, selectedGameIndex]);

  const teamIds = useMemo(() => {
    if (!game) return null;
    return game.isHomeGame
      ? {home: TeamId.ND, away: game.opponentId}
      : {home: game.opponentId, away: TeamId.ND};
  }, [game]);

  if (!game || !teamIds) return null;

  return game.result ? (
    <CompletedGameSummary
      game={game}
      homeTeamId={teamIds.home}
      awayTeamId={teamIds.away}
      season={selectedSeason}
    />
  ) : (
    <FutureGameSummary
      game={game}
      homeTeamId={teamIds.home}
      awayTeamId={teamIds.away}
      selectedSeason={selectedSeason}
    />
  );
};
