import _ from 'lodash';

import {isNumber} from '../../lib/utils';

export function validateScoreAndResult(
  {score, result, linescore, isHomeGame, isGameOver, numOvertimes},
  assert
) {
  const wrappedAssert = (statement, message) => {
    assert(statement, message, {score, result, linescore, isHomeGame, isGameOver, numOvertimes});
  };

  if (isGameOver) {
    // Completed game.
    wrappedAssert(
      _.isEqual(_.keys(score).sort(), ['home', 'away'].sort()),
      'Score object has unexpected keys.'
    );

    const opponentScore = isHomeGame ? score.away : score.home;
    const notreDameScore = isHomeGame ? score.home : score.away;

    ['home', 'away'].forEach((homeOrAway) => {
      wrappedAssert(
        isNumber(score[homeOrAway]) && score[homeOrAway] >= 0,
        `${_.capitalize(homeOrAway)} score must be >= 0.`
      );
    });

    let calculatedResult;
    if (notreDameScore > opponentScore) {
      calculatedResult = 'W';
    } else if (opponentScore > notreDameScore) {
      calculatedResult = 'L';
    } else {
      calculatedResult = 'T';
    }

    wrappedAssert(result === calculatedResult, 'Result does not match up with scores.');

    wrappedAssert(
      typeof numOvertimes === 'undefined' || (isNumber(numOvertimes) && numOvertimes >= 1),
      `Number of overtimes must be undefined or a positive number.`
    );

    wrappedAssert(
      _.isEqual(_.keys(linescore).sort(), ['home', 'away'].sort()),
      'Linescore object has unexpected keys.'
    );

    if (_.get(linescore, 'away', []).length !== 0) {
      ['home', 'away'].forEach((homeOrAway) => {
        wrappedAssert(
          linescore[homeOrAway].length === 4 + (numOvertimes || 0),
          `${_.capitalize(homeOrAway)} team linescore does not have expected number of periods.`
        );

        wrappedAssert(
          score[homeOrAway] === _.sum(linescore[homeOrAway]),
          `${_.capitalize(homeOrAway)} team linescore does not add up to ${homeOrAway} team score.`
        );
      });
    }
  } else {
    // Future game.
    wrappedAssert(typeof score === 'undefined', 'Future game unexpectedly has score object.');
    wrappedAssert(typeof result === 'undefined', 'Future game unexpectedly has result object.');
    wrappedAssert(
      typeof linescore === 'undefined',
      'Future game unexpectedly has linescore object.'
    );
  }
}
