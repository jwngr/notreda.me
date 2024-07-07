import PropTypes from 'prop-types';
import React from 'react';

import {GameCoverage} from '../GameCoverage';
import {Location} from '../Location';
import {MatchupHistory} from '../MatchupHistory';
import {GameStats} from './GameStats';
import {CompletedGameWrapper, CoverageLocationWrapper} from './index.styles';
import {Linescore} from './Linescore';
import {TotalScore} from './TotalScore';

export const CompletedGameSummary = ({game, homeTeam, awayTeam}) => {
  return (
    <CompletedGameWrapper>
      <TotalScore game={game} homeTeam={homeTeam} awayTeam={awayTeam} />

      <CoverageLocationWrapper>
        <GameCoverage game={game} />
        <Location game={game} />
      </CoverageLocationWrapper>

      <Linescore
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        linescore={game.linescore}
        highlightsYouTubeVideoId={game.highlightsYouTubeVideoId}
      />

      <MatchupHistory game={game} />

      <GameStats stats={game.stats} awayTeam={awayTeam} homeTeam={homeTeam} />
    </CompletedGameWrapper>
  );
};

CompletedGameSummary.propTypes = {
  game: PropTypes.object.isRequired,
  awayTeam: PropTypes.object.isRequired,
  homeTeam: PropTypes.object.isRequired,
};
