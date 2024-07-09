import React from 'react';

import {GameInfo, TeamId} from '../../../models';
import {GameCoverage} from '../GameCoverage';
import {Location} from '../Location';
import {MatchupHistory} from '../MatchupHistory';
import {CompletedGameStats} from './GameStats';
import {CompletedGameWrapper, CoverageLocationWrapper} from './index.styles';
import {Linescore} from './Linescore';
import {TotalScore} from './TotalScore';

export const CompletedGameSummary: React.FC<{
  readonly game: GameInfo;
  readonly season: number;
  readonly homeTeamId: TeamId;
  readonly awayTeamId: TeamId;
}> = ({game, season, homeTeamId, awayTeamId}) => {
  return (
    <CompletedGameWrapper>
      <TotalScore game={game} homeTeamId={homeTeamId} awayTeamId={awayTeamId} />

      <CoverageLocationWrapper>
        <GameCoverage game={game} />
        <Location game={game} />
      </CoverageLocationWrapper>

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
