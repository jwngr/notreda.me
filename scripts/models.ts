export interface ScriptsConfig {
  readonly darkSky: {
    readonly apiKey: string;
  };
  readonly sentry: {
    readonly dsn: string;
    readonly isEnabled: boolean;
  };
}
