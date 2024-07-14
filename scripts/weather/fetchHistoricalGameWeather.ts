import {GameInfo, GameWeather} from '../../website/src/models';
import {ALL_SEASONS, CURRENT_SEASON} from '../lib/constants';
import {Logger} from '../lib/logger';
import {getForSeason, updateForSeason} from '../lib/ndSchedules';
import {getGameTimestampInSeconds} from '../lib/utils';
import {Weather} from '../lib/weather';

const logger = new Logger({isSentryEnabled: false});

async function fetchWeatherFromGameInfo(gameInfo: GameInfo): Promise<GameWeather | null> {
  if (gameInfo.location === 'TBD') return null;
  const timestamp = getGameTimestampInSeconds(gameInfo);
  return await Weather.fetchForCoordinates({
    latitude: gameInfo.location.coordinates[0],
    longitude: gameInfo.location.coordinates[1],
    timestamp: timestamp,
  });
}

async function fetchHistoricalGameWeather(): Promise<void> {
  logger.info('Updating weather for historical games...');

  const fetchWeatherPromises: Promise<void>[] = [];
  ALL_SEASONS.forEach(async (season) => {
    const seasonScheduleData = await getForSeason(season);
    const currentSeasonFetchWeatherPromises: Promise<GameWeather | null>[] = [];

    seasonScheduleData.forEach((gameInfo) => {
      if (
        gameInfo.result &&
        gameInfo.location !== 'TBD' &&
        // !gameInfo.weather &&
        season === CURRENT_SEASON
      ) {
        logger.info(`Fetching weather for ${gameInfo.opponentId} ${season}...`);
        currentSeasonFetchWeatherPromises.push(fetchWeatherFromGameInfo(gameInfo));
      }
    });

    if (currentSeasonFetchWeatherPromises.length === 0) return;

    fetchWeatherPromises.push(
      Promise.all(currentSeasonFetchWeatherPromises).then(() => {
        logger.info(`Weather fetched for ${season}.`);
        logger.info(`Updating ${season} schedule...`);
        updateForSeason(season, seasonScheduleData);
      })
    );
  });

  try {
    await Promise.all(fetchWeatherPromises);
    logger.success('Updated weather for historical games!');
  } catch (error) {
    logger.error('Failed to update weather for historical games', {error});
  }
}

fetchHistoricalGameWeather();
