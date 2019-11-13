const _ = require('lodash');
const axios = require('axios');

const logger = require('./logger');
const config = require('./loadConfig');

const DARK_SKY_API_HOST = 'https://api.darksky.net';

const DARK_SKY_API_KEY = _.get(config, 'darkSky.apiKey');
if (typeof DARK_SKY_API_KEY === 'undefined') {
  logger.error('Provided config file does not contain a Dark Sky API key.');
  process.exit(-1);
}

module.exports.fetchForecast = ([latitude, longitude], timestampInSeconds) => {
  // Handle the forecast request differently depending on whether or not the timestamp is in the
  // past or future.
  let isHistoricalForecastRequest = new Date(timestampInSeconds * 1000) < Date.now();

  let url = `${DARK_SKY_API_HOST}/forecast/${DARK_SKY_API_KEY}/${latitude},${longitude}`;
  const params = {};
  if (isHistoricalForecastRequest) {
    params.exclude = 'minutely,hourly,daily';
    url += `,${timestampInSeconds}`;
  } else {
    params.exclude = 'minutely';
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

      let weather;
      if (isHistoricalForecastRequest) {
        weather = _.pick(forecast.currently, ['icon', 'temperature']);
      } else {
        // TODO: handle date for future games to get the right hour.
        weather = _.pick(forecast.currently, ['icon', 'temperature']);
      }

      // TODO: handle forecasts which have no icon nor temperature.

      return weather;
    })
    .catch((error) => {
      console.log(error);
      throw new Error(error.response.data.message || error.response.data.error);
    });
};

module.exports.fetchHistoricalForecast = ([latitude, longitude], timestamp) => {
  // TODO: handle date.
  return axios({
    method: 'GET',
    url: `${DARK_SKY_API_HOST}/forecast/${DARK_SKY_API_KEY}/${latitude},${longitude}`,
    headers: {
      'Accept-Encoding': 'gzip',
    },
    params: {
      exclude: 'minutely',
      extend: 'hourly',
    },
  })
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
      throw new Error(error.response.data.message || error.response.data.error);
    });
};
