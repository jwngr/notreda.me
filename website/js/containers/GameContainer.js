// Libraries
import { connect } from 'react-redux';

// Actions
import { changeSelectedGameIndex } from '../actions';

// Presentational components
import Game from '../components/Game';

const mapStateToProps = (state, ownProps) => {
  return {
    selected: (ownProps.index === state.selectedGameIndex)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGameSelected: (index) => {
      dispatch(changeSelectedGameIndex(index));
    }
  };
};

const GameContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);

export default GameContainer;
