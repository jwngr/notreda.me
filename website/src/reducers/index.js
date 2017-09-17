// Libraries
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'

// Actions
import * as actions from '../actions';

// Reducers
import navMenu from './navMenu';

const DEFAULT_YEAR = 2017;
const DEFAULT_SELECTED_GAME_INDEX = 0;

const rootReducer = combineReducers({
  navMenu,
  router: routerReducer,
  selectedGameIndex: (state = 0, action) => {
    switch (action.type) {
    case actions.CHANGE_ROUTER_LOCATION:
      // TODO: there should be a simpler way to do this...
      const path = action.payload.pathname;
      const pathTokens = path.split('/');

      // TODO: what if pathTokens[2] is an invalid number like 0 or 'foo'?
      if (pathTokens.length < 3 || pathTokens[2] === '') {
        return DEFAULT_SELECTED_GAME_INDEX
      } else {
        return Number(pathTokens[2]) - 1;
      }
    default:
      return state;
    }
  },
  selectedYear: (state = DEFAULT_YEAR, action) => {
    switch (action.type) {
    case actions.CHANGE_ROUTER_LOCATION:
      // TODO: there should be a simpler way to do this...
      const path = action.payload.pathname;
      const pathTokens = path.split('/');

      // TODO: what if pathTokens[1] is an invalid number like 0 or 'foo'?
      if (pathTokens.length < 2 || pathTokens[1] === '') {
        return DEFAULT_YEAR;
      } else {
        return Number(pathTokens[1]);
      }
    default:
      return state;
    }
  }
});

export default rootReducer;
