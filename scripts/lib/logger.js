const chalk = require('chalk');

const red = chalk.bold.red;
const black = chalk.bold.black;
const green = chalk.bold.green;
const yellow = chalk.bold.yellow;

const _log = (message, data, color) => {
  if (typeof data === 'undefined') {
    // eslint-disable-next-line no-console
    console.log(color(message));
  } else {
    // eslint-disable-next-line no-console
    console.log(color(message), data);
  }
};

module.exports.info = (message, data) => {
  _log(`[INFO] ${message}`, data, black);
};

module.exports.warning = (message, data) => {
  _log(`[WARNING] ${message}`, data, yellow);
};

module.exports.error = (message, data) => {
  _log(`[ERROR] ${message}`, data, red);
};

module.exports.success = (message, data) => {
  _log(`[SUCCESS] ${message}`, data, green);
};

module.exports.todo = (message, data) => {
  _log(`[TODO] ${message}`, data, red);
};

module.exports.fail = (message, data) => {
  _log(`[FAIL] ${message}`, data, red);
};

module.exports.newline = (numNewLines = 1) => {
  for (let i = 0; i < numNewLines; i++) {
    // eslint-disable-next-line no-console
    console.log();
  }
};
