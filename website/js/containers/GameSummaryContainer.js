// Libraries
import { connect } from 'react-redux';

// Presentational components
import GameSummary from '../components/GameSummary';

// Resources
import schedule from '../../resources/schedule';

const mapStateToProps = (state) => {
  const games = schedule[state.selectedYear];
  const game = games[state.selectedGameIndex];

  return {
    game
  };
};

const GameSummaryContainer = connect(
  mapStateToProps
)(GameSummary);

export default GameSummaryContainer;
