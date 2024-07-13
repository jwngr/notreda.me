import fs from 'fs';
import path from 'path';

import {GameInfo} from '../../website/src/models';
import {ALL_SEASONS, CURRENT_SEASON} from './constants';

// TODO: Dedupe this file with the one in the website package.

const ND_SCHEDULES_DATA_DIRECTORY = path.resolve(
  __dirname,
  '../../website/src/resources/schedules'
);

export function getForSeason(season: number): readonly GameInfo[] {
  try {
    return require(`${ND_SCHEDULES_DATA_DIRECTORY}/${season}.json`);
  } catch (error) {
    // If no file exists for the provided season, either Notre Dame did not play any games that
    // season or it is a future season with no games scheduled yet.
    return [];
  }
}

export function getForCurrentSeason(): readonly GameInfo[] {
  return getForSeason(CURRENT_SEASON);
}

export function updateForSeason(
  season: number,
  seasonScheduleData: readonly GameInfo[]
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      fs.writeFileSync(
        `${ND_SCHEDULES_DATA_DIRECTORY}/${season}.json`,
        JSON.stringify(seasonScheduleData, null, 2)
      );
      // TODO: Run through Prettier.
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

export function updateForCurrentSeason(seasonScheduleData: readonly GameInfo[]): Promise<void> {
  return updateForSeason(CURRENT_SEASON, seasonScheduleData);
}

export async function transformForAllSeasons(
  transform: (gameData: GameInfo, season: number, i: number) => void
): Promise<void> {
  const allSeasonsScheduleData: Record<number, readonly GameInfo[]> = {};

  const updateForSeasonPromises: Promise<void>[] = [];
  ALL_SEASONS.forEach((season) => {
    const seasonScheduleData = getForSeason(season);

    seasonScheduleData.forEach((gameData, i) => {
      transform(gameData, season, i);
    });

    allSeasonsScheduleData[season] = seasonScheduleData;

    updateForSeasonPromises.push(updateForSeason(season, seasonScheduleData));
  });

  await Promise.all(updateForSeasonPromises);
}
