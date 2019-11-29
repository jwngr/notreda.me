const _ = require('lodash');

const {isNumber} = require('../../lib/utils');

const EXPECTED_POLLS = {
  ap: 'AP',
  bcs: 'BCS',
  coaches: 'Coaches',
  cfbPlayoff: 'College Football Playoff',
};

module.exports = ({rankings}, assert) => {
  const wrappedAssert = (statement, message) => {
    assert(statement, message, {rankings});
  };

  if (typeof rankings !== 'undefined') {
    wrappedAssert(
      _.difference(_.keys(rankings).sort(), ['home', 'away'].sort()).length === 0,
      'Rankings object has unexpected keys.'
    );

    ['home', 'away'].forEach((homeOrAway) => {
      if (typeof rankings[homeOrAway] !== 'undefined') {
        const homeOrAwayRankings = rankings[homeOrAway];

        wrappedAssert(
          _.difference(_.keys(homeOrAwayRankings).sort(), _.keys(EXPECTED_POLLS).sort()).length ===
            0,
          `${_.capitalize(homeOrAway)} rankings object has unexpected poll keys.`
        );

        _.forEach(homeOrAwayRankings, (pollRanking, poll) => {
          wrappedAssert(
            isNumber(pollRanking) && pollRanking >= 1 && pollRanking <= 25,
            `${_.capitalize(homeOrAway)} ${EXPECTED_POLLS[poll]} ranking must be between 1 and 25.`
          );
        });
      }
    });
  }
};
