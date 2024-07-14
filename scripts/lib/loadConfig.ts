import dotenv from 'dotenv';

import {ScriptsConfig} from '../models';

// Load environment variables from .env file.
dotenv.config();

function parseConfigFromEnv(): ScriptsConfig {
  if (!process.env.OPEN_WEATHER_API_KEY) {
    throw new Error('OPEN_WEATHER_API_KEY environment variable is not set.');
  }

  if (!process.env.SENTRY_DSN) {
    throw new Error('SENTRY_DSN environment variable is not set.');
  }

  if (!process.env.IS_SENTRY_ENABLED) {
    throw new Error('IS_SENTRY_ENABLED environment variable is not set.');
  }

  return {
    sentry: {
      dsn: process.env.SENTRY_DSN,
      isEnabled: process.env.IS_SENTRY_ENABLED === 'true',
    },
    openWeather: {
      apiKey: process.env.OPEN_WEATHER_API_KEY,
    },
  };
}

export function getConfig(): ScriptsConfig {
  const config = parseConfigFromEnv();
  if (!config) {
    throw new Error('Scripts config not found');
  }
  return config;
}
