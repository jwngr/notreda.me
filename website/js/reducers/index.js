// Libraries
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

// Actions
import * as actions from '../actions';

// Reducers
import navMenu from './navMenu';


const rootReducer = combineReducers({
  navMenu,
  selectedGameIndex: (state = 0, action) => {
    switch (action.type) {
    case actions.CHANGE_SELECTED_GAME_INDEX:
      return action.index;
    default:
      return state;
    }
  },
  routing: routerReducer
});

export default rootReducer;
