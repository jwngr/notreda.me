import {CURRENT_SEASON} from '../../lib/constants';
import {Teams} from '../../lib/teams';
import {isNonEmptyString} from '../../lib/utils';
import {ValidatorFuncWithSchedule} from '../../models';
import {GameResult} from '../../models/games.models';

export const validateMiscellaneous: ValidatorFuncWithSchedule = ({
  currentGameInfo,
  seasonScheduleData,
  assert,
}) => {
  const {
    result,
    season,
    nickname,
    weekIndex,
    headCoach,
    espnGameId,
    isBowlGame,
    isGameOver,
    opponentId,
    isVacatedWin,
    highlightsYouTubeVideoId,
    isLatestCompletedGame,
  } = currentGameInfo;

  assert(Teams.existsById(opponentId), 'Opponent ID must correspond to a valid team.', {
    opponentId,
  });

  if (isGameOver) {
    // Completed games.

    /****************/
    /*  HEAD COACH  */
    /****************/
    assert(isNonEmptyString(headCoach), 'Completed game must have a head coach.', {headCoach});

    /**********************/
    /*  HIGHLIGHTS VIDEO  */
    /**********************/
    // Ensure all completed games since 2015 have a YouTube highlights video, adding an exception
    // for the latest completed game since it needs to be manually added after the game is
    // completed.
    // TODO: Update this after adding highlights video IDs for older games.
    if (season >= 2015) {
      assert(
        isNonEmptyString(highlightsYouTubeVideoId) || isLatestCompletedGame,
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
      typeof espnGameId !== 'undefined' && espnGameId >= 0,
      'Completed game must have ESPN game ID.',
      {
        espnGameId,
      }
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
    if (weekIndex === 0) {
      // This check only needs to be made once per season it will be the same for every game of the
      // season.
      const shamrockSeriesGameCount = seasonScheduleData.filter(
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
      typeof isBowlGame === 'undefined' || weekIndex === seasonScheduleData.length - 1,
      'Bowl games should be at the end of a season.',
      {isBowlGame, weekIndex, seasonGamesCount: seasonScheduleData.length}
    );

    /************************/
    /*  NEUTRAL SITE GAMES  */
    /************************/

    assert(
      typeof isBowlGame === 'undefined' || weekIndex === seasonScheduleData.length - 1,
      'Bowl games should be at the end of a season.',
      {isBowlGame, weekIndex, seasonGamesCount: seasonScheduleData.length}
    );

    /******************/
    /*  VACATED WINS  */
    /******************/
    if (result === GameResult.Win && (season === 2012 || season === 2013)) {
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
      {isVacatedWin}
    );

    assert(
      typeof highlightsYouTubeVideoId === 'undefined',
      'Future games should not have a highlights video ID.',
      {highlightsYouTubeVideoId}
    );

    if (season === CURRENT_SEASON) {
      // Unplayed current season game.
      assert(
        typeof espnGameId !== 'undefined',
        'Unplayed current season game should have an ESPN game ID.',
        {espnGameId}
      );
    } else if (season > CURRENT_SEASON) {
      // Future season games.
      assert(typeof espnGameId === 'undefined', 'Future games should not have an ESPN game ID.', {
        espnGameId,
      });
    }
  }
};
