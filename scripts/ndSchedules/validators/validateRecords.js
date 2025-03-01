import _ from 'lodash';

import {CURRENT_SEASON} from '../../lib/constants';
import {isNumber} from '../../lib/utils';

const RECORD_REGEX = /^\d{1,2}-\d{1,2}$/;
const RECORD_REGEX_WITH_TIES = /^\d{1,2}-\d{1,2}-\d{1,2}$/;

const _parseRecord = (record) => {
  const recordTokens = record.split('-');

  const winCount = Number(recordTokens[0]);
  const lossCount = Number(recordTokens[1]);
  const tieCount = recordTokens.length === 2 ? 0 : Number(recordTokens[2]);

  return [winCount, lossCount, tieCount];
};

export function validateRecords(
  {records, season, isHomeGame, weekIndex, completedGameCountForSeason},
  assert,
  ignoredAssert
) {
  const wrappedAssert = (statement, message) => {
    assert(statement, message, {records, isHomeGame, weekIndex, completedGameCountForSeason});
  };

  const wrappedIgnoredAssert = (statement, message) => {
    ignoredAssert(statement, message, {
      records,
      isHomeGame,
      weekIndex,
      completedGameCountForSeason,
    });
  };

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
        wrappedAssert(
          _.isEqual(_.keys(records).sort(), ['home', 'away'].sort()),
          'Records object has unexpected keys.'
        );

        ['home', 'away'].forEach((homeOrAway) => {
          const isNdRecord = isHomeGame ? homeOrAway === 'home' : homeOrAway === 'away';
          const homeOrAwayRecords = records[homeOrAway];
          if (typeof homeOrAwayRecords !== 'undefined') {
            // TODO: Backfill neutral site records and make this a strict equality check.
            wrappedAssert(
              Object.keys(homeOrAwayRecords).every((val) =>
                ['home', 'away', 'neutral', 'overall'].includes(val)
              ),
              `${_.capitalize(homeOrAway)} record has unexpected keys.`
            );

            // Validate home, away, neutral, and overall records.
            _.forEach(homeOrAwayRecords, (currentRecord, homeAwayNeutralOrOverall) => {
              wrappedAssert(
                currentRecord.match(RECORD_REGEX) || currentRecord.match(RECORD_REGEX_WITH_TIES),
                `${_.capitalize(homeOrAway)} ${homeAwayNeutralOrOverall} record has invalid format.`
              );

              const [winCount, lossCount, tieCount] = _parseRecord(currentRecord);

              wrappedAssert(
                isNumber(winCount) && winCount >= 0,
                `${_.capitalize(
                  homeOrAway
                )} ${homeAwayNeutralOrOverall} record has unexpected wins value.`
              );

              wrappedAssert(
                isNumber(lossCount) && lossCount >= 0,
                `${_.capitalize(
                  homeOrAway
                )} ${homeAwayNeutralOrOverall} record has unexpected losses value.`
              );

              wrappedAssert(
                isNumber(tieCount) && tieCount >= 0,
                `${_.capitalize(
                  homeOrAway
                )} ${homeAwayNeutralOrOverall} record has unexpected ties value.`
              );

              if (homeAwayNeutralOrOverall === 'overall') {
                // The number of games Notre Dame has played should be the minimum of the week
                // index (which is 0-indexed; for weeks with completed games) or the completed
                // game count (for upcoming games).
                const ndExpectedGamesPlayed = Math.min(weekIndex + 1, completedGameCountForSeason);

                const gamesPlayedCountFromRecord = winCount + lossCount + tieCount;

                if (isNdRecord) {
                  // ND's actual games played count from their record should equal their expected
                  // games played count.
                  wrappedAssert(
                    gamesPlayedCountFromRecord === ndExpectedGamesPlayed,
                    `${_.capitalize(
                      homeOrAway
                    )} (ND) overall record has unexpected number of games.`
                  );
                } else {
                  // Opponent's actual games played count from their record should be no more than
                  // 1 away from the ND's expected games played count.
                  // Exlude 2020 because COVID caused so many postponements.
                  if (season !== 2020) {
                    wrappedAssert(
                      Math.abs(gamesPlayedCountFromRecord - ndExpectedGamesPlayed) <= 1,
                      `${_.capitalize(
                        homeOrAway
                      )} (opponent) overall record has unexpected number of games.`
                    );
                  }
                }

                const [awayWinCount, awayLossCount, awayTieCount] = _parseRecord(
                  records[homeOrAway].away
                );
                const [homeWinCount, homeLossCount, homeTieCount] = _parseRecord(
                  records[homeOrAway].home
                );
                const [neutralWinCount, neutralLossCount, neutralTieCount] = _parseRecord(
                  // TODO: Backfill neutral site records and remove the hardcoded 0-0 record.
                  records[homeOrAway].neutral || '0-0'
                );

                wrappedAssert(
                  gamesPlayedCountFromRecord ===
                    awayWinCount +
                      awayLossCount +
                      awayTieCount +
                      homeWinCount +
                      homeLossCount +
                      homeTieCount +
                      neutralWinCount +
                      neutralLossCount +
                      neutralTieCount,
                  `${_.capitalize(
                    homeOrAway
                  )} overall record has different games played count than their away, home, and neutral records combined.`
                );
              }
            });
          }
        });
      }
    }
  } else {
    wrappedAssert(
      typeof records === 'undefined',
      'Future season game should not have records object.'
    );
  }
}
