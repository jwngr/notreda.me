import {GameInfo, GameLocation, GameWeather} from '../../website/src/models/games.models';
import {TeamId} from '../../website/src/models/teams.models';
import {Writable} from '../../website/src/models/utils.models';
import {ALL_SEASONS, CURRENT_SEASON} from '../lib/constants';
import {getDateFromGame} from '../lib/datetime';
import {Logger} from '../lib/logger';
import {NDSchedules} from '../lib/ndSchedules';
import {Weather} from '../lib/weather';

const logger = new Logger({isSentryEnabled: false});

async function fetchWeatherForGame(args: {
  readonly opponentId: TeamId;
  readonly location: GameLocation;
  readonly timestampSec: number;
  readonly season: number;
}): Promise<GameWeather | null> {
  const {opponentId, location, timestampSec, season} = args;

  logger.info(`Fetching weather for ${opponentId} ${season}...`);

  const gameWeather = await Weather.fetchForHistoricalGame({
    latitude: location.coordinates[0],
    longitude: location.coordinates[1],
    timestamp: timestampSec,
  });

  logger.info(`Weather fetched for ${opponentId} ${season}...`);
  return gameWeather;
}

async function main(): Promise<void> {
  logger.info('Updating weather for historical games...');

  const allFetchWeatherPromises: Promise<void>[] = [];
  for (const season of ALL_SEASONS) {
    // Only run this on the current season since all historical seasons already have weather. Keep
    // the loop around so it's easy to re-run on older data if we need to.
    if (season !== CURRENT_SEASON) continue;

    const seasonScheduleData = await NDSchedules.getForSeason(season);
    const seasonFetchWeatherPromises: Promise<GameWeather | null>[] = seasonScheduleData.map(
      async (gameInfo) => {
        const date = getDateFromGame(gameInfo.date);

        // Skip games that should not have weather or already have weather.
        if (
          !gameInfo.result ||
          !gameInfo.location ||
          gameInfo.location === 'TBD' ||
          date === 'TBD' ||
          gameInfo.weather
        ) {
          logger.info(`Skipping game ${gameInfo.opponentId} ${season}...`);
          return null;
        }

        return fetchWeatherForGame({
          opponentId: gameInfo.opponentId,
          location: gameInfo.location,
          timestampSec: date.getTime() / 1000,
          season,
        });
      }
    );

    allFetchWeatherPromises.push(
      Promise.all(seasonFetchWeatherPromises).then(async (seasonWeatherData) => {
        const hasUpdatedWeather = seasonWeatherData.some((gameWeather) => gameWeather);
        if (!hasUpdatedWeather) {
          logger.info(`Skipping season ${season}...`);
          return;
        }

        // Over-write the weather for each game in the season for which we have updated weather.
        seasonScheduleData.forEach((gameInfo, index) => {
          const gameWeatherData = seasonWeatherData[index];
          if (gameWeatherData !== null) {
            (gameInfo as Writable<GameInfo>).weather = gameWeatherData;
          }
        });

        await NDSchedules.updateForSeason(season, seasonScheduleData);
        logger.info(`Updated weather for season ${season}...`);
      })
    );
  }

  try {
    await Promise.all(allFetchWeatherPromises);
    logger.success('Updated weather for historical games!');
  } catch (error) {
    logger.error('Failed to update weather for historical games', {error});
    process.exit(1);
  }
}

main();
