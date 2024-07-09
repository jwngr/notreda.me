import React from 'react';
import styled from 'styled-components';

import {GameInfo, TeamId} from '../../models';
import {GameCoverage} from './GameCoverage';
// import {MatchupHistory} from '../MatchupHistory';
import {CompletedGameStats} from './GameStats';
import {Linescore} from './Linescore';
import {TotalScore} from './TotalScore';

const CompletedGameWrapper = styled.div`
  flex: 1;
  display: flex;
  margin-top: 16px;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 8px;
    padding-bottom: 20px;
  }
`;

export const CompletedGameSummary: React.FC<{
  readonly game: GameInfo;
  readonly season: number;
  readonly homeTeamId: TeamId;
  readonly awayTeamId: TeamId;
}> = ({game, homeTeamId, awayTeamId}) => {
  return (
    <CompletedGameWrapper>
      <TotalScore game={game} homeTeamId={homeTeamId} awayTeamId={awayTeamId} />

      <GameCoverage game={game} />

      <Linescore
        homeTeamId={homeTeamId}
        awayTeamId={awayTeamId}
        linescore={game.linescore ?? null}
        highlightsYouTubeVideoId={game.highlightsYouTubeVideoId ?? null}
      />

      {/* TODO: Re-enable matchup history after improving data loading performance. */}
      {/* <MatchupHistory selectedGame={game} selectedSeason={season} /> */}

      <CompletedGameStats
        stats={game.stats ?? null}
        awayTeamId={awayTeamId}
        homeTeamId={homeTeamId}
      />
    </CompletedGameWrapper>
  );
};
