import capitalize from 'lodash/capitalize';

import {CURRENT_SEASON} from '../../lib/constants';
import {getPossessionInSeconds, isNonEmptyString} from '../../lib/utils';
import {AssertFunc, ExtendedGameInfo, ValidatorFuncWithIgnore} from '../../models';
import {TeamStats} from '../../models/teams.models';

const POSSESSION_REGEX = /^\d{1,2}:\d{1,2}$/;

export const validateStats: ValidatorFuncWithIgnore = ({
  currentGameInfo,
  assert,
  ignoredAssert,
}) => {
  const {stats, isGameOver, isLatestCompletedGame: isLatestCompletedGame} = currentGameInfo;

  const wrappedAssert = (statement: boolean, message: string) => {
    assert(statement, message, {stats, isGameOver, isLatestCompletedGame});
  };

  const wrappedIgnoredAssert = (statement: boolean, message: string) => {
    ignoredAssert(statement, message, {stats});
  };

  if (!isGameOver) {
    // Future game.
    wrappedAssert(typeof stats === 'undefined', 'Future game unexpected has stats.');
  } else {
    // Completed game.

    // TODO: Fully enable this assert when all completed games have stats.
    wrappedIgnoredAssert(typeof stats !== 'undefined', 'Completed game is missing stats.');

    if (stats) {
      validateIndividualTeamStats({
        stats: stats.home,
        homeOrAway: 'home',
        currentGameInfo,
        wrappedAssert,
        wrappedIgnoredAssert,
      });
      validateIndividualTeamStats({
        stats: stats.away,
        homeOrAway: 'away',
        currentGameInfo,
        wrappedAssert,
        wrappedIgnoredAssert,
      });

      /****************/
      /*  POSSESSION  */
      /****************/
      const homePossession = stats.home.possession;
      const awayPossession = stats.away.possession;
      const actualTotalPossesssionInSeconds =
        getPossessionInSeconds(awayPossession) + getPossessionInSeconds(homePossession);
      const expectedTotalPossessionInSeconds = 60 * 60;
      const possessionDifference = Math.abs(
        actualTotalPossesssionInSeconds - expectedTotalPossessionInSeconds
      );

      wrappedAssert(
        isNonEmptyString(homePossession) && homePossession.match(POSSESSION_REGEX) !== null,
        `Home possession has an invalid format.`
      );

      wrappedAssert(
        isNonEmptyString(awayPossession) && awayPossession.match(POSSESSION_REGEX) !== null,
        `Away possession has an invalid format.`
      );

      // TODO: Fully enable this assert when possession values match for all games.
      wrappedIgnoredAssert(
        actualTotalPossesssionInSeconds === expectedTotalPossessionInSeconds,
        `Expected total possession to be ${expectedTotalPossessionInSeconds} seconds, but actual value is ${actualTotalPossesssionInSeconds} seconds (${
          actualTotalPossesssionInSeconds > expectedTotalPossessionInSeconds ? '+' : '-'
        }${possessionDifference} seconds).`
      );
    }
  }
};

const validateIndividualTeamStats = ({
  stats,
  homeOrAway,
  currentGameInfo,
  wrappedAssert,
  wrappedIgnoredAssert,
}: {
  readonly stats: TeamStats;
  readonly homeOrAway: 'home' | 'away';
  readonly currentGameInfo: ExtendedGameInfo;
  readonly wrappedAssert: AssertFunc;
  readonly wrappedIgnoredAssert: AssertFunc;
}) => {
  /***************/
  /*  1ST DOWNS  */
  /***************/
  const firstDowns = stats.firstDowns;

  wrappedAssert(firstDowns >= 0, `${capitalize(homeOrAway)} first down attempts must be >= 0.`);

  /********************************/
  /*  3RD & 4TH DOWN CONVERSIONS  */
  /********************************/
  validateConversionOnDowns({
    down: 'third',
    attempts: stats.thirdDownAttempts,
    conversions: stats.thirdDownConversions,
    firstDowns,
    homeOrAway,
    wrappedAssert,
  });
  validateConversionOnDowns({
    down: 'fourth',
    attempts: stats.fourthDownAttempts,
    conversions: stats.fourthDownConversions,
    firstDowns,
    homeOrAway,
    wrappedAssert,
  });

  /*************/
  /*  YARDAGE  */
  /*************/
  const passYards = stats.passYards;
  const rushYards = stats.rushYards;
  const totalYards = stats.totalYards;

  wrappedAssert(passYards >= 0, `${capitalize(homeOrAway)} pass yards must be a number.`);
  wrappedAssert(rushYards >= 0, `${capitalize(homeOrAway)} rush yards must be a number.`);
  wrappedAssert(totalYards >= 0, `${capitalize(homeOrAway)} total yards must be a number.`);

  // TODO: Fully enable this assert when all completed games have valid total yards.
  wrappedIgnoredAssert(
    totalYards === passYards + rushYards,
    `${capitalize(
      homeOrAway
    )} total yards must be the sum of rush and pass yards (${totalYards} total vs. ${
      passYards + rushYards
    } sum).`
  );

  /*************/
  /*  PASSING  */
  /*************/
  const yardsPerPass = stats.yardsPerPass;
  const passAttempts = stats.passAttempts;
  const passCompletions = stats.passCompletions;
  const computedYardsPerPass = passAttempts === 0 ? 0 : passYards / passAttempts;

  wrappedAssert(passAttempts >= 0, `${capitalize(homeOrAway)} pass attempts must be >= 0.`);
  wrappedAssert(passCompletions >= 0, `${capitalize(homeOrAway)} pass completions must be >= 0.`);
  wrappedAssert(yardsPerPass >= 0, `${capitalize(homeOrAway)} yards per pass must be a number.`);

  wrappedAssert(
    passCompletions <= passAttempts,
    `More ${homeOrAway} pass completions than attempts.`
  );

  // TODO: Fully enable this assert when actual and computed values match for all games.
  wrappedIgnoredAssert(
    yardsPerPass.toFixed(1) === computedYardsPerPass.toFixed(1),
    `${capitalize(homeOrAway)} yards per pass has unexpected value (${yardsPerPass.toFixed(
      1
    )} actual vs. ${computedYardsPerPass.toFixed(1)} computed).`
  );

  /*************/
  /*  RUSHING  */
  /*************/
  const rushAttempts = stats.rushAttempts;
  const yardsPerRush = stats.yardsPerRush;
  const computedYardsPerRush = rushAttempts === 0 ? 0 : rushYards / rushAttempts;

  wrappedAssert(rushAttempts >= 0, `${capitalize(homeOrAway)} rush attempts must be >= 0.`);
  wrappedAssert(yardsPerRush >= 0, `${capitalize(homeOrAway)} yards per rush must be a number.`);

  wrappedAssert(
    passCompletions <= passAttempts,
    `More ${homeOrAway} pass completions than attempts.`
  );

  // TODO: Fully enable this assert when actual and computed values match for all games.
  wrappedIgnoredAssert(
    yardsPerRush.toFixed(1) === computedYardsPerRush.toFixed(1),
    `${capitalize(homeOrAway)} yards per rush has unexpected value (${yardsPerRush.toFixed(
      1
    )} actual vs. ${computedYardsPerRush.toFixed(1)} computed).`
  );

  /***************/
  /*  PENALTIES  */
  /***************/
  const penalties = stats.penalties;
  const penaltyYards = stats.penaltyYards;

  wrappedAssert(penalties >= 0, `${capitalize(homeOrAway)} penalties must be >= 0.`);
  wrappedAssert(penaltyYards >= 0, `${capitalize(homeOrAway)} penalty yards must be >= 0.`);
  wrappedAssert(
    penaltyYards >= penalties && penaltyYards <= penalties * 15,
    `${homeOrAway} penalty yards has unexpected value.`
  );

  /***************/
  /*  TURNOVERS  */
  /***************/
  const fumbles = stats.fumbles;
  const fumblesLost = stats.fumblesLost;
  const interceptionsThrown = stats.interceptionsThrown;

  wrappedAssert(fumblesLost >= 0, `${capitalize(homeOrAway)} fumbles lost must be >= 0.`);
  wrappedAssert(
    interceptionsThrown >= 0,
    `${capitalize(homeOrAway)} interceptions thrown must be >= 0.`
  );

  if (currentGameInfo.isLatestCompletedGame) {
    wrappedAssert(
      // TODO: Do I need the season check here?
      (typeof fumbles === 'undefined' && currentGameInfo.season === CURRENT_SEASON) ||
        (typeof fumbles === 'number' && fumbles >= 0),
      `${capitalize(homeOrAway)} fumbles must be >= 0 (or undefined).`
    );

    wrappedAssert(
      typeof fumbles === 'undefined' || fumblesLost <= fumbles,
      `${capitalize(homeOrAway)} fumbles lost must be <= fumbles (or undefined).`
    );
  } else {
    wrappedAssert(
      typeof fumbles === 'number' && fumbles >= 0,
      `${capitalize(homeOrAway)} fumbles must be >= 0.`
    );

    wrappedAssert(
      typeof fumbles === 'number' && fumblesLost <= fumbles,
      `${capitalize(homeOrAway)} fumbles lost must be <= fumbles.`
    );
  }
};

const validateConversionOnDowns = ({
  down,
  attempts,
  firstDowns,
  conversions,
  homeOrAway,
  wrappedAssert,
}: {
  readonly down: 'third' | 'fourth';
  readonly attempts: number;
  readonly conversions: number;
  readonly firstDowns: number;
  readonly homeOrAway: 'home' | 'away';
  readonly wrappedAssert: AssertFunc;
}) => {
  wrappedAssert(attempts >= 0, `${capitalize(homeOrAway)} ${down} down attempts must be >= 0.`);

  wrappedAssert(
    conversions >= 0,
    `${capitalize(homeOrAway)} ${down} down conversions must be >= 0.`
  );

  wrappedAssert(
    conversions <= attempts,
    `More ${homeOrAway} ${down} down conversions than attempts.`
  );

  wrappedAssert(
    firstDowns >= conversions,
    `${capitalize(homeOrAway)} ${down} down conversions must be no greater than first downs.`
  );
};
