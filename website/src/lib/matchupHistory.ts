import {FullSchedule, GameInfo, TeamId} from '../models';
import scheduleJson from '../resources/schedule.json';
import {CURRENT_SEASON} from './constants';

const schedule = scheduleJson as FullSchedule;

interface ExpandedGameInfo extends GameInfo {
  readonly season: number;
  readonly weekIndex: number;
}

interface PastAndFutureMatchups {
  readonly past: ExpandedGameInfo[];
  readonly future: ExpandedGameInfo[];
}

/** Returns an array of all historical and future matchups against the specified opponent. */
export const getMatchupsAgainstTeam = (opponentId: TeamId): PastAndFutureMatchups => {
  const matchupsAgainstTeam: PastAndFutureMatchups = {
    past: [],
    future: [],
  };

  Object.entries(schedule).forEach(([currentSeason, currentSeasonGames]) => {
    currentSeasonGames.forEach((currentGame, weekIndex) => {
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
 */
export const getFilteredMatchupsAgainstTeam = ({
  opponentId,
  selectedSeason,
  maxMatchupsCount = Infinity,
}: {
  readonly opponentId: TeamId;
  readonly selectedSeason: number;
  readonly maxMatchupsCount?: number;
}): readonly ExpandedGameInfo[] => {
  const minMatchupsCount = 5;
  if (maxMatchupsCount < minMatchupsCount) {
    throw new Error(
      `Cannot get filtered matchups: Max matchups count must be at least ${minMatchupsCount}.`
    );
  }

  const {past: pastMatchupsAgainstTeam, future: futureMatchupsAgainstTeam} =
    getMatchupsAgainstTeam(opponentId);
  const allMatchupsAgainstTeam = [...pastMatchupsAgainstTeam, ...futureMatchupsAgainstTeam];

  const selectedMatchup = allMatchupsAgainstTeam.find(({season}) => season === selectedSeason);

  if (typeof selectedMatchup === 'undefined') {
    throw new Error(
      `Cannot get filtered matchups: No matchup exists against ${opponentId} for the provided ${selectedSeason} season.`
    );
  }

  let filteredMatchupsAgainstTeam: readonly (ExpandedGameInfo | undefined)[];
  if (allMatchupsAgainstTeam.length < maxMatchupsCount) {
    // If the actual number of matchups is less than the maximum number of matchups, include all of
    // them.
    filteredMatchupsAgainstTeam = allMatchupsAgainstTeam;
  } else if (futureMatchupsAgainstTeam.length === 0) {
    // If there are no future matchups against the opponent, include a subset of past matchups.
    const seasonsWithPastMatchups = pastMatchupsAgainstTeam.map(({season}) => season);
    const selectedMatchupIndexWithinPastMatchupsArray =
      seasonsWithPastMatchups.indexOf(selectedSeason);

    // Dynamically display a subset of historical matchups, making sure to always include matchups
    // just before and after the currently selected matchup.
    if (
      selectedMatchupIndexWithinPastMatchupsArray >=
      pastMatchupsAgainstTeam.length - maxMatchupsCount + 2
    ) {
      filteredMatchupsAgainstTeam = [
        pastMatchupsAgainstTeam[0],
        ...pastMatchupsAgainstTeam.slice(-maxMatchupsCount + 1),
      ];
    } else if (selectedMatchupIndexWithinPastMatchupsArray <= 2) {
      filteredMatchupsAgainstTeam = [
        ...pastMatchupsAgainstTeam.slice(0, maxMatchupsCount - 1),
        pastMatchupsAgainstTeam[pastMatchupsAgainstTeam.length - 1],
      ];
    } else {
      filteredMatchupsAgainstTeam = [
        pastMatchupsAgainstTeam[0],
        ...pastMatchupsAgainstTeam.slice(
          // Start one matchup before the selected season.
          selectedMatchupIndexWithinPastMatchupsArray - 1,
          // End maxMatchupsCount minus 3 ((1) first matchup, (2) last matchcup, (3) matchup before
          // selected season) after the selected season.
          selectedMatchupIndexWithinPastMatchupsArray + maxMatchupsCount - 3
        ),
        pastMatchupsAgainstTeam[pastMatchupsAgainstTeam.length - 1],
      ];
    }
  } else if (pastMatchupsAgainstTeam.length === 0) {
    // If there are no past matchups against the opponent, include the next N future matchups.
    filteredMatchupsAgainstTeam = futureMatchupsAgainstTeam.slice(0, maxMatchupsCount);
  } else {
    // Otherwise, only include up to the maximum number of matchups, choosing a selection of them
    // from the past and future.

    // Determine the future matchups to show, always showing the next future matchup.
    const filteredFutureMatchupsAgainstTeam = [futureMatchupsAgainstTeam[0]];

    // Determine if the selected season is within the future matchups array. If so, optionally
    // include another future matchup in our filtered list.
    const selectedMatchupIndexWithinFutureMatchupsArray = futureMatchupsAgainstTeam.findIndex(
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

    let filteredPastMatchupsAgainstTeam: readonly (ExpandedGameInfo | undefined)[];

    if (pastMatchupsAgainstTeam.length <= desiredFilteredPastMatchupsCount) {
      filteredPastMatchupsAgainstTeam = [...pastMatchupsAgainstTeam];
    } else {
      const seasonsWithPastMatchups = pastMatchupsAgainstTeam.map(({season}) => season);
      const selectedMatchupIndexWithinPastMatchupsArray =
        seasonsWithPastMatchups.indexOf(selectedSeason);

      // Dynamically display a subset of historical matchups, making sure to always include matchups
      // just before and after the currently selected matchup.
      if (
        selectedMatchupIndexWithinPastMatchupsArray === -1 ||
        selectedMatchupIndexWithinPastMatchupsArray >=
          pastMatchupsAgainstTeam.length - desiredFilteredPastMatchupsCount + 2
      ) {
        filteredPastMatchupsAgainstTeam = [
          pastMatchupsAgainstTeam[0],
          ...pastMatchupsAgainstTeam.slice(-desiredFilteredPastMatchupsCount + 1),
        ];
      } else if (selectedMatchupIndexWithinPastMatchupsArray <= 2) {
        filteredPastMatchupsAgainstTeam = [
          ...pastMatchupsAgainstTeam.slice(0, desiredFilteredPastMatchupsCount - 1),
          pastMatchupsAgainstTeam[pastMatchupsAgainstTeam.length - 1],
        ];
      } else {
        filteredPastMatchupsAgainstTeam = [
          pastMatchupsAgainstTeam[0],
          ...pastMatchupsAgainstTeam.slice(
            // Start one matchup before the selected season.
            selectedMatchupIndexWithinPastMatchupsArray - 1,
            // End desiredFilteredPastMatchupsCount minus 3 ((1) first past matchup, (2) last past
            // matchup, (3) past matchup before selected season) after the selected season.
            selectedMatchupIndexWithinPastMatchupsArray + desiredFilteredPastMatchupsCount - 3
          ),
          pastMatchupsAgainstTeam[pastMatchupsAgainstTeam.length - 1],
        ];
      }
    }

    filteredMatchupsAgainstTeam = [
      ...filteredPastMatchupsAgainstTeam,
      ...filteredFutureMatchupsAgainstTeam,
    ];
  }

  return filteredMatchupsAgainstTeam.filter(
    (matchup): matchup is ExpandedGameInfo => typeof matchup !== 'undefined'
  );
};
