const axios = require('axios');

const logger = require('../lib/logger');

const OPEN_WEATHER_MAP_API_HOST = 'https://api.openweathermap.org';

const OPEN_WEATHER_MAP_API_KEY = process.env.OPEN_WEATHER_MAP_API_KEY;
if (typeof OPEN_WEATHER_MAP_API_KEY === 'undefined') {
  logger.error('You must set the OPEN_WEATHER_MAP_API_KEY environment variable.');
  process.exit(-1);
}

const _fetchWeatherEndpoint = async (endpoint, options = {}) => {
  const requestOptions = {
    method: options.method || 'GET',
    url: `${OPEN_WEATHER_MAP_API_HOST}${endpoint}`,
  };

  if (typeof options.queryParams !== 'undefined') {
    requestOptions.params = options.queryParams;
  }

  if (typeof options.postBody !== 'undefined') {
    requestOptions.data = options.postBody;
  }

  if (typeof options.headers !== 'undefined') {
    requestOptions.headers = options.headers;
  }

  return axios(requestOptions)
    .then((response) => response.data)
    .catch((error) => {
      throw new Error(error.response.data.message);
    });
};

module.exports.fetchForecastByCityId = (openWeatherMapCityId) => {
  return _fetchWeatherEndpoint('/data/2.5/forecast', {
    queryParams: {
      id: openWeatherMapCityId,
      appid: OPEN_WEATHER_MAP_API_KEY,
    }
  })
}
