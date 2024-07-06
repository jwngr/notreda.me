import PropTypes from 'prop-types';
import React from 'react';

import teams from '../../resources/teams';
import {CompletedGameSummary} from './CompletedGameSummary';
import {FutureGameSummary} from './FutureGameSummary';

export const GameSummary = ({game}) => {
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
