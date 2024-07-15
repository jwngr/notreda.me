import {GameInfo} from '../models/games.models';
import {ALL_SEASONS} from './constants';

const schedulesGlob = import.meta.glob('../resources/schedules/*.json');

export class Schedules {
  static getSeasons(): readonly number[] {
    return ALL_SEASONS;
  }

  static async getForSeason(season: number): Promise<readonly GameInfo[]> {
    try {
      const scheduleModule = await schedulesGlob[`../resources/schedules/${season}.json`]();
      return (scheduleModule as {readonly default: readonly GameInfo[]}).default;
    } catch (error) {
      // TODO: Add error logging.
      return [];
    }
  }
}
