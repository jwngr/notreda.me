import React from 'react';
import PropTypes from 'prop-types';

import Location from '../Location';
import LineScore from './Linescore';
import GameStats from './GameStats';
import TotalScore from './TotalScore';
import GameCoverage from '../GameCoverage';
import MatchupHistory from '../MatchupHistory';

import {CompletedGameWrapper, CoverageLocationWrapper} from './index.styles';

const CompletedGameSummary = ({game, homeTeam, awayTeam}) => {
  return (
    <CompletedGameWrapper>
      <TotalScore game={game} homeTeam={homeTeam} awayTeam={awayTeam} />

      <CoverageLocationWrapper>
        <GameCoverage game={game} />
        <Location game={game} />
      </CoverageLocationWrapper>

      <LineScore
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

export default CompletedGameSummary;
