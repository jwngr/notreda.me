import React from 'react';
import PropTypes from 'prop-types';

import Metadata from './Metadata';
import LineScore from './Linescore';
import GameStats from './GameStats';
import TotalScore from './TotalScore';

import {CompletedGameWrapper} from './index.styles';

const CompletedGameSummary = ({game, homeTeam, awayTeam}) => {
  return (
    <CompletedGameWrapper>
      <TotalScore game={game} homeTeam={homeTeam} awayTeam={awayTeam} />
      <Metadata game={game} />
      <LineScore linescore={game.linescore} homeTeam={homeTeam} awayTeam={awayTeam} />

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
