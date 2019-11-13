const chalk = require('chalk');

const red = chalk.bold.red;
const black = chalk.bold.black;
const green = chalk.bold.green;
const orange = chalk.bold.yellow;

const _log = (message, data, color) => {
  if (typeof data === 'undefined') {
    console.log(color(message));
  } else {
    console.log(color(message), data);
  }
};

module.exports.info = (message, data) => {
  _log(`[INFO] ${message}`, data, black);
};

module.exports.warning = (message, data) => {
  _log(`[WARNING] ${message}`, data, orange);
};

module.exports.error = (message, data) => {
  _log(`[ERROR] ${message}`, data, red);
};

module.exports.success = (message, data) => {
  _log(`[SUCCESS] ${message}`, data, green);
};
