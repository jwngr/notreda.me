import pick from 'lodash/pick';

import {getDateFromGame} from '../../../website/src/lib/datetime';

export function validateDate([currentGameData, previousGameData], assert) {
  const wrappedAssert = (statement, message) => {
    assert(statement, message, pick(currentGameData, ['date', 'time', 'fullDate']));
  };

  const currentGameDate = getDateFromGame(currentGameData);
  if (!currentGameDate) {
    wrappedAssert(false, 'Kickoff date is missing.');
    return;
  }

  let previousGameDate = undefined;
  if (previousGameData !== null) {
    previousGameDate = getDateFromGame(previousGameData);
  }

  if (currentGameDate === 'TBD' || !previousGameDate || previousGameDate === 'TBD') {
    // Nothing to validate.
    return;
  }

  wrappedAssert(currentGameDate > previousGameDate, 'Kickoff date is before previous game.');
}
