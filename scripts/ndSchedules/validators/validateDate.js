import {getDateFromGame} from '../../../website/src/lib/datetime';
import {CURRENT_SEASON} from '../../lib/constants';

export function validateDate([currentGameData, previousGameData], assert) {
  const wrappedAssert = (statement, message) => {
    assert(statement, message, {currentGameData, previousGameData});
  };

  const currentDate = getDateFromGame(currentGameData.date);

  // Current date is TBD.
  if (currentDate === 'TBD') {
    if (currentGameData.season < CURRENT_SEASON && currentDate === 'TBD') {
      wrappedAssert(false, 'Kickoff date missing for game in past season.');
    }
    return;
  }

  // Current date is a date (with or without time).
  let previousDate = undefined;
  if (previousGameData !== null) {
    previousDate = getDateFromGame(previousGameData.date);
  }

  if (!previousDate || previousDate === 'TBD') {
    // Nothing to validate.
    return;
  }

  wrappedAssert(
    currentDate.getTime() > previousDate.getTime(),
    'Kickoff date is before previous game.'
  );
}
