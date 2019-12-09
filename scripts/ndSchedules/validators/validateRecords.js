const _ = require('lodash');

const {isNumber} = require('../../lib/utils');
const {CURRENT_SEASON} = require('../../lib/constants');

const RECORD_REGEX = /^\d{1,2}-\d{1,2}$/;
const RECORD_REGEX_WITH_TIES = /^\d{1,2}-\d{1,2}-\d{1,2}$/;

const _parseRecord = (record) => {
  const recordTokens = record.split('-');

  const winCount = Number(recordTokens[0]);
  const lossCount = Number(recordTokens[1]);
  const tieCount = recordTokens.length === 2 ? 0 : Number(recordTokens[2]);

  return [winCount, lossCount, tieCount];
};

module.exports = (
  {records, season, isHomeGame, weekIndex, opponentId, completedGameCountForSeason},
  assert,
  ignoredAssert
) => {
  const wrappedAssert = (statement, message) => {
    assert(statement, message, {
      records,
      isHomeGame,
      weekIndex,
      completedGameCountForSeason,
    });
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
            wrappedAssert(
              _.isEqual(_.keys(homeOrAwayRecords).sort(), ['overall', 'home', 'away'].sort()),
              `${_.capitalize(homeOrAway)} record has unexpected keys.`
            );

            // Validate home, away, and overall records.
            _.forEach(homeOrAwayRecords, (currentRecord, homeAwayOrOverall) => {
              wrappedAssert(
                currentRecord.match(RECORD_REGEX) || currentRecord.match(RECORD_REGEX_WITH_TIES),
                `${_.capitalize(homeOrAway)} ${homeAwayOrOverall} record has invalid format.`
              );

              const [winCount, lossCount, tieCount] = _parseRecord(currentRecord);

              wrappedAssert(
                isNumber(winCount) && winCount >= 0,
                `${_.capitalize(homeOrAway)} ${homeAwayOrOverall} record has unexpected wins value.`
              );

              wrappedAssert(
                isNumber(lossCount) && lossCount >= 0,
                `${_.capitalize(
                  homeOrAway
                )} ${homeAwayOrOverall} record has unexpected losses value.`
              );

              wrappedAssert(
                isNumber(tieCount) && tieCount >= 0,
                `${_.capitalize(homeOrAway)} ${homeAwayOrOverall} record has unexpected ties value.`
              );

              if (homeAwayOrOverall === 'overall') {
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
                  wrappedAssert(
                    Math.abs(gamesPlayedCountFromRecord - ndExpectedGamesPlayed) <= 1,
                    `${_.capitalize(
                      homeOrAway
                    )} (opponent) overall record has unexpected number of games.`
                  );
                }

                // TODO: Handle neutral site games.
                const [awayWinCount, awayLossCount, awayTieCount] = _parseRecord(
                  records[homeOrAway].away
                );
                const [homeWinCount, homeLossCount, homeTieCount] = _parseRecord(
                  records[homeOrAway].home
                );

                wrappedAssert(
                  gamesPlayedCountFromRecord ===
                    awayWinCount +
                      awayLossCount +
                      awayTieCount +
                      homeWinCount +
                      homeLossCount +
                      homeTieCount,
                  `${_.capitalize(
                    homeOrAway
                  )} overall record has different games played count than their away and home records combined.`
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
};
