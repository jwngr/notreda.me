import {GameInfo} from '../website/src/models';

export interface ScriptsConfig {
  readonly sentry: {
    readonly dsn: string;
    readonly isEnabled: boolean;
  };
  readonly openWeather: {
    readonly apiKey: string;
  };
}

export interface ExtendedGameInfo extends GameInfo {
  readonly season: number;
  readonly weekIndex: number;
  readonly isGameOver: boolean;
  readonly isNextUnplayedGame: boolean;
  readonly isLatestGameCompletedGame: boolean;
  readonly completedGameCountForSeason: number;
}
