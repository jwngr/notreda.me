import React from 'react';
import PropTypes from 'prop-types';

import Coverage from '../Coverage';
import Location from '../Location';
import LineScore from './Linescore';
import GameStats from './GameStats';
import TotalScore from './TotalScore';
import MatchupHistory from '../MatchupHistory';

import {VideoHighlights, CompletedGameWrapper, CoverageLocationWrapper} from './index.styles';

const CompletedGameSummary = ({game, homeTeam, awayTeam}) => {
  return (
    <CompletedGameWrapper>
      <TotalScore game={game} homeTeam={homeTeam} awayTeam={awayTeam} />

      <CoverageLocationWrapper>
        <Coverage game={game} />
        <Location game={game} />
      </CoverageLocationWrapper>

      <LineScore linescore={game.linescore} homeTeam={homeTeam} awayTeam={awayTeam} />

      {game.highlightsYouTubeVideoId && (
        <VideoHighlights
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${game.highlightsYouTubeVideoId}`}
          title={`${homeTeam.name} at ${awayTeam.name} Highlights`}
          allowFullScreen
        />
      )}

      <GameStats stats={game.stats} awayTeam={awayTeam} homeTeam={homeTeam} />
      <MatchupHistory
        game={game}
        opponentId={game.isHomeGame ? awayTeam.abbreviation : homeTeam.abbreviation}
      />
    </CompletedGameWrapper>
  );
};

CompletedGameSummary.propTypes = {
  game: PropTypes.object.isRequired,
  awayTeam: PropTypes.object.isRequired,
  homeTeam: PropTypes.object.isRequired,
};

export default CompletedGameSummary;
