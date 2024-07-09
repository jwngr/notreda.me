import {FullSchedule, GameInfo} from '../models';
import scheduleJson from '../resources/schedule.json';

const FULL_SCHEDULE = scheduleJson as FullSchedule;

export class Schedules {
  static getAll(): FullSchedule {
    return FULL_SCHEDULE;
  }

  static getForSeason(season: number): readonly GameInfo[] {
    return FULL_SCHEDULE[season];
  }

  static getSeasons(): readonly number[] {
    return Object.keys(FULL_SCHEDULE).map(Number);
  }
}
