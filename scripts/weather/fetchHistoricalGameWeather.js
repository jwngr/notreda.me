import _ from 'lodash';

import {getForSeason, updateForSeason} from '../../website/src/resources/schedules';
import {ALL_SEASONS, CURRENT_SEASON} from '../lib/constants';
import {Logger} from '../lib/logger';
import utils from '../lib/utils';
import weather from '../lib/weather';

Logger.info('Updating weather for historical games...');

const fetchWeatherPromises = [];
ALL_SEASONS.forEach((season) => {
  const seasonScheduleData = getForSeason(season);
  let currentSeasonFetchWeatherPromises = [];

  _.forEach(seasonScheduleData, (gameData) => {
    if (gameData.result && !gameData.weather && season === CURRENT_SEASON) {
      const [lat, lon] = gameData.location.coordinates;

      const timestamp = utils.getGameTimestampInSeconds(gameData);
      currentSeasonFetchWeatherPromises.push(
        weather
          .fetchForGame([lat, lon], utils.getGameTimestampInSeconds(gameData))
          .then((weather) => {
            if (!weather.temperature) {
              Logger.warning('NO FORECAST!', {
                season,
                opponentId: gameData.opponentId,
                location: gameData.location.city + ', ' + gameData.location.state,
                timestamp,
              });
            } else {
              weather.icon = weather.icon || 'unknown';
              gameData.weather = weather;
            }
          })
      );
    }
  });

  fetchWeatherPromises.push(
    Promise.all(currentSeasonFetchWeatherPromises).then(() => {
      updateForSeason(season, seasonScheduleData);
    })
  );
});

Promise.all(fetchWeatherPromises)
  .then(() => {
    Logger.success('Updated weather for historical games!');
  })
  .catch((error) => {
    Logger.error('Failed to update weather for historical games', {error});
  });
