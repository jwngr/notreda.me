import range from 'lodash/range';

import {
  GameLinescore,
  GameScore,
  IndividualTeamPollData,
  PollType,
  SeasonAllPollRankings,
  TeamId,
  TeamRecords,
  TeamStats,
  WeeklyIndividualPollRanking,
  Writable,
} from '../../website/src/models';
import {Logger} from './logger';
import {Scraper} from './scraper';
import {Teams} from './teams';
import {isNumber} from './utils';

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
  fumbles: 0,
  fumblesLost: 0,
  possession: '',
};

const logger = new Logger({isSentryEnabled: false});

const NORMALIZED_TEAM_NAMES: Record<string, string> = {
  Pitt: 'Pittsburgh',
  'Miami (FL)': 'Maimi',
  'Texas Christian': 'TCU',
  SMU: 'Southern Methodist',
  'North Carolina State': 'NC State',
};

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
];

const CFP_POLL_DATES_2021 = ['2021-11-23', '2021-11-30', '2021-12-07', '2021-12-14', '2021-12-21'];

const _getEspnRankingsUrl = (season: number, weekIndex: number): string => {
  return `https://www.espn.com/college-football/rankings/_/week/${weekIndex}/year/${season}/seasontype/2`;
};

const _getEspnTeamScheduleUrl = (season: number, espnTeamId: number): string => {
  return `http://www.espn.com/college-football/team/schedule/_/id/${espnTeamId}/season/${season}`;
};

const _normalizeTeamName = (teamName: string): string => {
  return NORMALIZED_TEAM_NAMES[teamName] ?? teamName;
};

const _getPollRankingsForWeek = (
  $: cheerio.Root,
  weekIndex: number
): Record<PollType, WeeklyIndividualPollRanking | null> => {
  const pollRankings: Record<PollType, WeeklyIndividualPollRanking | null> = {
    [PollType.AP]: null,
    [PollType.COACHES]: null,
    [PollType.CFP]: null,
  };

  $('.InnerLayout__child.mb2').each((_, poll) => {
    const pollTitle = $(poll).find('.Table__Title').text().trim();

    let pollType: PollType;
    if (pollTitle.includes('AP')) {
      pollType = PollType.AP;
    } else if (pollTitle.includes('Coaches')) {
      pollType = PollType.COACHES;
    } else if (pollTitle.includes('College Football Playoff ')) {
      pollType = PollType.CFP;
    } else {
      throw new Error(`Unexpected poll title: "${pollTitle}"`);
    }

    const teamsData: Record<string, IndividualTeamPollData> = {};
    const $pollRows = $(poll).find('tr');
    let previousTeamCurrentWeekRanking: number | null = null;
    $pollRows.each((_, pollRow) => {
      const $rowCells = $(pollRow).find('td');
      if ($rowCells.length !== 0) {
        const rowCellValues = $rowCells.map((rowCell) => $(rowCell).text().trim());

        const currentWeekRanking = Number(rowCellValues[0]) || previousTeamCurrentWeekRanking;

        if (!currentWeekRanking) {
          throw new Error(`No current week ranking`);
        }

        previousTeamCurrentWeekRanking = currentWeekRanking;
        const teamName = _normalizeTeamName($($rowCells[1]).find('.pl3').text().trim());
        const record = rowCellValues[2].data;
        const points = Number(rowCellValues[3].data);

        const trend = rowCellValues[4];
        let previousWeekRanking: number | 'NR';
        if (trend.data === 'NR') {
          previousWeekRanking = 'NR';
        } else if (trend.data === '-') {
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
        pollType === PollType.CFP
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
      const gameId = $cols.eq(2).find('a').attr('href')?.split('gameId/')[1].trim();

      if (gameId) {
        gameIds.push(Number(gameId));
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
  const gameStatus = $matchup('.status-detail').text().trim();
  if (!gameStatus.startsWith('Final')) {
    return null;
  }

  const $statsTable = $matchup('.team-stats-list');

  // Loop through each row in the stats table.
  const awayStats: Writable<TeamStats> = DEFAULT_TEAM_STATS;
  const homeStats: Writable<TeamStats> = DEFAULT_TEAM_STATS;

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
          logger.error('Unexpected stat name.', {gameId, statName});
      }
    }

    return {
      away: awayStats,
      home: homeStats,
    };
  });

  // Fetch total fumbles (lost and recovered) from the boxscore page since the matchup page only
  // provides stats for lost fumbles.
  const $fumbleStatsContainer = $boxscore('#gamepackage-fumbles');
  $fumbleStatsContainer.find('.col').each((i, teamFumbleStatsContainer) => {
    const teamFumbleRows = $boxscore(teamFumbleStatsContainer).find('tr');
    const teamFumbleTotalRow = teamFumbleRows.last();

    const $teamFumbleTotalTd = $boxscore(teamFumbleTotalRow).find('.fum');

    let teamFumblesCount: number;
    if ($teamFumbleTotalTd.length === 0) {
      // There are no stats on fumbles for this team, meaning either (1) they did not have any
      // fumbles or fumble recoveries or (2) the fumble stats have not yet bet updated by ESPN
      // (they usually happen a few hours after the game ends). Either way, set this value to 0
      // and we will clean it up as much as we can below.
      teamFumblesCount = 0;
    } else {
      // Otherwise, the team's fumble count is the text of the element we grabbed.
      teamFumblesCount = Number($teamFumbleTotalTd.text().trim());
    }

    if (i === 0) {
      awayStats.fumbles = teamFumblesCount;
    } else {
      homeStats.fumbles = teamFumblesCount;
    }
  });

  // It is difficult to completely differentiate the two cases above in which a team's fumble
  // count is 0, but we can at the very least check to see if there were any fumbles lost in
  // the game (which is available right at the conclusion of the game). If there are any lost
  // fumbles at all, the fumbles count for at least one team should be non-zero. So if they are
  // both zero, we know the data is just not available yet, so delete the fumble counts for now
  // which will hide it on the site itself.
  if (
    (homeStats.fumblesLost ?? 0) + (awayStats.fumblesLost ?? 0) > 0 &&
    (homeStats.fumbles ?? 0) + (awayStats.fumbles ?? 0) === 0
  ) {
    delete homeStats.fumbles;
    delete awayStats.fumbles;
  }

  // Line score
  const linescore: GameLinescore = {away: [], home: []};
  $matchup('#linescore')
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

  let upcomingGameIsBowlGame = false;
  let teamAlreadyFacedNotreDame = false;
  $('tr.Table__TR').each((_, row) => {
    // Only fetch team records up through when they play Notre Dame for completed games (i.e., non-
    // header rows with 7 columns).
    const $cols = $(row).find('td');

    upcomingGameIsBowlGame =
      upcomingGameIsBowlGame ||
      ($cols.length === 1 && $cols.eq(0).text().toLowerCase().includes('bowl'));

    if (!teamAlreadyFacedNotreDame && $cols.length === 7 && $cols.eq(0).text().trim() !== 'Date') {
      const gameInfo = $cols.eq(1).text().trim();
      const gameResult = $cols.eq(2).text().trim()[0];

      // Bowl games are played at neutral sites and do not indicate either side with an @.
      let locationKey;
      if (upcomingGameIsBowlGame) {
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

  let upcomingGameIsBowlGame = false;
  $('tr.Table__TR').each((_, row) => {
    const $cols = $(row).find('td');

    // Ignore rows which are headers or do not have the proper number of columns (e.g., bowl games
    // have a header row above them which say the bowl's name).
    const isIgnoredRow =
      $cols.eq(0).text().trim().toLowerCase() === 'date' ||
      ($cols.length !== 5 && $cols.length !== 7);
    upcomingGameIsBowlGame =
      upcomingGameIsBowlGame ||
      ($cols.length === 1 && $cols.eq(0).text().toLowerCase().includes('bowl'));

    if (!isIgnoredRow) {
      if ($cols.length === 7) {
        const gameInfo = $cols.eq(1).text().trim();
        const gameResult = $cols.eq(2).text().trim()[0];

        // Bowl games are played at neutral sites and do not indicate either side with an @.
        let locationKey;
        if (upcomingGameIsBowlGame) {
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
 */
export const fetchPollsForSeason = async (season: number): Promise<SeasonAllPollRankings> => {
  const $currentWeekRankings = await Scraper.get(`https://www.espn.com/college-football/rankings`);

  const $headline = $currentWeekRankings('.page-container .headline');
  const headlineText = $headline.text().trim();

  // Determine how many weeks of ranking have been released to date.
  let currentWeekIndex;
  if (headlineText.includes('Preseason')) {
    currentWeekIndex = 0;
  } else if (headlineText.includes('Week')) {
    currentWeekIndex = Number(headlineText.split('Week ')[1]) - 1;
  } else {
    currentWeekIndex = 15;
  }

  // Fetch the HTML for all previous week rankings.
  const $priorWeeksRankings = await Promise.all(
    range(1, currentWeekIndex + 1).map((i) => {
      return Scraper.get(_getEspnRankingsUrl(season, i));
    })
  );

  // Scrape the actual rankings for each week using the HTML.
  const currentWeekRankings = _getPollRankingsForWeek($currentWeekRankings, currentWeekIndex);
  const priorWeeksRankings = $priorWeeksRankings.map(($priorWeekRankings, i) =>
    _getPollRankingsForWeek($priorWeekRankings, i)
  );

  // Loop through the weekly rankings and combine them into a standard format.
  const pollRankings: SeasonAllPollRankings = {
    ap: [],
    coaches: [],
    cfbPlayoff: [],
  };
  [...priorWeeksRankings, currentWeekRankings].forEach((rankings) => {
    Object.entries(rankings).forEach(([pollType, pollRanking]) => {
      if (!pollRanking) return;
      pollRankings[pollType as PollType].push(pollRanking);
    });
  });

  return pollRankings;
};

/**
 * Returns the kickoff time for the provided game. If the game has not yet been assigned a kickoff
 * time, returns 'TBD'.
 */
export const fetchKickoffTimeForGame = async (espnGameId: number): Promise<Date | 'TBD'> => {
  const $ = await Scraper.get(`https://www.espn.com/college-football/game/_/gameId/${espnGameId}`);
  const $gameStatusSpan = $('.game-date-time > span').eq(0);
  const gameKickoffTime = $gameStatusSpan.attr('data-date');
  const isKickoffTimeTbd = $gameStatusSpan.find('.game-date').attr('data-istbd') === 'true';

  return isKickoffTimeTbd || !gameKickoffTime ? 'TBD' : new Date(gameKickoffTime);
};