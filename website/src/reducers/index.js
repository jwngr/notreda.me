import _ from 'lodash';
import subDays from 'date-fns/subDays';
import isAfter from 'date-fns/isAfter';
import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';

import * as actions from '../actions';

import navMenu from './navMenu';

import schedule from '../resources/schedule';
import {CURRENT_YEAR} from '../lib/constants.js';

const DEFAULT_SELECTED_GAME_INDEX = 0;

const getYearFromUrl = (url = '') => {
  const tokens = url.split('/').filter((val) => val !== '');

  let year;
  if (tokens.length > 0 && tokens[0].length === 4) {
    year = Number(tokens[0]);
  }

  if (isNaN(year) || !_.has(schedule, year)) {
    return CURRENT_YEAR;
  }

  return year;
};

const getSelectedGameIndexFromUrl = (url = '') => {
  const year = getYearFromUrl(url);

  const tokens = url.split('/').filter((val) => val !== '');

  let selectedGameIndex;
  if (tokens.length > 1) {
    selectedGameIndex = Number(tokens[1]);
  }

  // Numeric selected game index is provided.
  if (!isNaN(selectedGameIndex)) {
    if (selectedGameIndex <= 0 || selectedGameIndex > schedule[year].length) {
      // If the selected game index is invalid for this year, use the default selected game index.
      return DEFAULT_SELECTED_GAME_INDEX;
    } else {
      // Otherwise, subtract one from the selected game index in the URL since they are 1-based, not
      // 0-based.
      return selectedGameIndex - 1;
    }
  }

  // No selected game index or a non-numeric game index is provided.
  if (year !== CURRENT_YEAR) {
    // If the year is not the default year, show the default game index.
    return DEFAULT_SELECTED_GAME_INDEX;
  } else {
    // Otherwise, show the latest completed or next upcoming game.
    const gamesPlayedCount = _.filter(schedule[year], (game) => game.result).length;
    if (gamesPlayedCount === 0) {
      // If no games have been played yet, select the default game index.
      return DEFAULT_SELECTED_GAME_INDEX;
    } else if (gamesPlayedCount === schedule[year].length) {
      // If all games have already played, select the last game.
      return schedule[year].length - 1;
    } else {
      // Otherwise, select the latest completed game until the Wednesday before the next game, at
      // which point, select the next game.
      // TODO: remove date or fullDate once these are all standardized.
      const nextCompletedGameDate =
        schedule[year][gamesPlayedCount].date || schedule[year][gamesPlayedCount].fullDate;
      const wednesdayBeforeNextGameDate = subDays(new Date(nextCompletedGameDate), 4);
      if (isAfter(new Date(), wednesdayBeforeNextGameDate)) {
        return gamesPlayedCount;
      } else {
        return gamesPlayedCount - 1;
      }
    }
  }
};

const rootReducer = {
  navMenu,
  selectedYear: (state = CURRENT_YEAR, action) => {
    switch (action.type) {
      case actions.ROUTER_LOCATION_CHANGED:
        return getYearFromUrl(_.get(action.payload, 'location.pathname'));
      default:
        return state;
    }
  },
  selectedGameIndex: (state = DEFAULT_SELECTED_GAME_INDEX, action) => {
    switch (action.type) {
      case actions.ROUTER_LOCATION_CHANGED:
        return getSelectedGameIndexFromUrl(_.get(action.payload, 'location.pathname'));
      default:
        return state;
    }
  },
};

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    ...rootReducer,
  });

export default createRootReducer;
