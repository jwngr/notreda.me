import dotenv from 'dotenv';

import {ScriptsConfig} from '../models';

// Load environment variables from .env file.
dotenv.config();

if (!process.env.DARK_SKY_API_KEY) {
  throw new Error('DARK_SKY_API_KEY environment variable is not set.');
}

if (!process.env.SENTRY_DSN) {
  throw new Error('SENTRY_DSN environment variable is not set.');
}

if (!process.env.IS_SENTRY_ENABLED) {
  throw new Error('IS_SENTRY_ENABLED environment variable is not set.');
}

const config: ScriptsConfig = {
  darkSky: {
    apiKey: process.env.DARK_SKY_API_KEY,
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
    isEnabled: process.env.IS_SENTRY_ENABLED === 'true',
  },
};

export function getConfig(): ScriptsConfig {
  if (!config) {
    throw new Error('Scripts config not found');
  }

  return config;
}
