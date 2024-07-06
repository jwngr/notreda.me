import _ from 'lodash';

import schedule from '../resources/schedule';
import {CURRENT_SEASON} from './constants';

/**
 * Returns an array of all historical and future matchups against the specified opponent.
 *
 * @param {string} opponentId The opponent ID whose matchups to fetch.
 *
 * @return {Object} An object containing two arrays with keys `past` and `future`.
 */
export const getMatchupsAgainstTeam = (opponentId) => {
  const matchupsAgainstTeam = {
    past: [],
    future: [],
  };

  _.forEach(schedule, (currentSeasonGames, currentSeason) => {
    _.forEach(currentSeasonGames, (currentGame, weekIndex) => {
      if (currentGame.opponentId === opponentId) {
        const pastOrFuture = currentGame.result ? 'past' : 'future';
        matchupsAgainstTeam[pastOrFuture].push({
          season: Number(currentSeason),
          weekIndex,
          ...currentGame,
        });
      }
    });
  });

  return matchupsAgainstTeam;
};

/**
 * Returns a subset of all matchups against the specified opponent, focused on the selected season.
 *
 * @param {string} opponentId The opponent ID whose matchups to fetch.
 * @param {number} selectedSeason The currently selected season (i.e., the season whose page is
 *     visible).
 * @param {number} [maxMatchupsCount] The maximum number of matchups to include.
 *
 * @return {Object} An object containing a subset of matchups against the specified opponent.
 */
export const getFilteredMatchupsAgainstTeam = (
  opponentId,
  selectedSeason,
  maxMatchupsCount = Infinity
) => {
  const minMatchupsCount = 5;
  if (maxMatchupsCount < minMatchupsCount) {
    throw new Error(
      `Cannot get filtered matchups: Max matchups count must be at least ${minMatchupsCount}.`
    );
  }

  const {past: pastMatchupsAgainstTeam, future: futureMatchupsAgainstTeam} =
    getMatchupsAgainstTeam(opponentId);
  const allMatchupsAgainstTeam = [...pastMatchupsAgainstTeam, ...futureMatchupsAgainstTeam];

  const selectedMatchup = _.find(allMatchupsAgainstTeam, ({season}) => season === selectedSeason);

  if (typeof selectedMatchup === 'undefined') {
    throw new Error(
      `Cannot get filtered matchups: No matchup exists against ${opponentId} for the provided ${selectedSeason} season.`
    );
  }

  let filteredMatchupsAgainstTeam;
  if (allMatchupsAgainstTeam.length < maxMatchupsCount) {
    // If the actual number of matchups is less than the maximum number of matchups, include all of
    // them.
    filteredMatchupsAgainstTeam = allMatchupsAgainstTeam;
  } else if (futureMatchupsAgainstTeam.length === 0) {
    // If there are no future matchups against the opponent, include a subset of past matchups.
    const seasonsWithPastMatchups = pastMatchupsAgainstTeam.map(({season}) => season);
    const selectedMatchupIndexWithinPastMatchupsArray = _.indexOf(
      seasonsWithPastMatchups,
      selectedSeason
    );

    // TODO: add comments explaining this.
    if (
      selectedMatchupIndexWithinPastMatchupsArray >=
      pastMatchupsAgainstTeam.length - maxMatchupsCount + 2
    ) {
      filteredMatchupsAgainstTeam = [
        _.first(pastMatchupsAgainstTeam),
        ..._.takeRight(pastMatchupsAgainstTeam, maxMatchupsCount - 1),
      ];
    } else if (selectedMatchupIndexWithinPastMatchupsArray <= 2) {
      filteredMatchupsAgainstTeam = [
        ..._.take(pastMatchupsAgainstTeam, maxMatchupsCount - 1),
        _.last(pastMatchupsAgainstTeam),
      ];
    } else {
      filteredMatchupsAgainstTeam = [
        _.first(pastMatchupsAgainstTeam),
        ..._.slice(
          pastMatchupsAgainstTeam,
          // Start one matchup before the selected season.
          selectedMatchupIndexWithinPastMatchupsArray - 1,
          // End maxMatchupsCount minus 3 ((1) first matchup, (2) last matchcup, (3) matchup before
          // selected season) after the selected season.
          selectedMatchupIndexWithinPastMatchupsArray + maxMatchupsCount - 3
        ),
        _.last(pastMatchupsAgainstTeam),
      ];
    }
  } else if (pastMatchupsAgainstTeam.length === 0) {
    // If there are no past matchups against the opponent, include the next N future matchups.
    filteredMatchupsAgainstTeam = _.take(futureMatchupsAgainstTeam, maxMatchupsCount);
  } else {
    // Otherwise, only include up to the maximum number of matchups, choosing a selection of them
    // from the past and future.

    // Determine the future matchups to show, always showing the next future matchup.
    const filteredFutureMatchupsAgainstTeam = [futureMatchupsAgainstTeam[0]];

    // Determine if the selected season is within the future matchups array. If so, optionally
    // include another future matchup in our filtered list.
    let selectedMatchupIndexWithinFutureMatchupsArray = _.findIndex(
      futureMatchupsAgainstTeam,
      ({season}) => season === selectedSeason
    );

    if (selectedMatchupIndexWithinFutureMatchupsArray > 0) {
      // If the selected season is a future matchup which is not the next matchup, show it as well.
      filteredFutureMatchupsAgainstTeam.push(
        futureMatchupsAgainstTeam[selectedMatchupIndexWithinFutureMatchupsArray]
      );
    } else if (
      selectedSeason === CURRENT_SEASON &&
      selectedMatchupIndexWithinFutureMatchupsArray === 0 &&
      futureMatchupsAgainstTeam.length > 1
    ) {
      // If the selected season is the next matchup and there are multiple future matchups, show the
      // second-to-next matchup as well.
      filteredFutureMatchupsAgainstTeam.push(futureMatchupsAgainstTeam[1]);
    }

    // Determine how many past matchups need to be included to reach the max.
    const desiredFilteredPastMatchupsCount =
      maxMatchupsCount - filteredFutureMatchupsAgainstTeam.length;

    let filteredPastMatchupsAgainstTeam;

    if (pastMatchupsAgainstTeam.length <= desiredFilteredPastMatchupsCount) {
      filteredPastMatchupsAgainstTeam = [...pastMatchupsAgainstTeam];
    } else {
      const seasonsWithPastMatchups = pastMatchupsAgainstTeam.map(({season}) => season);
      const selectedMatchupIndexWithinPastMatchupsArray = _.indexOf(
        seasonsWithPastMatchups,
        selectedSeason
      );

      // TODO: add comments.
      if (
        selectedMatchupIndexWithinPastMatchupsArray === -1 ||
        selectedMatchupIndexWithinPastMatchupsArray >=
          pastMatchupsAgainstTeam.length - desiredFilteredPastMatchupsCount + 2
      ) {
        filteredPastMatchupsAgainstTeam = [
          _.first(pastMatchupsAgainstTeam),
          ..._.takeRight(pastMatchupsAgainstTeam, desiredFilteredPastMatchupsCount - 1),
        ];
      } else if (selectedMatchupIndexWithinPastMatchupsArray <= 2) {
        filteredPastMatchupsAgainstTeam = [
          ..._.take(pastMatchupsAgainstTeam, desiredFilteredPastMatchupsCount - 1),
          _.last(pastMatchupsAgainstTeam),
        ];
      } else {
        filteredPastMatchupsAgainstTeam = [
          _.first(pastMatchupsAgainstTeam),
          ..._.slice(
            pastMatchupsAgainstTeam,
            // Start one matchup before the selected season.
            selectedMatchupIndexWithinPastMatchupsArray - 1,
            // End desiredFilteredPastMatchupsCount minus 3 ((1) first past matchup, (2) last past
            // matchup, (3) past matchup before selected season) after the selected season.
            selectedMatchupIndexWithinPastMatchupsArray + desiredFilteredPastMatchupsCount - 3
          ),
          _.last(pastMatchupsAgainstTeam),
        ];
      }
    }

    filteredMatchupsAgainstTeam = [
      ...filteredPastMatchupsAgainstTeam,
      ...filteredFutureMatchupsAgainstTeam,
    ];
  }

  return filteredMatchupsAgainstTeam;
};
