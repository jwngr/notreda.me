import sentry, {Severity} from '@sentry/node';
import chalk, {ChalkInstance} from 'chalk';

interface LoggerConfig {
  readonly isSentryEnabled: boolean;
}

export class Logger {
  constructor(private readonly isSentryEnabled: LoggerConfig) {}

  private logInternal(
    message: string,
    data?: object | undefined,
    color: ChalkInstance = chalk.bold.black
  ): void {
    if (typeof data === 'undefined') {
      // eslint-disable-next-line no-console
      console.log(color(message));
    } else {
      // eslint-disable-next-line no-console
      console.log(color(message), data);
    }
  }

  private logToSentry(message: string, level: Severity.Warning | Severity.Error): void {
    if (this.isSentryEnabled) {
      sentry.captureMessage(message, level);
    }
  }

  /** Passthrough to `console.log`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public log(...args: any[]): void {
    // eslint-disable-next-line no-console
    console.log(...args);
  }

  public info(message: string, data?: object): void {
    this.logInternal(`[INFO] ${message}`, data, chalk.bold.black);
  }

  public warning(message: string, data?: object): void {
    this.logInternal(`[WARNING] ${message}`, data, chalk.bold.yellow);
    this.logToSentry(message, Severity.Warning);
  }

  public error(message: string, data?: object): void {
    this.logInternal(`[ERROR] ${message}`, data, chalk.bold.red);
    this.logToSentry(message, Severity.Error);
  }

  public success(message: string, data?: object): void {
    this.logInternal(`[SUCCESS] ${message}`, data, chalk.bold.green);
  }

  public fail(message: string, data?: object): void {
    this.logInternal(`[FAIL] ${message}`, data, chalk.bold.red);
    this.logToSentry(message, Severity.Error);
  }

  public newline(numNewLines = 1): void {
    for (let i = 0; i < numNewLines; i++) {
      // eslint-disable-next-line no-console
      console.log();
    }
  }
}
