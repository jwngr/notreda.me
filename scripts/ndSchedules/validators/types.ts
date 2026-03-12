export type AssertFn = (
  statement: boolean,
  message: string,
  extraContext?: Record<string, unknown>
) => void;

export type IgnoredAssertFn = (
  statement: boolean,
  message: string,
  extraContext?: Record<string, unknown>
) => void;
