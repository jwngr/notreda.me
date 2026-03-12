import _ from 'lodash';

import {TeamRankings} from '../../../website/src/models/teams.models';
import {isNumber} from '../../lib/utils';
import {ExtendedGameInfo} from '../../models';
import type {AssertFn} from './types';

const EXPECTED_POLLS: Record<keyof TeamRankings, string> = {
  ap: 'AP',
  bcs: 'BCS',
  coaches: 'Coaches',
  cfbPlayoff: 'College Football Playoff',
};

const HOME_AWAY_KEYS = ['home', 'away'] as const;

type RankingsSide = (typeof HOME_AWAY_KEYS)[number];

export function validateRankings({rankings}: ExtendedGameInfo, assert: AssertFn): void {
  const wrappedAssert = (statement: boolean, message: string) => {
    assert(statement, message, {rankings});
  };

  if (typeof rankings !== 'undefined') {
    wrappedAssert(
      _.difference(Object.keys(rankings).sort(), [...HOME_AWAY_KEYS].sort()).length === 0,
      'Rankings object has unexpected keys.'
    );

    HOME_AWAY_KEYS.forEach((homeOrAway: RankingsSide) => {
      const homeOrAwayRankings = rankings[homeOrAway];
      if (typeof homeOrAwayRankings === 'undefined') {
        return;
      }

      const expectedPollKeys = Object.keys(EXPECTED_POLLS) as (keyof TeamRankings)[];

      wrappedAssert(
        _.difference(Object.keys(homeOrAwayRankings).sort(), expectedPollKeys.sort()).length === 0,
        `${_.capitalize(homeOrAway)} rankings object has unexpected poll keys.`
      );

      _.forEach(homeOrAwayRankings, (pollRanking, poll) => {
        wrappedAssert(
          isNumber(pollRanking) && pollRanking >= 1 && pollRanking <= 25,
          `${_.capitalize(homeOrAway)} ${EXPECTED_POLLS[poll as keyof TeamRankings]} ranking must be between 1 and 25.`
        );
      });
    });
  }
}
