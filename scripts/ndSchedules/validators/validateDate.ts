import pick from 'lodash/pick';

import {ValidatorFuncWithPreviousGameInfo} from '../../models';

export const validateDate: ValidatorFuncWithPreviousGameInfo = ({
  currentGameInfo,
  previousGameInfo,
  assert,
}) => {
  const wrappedAssert = (statement: boolean, message: string) => {
    assert(statement, message, pick(currentGameInfo, ['date', 'time', 'fullDate']));
  };

  const currentGameDataRaw = currentGameInfo.date ?? currentGameInfo.fullDate;
  const currentGameDate =
    currentGameDataRaw === 'TBD'
      ? 'TBD'
      : currentGameDataRaw
        ? new Date(currentGameDataRaw)
        : 'MISSING';

  let previousGameDate: Date | 'TBD' | 'MISSING' | null = null;
  if (previousGameInfo !== null) {
    const previousGameDataRaw = previousGameInfo.date ?? previousGameInfo.fullDate;
    previousGameDate =
      previousGameDataRaw === 'TBD'
        ? 'TBD'
        : previousGameDataRaw
          ? new Date(previousGameDataRaw)
          : 'MISSING';
  }

  if (currentGameDate === 'MISSING') {
    wrappedAssert(false, 'Game has no specificed kickoff date.');
  } else if (previousGameDate === 'MISSING') {
    wrappedAssert(false, 'Previous game has no specificed kickoff date.');
  } else if (currentGameInfo.isGameOver) {
    wrappedAssert(
      previousGameDate === null || currentGameDate > previousGameDate,
      'Kickoff date is before previous game.'
    );
  } else {
    wrappedAssert(
      currentGameInfo.date === 'TBD' ||
        previousGameDate === 'TBD' ||
        previousGameDate === null ||
        previousGameDate === null ||
        currentGameDate > previousGameDate,
      'Kickoff date is before previous game.'
    );
  }
};
