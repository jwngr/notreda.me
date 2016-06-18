// Libraries
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

// Reducers
import navMenu from './navMenu';

const rootReducer = combineReducers({
  navMenu,
  routing: routerReducer
});

export default rootReducer;
