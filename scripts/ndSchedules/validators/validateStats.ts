import _ from 'lodash';

import {CURRENT_SEASON} from '../../lib/constants';
import {getPossessionInSeconds, isNonEmptyString, isNumber} from '../../lib/utils';
import {ExtendedGameInfo} from '../../models';
import type {AssertFn, IgnoredAssertFn} from './types';

const EXPECTED_STATS_KEYS = [
  'firstDowns',
  'fourthDownAttempts',
  'fourthDownConversions',
  'thirdDownAttempts',
  'thirdDownConversions',
  'totalYards',
  'passYards',
  'passCompletions',
  'passAttempts',
  'yardsPerPass',
  'interceptionsThrown',
  'rushYards',
  'rushAttempts',
  'yardsPerRush',
  'penalties',
  'penaltyYards',
  'fumblesLost',
  'possession',
  'fumbles',
];

const POSSESSION_REGEX = /^\d{1,2}:\d{1,2}$/;
const HOME_AWAY_KEYS = ['home', 'away'] as const;

export function validateStats(
  {stats, isGameOver, isLatestGameCompletedGame, season}: ExtendedGameInfo,
  assert: AssertFn,
  ignoredAssert: IgnoredAssertFn
): void {
  const wrappedAssert = (statement: boolean, message: string) => {
    assert(statement, message, {stats, isGameOver, isLatestGameCompletedGame});
  };

  if (isGameOver) {
    // Completed game.

    // TODO: Fully enable this assert when all completed games have stats.
    ignoredAssert(typeof stats !== 'undefined', 'Completed game is missing stats.', {stats});

    if (typeof stats !== 'undefined') {
      wrappedAssert(
        _.isEqual(Object.keys(stats).sort(), ['home', 'away'].sort()),
        'Stats object has unexpected keys.'
      );

      HOME_AWAY_KEYS.forEach((homeOrAway) => {
        const homeOrAwayStats = stats[homeOrAway];

        wrappedAssert(
          _.isEqual(Object.keys(homeOrAwayStats).sort(), EXPECTED_STATS_KEYS.sort()),
          `${_.capitalize(homeOrAway)} stats object has unexpected keys: ${_.difference(
            Object.keys(homeOrAwayStats).sort(),
            EXPECTED_STATS_KEYS.sort()
          )}.`
        );

        /***************/
        /*  1ST DOWNS  */
        /***************/
        const firstDowns = _.get(homeOrAwayStats, `firstDowns`);

        wrappedAssert(
          isNumber(firstDowns) && firstDowns >= 0,
          `${_.capitalize(homeOrAway)} first down attempts must be >= 0.`
        );

        /********************************/
        /*  3RD & 4TH DOWN CONVERSIONS  */
        /********************************/
        //
        ['third', 'fourth'].forEach((thirdOrFourth) => {
          const attempts = _.get(homeOrAwayStats, `${thirdOrFourth}DownAttempts`);
          const conversions = _.get(homeOrAwayStats, `${thirdOrFourth}DownConversions`);

          wrappedAssert(
            isNumber(attempts) && attempts >= 0,
            `${_.capitalize(homeOrAway)} ${thirdOrFourth} down attempts must be >= 0.`
          );

          wrappedAssert(
            isNumber(conversions) && conversions >= 0,
            `${_.capitalize(homeOrAway)} ${thirdOrFourth} down conversions must be >= 0.`
          );

          if (isNumber(attempts) && isNumber(conversions)) {
            wrappedAssert(
              conversions <= attempts,
              `More ${homeOrAway} ${thirdOrFourth} down conversions than attempts.`
            );

            wrappedAssert(
              firstDowns >= conversions,
              `${_.capitalize(
                homeOrAway
              )} ${thirdOrFourth} down conversions must be no greater than first downs.`
            );
          }
        });

        /*************/
        /*  YARDAGE  */
        /*************/
        const passYards = _.get(homeOrAwayStats, `passYards`);
        const rushYards = _.get(homeOrAwayStats, `rushYards`);
        const totalYards = _.get(homeOrAwayStats, `totalYards`);

        wrappedAssert(
          isNumber(passYards),
          `${_.capitalize(homeOrAway)} pass yards must be a number.`
        );

        wrappedAssert(
          isNumber(rushYards),
          `${_.capitalize(homeOrAway)} rush yards must be a number.`
        );

        wrappedAssert(
          isNumber(totalYards),
          `${_.capitalize(homeOrAway)} total yards must be a number.`
        );

        // TODO: Fully enable this assert when all completed games have valid total yards.
        ignoredAssert(
          isNumber(totalYards) && totalYards === passYards + rushYards,
          `${_.capitalize(
            homeOrAway
          )} total yards must be the sum of rush and pass yards (${totalYards} total vs. ${
            passYards + rushYards
          } sum).`,
          {stats}
        );

        /*************/
        /*  PASSING  */
        /*************/
        const yardsPerPass = _.get(homeOrAwayStats, `yardsPerPass`);
        const passAttempts = _.get(homeOrAwayStats, `passAttempts`);
        const passCompletions = _.get(homeOrAwayStats, `passCompletions`);
        const computedYardsPerPass = passAttempts === 0 ? 0 : passYards / passAttempts;

        wrappedAssert(
          isNumber(passAttempts) && passAttempts >= 0,
          `${_.capitalize(homeOrAway)} pass attempts must be >= 0.`
        );

        wrappedAssert(
          isNumber(passCompletions) && passCompletions >= 0,
          `${_.capitalize(homeOrAway)} pass completions must be >= 0.`
        );

        wrappedAssert(
          passCompletions <= passAttempts,
          `More ${homeOrAway} pass completions than attempts.`
        );

        wrappedAssert(
          isNumber(yardsPerPass),
          `${_.capitalize(homeOrAway)} yards per pass must be a number.`
        );

        // TODO: Fully enable this assert when actual and computed values match for all games.
        ignoredAssert(
          yardsPerPass.toFixed(1) === computedYardsPerPass.toFixed(1),
          `${_.capitalize(homeOrAway)} yards per pass has unexpected value (${yardsPerPass.toFixed(
            1
          )} actual vs. ${computedYardsPerPass.toFixed(1)} computed).`,
          {stats}
        );

        /*************/
        /*  RUSHING  */
        /*************/
        const rushAttempts = _.get(homeOrAwayStats, `rushAttempts`);
        const yardsPerRush = _.get(homeOrAwayStats, `yardsPerRush`);
        const computedYardsPerRush = rushAttempts === 0 ? 0 : rushYards / rushAttempts;

        wrappedAssert(
          isNumber(rushAttempts) && rushAttempts >= 0,
          `${_.capitalize(homeOrAway)} rush attempts must be >= 0.`
        );

        wrappedAssert(
          passCompletions <= passAttempts,
          `More ${homeOrAway} pass completions than attempts.`
        );

        wrappedAssert(
          isNumber(yardsPerRush),
          `${_.capitalize(homeOrAway)} yards per rush must be a number.`
        );

        // TODO: Fully enable this assert when actual and computed values match for all games.
        ignoredAssert(
          yardsPerRush.toFixed(1) === computedYardsPerRush.toFixed(1),
          `${_.capitalize(homeOrAway)} yards per rush has unexpected value (${yardsPerRush.toFixed(
            1
          )} actual vs. ${computedYardsPerRush.toFixed(1)} computed).`,
          {stats}
        );

        /***************/
        /*  PENALTIES  */
        /***************/
        const penalties = _.get(homeOrAwayStats, `penalties`);
        const penaltyYards = _.get(homeOrAwayStats, `penaltyYards`);

        wrappedAssert(
          isNumber(penalties) && penalties >= 0,
          `${_.capitalize(homeOrAway)} penalties must be >= 0.`
        );

        wrappedAssert(
          isNumber(penaltyYards) && penaltyYards >= 0,
          `${_.capitalize(homeOrAway)} penalty yards must be >= 0.`
        );

        wrappedAssert(
          penaltyYards <= penalties * 15,
          `${homeOrAway} penalty yards has unexpectedly high value.`
        );

        /***************/
        /*  TURNOVERS  */
        /***************/
        const fumbles = _.get(homeOrAwayStats, `fumbles`);
        const fumblesLost = _.get(homeOrAwayStats, `fumblesLost`);
        const interceptionsThrown = _.get(homeOrAwayStats, `interceptionsThrown`);

        wrappedAssert(
          isNumber(fumblesLost) && fumblesLost >= 0,
          `${_.capitalize(homeOrAway)} fumbles lost must be >= 0.`
        );

        wrappedAssert(
          isNumber(interceptionsThrown) && interceptionsThrown >= 0,
          `${_.capitalize(homeOrAway)} interceptions thrown must be >= 0.`
        );
        if (isLatestGameCompletedGame) {
          // The latest completed game may not yet have a fumbles value.
          wrappedAssert(
            (typeof fumbles === 'undefined' && season >= 2004 && season !== CURRENT_SEASON) ||
              (isNumber(fumbles) && fumbles >= 0),
            `${_.capitalize(homeOrAway)} fumbles must be >= 0 (or undefined).`
          );

          wrappedAssert(
            typeof fumbles === 'undefined' || fumblesLost <= fumbles,
            `${_.capitalize(homeOrAway)} fumbles lost must be <= fumbles (or undefined).`
          );
        } else {
          wrappedAssert(
            isNumber(fumbles) && fumbles >= 0,
            `${_.capitalize(homeOrAway)} fumbles must be >= 0.`
          );

          if (typeof fumbles !== 'undefined') {
            wrappedAssert(
              fumblesLost <= fumbles,
              `${_.capitalize(homeOrAway)} fumbles lost must be <= fumbles.`
            );
          }
        }
      });

      /****************/
      /*  POSSESSION  */
      /****************/
      const homePossession = _.get(stats, `home.possession`);
      const awayPossession = _.get(stats, `away.possession`);
      const actualTotalPossesssionInSeconds =
        getPossessionInSeconds(awayPossession) + getPossessionInSeconds(homePossession);
      const expectedTotalPossessionInSeconds = 60 * 60;
      const possessionDifference = Math.abs(
        actualTotalPossesssionInSeconds - expectedTotalPossessionInSeconds
      );

      wrappedAssert(
        isNonEmptyString(homePossession) && Boolean(homePossession.match(POSSESSION_REGEX)),
        `Home possession has an invalid format.`
      );

      wrappedAssert(
        isNonEmptyString(awayPossession) && Boolean(awayPossession.match(POSSESSION_REGEX)),
        `Away possession has an invalid format.`
      );

      // TODO: Fully enable this assert when possession values match for all games.
      ignoredAssert(
        actualTotalPossesssionInSeconds === expectedTotalPossessionInSeconds,
        `Expected total possession to be ${expectedTotalPossessionInSeconds} seconds, but actual value is ${actualTotalPossesssionInSeconds} seconds (${
          actualTotalPossesssionInSeconds > expectedTotalPossessionInSeconds ? '+' : '-'
        }${possessionDifference} seconds).`,
        {stats}
      );
    }
  } else {
    // Future game.
    wrappedAssert(typeof stats === 'undefined', 'Future game unexpected has stats.');
  }
}
