import React from 'react';
import PropTypes from 'prop-types';

import FutureGameSummary from './FutureGameSummary';
import CompletedGameSummary from './CompletedGameSummary';

import teams from '../../resources/teams';

const GameSummary = ({game}) => {
  const notreDame = teams.ND;
  notreDame.abbreviation = 'ND';

  const homeTeam = game.isHomeGame ? notreDame : game.opponent;
  const awayTeam = game.isHomeGame ? game.opponent : notreDame;

  const MainComponent = 'result' in game ? CompletedGameSummary : FutureGameSummary;

  return <MainComponent game={game} homeTeam={homeTeam} awayTeam={awayTeam} />;
};

GameSummary.propTypes = {
  game: PropTypes.object.isRequired,
};

export default GameSummary;
