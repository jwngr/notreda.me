import {GameInfo, GameLocation} from '../models/games.models';
import {getDateFromGame} from './datetime';

const NOTRE_DAME_STADIUM_LOCATION: GameLocation = {
  city: 'Notre Dame',
  state: 'IN',
  stadium: 'Notre Dame Stadium',
  coordinates: [41.698399, -86.233917],
};

const GREEN_STOCKING_BALL_PARK_DATE = new Date('04/20/1888');

const GREEN_STOCKING_BALL_PARK_LOCATION: GameLocation = {
  city: 'Notre Dame',
  state: 'IN',
  stadium: 'Green Stocking Ball Park',
  coordinates: [41.673784, -86.265854],
};

const CARTIER_FIELD_LOCATION: GameLocation = {
  city: 'Notre Dame',
  state: 'IN',
  stadium: 'Cartier Field',
  coordinates: [41.701239, -86.234417],
};

/**
 * Returns the stadium location for a Notre Dame home game. Given how often these show up in the
 * season data, these are computed dynamically given some simple rules.
 *
 * Historical context:
 * - Green Stocking Ball Park: April 20, 1888 (one game)
 * - Cartier Field: 1887 - 1929
 * - Notre Dame Stadium: 1930 - present (current stadium)
 */
export const getHomeGameLocation = (args: {
  readonly season: number;
  readonly date: Date | 'TBD' | undefined;
}): GameLocation => {
  const {season, date} = args;

  // Future home games without a date are assumed to be at Notre Dame Stadium.
  // TODO: `date` should never be `undefined`. Update types to disallow it.
  if (!date || date === 'TBD') {
    return NOTRE_DAME_STADIUM_LOCATION;
  }

  // Green Stocking Ball Park era: once in 1888.
  if (date.getTime() === GREEN_STOCKING_BALL_PARK_DATE.getTime()) {
    return GREEN_STOCKING_BALL_PARK_LOCATION;
  }

  // Cartier Field era: 1887 - 1929.
  if (season < 1930) {
    return CARTIER_FIELD_LOCATION;
  }

  // Notre Dame Stadium era: 1930 - present.
  return NOTRE_DAME_STADIUM_LOCATION;
};

/**
 * Returns the appropriate location for a game. Not every game has an explicit location, so this
 * function normalizes it.
 */
export const getGameLocation = (args: {
  readonly game: GameInfo;
  readonly season: number;
}): GameLocation | 'TBD' | undefined => {
  const {game, season} = args;

  // Notre Dame home games (non-neutral site) have no stored location, so compute it.
  if (game.isHomeGame && !game.isNeutralSiteGame) {
    const gameDate = getDateFromGame(game.date);
    return getHomeGameLocation({date: gameDate, season});
  }

  // For away games and neutral site games, use the provided location.
  return game.location || 'TBD';
};

/**
 * Formats a game location as a readable string.
 */
export const formatGameLocationAsString = (args: {
  readonly location: GameLocation | 'TBD' | undefined;
  readonly tbdText: string;
}): string => {
  const {location, tbdText} = args;

  if (!location || location === 'TBD') {
    return tbdText;
  }

  // Format as "City, State" or "City, Country".
  return location.state
    ? `${location.city}, ${location.state}`
    : `${location.city}, ${location.country}`;
};
