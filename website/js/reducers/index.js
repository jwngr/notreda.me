// Libraries
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

// Actions
import * as actions from '../actions';

// Reducers
import navMenu from './navMenu';

// Constants
const DEFAULT_YEAR = 2015;

const rootReducer = combineReducers({
  navMenu,
  routing: routerReducer,
  selectedGameIndex: (state = 0, action) => {
    switch (action.type) {
    case actions.CHANGE_SELECTED_GAME_INDEX:
      return action.index;
    default:
      return state;
    }
  },
  selectedYear: (state = DEFAULT_YEAR, action) => {
    console.log(state, action);
    switch (action.type) {
    case actions.CHANGE_ROUTER_LOCATION:
      const path = action.payload.pathname;
      return (path === '/') ? DEFAULT_YEAR : Number(path.slice(1));
    default:
      return state;
    }
  }
});

export default rootReducer;
