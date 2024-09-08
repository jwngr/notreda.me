import fs from 'fs/promises';
import path from 'path';
import {fileURLToPath} from 'url';

import prettier from 'prettier';

import {GameInfo} from '../../website/src/models/games.models';
import {ALL_SEASONS, CURRENT_SEASON} from './constants';

// Get the current file's URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the ND_SCHEDULES_DATA_DIRECTORY relative to the current file
const ND_SCHEDULES_DATA_DIRECTORY = path.resolve(
  __dirname,
  '../../website/src/resources/schedules'
);

// TODO: De-dupe this with `Schedules` class in `website/src`.
export class NDSchedules {
  static async getForSeason(season: number): Promise<readonly GameInfo[]> {
    try {
      const data = await fs.readFile(`${ND_SCHEDULES_DATA_DIRECTORY}/${season}.json`, 'utf-8');
      return JSON.parse(data) as readonly GameInfo[];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // If no file exists for the provided season, either Notre Dame did not play any games that
      // season or it is a future season with no games scheduled yet.
      return [];
    }
  }

  static async getForCurrentSeason(): Promise<readonly GameInfo[]> {
    return this.getForSeason(CURRENT_SEASON);
  }

  static async updateForSeason(
    season: number,
    seasonScheduleData: readonly GameInfo[]
  ): Promise<void> {
    const filePath = `${ND_SCHEDULES_DATA_DIRECTORY}/${season}.json`;
    const jsonData = JSON.stringify(seasonScheduleData, null, 2);
    const formattedData = await prettier.format(jsonData, {parser: 'json'});

    await fs.writeFile(filePath, formattedData);
  }

  static async updateForCurrentSeason(seasonScheduleData: readonly GameInfo[]): Promise<void> {
    return this.updateForSeason(CURRENT_SEASON, seasonScheduleData);
  }

  static async transformForAllSeasons(
    transform: (gameData: GameInfo, season: number, i: number) => void
  ): Promise<void> {
    const allSeasonsScheduleData: Record<number, readonly GameInfo[]> = {};

    const updateForSeasonPromises: Promise<void>[] = [];
    for (const season of ALL_SEASONS) {
      const seasonScheduleData = await this.getForSeason(season);

      seasonScheduleData.forEach((gameData, i) => {
        transform(gameData, season, i);
      });

      allSeasonsScheduleData[season] = seasonScheduleData;

      updateForSeasonPromises.push(this.updateForSeason(season, seasonScheduleData));
    }

    await Promise.all(updateForSeasonPromises);
  }
}
