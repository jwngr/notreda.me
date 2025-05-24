const DEFAULT_ERROR_MESSAGE = 'An unexpected error occurred';

/**
 * Upgrades an unknown error into a proper `Error` object with the best message possible.
 */
export function upgradeUnknownError(unknownError: unknown): Error {
  // Unknown error is already an `Error` object.
  if (unknownError instanceof Error) {
    return new Error(unknownError.message || DEFAULT_ERROR_MESSAGE, {
      cause: unknownError.cause instanceof Error ? unknownError.cause : unknownError,
    });
  }

  // Unknown error is a string.
  if (typeof unknownError === 'string' && unknownError.length > 0) {
    return new Error(unknownError, {cause: unknownError});
  }

  if (typeof unknownError === 'object' && unknownError !== null) {
    // Unknown error is an object with a `message` property.
    if ('message' in unknownError) {
      return upgradeUnknownError(unknownError.message);
    }

    // Also recursively check the unknown error's `error` property.
    if ('error' in unknownError) {
      return upgradeUnknownError(unknownError.error);
    }
  }

  // Unknown error has an unexpected type.
  let stringifiedError: string;
  try {
    stringifiedError = JSON.stringify(unknownError);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error stringifying unknown error:', error);
    return new Error(
      `Expected error, but caught non-stringifiable object of type ${typeof unknownError}: \`${unknownError}\``,
      {cause: unknownError}
    );
  }

  return new Error(`Expected error, but caught \`${stringifiedError}\` (${typeof unknownError})`, {
    cause: unknownError,
  });
}

/**
 * Adds a prefix to the error message for a known `Error`.
 */
export function prefixError(error: Error, prefix: string): Error {
  const newError = new Error(`${prefix}: ${error.message}`, {
    cause: error.cause instanceof Error ? error.cause : error,
  });
  return newError;
}
