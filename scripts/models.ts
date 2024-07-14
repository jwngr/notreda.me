export interface ScriptsConfig {
  readonly sentry: {
    readonly dsn: string;
    readonly isEnabled: boolean;
  };
  readonly openWeather: {
    readonly apiKey: string;
  };
}
