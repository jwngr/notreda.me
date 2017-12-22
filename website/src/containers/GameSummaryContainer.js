import _ from 'lodash';
import {connect} from 'react-redux';

import GameSummary from '../components/gameSummary/GameSummary';

import teams from '../resources/teams';
import schedule from '../resources/schedule';

const mapStateToProps = (state) => {
  const games = schedule[state.selectedYear];
  const game = _.clone(games[state.selectedGameIndex]);

  game.opponent = teams[game.opponentId];
  game.opponent.abbreviation = game.opponentId;

  return {
    game,
  };
};

const GameSummaryContainer = connect(mapStateToProps)(GameSummary);

export default GameSummaryContainer;
