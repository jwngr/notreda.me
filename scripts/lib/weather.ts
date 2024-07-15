import axios, {AxiosResponse} from 'axios';

import {GameWeather} from '../../website/src/models';
import {getConfig} from './loadConfig';

const config = getConfig();

const OPEN_WEATHER_API_HOST = 'https://api.openweathermap.org';

interface OpenWeatherRequestParams {
  readonly lat: string;
  readonly lon: string;
  readonly appid: string;
  readonly dt?: string;
  readonly exclude?: string;
  readonly units?: 'standard' | 'metric' | 'imperial';
  readonly lang?: string;
}

interface OpenWeatherWeatherForecast {
  readonly dt: number;
  readonly temp: number;
  readonly weather: {
    readonly icon: string;
  }[];
}

interface OpenWeatherForecastResponse {
  readonly lat: number;
  readonly lon: number;
  readonly timezone: string;
  readonly timezone_offset: number;
  readonly data: readonly OpenWeatherWeatherForecast[];
  readonly minutely: readonly OpenWeatherWeatherForecast[];
  readonly hourly: readonly OpenWeatherWeatherForecast[];
  readonly daily: readonly OpenWeatherWeatherForecast[];
}

export class Weather {
  static async fetchForCoordinates({
    latitude,
    longitude,
    timestamp,
  }: {
    readonly latitude: number;
    readonly longitude: number;
    readonly timestamp: number;
  }): Promise<GameWeather | null> {
    let errorMessage: string | undefined;
    if (latitude < -90 || latitude > 90) {
      errorMessage = 'Latitude must be a number between -90 and 90.';
    } else if (longitude < -180 || longitude > 180) {
      errorMessage = 'Longitude must be a number between -180 and 180.';
    }

    if (errorMessage) {
      throw new Error(`Invalid argument passed to fetchForecast(): ${errorMessage}`);
    }

    // Past and future forecast are handled differently to get as accurate data as possible.
    const isHistoricalForecastRequest = new Date(timestamp * 1000).getTime() < Date.now();

    const params: OpenWeatherRequestParams = {
      dt: timestamp.toString(),
      lat: latitude.toString(),
      lon: longitude.toString(),
      units: 'imperial',
      appid: config.openWeather.apiKey,
      exclude: isHistoricalForecastRequest
        ? 'current,minutely,daily'
        : 'current,minutely,hourly,daily',
    };

    const response = await axios({
      url: `${OPEN_WEATHER_API_HOST}/data/3.0/onecall/timemachine`,
      params,
      method: 'GET',
      headers: {
        'Accept-Encoding': 'gzip',
      },
    });

    const forecast: OpenWeatherForecastResponse = response.data;

    let chosenForecast: OpenWeatherWeatherForecast | null;
    if (isHistoricalForecastRequest) {
      // For historical games, get the current weather forecast as it will exactly match the
      // provided timestamp.
      chosenForecast = forecast.data[0];
    } else {
      // For future games, find the hourly forecast closest to the provided timestamp.
      let closestHourlyForecast: OpenWeatherWeatherForecast | null = null;
      forecast.hourly.forEach((currentHourlyForecast) => {
        const currentTimeDistance = Math.abs(timestamp - currentHourlyForecast.dt);
        const closestHourlyForecastTimeDistance =
          closestHourlyForecast === null
            ? Infinity
            : Math.abs(timestamp - closestHourlyForecast.dt);

        if (currentTimeDistance < closestHourlyForecastTimeDistance) {
          closestHourlyForecast = currentHourlyForecast;
        }
      });

      chosenForecast = closestHourlyForecast;
    }

    if (!chosenForecast) {
      return null;
    }

    return {
      icon: chosenForecast.weather[0].icon,
      temperature: Math.round(chosenForecast.temp),
    };
  }

  private static validateLatitude(latitude: number): void {
    if (latitude < -90 || latitude > 90) {
      throw new Error('Latitude must be a number between -90 and 90.');
    }
  }

  private static validateLongitude(longitude: number): void {
    if (longitude < -180 || longitude > 180) {
      throw new Error('Longitude must be a number between -180 and 180.');
    }
  }

  private static parseOpenWeatherResponse(
    response: AxiosResponse<OpenWeatherForecastResponse>
  ): OpenWeatherForecastResponse {
    return response.data;
  }

  static async fetchForHistoricalGame({
    latitude,
    longitude,
    timestamp,
  }: {
    readonly latitude: number;
    readonly longitude: number;
    readonly timestamp: number;
  }): Promise<GameWeather> {
    this.validateLatitude(latitude);
    this.validateLongitude(longitude);

    const params: OpenWeatherRequestParams = {
      dt: timestamp.toString(),
      lat: latitude.toString(),
      lon: longitude.toString(),
      units: 'imperial',
      appid: config.openWeather.apiKey,
      exclude: 'current,minutely,daily',
    };

    const response = await axios({
      url: `${OPEN_WEATHER_API_HOST}/data/3.0/onecall/timemachine`,
      params,
      method: 'GET',
      headers: {
        'Accept-Encoding': 'gzip',
      },
    });

    const responseData = this.parseOpenWeatherResponse(response);
    const chosenForecast = responseData.data[0];

    return {
      icon: chosenForecast.weather[0].icon,
      temperature: Math.round(chosenForecast.temp),
    };
  }

  static async fetchForFutureGame({
    latitude,
    longitude,
    timestamp,
  }: {
    readonly latitude: number;
    readonly longitude: number;
    readonly timestamp: number;
  }): Promise<GameWeather> {
    this.validateLatitude(latitude);
    this.validateLongitude(longitude);

    const params: OpenWeatherRequestParams = {
      dt: timestamp.toString(),
      lat: latitude.toString(),
      lon: longitude.toString(),
      units: 'imperial',
      appid: config.openWeather.apiKey,
      exclude: 'current,minutely,hourly,daily',
    };

    const response = await axios({
      url: `${OPEN_WEATHER_API_HOST}/data/3.0/onecall/timemachine`,
      params,
      method: 'GET',
      headers: {
        'Accept-Encoding': 'gzip',
      },
    });

    const responseData = this.parseOpenWeatherResponse(response);

    // For future games, find the hourly forecast closest to the provided timestamp.
    let closestHourlyForecast: OpenWeatherWeatherForecast | undefined;
    responseData.hourly.forEach((currentHourlyForecast) => {
      const currentTimeDistance = Math.abs(timestamp - currentHourlyForecast.dt);
      const closestHourlyForecastTimeDistance = closestHourlyForecast
        ? Math.abs(timestamp - closestHourlyForecast.dt)
        : Infinity;

      if (currentTimeDistance < closestHourlyForecastTimeDistance) {
        closestHourlyForecast = currentHourlyForecast;
      }
    });

    if (!closestHourlyForecast) {
      throw new Error('No weather forecast found for future game.');
    }

    return {
      icon: closestHourlyForecast.weather[0].icon,
      temperature: Math.round(closestHourlyForecast.temp),
    };
  }
}
