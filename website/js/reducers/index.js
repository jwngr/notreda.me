import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import navMenu from './navMenu';

const rootReducer = combineReducers({
  navMenu,
  router: routerStateReducer
});

export default rootReducer;
