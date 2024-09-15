import {GameInfo} from '../website/src/models/games.models';

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
  readonly isLatestCompletedGame: boolean;
  readonly completedGameCountForSeason: number;
}

export type AssertContext = Record<string, unknown>;

export type AssertFunc = (statement: boolean, message: string, context?: AssertContext) => void;

export type GenericValidatorFunc<T> = (
  args: {
    readonly currentGameInfo: ExtendedGameInfo;
    readonly assert: AssertFunc;
  } & T
) => void;

export type ValidatorFunc = GenericValidatorFunc<object>;

export type ValidatorFuncWithIgnore = GenericValidatorFunc<{
  readonly ignoredAssert: AssertFunc;
}>;

export type ValidatorFuncWithPreviousGameInfo = GenericValidatorFunc<{
  readonly previousGameInfo: ExtendedGameInfo | null;
}>;

export type ValidatorFuncWithSchedule = GenericValidatorFunc<{
  readonly seasonScheduleData: readonly GameInfo[];
}>;
