import {isAfter} from 'date-fns/isAfter';
import {subDays} from 'date-fns/subDays';

import {GameInfo} from '../models';
import {CURRENT_SEASON} from './constants';
import {Schedules} from './schedules';

const DEFAULT_SELECTED_GAME_INDEX = 0;

export const getSelectedSeasonFromUrlParam = (maybeYearString?: string): number => {
  if (!maybeYearString || maybeYearString.length !== 4) return CURRENT_SEASON;
  const year = Number(maybeYearString);
  const validSeasons = Schedules.getSeasons();
  return isNaN(year) || !validSeasons.includes(year) ? CURRENT_SEASON : year;
};

export const getSelectedGameIndexFromUrlParam = ({
  year,
  maybeWeekString,
  seasonSchedule,
}: {
  readonly year: number;
  readonly maybeWeekString?: string;
  readonly seasonSchedule: readonly GameInfo[] | null;
}): number => {
  const maybeValidWeek = Number(maybeWeekString);

  if (!seasonSchedule) return DEFAULT_SELECTED_GAME_INDEX;

  // Numeric selected game index is provided.
  if (!isNaN(maybeValidWeek)) {
    if (maybeValidWeek <= 0 || maybeValidWeek > seasonSchedule.length) {
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
    const gamesPlayedCount = seasonSchedule.filter((game) => game.result).length;
    if (gamesPlayedCount === 0) {
      // If no games have been played yet, select the default game index.
      return DEFAULT_SELECTED_GAME_INDEX;
    } else if (gamesPlayedCount === seasonSchedule.length) {
      // If all games have already played, select the last game.
      return seasonSchedule.length - 1;
    } else if (seasonSchedule[gamesPlayedCount].isBowlGame) {
      // If the next upcoming game is a bowl game, select it.
      return gamesPlayedCount;
    } else {
      // Otherwise, select the latest completed game until the Wednesday before the next game, at
      // which point, select the next game.
      // TODO: remove date or fullDate once these are all standardized.
      const nextCompletedGameDate =
        seasonSchedule[gamesPlayedCount].date || seasonSchedule[gamesPlayedCount].fullDate;
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
