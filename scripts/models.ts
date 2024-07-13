export interface ScriptsConfig {
  readonly darkSky: {
    readonly apiKey: string;
  };
  readonly sentry: {
    readonly dsn: string;
    readonly isEnabled: boolean;
  };
}

export interface FutureGameInfo {
  readonly date: Date | 'TBD';
  readonly isHomeGame: boolean;
  readonly opponentName: string;
  readonly location?: string;
}

export type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};
