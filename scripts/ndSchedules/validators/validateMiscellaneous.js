const _ = require('lodash');

const teams = require('../../lib/teams');
const {CURRENT_SEASON} = require('../../lib/constants');
const {isNumber, isNonEmptyString} = require('../../lib/utils');

module.exports = (
  [
    {
      result,
      season,
      nickname,
      weekIndex,
      headCoach,
      espnGameId,
      isBowlGame,
      isGameOver,
      isHomeGame,
      opponentId,
      isVacatedWin,
      isShamrockSeries,
      highlightsYouTubeVideoId,
    },
    seasonScheduleData,
  ],
  assert
) => {
  assert(typeof isHomeGame === 'boolean', 'isHomeGame must be a boolean.', {isHomeGame});

  assert(teams.existsById(opponentId), 'Opponent ID must correspond to a valid team.', {
    opponentId,
  });

  if (isGameOver) {
    // Completed games.

    /****************/
    /*  headCoach  */
    /****************/
    assert(isNonEmptyString(headCoach), 'Completed game must have a head coach.', {headCoach});

    /*********************************/
    /*  HIGHLIGHTS YOUTUBE VIDEO ID  */
    /*********************************/
    // TODO: add highlights video IDs for older games.
    if (season >= 2015) {
      assert(
        isNonEmptyString(highlightsYouTubeVideoId),
        'Completed game must have a highlights video ID.',
        {
          highlightsYouTubeVideoId,
        }
      );
    }

    /******************/
    /*  ESPN GAME ID  */
    /******************/
    assert(
      typeof espnGameId === 'undefined' || isNumber(espnGameId),
      'ESPN game ID should be a number.',
      {espnGameId}
    );

    /**************/
    /*  NICKNAME  */
    /**************/
    assert(
      typeof nickname === 'undefined' || isNonEmptyString(nickname),
      'Nickname should be undefined or a non-empty string.',
      {nickname}
    );

    /***************************/
    /*  SHAMROCK SERIES GAMES  */
    /***************************/
    assert(
      typeof isShamrockSeries === 'undefined' || isShamrockSeries === true,
      'Shamrock Series games should set isShamrockSeries to true.',
      {isShamrockSeries}
    );

    if (weekIndex === 0) {
      // This check only needs to be made once per season it will be the same for every game of the
      // season.
      const shamrockSeriesGameCount = _.filter(
        seasonScheduleData,
        ({isShamrockSeries}) => !!isShamrockSeries
      ).length;
      assert(
        shamrockSeriesGameCount <= 1,
        'At most one game person season can be a Shamrock Series game.',
        {shamrockSeriesGameCount}
      );
    }

    /****************/
    /*  BOWL GAMES  */
    /****************/
    assert(
      typeof isBowlGame === 'undefined' || isBowlGame === true,
      'Bowl games should set isBowlGame to true.',
      {isBowlGame}
    );

    assert(
      typeof isBowlGame === 'undefined' || weekIndex === seasonScheduleData.length - 1,
      'Bowl games should be at the end of a season.',
      {isBowlGame, weekIndex, seasonGamesCount: seasonScheduleData.lengt}
    );

    /******************/
    /*  VACATED WINS  */
    /******************/
    if (result === 'W' && (season === 2012 || season === 2013)) {
      assert(isVacatedWin === true, 'Game should be marked as vacated.', {result, isVacatedWin});
    } else {
      assert(typeof isVacatedWin === 'undefined', 'Game should not be marked as vacated.', {
        result,
        isVacatedWin,
      });
    }
  } else {
    // Future games (unplayed current season games and future season games).
    assert(typeof headCoach === 'undefined', 'Future games should not have a head coach.', {
      headCoach,
    });

    assert(
      typeof isVacatedWin === 'undefined',
      'Future games should not have a vacated win boolean.',
      {
        isVacatedWin,
      }
    );

    assert(
      typeof highlightsYouTubeVideoId === 'undefined',
      'Future games should not have a highlights video ID.',
      {
        highlightsYouTubeVideoId,
      }
    );

    if (season > CURRENT_SEASON) {
      // Future season games.
      assert(typeof espnGameId === 'undefined', 'Future games should not have an ESPN game ID.', {
        espnGameId,
      });
    }
  }
};
