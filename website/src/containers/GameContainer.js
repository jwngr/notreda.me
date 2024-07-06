import {connect} from 'react-redux';

import {Game} from '../components/Game';

const mapStateToProps = (state, ownProps) => {
  return {
    isSelected: ownProps.index === state.selectedGameIndex,
  };
};

export const GameContainer = connect(mapStateToProps)(Game);
