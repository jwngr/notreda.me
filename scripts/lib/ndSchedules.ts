import fs from 'fs/promises';
import path from 'path';
import {fileURLToPath} from 'url';

import prettier from 'prettier';

import {GameInfo} from '../../website/src/models';
import {ALL_SEASONS, CURRENT_SEASON} from './constants';

// Get the current file's URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the ND_SCHEDULES_DATA_DIRECTORY relative to the current file
const ND_SCHEDULES_DATA_DIRECTORY = path.resolve(
  __dirname,
  '../../website/src/resources/schedules'
);

export async function getForSeason(season: number): Promise<readonly GameInfo[]> {
  try {
    const data = await fs.readFile(`${ND_SCHEDULES_DATA_DIRECTORY}/${season}.json`, 'utf-8');
    return JSON.parse(data) as readonly GameInfo[];
  } catch (error) {
    // If no file exists for the provided season, either Notre Dame did not play any games that
    // season or it is a future season with no games scheduled yet.
    return [];
  }
}

export async function getForCurrentSeason(): Promise<readonly GameInfo[]> {
  return getForSeason(CURRENT_SEASON);
}

export async function updateForSeason(
  season: number,
  seasonScheduleData: readonly GameInfo[]
): Promise<void> {
  const filePath = `${ND_SCHEDULES_DATA_DIRECTORY}/${season}.json`;
  const jsonData = JSON.stringify(seasonScheduleData, null, 2);
  const formattedData = await prettier.format(jsonData, {parser: 'json'});

  await fs.writeFile(filePath, formattedData);
}

export async function updateForCurrentSeason(
  seasonScheduleData: readonly GameInfo[]
): Promise<void> {
  return updateForSeason(CURRENT_SEASON, seasonScheduleData);
}

export async function transformForAllSeasons(
  transform: (gameData: GameInfo, season: number, i: number) => void
): Promise<void> {
  const allSeasonsScheduleData: Record<number, readonly GameInfo[]> = {};

  const updateForSeasonPromises: Promise<void>[] = [];
  for (const season of ALL_SEASONS) {
    const seasonScheduleData = await getForSeason(season);

    seasonScheduleData.forEach((gameData, i) => {
      transform(gameData, season, i);
    });

    allSeasonsScheduleData[season] = seasonScheduleData;

    updateForSeasonPromises.push(updateForSeason(season, seasonScheduleData));
  }

  await Promise.all(updateForSeasonPromises);
}
