import {bold, Chalk} from 'chalk';

function _log(message: string, data: object, color: Chalk) {
  if (typeof data === 'undefined') {
    // eslint-disable-next-line no-console
    console.log(color(message));
  } else {
    // eslint-disable-next-line no-console
    console.log(color(message), data);
  }
}

export class Logger {
  /** Passthrough to `console.log`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static log(...args: any[]) {
    // eslint-disable-next-line no-console
    console.log(...args);
  }

  static info(message: string, data: object) {
    _log(`[INFO] ${message}`, data, bold.black);
  }

  static warning(message: string, data: object) {
    _log(`[WARNING] ${message}`, data, bold.yellow);
  }

  static error(message: string, data: object) {
    _log(`[ERROR] ${message}`, data, bold.red);
  }

  static success(message: string, data: object) {
    _log(`[SUCCESS] ${message}`, data, bold.green);
  }

  static fail(message: string, data: object) {
    _log(`[FAIL] ${message}`, data, bold.red);
  }

  static newline(numNewLines = 1) {
    for (let i = 0; i < numNewLines; i++) {
      // eslint-disable-next-line no-console
      console.log();
    }
  }
}
