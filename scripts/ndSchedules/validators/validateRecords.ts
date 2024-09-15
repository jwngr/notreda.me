import capitalize from 'lodash/capitalize';

import {CURRENT_SEASON} from '../../lib/constants';
import {ExtendedGameInfo, ValidatorFuncWithIgnore} from '../../models';
import {RecordType, TeamRecords} from '../../models/teams.models';

const _parseRecord = (
  record: string
): {readonly winCount: number; readonly lossCount: number; readonly tieCount: number} | null => {
  const recordTokens = record.split('-');

  if (
    recordTokens.length < 2 ||
    recordTokens.length > 3 ||
    typeof recordTokens[0] !== 'number' ||
    typeof recordTokens[1] !== 'number' ||
    (typeof recordTokens[2] !== 'number' && typeof recordTokens[2] !== 'undefined')
  ) {
    return null;
  }

  const winCount = Number(recordTokens[0]);
  const lossCount = Number(recordTokens[1]);
  const tieCount = recordTokens.length === 2 ? 0 : Number(recordTokens[2]);

  return {winCount, lossCount, tieCount};
};

export const validateRecords: ValidatorFuncWithIgnore = ({
  currentGameInfo,
  assert,
  ignoredAssert,
}) => {
  const {records, season, isHomeGame, weekIndex, completedGameCountForSeason} = currentGameInfo;

  const wrappedAssert = (statement: boolean, message: string): void => {
    assert(statement, message, {
      records,
      isHomeGame,
      weekIndex,
      completedGameCountForSeason,
    });
  };

  const wrappedIgnoredAssert = (statement: boolean, message: string): void => {
    ignoredAssert(statement, message, {
      records,
      isHomeGame,
      weekIndex,
      completedGameCountForSeason,
    });
  };

  if (season > CURRENT_SEASON) {
    wrappedAssert(
      typeof records === 'undefined',
      'Future season game should not have records object.'
    );
  }

  if (season <= CURRENT_SEASON) {
    if (season < 2018) {
      // TODO: Fully enable this assert when all completed games have records.
      wrappedIgnoredAssert(
        typeof records !== 'undefined',
        `Current or former season game should have records object.`
      );
    } else {
      wrappedAssert(
        typeof records !== 'undefined',
        `Current or former season game should have records object.`
      );

      if (typeof records !== 'undefined') {
        validateIndividualTeamRecords({
          records: records.home,
          homeOrAway: 'home',
          currentGameInfo,
          wrappedAssert,
        });
        validateIndividualTeamRecords({
          records: records.away,
          homeOrAway: 'away',
          currentGameInfo,
          wrappedAssert,
        });
      }
    }
  }
};

const validateIndividualTeamRecords = ({
  records,
  homeOrAway,
  currentGameInfo,
  wrappedAssert,
}: {
  readonly records: TeamRecords;
  readonly homeOrAway: 'home' | 'away';
  readonly currentGameInfo: ExtendedGameInfo;
  wrappedAssert: (statement: boolean, message: string) => void;
}) => {
  validateIndividualRecord({
    record: records.home,
    recordType: 'home',
    homeOrAway,
    wrappedAssert,
  });
  validateIndividualRecord({
    record: records.away,
    recordType: 'away',
    homeOrAway,
    wrappedAssert,
  });
  validateIndividualRecord({
    record: records.neutral,
    recordType: 'neutral',
    homeOrAway,
    wrappedAssert,
  });
  validateIndividualRecord({
    record: records.overall,
    recordType: 'overall',
    homeOrAway,
    wrappedAssert,
  });

  // The number of games Notre Dame has played should be the minimum of the week
  // index (which is 0-indexed; for weeks with completed games) or the completed
  // game count (for upcoming games).
  const ndExpectedGamesPlayed = Math.min(
    currentGameInfo.weekIndex + 1,
    currentGameInfo.completedGameCountForSeason
  );

  const parsedOverallRecord = _parseRecord(records.overall);
  if (parsedOverallRecord) {
    const gamesPlayedCountFromRecord =
      parsedOverallRecord.winCount + parsedOverallRecord.lossCount + parsedOverallRecord.tieCount;

    const isNdRecord = currentGameInfo.isHomeGame ? homeOrAway === 'home' : homeOrAway === 'away';
    if (isNdRecord) {
      // ND's actual games played count from their record should equal their expected
      // games played count.
      wrappedAssert(
        gamesPlayedCountFromRecord === ndExpectedGamesPlayed,
        `${capitalize(homeOrAway)} (ND) overall record has unexpected number of games.`
      );
    } else {
      // Opponent's actual games played count from their record should be no more than
      // 1 away from the ND's expected games played count.
      // Exlude 2020 because COVID caused so many postponements.
      if (currentGameInfo.season !== 2020) {
        wrappedAssert(
          Math.abs(gamesPlayedCountFromRecord - ndExpectedGamesPlayed) <= 1,
          `${capitalize(homeOrAway)} (opponent) overall record has unexpected number of games.`
        );
      }
    }

    const parsedHomeRecord = _parseRecord(records.home);
    const parsedAwayRecord = _parseRecord(records.away);
    // TODO: Backfill neutral site records and remove the hardcoded 0-0 record.
    const parsedNeutralRecord = _parseRecord(records.neutral || '0-0');

    const homeGameCount = parsedHomeRecord
      ? parsedHomeRecord.winCount + parsedHomeRecord.lossCount + parsedHomeRecord.tieCount
      : -100;
    const awayGameCount = parsedAwayRecord
      ? parsedAwayRecord.winCount + parsedAwayRecord.lossCount + parsedAwayRecord.tieCount
      : -100;
    const neutralGameCount = parsedNeutralRecord
      ? parsedNeutralRecord.winCount + parsedNeutralRecord.lossCount + parsedNeutralRecord.tieCount
      : -100;

    wrappedAssert(
      gamesPlayedCountFromRecord === homeGameCount + awayGameCount + neutralGameCount,
      `${capitalize(
        homeOrAway
      )} overall record has different games played count than their away, home, and neutral records combined.`
    );
  }
};

const validateIndividualRecord = ({
  record,
  recordType,
  homeOrAway,
  wrappedAssert,
}: {
  readonly record: string;
  readonly recordType: RecordType;
  readonly homeOrAway: 'home' | 'away';
  wrappedAssert: (statement: boolean, message: string) => void;
}) => {
  const parsedRecord = _parseRecord(record);

  if (parsedRecord === null) {
    wrappedAssert(false, `${capitalize(homeOrAway)} ${recordType} record has invalid format.`);
    return;
  }

  const {winCount, lossCount, tieCount} = parsedRecord;

  wrappedAssert(
    winCount >= 0,
    `${capitalize(homeOrAway)} ${recordType} record has unexpected wins value.`
  );

  wrappedAssert(
    lossCount >= 0,
    `${capitalize(homeOrAway)} ${recordType} record has unexpected losses value.`
  );

  wrappedAssert(
    tieCount >= 0,
    `${capitalize(homeOrAway)} ${recordType} record has unexpected ties value.`
  );
};
