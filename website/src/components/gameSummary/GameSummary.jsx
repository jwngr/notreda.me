import clone from 'lodash/clone';
import PropTypes from 'prop-types';
import React from 'react';

import schedule from '../../resources/schedule.json';
import teams from '../../resources/teams.json';
import {CompletedGameSummary} from './CompletedGameSummary';
import {FutureGameSummary} from './FutureGameSummary';

export const GameSummary = ({selectedYear, selectedGameIndex}) => {
  const games = schedule[selectedYear];
  const game = clone(games[selectedGameIndex]);

  game.season = Number(selectedYear);

  game.weekIndex = Number(selectedGameIndex);

  game.opponent = teams[game.opponentId];
  game.opponent.abbreviation = game.opponentId;

  const notreDame = teams.ND;
  notreDame.abbreviation = 'ND';

  const homeTeam = game.isHomeGame ? notreDame : game.opponent;
  const awayTeam = game.isHomeGame ? game.opponent : notreDame;

  const MainComponent = 'result' in game ? CompletedGameSummary : FutureGameSummary;

  return <MainComponent game={game} homeTeam={homeTeam} awayTeam={awayTeam} />;
};

GameSummary.propTypes = {
  selectedYear: PropTypes.number.isRequired,
  selectedGameIndex: PropTypes.number.isRequired,
};
