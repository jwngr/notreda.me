// Libraries
import _ from 'lodash';
import { connect } from 'react-redux';

// Presentational components
import GameSummary from '../components/GameSummary';

// Resources
import teams from '../../resources/teams';
import schedule from '../../resources/schedule';

const mapStateToProps = (state) => {
  const games = schedule[state.selectedYear];
  const game = _.clone(games[state.selectedGameIndex]);

  game.opponent = teams[game.opponentId];
  game.opponent.abbreviation = game.opponentId;

  return {
    game
  };
};

const GameSummaryContainer = connect(
  mapStateToProps
)(GameSummary);

export default GameSummaryContainer;
