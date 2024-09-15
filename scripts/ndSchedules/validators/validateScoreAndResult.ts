import capitalize from 'lodash/capitalize';
import sum from 'lodash/sum';

import {AssertFunc, ValidatorFunc} from '../../models';
import {GameResult} from '../../models/games.models';
import {TeamLinescore} from '../../models/teams.models';

export const validateScoreAndResult: ValidatorFunc = ({currentGameInfo, assert}) => {
  const {score, result, linescore, isHomeGame, isGameOver, numOvertimes} = currentGameInfo;

  const wrappedAssert = (statement: boolean, message: string) => {
    assert(statement, message, {score, result, linescore, isHomeGame, isGameOver, numOvertimes});
  };

  if (isGameOver) {
    // Completed game.
    wrappedAssert(typeof score !== 'undefined', 'Completed game has has no score.');

    if (score) {
      const opponentScore = isHomeGame ? score.away : score.home;
      const notreDameScore = isHomeGame ? score.home : score.away;

      wrappedAssert(score.home >= 0, `Home score must be >= 0.`);
      wrappedAssert(score.away >= 0, `Away score must be >= 0.`);

      let calculatedResult: GameResult;
      if (notreDameScore > opponentScore) {
        calculatedResult = GameResult.Win;
      } else if (opponentScore > notreDameScore) {
        calculatedResult = GameResult.Loss;
      } else {
        calculatedResult = GameResult.Tie;
      }

      wrappedAssert(result === calculatedResult, 'Result does not match up with scores.');

      wrappedAssert(
        typeof numOvertimes === 'undefined' || numOvertimes >= 1,
        `Number of overtimes must be undefined or a positive number.`
      );

      wrappedAssert(typeof linescore !== 'undefined', 'Completed game has has no linescore.');

      if (linescore) {
        validateTeamLinescore({
          teamScore: score.home,
          teamLinescore: linescore.home,
          numOvertimes: numOvertimes ?? 0,
          homeOrAway: 'home',
          wrappedAssert,
        });
        validateTeamLinescore({
          teamScore: score.away,
          teamLinescore: linescore.away,
          numOvertimes: numOvertimes ?? 0,
          homeOrAway: 'away',
          wrappedAssert,
        });
      }
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
};

const validateTeamLinescore = ({
  teamScore,
  teamLinescore,
  numOvertimes,
  homeOrAway,
  wrappedAssert,
}: {
  readonly teamScore: number;
  readonly teamLinescore: TeamLinescore;
  readonly numOvertimes: number;
  readonly homeOrAway: 'home' | 'away';
  readonly wrappedAssert: AssertFunc;
}) => {
  wrappedAssert(
    teamLinescore.length === 4 + numOvertimes,
    `${capitalize(homeOrAway)} team linescore does not have expected number of periods.`
  );

  wrappedAssert(
    teamScore === sum(teamLinescore),
    `${capitalize(homeOrAway)} team linescore does not add up to team score.`
  );
};
