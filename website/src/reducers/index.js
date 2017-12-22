import _ from 'lodash';
import addDays from 'date-fns/add_days';
import isAfter from 'date-fns/is_after';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import * as actions from '../actions';

import navMenu from './navMenu';

import schedule from '../resources/schedule';


const DEFAULT_YEAR = 2017;
const DEFAULT_SELECTED_GAME_INDEX = 0;


const getYearFromQueryString = (qs) => {
  const pathTokens = qs.split('/');

  let year = DEFAULT_YEAR;
  if (pathTokens.length >= 2 && pathTokens[1] !== '') {
    year = Number(pathTokens[1]);
  }

  return _.isNaN(year) ? DEFAULT_YEAR : year;
}

const getSelectedGameIndexFromQueryString = (qs) => {
  const pathTokens = qs.split('/');

  const year = getYearFromQueryString(qs);

  // If the query string contains a valid game index, subtract one from it and use it
  if (pathTokens.length >= 3 && pathTokens[2] !== '') {
    const selectedGameIndex = Number(pathTokens[2]);
    if (!_.isNaN(selectedGameIndex) && selectedGameIndex > 0 && selectedGameIndex <= schedule[year].length) {
      return selectedGameIndex - 1;
    }
  }

  if (year !== DEFAULT_YEAR) {
    // If the year is not the default year, show the default game index
    return DEFAULT_SELECTED_GAME_INDEX;
  } else {
    // Otherwise, show the latest completed or next upcoming game
    const gamesPlayedCount = _.filter(schedule[year], (game) => game.result).length;
    if (gamesPlayedCount === 0) {
      // If no games have been played yet, select the default game index
      return DEFAULT_SELECTED_GAME_INDEX;
    } else if (gamesPlayedCount === schedule[year].length) {
      // If all games have already played, select the last game
      return schedule[year].length - 1;
    } else {
      // Otherwise, select the latest completed game until the Tuesday after the game, at which
      // point, select the next upcoming game
      const latestCompletedGameDate = schedule[year][gamesPlayedCount - 1].date;
      const tuesdayAfterLatestCompletedGameDate = addDays(new Date(latestCompletedGameDate), 3);
      if (isAfter(new Date(), tuesdayAfterLatestCompletedGameDate)) {
        return gamesPlayedCount;
      } else {
        return gamesPlayedCount - 1;
      }
    }
  }
}


const rootReducer = combineReducers({
  navMenu,
  router: routerReducer,
  selectedYear: (state = DEFAULT_YEAR, action) => {
    switch (action.type) {
    case actions.CHANGE_ROUTER_LOCATION:
      return getYearFromQueryString(action.payload.pathname);
    default:
      return state;
    }
  },
  selectedGameIndex: (state = DEFAULT_SELECTED_GAME_INDEX, action) => {
    switch (action.type) {
    case actions.CHANGE_ROUTER_LOCATION:
      return getSelectedGameIndexFromQueryString(action.payload.pathname);
    default:
      return state;
    }
  },
});

export default rootReducer;
