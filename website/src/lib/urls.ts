import {isAfter} from 'date-fns/isAfter';
import {subDays} from 'date-fns/subDays';
import _ from 'lodash';

import {FullSchedule} from '../models';
import scheduleJson from '../resources/schedule.json';
import {CURRENT_SEASON} from './constants';

const schedule = scheduleJson as FullSchedule;

const DEFAULT_SELECTED_GAME_INDEX = 0;

export const getSelectedSeasonFromUrlParam = (maybeYearString?: string): number => {
  if (!maybeYearString || maybeYearString.length !== 4) return CURRENT_SEASON;
  const year = Number(maybeYearString);
  return isNaN(year) || !_.has(schedule, year) ? CURRENT_SEASON : year;
};

export const getSelectedGameIndexFromUrlParam = (
  year: number,
  maybeWeekString?: string
): number => {
  const maybeValidWeek = Number(maybeWeekString);
  // Numeric selected game index is provided.
  if (!isNaN(maybeValidWeek)) {
    if (maybeValidWeek <= 0 || maybeValidWeek > schedule[year].length) {
      // If the selected game index is invalid for this year, use the default selected game index.
      return DEFAULT_SELECTED_GAME_INDEX;
    } else {
      // Otherwise, subtract one from the selected game index in the URL since they are 1-based, not
      // 0-based.
      return maybeValidWeek - 1;
    }
  }

  // No selected game index or a non-numeric game index is provided.
  if (year !== CURRENT_SEASON) {
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
    } else if (schedule[year][gamesPlayedCount].isBowlGame) {
      // If the next upcoming game is a bowl game, select it.
      return gamesPlayedCount;
    } else {
      // Otherwise, select the latest completed game until the Wednesday before the next game, at
      // which point, select the next game.
      // TODO: remove date or fullDate once these are all standardized.
      const nextCompletedGameDate =
        schedule[year][gamesPlayedCount].date || schedule[year][gamesPlayedCount].fullDate;
      if (!nextCompletedGameDate) {
        return gamesPlayedCount;
      }
      const wednesdayBeforeNextGameDate = subDays(new Date(nextCompletedGameDate), 4);
      if (isAfter(new Date(), wednesdayBeforeNextGameDate)) {
        return gamesPlayedCount;
      } else {
        return gamesPlayedCount - 1;
      }
    }
  }
};