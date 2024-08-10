import {GameInfo} from '../models/games.models';
import {ALL_SEASONS} from './constants';

const schedulesGlob = import.meta.glob('../resources/schedules/*.json');

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Schedules {
  static getSeasons(): readonly number[] {
    return ALL_SEASONS;
  }

  static async getForSeason(season: number): Promise<readonly GameInfo[]> {
    try {
      const scheduleModule = await schedulesGlob[`../resources/schedules/${season}.json`]();
      return (scheduleModule as {readonly default: readonly GameInfo[]}).default;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // TODO: Add error logging.
      return [];
    }
  }
}
