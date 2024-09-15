import _ from 'lodash';

import {Polls} from '../../lib/polls';
import {AssertFunc, ValidatorFunc} from '../../models';
import {PollType} from '../../models/polls.models';
import {TeamRankings} from '../../models/teams.models';

export const validateRankings: ValidatorFunc = ({currentGameInfo, assert}) => {
  const {rankings} = currentGameInfo;

  const wrappedAssert = (statement: boolean, message: string) => {
    assert(statement, message, {rankings});
  };

  if (typeof rankings !== 'undefined') {
    validateIndividualTeamRankings({
      rankings: rankings.home ?? null,
      homeOrAway: 'home',
      wrappedAssert,
    });
    validateIndividualTeamRankings({
      rankings: rankings.away ?? null,
      homeOrAway: 'away',
      wrappedAssert,
    });
  }
};

const validateIndividualTeamRankings = ({
  rankings,
  homeOrAway,
  wrappedAssert,
}: {
  readonly rankings: TeamRankings | null;
  readonly homeOrAway: 'home' | 'away';
  readonly wrappedAssert: AssertFunc;
}) => {
  // Teams who are not ranked have nothing to validate.
  if (!rankings) return;

  validateIndividualPollRanking({
    ranking: rankings[PollType.AP] ?? null,
    pollType: PollType.AP,
    homeOrAway,
    wrappedAssert,
  });
  validateIndividualPollRanking({
    ranking: rankings[PollType.Coaches] ?? null,
    pollType: PollType.Coaches,
    homeOrAway,
    wrappedAssert,
  });
  validateIndividualPollRanking({
    ranking: rankings[PollType.CFBPlayoff] ?? null,
    pollType: PollType.CFBPlayoff,
    homeOrAway,
    wrappedAssert,
  });
  validateIndividualPollRanking({
    ranking: rankings[PollType.BCS] ?? null,
    pollType: PollType.BCS,
    homeOrAway,
    wrappedAssert,
  });
};

const validateIndividualPollRanking = ({
  ranking,
  pollType,
  homeOrAway,
  wrappedAssert,
}: {
  readonly ranking: number | null;
  readonly pollType: PollType;
  readonly homeOrAway: 'home' | 'away';
  readonly wrappedAssert: AssertFunc;
}) => {
  // Teams who are not ranked have nothing to validate.
  if (!ranking) return;

  wrappedAssert(
    ranking >= 1 && ranking <= 25,
    `${_.capitalize(homeOrAway)} ${Polls.getPollName(pollType)} ranking must be between 1 and 25.`
  );
};
