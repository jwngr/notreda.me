const _ = require('lodash');

export function validateDate([currentGameData, previousGameData], assert) {
  const wrappedAssert = (statement, message) => {
    assert(statement, message, _.pick(currentGameData, ['date', 'time', 'fullDate']));
  };

  const currentGameDate =
    currentGameData.date === 'TBD'
      ? 'TBD'
      : new Date(currentGameData.date || currentGameData.fullDate);

  let previousGameDate = null;
  if (previousGameData !== null) {
    previousGameDate =
      previousGameData.date === 'TBD'
        ? 'TBD'
        : new Date(previousGameData.date || previousGameData.fullDate);
  }

  if (currentGameData.isGameOver) {
    wrappedAssert(
      previousGameDate === null || currentGameDate > previousGameDate,
      'Kickoff date is before previous game.'
    );
  } else {
    wrappedAssert(
      currentGameData.date === 'TBD' ||
        previousGameDate === 'TBD' ||
        previousGameDate === null ||
        currentGameDate > previousGameDate,
      'Kickoff date is before previous game.'
    );
  }
}
