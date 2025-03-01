import path from 'path';
import {fileURLToPath} from 'url';

import dotenv from 'dotenv';

import {ScriptsConfig} from '../models';
import {Logger} from './logger';

const logger = new Logger({isSentryEnabled: false});

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Construct the absolute path to the .env file
const envPath = path.resolve(__dirname, '../../.env');

// Load environment variables from .env file.
const result = dotenv.config({path: envPath});
if (result.error) {
  logger.error('Error loading .env file:', result.error);
  process.exit(1);
}

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
    sentry: {dsn: process.env.SENTRY_DSN, isEnabled: process.env.IS_SENTRY_ENABLED === 'true'},
    openWeather: {apiKey: process.env.OPEN_WEATHER_API_KEY},
  };
}

export function getConfig(): ScriptsConfig {
  const config = parseConfigFromEnv();
  if (!config) {
    throw new Error('Scripts config not found');
  }
  return config;
}
