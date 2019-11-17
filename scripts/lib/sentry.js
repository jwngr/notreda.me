const _ = require('lodash');
var sentry = require('@sentry/node');

const logger = require('./logger');
const config = require('./loadConfig');

let _isSentryInitialized = false;

module.exports.initialize = () => {
  if (process.env.NODE_ENV !== 'production' && !_isSentryInitialized) {
    const SENTRY_DSN = _.get(config, 'sentry.dsn');
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
  if (_isSentryInitialized) {
    sentry.captureMessage(message, level);
  }
};
