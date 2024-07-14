import axios from 'axios';
import _ from 'lodash';

import {getConfig} from './loadConfig';
import {Logger} from './logger';

const config = getConfig();
const logger = new Logger({isSentryEnabled: false});

const DARK_SKY_API_HOST = 'https://api.darksky.net';

const DARK_SKY_API_KEY = _.get(config, 'darkSky.apiKey');
if (typeof DARK_SKY_API_KEY === 'undefined') {
  logger.error('Provided config file does not contain a Dark Sky API key.');
  process.exit(-1);
}

module.exports.fetchForGame = ([latitude, longitude], kickoffTimeInSeconds) => {
  let errorMessage;
  if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
    errorMessage = 'Latitude must be a number between -90 and 90.';
  } else if (typeof latitude !== 'number' || longitude < -180 || longitude > 180) {
    errorMessage = 'Longitude must be a number between -180 and 180.';
  } else if (typeof kickoffTimeInSeconds !== 'number') {
    errorMessage = 'Timestamp must be a number.';
  }

  if (typeof errorMessage !== 'undefined') {
    throw new Error(`Invalid argument passed to fetchForecast(): ${errorMessage}`);
  }

  // Handle the forecast request differently depending on whether or not the timestamp is in the
  // past or future.
  let isHistoricalForecastRequest = new Date(kickoffTimeInSeconds * 1000) < Date.now();

  let url = `${DARK_SKY_API_HOST}/forecast/${DARK_SKY_API_KEY}/${latitude},${longitude}`;
  const params = {};
  if (isHistoricalForecastRequest) {
    params.exclude = 'minutely,hourly,daily';
    url += `,${kickoffTimeInSeconds}`;
  } else {
    params.exclude = 'currently,minutely,daily';
    params.extend = 'hourly';
  }

  return axios({
    url,
    params,
    method: 'GET',
    headers: {
      'Accept-Encoding': 'gzip',
    },
  })
    .then((response) => {
      const forecast = response.data;

      let chosenForecast;
      if (isHistoricalForecastRequest) {
        // For historical games, simply get the current weather forecast since it will exactly match
        // the provided timestamp.
        chosenForecast = forecast.currently;
      } else {
        // For future games, find the hourly forecast closest to the proivded timestamp.
        let closestHourlyForecast = null;
        _.forEach(forecast.hourly.data, (currentHourlyForecast) => {
          const currentTimeDistance = Math.abs(kickoffTimeInSeconds - currentHourlyForecast.time);
          const closestHourlyForecastTimeDistance =
            closestHourlyForecast === null
              ? Infinity
              : Math.abs(kickoffTimeInSeconds - closestHourlyForecast.time);

          if (currentTimeDistance < closestHourlyForecastTimeDistance) {
            closestHourlyForecast = currentHourlyForecast;
          }
        });

        chosenForecast = closestHourlyForecast;
      }

      // Pull the icon and temperature from the chosen forecast.
      const weather = _.pick(chosenForecast, ['icon', 'temperature']);
      weather.temperature = 'temperature' in weather && Math.round(weather.temperature);

      // Log a warning if any data is missing.
      let warning;
      if (_.size(weather) === 0) {
        warning = 'No weather found.';
      } else if (typeof weather.icon === 'undefined') {
        warning = 'Weather icon not found.';
      } else if (typeof weather.temperature === 'undefined') {
        warning = 'Weather temperature not found.';
      }

      if (typeof warning !== 'undefined') {
        logger.warning(warning, {latitude, longitude, kickoffTimeInSeconds});
      }

      return weather;
    })
    .catch((error) => {
      throw new Error(error.response.data.message || error.response.data.error);
    });
};
