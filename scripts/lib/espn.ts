import range from 'lodash/range';

import {GameLinescore, GameScore} from '../../website/src/models/games.models';
import {
  IndividualTeamPollData,
  PollType,
  SeasonAllPollRankings,
  WeeklyIndividualPollRanking,
} from '../../website/src/models/polls.models';
import {TeamId, TeamRecords, TeamStats} from '../../website/src/models/teams.models';
import {Writable} from '../../website/src/models/utils.models';
import {Logger} from './logger';
import {Scraper} from './scraper';
import {Teams} from './teams';
import {assertNever, isNumber} from './utils';

const DEFAULT_TEAM_STATS: TeamStats = {
  firstDowns: 0,
  thirdDownAttempts: 0,
  thirdDownConversions: 0,
  fourthDownAttempts: 0,
  fourthDownConversions: 0,
  totalYards: 0,
  passYards: 0,
  passCompletions: 0,
  passAttempts: 0,
  yardsPerPass: 0,
  interceptionsThrown: 0,
  rushYards: 0,
  rushAttempts: 0,
  yardsPerRush: 0,
  penalties: 0,
  penaltyYards: 0,
  possession: '',
  // No default value is set for "fumbles" since it is optional and sometimes not available
  // immediately after the game ends.
  fumblesLost: 0,
};

const logger = new Logger({isSentryEnabled: false});

// TODO: Pull these dynamically instead of hard-coding them.
const AP_COACHES_POLL_DATES_2021 = [
  'Preseason',
  '2021-09-05',
  '2021-09-12',
  '2021-09-19',
  '2021-09-26',
  '2021-10-03',
  '2021-10-10',
  '2021-10-17',
  '2021-10-24',
  '2021-10-31',
  '2021-11-07',
  '2021-11-14',
  '2021-11-21',
  '2021-11-28',
  '2021-12-05',
  '2021-12-12',
  '2021-12-19',
  '2021-12-26',
];

const CFP_POLL_DATES_2021 = [
  '2021-11-23',
  '2021-11-30',
  '2021-12-07',
  '2021-12-14',
  '2021-12-21',
  '2021-12-28',
];

const _getEspnRankingsUrl = (season: number, weekIndex: number): string => {
  return `https://www.espn.com/college-football/rankings/_/week/${weekIndex}/year/${season}/seasontype/2`;
};

const _getEspnTeamScheduleUrl = (season: number, espnTeamId: number): string => {
  return `http://www.espn.com/college-football/team/schedule/_/id/${espnTeamId}/season/${season}`;
};

const _getPollRankingsForWeek = (
  $: cheerio.Root,
  weekIndex: number
): Record<PollType, WeeklyIndividualPollRanking | null> | null => {
  const pollRankings: Record<PollType, WeeklyIndividualPollRanking | null> = {
    [PollType.AP]: null,
    [PollType.Coaches]: null,
    [PollType.CFBPlayoff]: null,
  };

  const $pollSections = $('.InnerLayout__child.mb2');

  if ($pollSections.length === 0) {
    return null;
  }

  $pollSections.each((_, poll) => {
    const pollTitle = $(poll).find('.Table__Title').text().trim();

    let pollType: PollType;
    if (pollTitle.includes('AP')) {
      pollType = PollType.AP;
    } else if (pollTitle.includes('Coaches')) {
      pollType = PollType.Coaches;
    } else if (pollTitle.includes('College Football Playoff ')) {
      pollType = PollType.CFBPlayoff;
    } else {
      throw new Error(`Unexpected poll title: "${pollTitle}"`);
    }

    const teamsData: Record<string, IndividualTeamPollData> = {};
    const $pollRows = $(poll).find('tr');
    let previousTeamCurrentWeekRanking: number | null = null;
    $pollRows.each((_, pollRow) => {
      const $rowCells = $(pollRow).find('td');
      if ($rowCells.length !== 0) {
        const rowCellValues: string[] = $rowCells.map((_, cell) => $(cell).text().trim()).get();

        const currentWeekRanking = Number(rowCellValues[0]) || previousTeamCurrentWeekRanking;
        if (!currentWeekRanking) {
          throw new Error(`No current week ranking`);
        }
        previousTeamCurrentWeekRanking = currentWeekRanking;
        const teamName = Teams.normalizeName($($rowCells[1]).find('.pl3').text().trim());
        const record = rowCellValues[2];

        let trend: string;
        let points: number | null = null;
        switch (pollType) {
          case PollType.AP:
          case PollType.Coaches:
            points = Number(rowCellValues[3]);
            trend = rowCellValues[4];
            break;
          case PollType.CFBPlayoff:
            points = null;
            trend = rowCellValues[3];
            break;
          default:
            assertNever(pollType);
        }

        let previousWeekRanking: number | 'NR';
        if (trend === 'NR') {
          previousWeekRanking = 'NR';
        } else if (trend === '-') {
          previousWeekRanking = currentWeekRanking;
        } else {
          const trendElementClasses = $($rowCells[4]).find('.trend').attr('class');
          previousWeekRanking = trendElementClasses?.includes('positive')
            ? currentWeekRanking + Number(trend)
            : currentWeekRanking - Number(trend);
        }
        if (!record) {
          logger.error('No record found', {rowCellValues});
          return;
        }

        const teamData: IndividualTeamPollData = {
          record,
          ranking: currentWeekRanking,
          previousRanking: previousWeekRanking,
          ...(isNumber(points) ? {points} : {}),
        };

        teamsData[teamName] = teamData;
      }
    });

    pollRankings[pollType] = {
      date:
        pollType === PollType.CFBPlayoff
          ? CFP_POLL_DATES_2021[weekIndex - 10]
          : AP_COACHES_POLL_DATES_2021[weekIndex],
      teams: teamsData,
    };
  });

  return pollRankings;
};

/**
 * Returns a list of ESPN game IDs for the provided season.
 */
export const fetchGameIdsForSeason = async (season: number): Promise<number[]> => {
  const $ = await Scraper.get(
    `http://www.espn.com/college-football/team/schedule/_/id/87/season/${season}`
  );

  const gameIds: number[] = [];

  const $rows = $('tr.Table__TR');

  $rows.each((_, row) => {
    const $cols = $(row).find('td');
    if (
      // Get game IDs for both completed (7 columns) and upcoming (5 columns).
      ($cols.length === 5 || $cols.length === 7) &&
      $cols.eq(0).text().trim().toLowerCase() !== 'date'
    ) {
      // Link has format https://www.espn.com/college-football/game/_/gameId/<GAME_ID>/<SLUG>
      const href = $cols.eq(2).find('a').attr('href');
      const hrefTokens = href?.split('/') ?? [];
      const gameIdStringTokenIndex = hrefTokens.findIndex((token) => token === 'gameId');
      if (gameIdStringTokenIndex === -1) {
        // The actual game ID is the token right after the "gameId" string.
        const gameId = hrefTokens[gameIdStringTokenIndex + 1];

        if (gameId) {
          gameIds.push(Number(gameId));
        }
      }
    }
  });

  return gameIds;
};

/**
 * Returns a list of game stats and line scores from ESPN for the provided game.
 */
export const fetchStatsForGame = async (
  gameId: number
): Promise<{
  readonly stats: {readonly away: TeamStats; readonly home: TeamStats};
  readonly score: GameScore;
  readonly linescore: GameLinescore;
} | null> => {
  const [$matchup, $boxscore] = await Promise.all([
    Scraper.get(`http://www.espn.com/college-football/matchup?gameId=${gameId}`),
    Scraper.get(`http://www.espn.com/college-football/boxscore?gameId=${gameId}`),
  ]);

  // If the game is not over, return early with no data.
  const winnerIcon = $matchup('.Gamestrip__WinnerIcon');
  if (!winnerIcon.length) {
    logger.error('Skipped fetching stats for game since it is not over', {gameId});
    return null;
  }

  const $statsTable = $matchup('.TeamStatsTable');

  // Loop through each row in the stats table.
  const awayStats: Writable<TeamStats> = {...DEFAULT_TEAM_STATS};
  const homeStats: Writable<TeamStats> = {...DEFAULT_TEAM_STATS};

  $statsTable.find('tr').each((_, row) => {
    const rowCells = $matchup(row).children('td');
    if (rowCells.length !== 0) {
      const statName = $matchup(rowCells[0]).text().trim();
      const awayValue = $matchup(rowCells[1]).text().trim();
      const homeValue = $matchup(rowCells[2]).text().trim();

      switch (statName) {
        case '1st Downs':
          awayStats.firstDowns = Number(awayValue);
          homeStats.firstDowns = Number(homeValue);
          break;
        case '3rd down efficiency':
          awayStats.thirdDownAttempts = Number(awayValue.split('-')[1]);
          homeStats.thirdDownAttempts = Number(homeValue.split('-')[1]);
          awayStats.thirdDownConversions = Number(awayValue.split('-')[0]);
          homeStats.thirdDownConversions = Number(homeValue.split('-')[0]);
          break;
        case '4th down efficiency':
          awayStats.fourthDownAttempts = Number(awayValue.split('-')[1]);
          homeStats.fourthDownAttempts = Number(homeValue.split('-')[1]);
          awayStats.fourthDownConversions = Number(awayValue.split('-')[0]);
          homeStats.fourthDownConversions = Number(homeValue.split('-')[0]);
          break;
        case 'Total Yards':
          awayStats.totalYards = Number(awayValue);
          homeStats.totalYards = Number(homeValue);
          break;
        case 'Passing':
          awayStats.passYards = Number(awayValue);
          homeStats.passYards = Number(homeValue);
          break;
        case 'Comp-Att':
          awayStats.passCompletions = Number(awayValue.split('-')[0]);
          homeStats.passCompletions = Number(homeValue.split('-')[0]);
          awayStats.passAttempts = Number(awayValue.split('-')[1]);
          homeStats.passAttempts = Number(homeValue.split('-')[1]);
          break;
        case 'Yards per pass':
          awayStats.yardsPerPass = Number(awayValue);
          homeStats.yardsPerPass = Number(homeValue);
          break;
        case 'Interceptions thrown':
          awayStats.interceptionsThrown = Number(awayValue);
          homeStats.interceptionsThrown = Number(homeValue);
          break;
        case 'Rushing':
          awayStats.rushYards = Number(awayValue);
          homeStats.rushYards = Number(homeValue);
          break;
        case 'Rushing Attempts':
          awayStats.rushAttempts = Number(awayValue);
          homeStats.rushAttempts = Number(homeValue);
          break;
        case 'Yards per rush':
          awayStats.yardsPerRush = Number(awayValue);
          homeStats.yardsPerRush = Number(homeValue);
          break;
        case 'Penalties':
          awayStats.penalties = Number(awayValue.split('-')[0]);
          homeStats.penalties = Number(homeValue.split('-')[0]);
          awayStats.penaltyYards = Number(awayValue.split('-')[1]);
          homeStats.penaltyYards = Number(homeValue.split('-')[1]);
          break;
        case 'Fumbles lost':
          awayStats.fumblesLost = Number(awayValue);
          homeStats.fumblesLost = Number(homeValue);
          break;
        case 'Possession':
          awayStats.possession = awayValue;
          homeStats.possession = homeValue;
          break;
        case 'Turnovers':
          // Ignore turnovers stat since it can be computed (interceptions + lost fumbles).
          break;
        default:
          logger.error('Fetched unexpected stat name', {gameId, statName});
      }
    }
  });

  // Compute total fumbles (lost + recovered) from the boxscore page since the matchup page only
  // provides stats for lost fumbles. ESPN usually updates this a few hours after the game ends.
  const $boxScoreCategories = $boxscore('.Boxscore__Category');
  $boxScoreCategories.each((_, boxScoreCategory) => {
    const categoryName = $boxscore(boxScoreCategory).find('.TeamTitle').text().trim();
    if (categoryName.toLowerCase().includes('fumbles')) {
      const teamContainers = $boxscore(boxScoreCategory).find('.Boxscore__Team');
      teamContainers.each((j, teamContainer) => {
        const teamFumbleTotals = $boxscore(teamContainer).find('.Boxscore__Totals');
        const teamFumblesCount = teamFumbleTotals.find('td').eq(1).text().trim() ?? 0;

        if (j === 0) {
          awayStats.fumbles = Number(teamFumblesCount);
        } else {
          homeStats.fumbles = Number(teamFumblesCount);
        }
      });
    }
  });

  // Compute line score.
  const linescore: GameLinescore = {away: [], home: []};
  $matchup('.Gamestrip__Overview')
    .find('tbody')
    .find('tr')
    .each((_, row) => {
      const $rowCells = $matchup(row).children('td');

      const homeOrAway = linescore.away.length === 0 ? 'away' : 'home';

      $rowCells.each((index, $rowCell) => {
        // Skip first (team abbreviation) and last (total score) cells
        if (index > 0 && index !== $rowCells.length - 1) {
          const score = Number($matchup($rowCell).text().trim());
          linescore[homeOrAway].push(score);
        }
      });
    });

  return {
    stats: {
      away: awayStats as TeamStats,
      home: homeStats as TeamStats,
    },
    score: {
      home: linescore.home.reduce((sum, n) => sum + n, 0),
      away: linescore.away.reduce((sum, n) => sum + n, 0),
    },
    linescore,
  };
};

/**
 * Returns the records for the provided team during the provided season, up through but not
 * including their matchup against Notre Dame.
 */
export const fetchTeamRecordUpThroughNotreDameGameForSeason = async (
  season: number,
  teamId: TeamId
): Promise<TeamRecords> => {
  const {espnId} = Teams.getById(teamId);
  if (!espnId) {
    throw new Error('Team does not have an ESPN ID.');
  }
  const $ = await Scraper.get(_getEspnTeamScheduleUrl(season, espnId));

  let wins = 0;
  let losses = 0;
  let homeWins = 0;
  let homeLosses = 0;
  let awayWins = 0;
  let awayLosses = 0;
  let neutralWins = 0;
  let neutralLosses = 0;

  let teamAlreadyFacedNotreDame = false;
  $('tr.Table__TR').each((_, row) => {
    // Only fetch team records up through when they play Notre Dame for completed games (i.e., non-
    // header rows with 7 columns).
    const $cols = $(row).find('td');

    if (!teamAlreadyFacedNotreDame && $cols.length === 7 && $cols.eq(0).text().trim() !== 'Date') {
      const gameInfo = $cols.eq(1).text().trim();
      const gameResult = $cols.eq(2).text().trim()[0];

      // Bowl games are played at neutral sites and do not indicate either side with an @.
      let locationKey: 'home' | 'away' | 'neutral';
      if (gameInfo.endsWith('*')) {
        // ESPN uses an asterisk to denote neutral site games.
        locationKey = 'neutral';
      } else {
        locationKey = !gameInfo.includes('@') ? 'home' : 'away';
      }

      if (gameResult === 'W') {
        wins += 1;
        if (locationKey === 'home') {
          homeWins += 1;
        } else if (locationKey === 'away') {
          awayWins += 1;
        } else {
          neutralWins += 1;
        }
      } else if (gameResult === 'L') {
        losses += 1;
        if (locationKey === 'home') {
          homeLosses += 1;
        } else if (locationKey === 'away') {
          awayLosses += 1;
        } else {
          neutralLosses += 1;
        }
      }

      teamAlreadyFacedNotreDame = gameInfo.includes('Notre Dame');
    }
  });

  return {
    overall: `${wins}-${losses}`,
    home: `${homeWins}-${homeLosses}`,
    away: `${awayWins}-${awayLosses}`,
    neutral: `${neutralWins}-${neutralLosses}`,
  };
};

/**
 * Returns Notre Dame's records at each week of the provided season.
 */
export const fetchNotreDameWeeklyRecordsForSeason = async (
  season: number
): Promise<readonly TeamRecords[]> => {
  // TODO: Re-use fetchTeamRecordUpThroughNotreDameGameForSeason() instead of copying it.

  const {espnId} = Teams.getById(TeamId.ND);
  if (!espnId) {
    throw new Error('Notre Dame does not have an ESPN ID.');
  }
  const $ = await Scraper.get(_getEspnTeamScheduleUrl(season, espnId));

  let wins = 0;
  let losses = 0;
  let homeWins = 0;
  let homeLosses = 0;
  let awayWins = 0;
  let awayLosses = 0;
  let neutralWins = 0;
  let neutralLosses = 0;

  const weeklyRecords: TeamRecords[] = [];

  $('tr.Table__TR').each((_, row) => {
    const $cols = $(row).find('td');

    // Ignore rows which are headers or do not have the proper number of columns (e.g., bowl games
    // have a header row above them which say the bowl's name).
    const isIgnoredRow =
      $cols.eq(0).text().trim().toLowerCase() === 'date' ||
      ($cols.length !== 5 && $cols.length !== 7);

    if (!isIgnoredRow) {
      if ($cols.length === 7) {
        const gameInfo = $cols.eq(1).text().trim();
        const gameResult = $cols.eq(2).text().trim()[0];

        // Bowl games are played at neutral sites and do not indicate either side with an @.
        let locationKey: 'home' | 'away' | 'neutral';
        if (gameInfo.endsWith('*')) {
          // ESPN uses an asterisk to denote neutral site games.
          locationKey = 'neutral';
        } else {
          locationKey = !gameInfo.includes('@') ? 'home' : 'away';
        }

        if (gameResult === 'W') {
          wins += 1;
          if (locationKey === 'home') {
            homeWins += 1;
          } else if (locationKey === 'away') {
            awayWins += 1;
          } else {
            neutralWins += 1;
          }
        } else if (gameResult === 'L') {
          losses += 1;
          if (locationKey === 'home') {
            homeLosses += 1;
          } else if (locationKey === 'away') {
            awayLosses += 1;
          } else {
            neutralLosses += 1;
          }
        }
      }

      weeklyRecords.push({
        overall: `${wins}-${losses}`,
        home: `${homeWins}-${homeLosses}`,
        away: `${awayWins}-${awayLosses}`,
        neutral: `${neutralWins}-${neutralLosses}`,
      });
    }
  });

  return weeklyRecords;
};

/**
 * Returns the weekly poll rankings for the provided season.
 * TODO: This is currently unused.
 */
export const fetchPollsForSeason = async ({
  season,
}: {
  readonly season: number;
  readonly weeklyReleaseDates: readonly Date[];
}): Promise<SeasonAllPollRankings> => {
  // Fetch the HTML of the ESPN rankings page for each week of the season. Fetch up to a max number
  // of weeks, which should be enough for any season. We cannot rely on using ND's game count
  // because ND bye weeks would not be considered. Some of these fetches return an empty page and
  // will be filtered out later.
  const MAX_POLL_WEEKS_TO_FETCH = 18;
  const $weeklyRankings = await Promise.all(
    range(0, MAX_POLL_WEEKS_TO_FETCH).map((i) => {
      return Scraper.get(_getEspnRankingsUrl(season, i));
    })
  );

  // Scrape the actual rankings for each week using the HTML.
  const weeklyRankings = $weeklyRankings
    .map(($weeklyRanking, i) => _getPollRankingsForWeek($weeklyRanking, i))
    // Filter out weeks with no rankings that we over-eagerly fetched.
    .filter((weeklyRanking) => weeklyRanking !== null);

  // Loop through the weekly rankings and combine them into a standard format.
  const pollRankings: SeasonAllPollRankings = {
    [PollType.AP]: [],
    [PollType.Coaches]: [],
    [PollType.CFBPlayoff]: [],
  };
  weeklyRankings.forEach((rankings) => {
    [PollType.AP, PollType.Coaches, PollType.CFBPlayoff].forEach((pollType) => {
      const ranking = rankings[pollType];
      if (!ranking) return;
      pollRankings[pollType].push(ranking);
    });
  });

  return pollRankings;
};

/**
 * Returns the kickoff time for the provided game. If the game has not yet been assigned a kickoff
 * time, returns 'TBD'.
 * TODO: This is currently broken and always returns 'TBD'.
 */
export const fetchKickoffTimeForGame = async (espnGameId: number): Promise<Date | 'TBD'> => {
  const $ = await Scraper.get(`https://www.espn.com/college-football/game/_/gameId/${espnGameId}`);
  const $gameStatusSpan = $('.game-date-time > span').eq(0);
  const gameKickoffTime = $gameStatusSpan.attr('data-date');
  const isKickoffTimeTbd = $gameStatusSpan.find('.game-date').attr('data-istbd') === 'true';

  return isKickoffTimeTbd || !gameKickoffTime ? 'TBD' : new Date(gameKickoffTime);
};
