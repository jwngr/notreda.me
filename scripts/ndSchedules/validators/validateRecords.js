const _ = require('lodash');

const {isNumber} = require('../../lib/utils');
const {CURRENT_SEASON} = require('../../lib/constants');

const RECORD_REGEX = /^\d{1,2}-\d{1,2}$/;
const RECORD_REGEX_WITH_TIES = /^\d{1,2}-\d{1,2}-\d{1,2}$/;

module.exports = (
  {records, season, isHomeGame, weekIndex, completedGameCountForSeason},
  assert,
  ignoredAssert
) => {
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
            wrappedAssert(
              _.isEqual(_.keys(homeOrAwayRecords).sort(), ['overall', 'home', 'away'].sort()),
              `${_.capitalize(homeOrAway)} record has unexpected keys.`
            );

            _.forEach(homeOrAwayRecords, (currentRecord, homeAwayOrOverall) => {
              wrappedAssert(
                currentRecord.match(RECORD_REGEX) || currentRecord.match(RECORD_REGEX_WITH_TIES),
                `${_.capitalize(homeOrAway)} ${homeAwayOrOverall} record has invalid format.`
              );

              const currentRecordTokens = currentRecord.split('-');

              const winCount = Number(currentRecordTokens[0]);
              const lossCount = Number(currentRecordTokens[1]);
              const tieCount =
                currentRecordTokens.length === 2 ? 0 : Number(currentRecordTokens[2]);

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

              if (homeAwayOrOverall === 'overall' && isNdRecord) {
                wrappedAssert(
                  winCount + lossCount + tieCount ===
                    Math.min(weekIndex + 1, completedGameCountForSeason),
                  `${_.capitalize(
                    homeOrAway
                  )} ${homeAwayOrOverall} record has unexpected number of games.`
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
