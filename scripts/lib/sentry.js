const _ = require('lodash');
var sentry = require('@sentry/node');

const logger = require('./logger');
const config = require('./loadConfig');

const SENTRY_DSN = _.get(config, 'sentry.dsn');
const IS_SENTRY_ENABLED = _.get(config, 'sentry.isEnabled');

let _isSentryInitialized = false;

module.exports.initialize = () => {
  if (typeof IS_SENTRY_ENABLED === 'undefined') {
    throw new Error('Provided config file does not specify whether or not Sentry is enabled.');
  }

  if (IS_SENTRY_ENABLED && !_isSentryInitialized) {
    if (typeof SENTRY_DSN === 'undefined') {
      throw new Error('Provided config file does not contain a Sentry DSN.');
    }

    sentry.init({
      dsn: SENTRY_DSN,
    });

    _isSentryInitialized = true;

    logger.info('Initialized Sentry error monitoring.');
  }
};

module.exports.captureMessage = (message, level) => {
  logger[level](message);
  if (_isSentryInitialized) {
    sentry.captureMessage(message, level);
  }
};
