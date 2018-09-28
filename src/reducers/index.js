import _ from 'lodash';
import addDays from 'date-fns/add_days';
import isAfter from 'date-fns/is_after';

import * as actions from '../actions';

import navMenu from './navMenu';

import schedule from '../resources/schedule';

const DEFAULT_YEAR = 2018;
const DEFAULT_SELECTED_GAME_INDEX = 0;

const getYearFromQueryParams = (params = {}) => {
  const year = Number(params.year);

  if (isNaN(year) || !_.has(schedule, year)) {
    return DEFAULT_YEAR;
  }

  return year;
};

const getSelectedGameIndexFromQueryParams = (params = {}) => {
  const year = getYearFromQueryParams(params);

  const selectedGameIndex = Number(params.selectedGameIndex);

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
  if (year !== DEFAULT_YEAR) {
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
      // Otherwise, select the latest completed game until the Tuesday after the game, at which
      // point, select the next upcoming game.
      const latestCompletedGameDate = schedule[year][gamesPlayedCount - 1].date;
      const tuesdayAfterLatestCompletedGameDate = addDays(new Date(latestCompletedGameDate), 3);
      if (isAfter(new Date(), tuesdayAfterLatestCompletedGameDate)) {
        return gamesPlayedCount;
      } else {
        return gamesPlayedCount - 1;
      }
    }
  }
};

const rootReducer = {
  navMenu,
  selectedYear: (state = DEFAULT_YEAR, action) => {
    switch (action.type) {
      case actions.ROUTER_LOCATION_CHANGED:
        return getYearFromQueryParams(action.payload.params);
      default:
        return state;
    }
  },
  selectedGameIndex: (state = DEFAULT_SELECTED_GAME_INDEX, action) => {
    switch (action.type) {
      case actions.ROUTER_LOCATION_CHANGED:
        return getSelectedGameIndexFromQueryParams(action.payload.params);
      default:
        return state;
    }
  },
};

export default rootReducer;
