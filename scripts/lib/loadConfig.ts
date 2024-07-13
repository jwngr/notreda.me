import configJson from '../../config/config.json';
import {ScriptsConfig} from '../models';

const config = configJson as ScriptsConfig;

export function getConfig(): ScriptsConfig {
  if (!config) {
    throw new Error('Scripts config file not found');
  }

  return config;
}
