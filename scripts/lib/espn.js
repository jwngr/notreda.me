const _ = require('lodash');

const teams = require('./teams');
const logger = require('./logger');
const scraper = require('./scraper');
const {isNumber} = require('./utils');

const NORMALIZED_TEAM_NAMES = {
  Pitt: 'Pittsburgh',
  'Miami (FL)': 'Maimi',
  'Texas Christian': 'TCU',
  SMU: 'Southern Methodist',
  'North Carolina State': 'NC State',
};

// TODO: Pull these dynamically instead of hard-coding them.
const AP_COACHES_POLL_DATES_2020 = [
  'Preseason',
  '2020-09-06',
  '2020-09-13',
  '2020-09-20',
  '2020-09-27',
  '2020-10-04',
  '2020-10-11',
  '2020-10-18',
  '2020-10-25',
  '2020-11-01',
  '2020-11-08',
  '2020-11-15',
  '2020-11-22',
  '2020-11-29',
  '2020-12-06',
];

const CFP_POLL_DATES_2020 = [
  '2020-11-24',
  '2020-12-01',
  '2020-12-08',
  '2020-12-15',
  '2020-12-22',
];

const _getEspnRankingsUrl = (season, weekIndex) => {
  return `https://www.espn.com/college-football/rankings/_/week/${weekIndex}/year/${season}/seasontype/2`;
};

const _getEspnTeamScheduleUrl = (season, teamId) => {
  return `http://www.espn.com/college-football/team/schedule/_/id/${teamId}/season/${season}`;
};

const _normalizeTeamName = (teamName) => {
  return NORMALIZED_TEAM_NAMES[teamName] || teamName;
};

const _getPollRankingsForWeek = ($, weekIndex) => {
  const pollRankings = {};

  $('.InnerLayout__child.mb2').each((i, poll) => {
    const pollTitle = $(poll).find('.Table__Title').text().trim();

    let pollType;
    if (_.includes(pollTitle, 'AP')) {
      pollType = 'ap';
    } else if (_.includes(pollTitle, 'Coaches')) {
      pollType = 'coaches';
    } else if (_.includes(pollTitle, 'College Football Playoff ')) {
      pollType = 'cfbPlayoff';
    } else {
      throw new Error(`Unexpected poll title: "${pollTitle}"`);
    }

    pollRankings[pollType] = {
      date:
        pollType === 'cfbPlayoff'
          ? CFP_POLL_DATES_2020[weekIndex - 10]
          : AP_COACHES_POLL_DATES_2020[weekIndex],
      teams: {},
    };

    const $pollRows = $(poll).find('tr');
    let previousTeamCurrentWeekRanking = null;
    $pollRows.each((j, pollRow) => {
      const $rowCells = $(pollRow).find('td');
      if ($rowCells.length !== 0) {
        const rowCellValues = _.map($rowCells, (rowCell) => $(rowCell).text().trim());

        const currentWeekRanking = Number(rowCellValues[0]) || previousTeamCurrentWeekRanking;
        previousTeamCurrentWeekRanking = currentWeekRanking;
        const teamName = _normalizeTeamName($($rowCells[1]).find('.pl3').text().trim());
        const record = rowCellValues[2];
        const points = Number(rowCellValues[3]);

        const trend = rowCellValues[4];
        let previousWeekRanking;
        if (trend === 'NR') {
          previousWeekRanking = 'NR';
        } else if (trend === '-') {
          previousWeekRanking = currentWeekRanking;
        } else {
          const trendElementClasses = $($rowCells[4]).find('.trend').attr('class');
          previousWeekRanking = _.includes(trendElementClasses, 'positive')
            ? currentWeekRanking + Number(trend)
            : currentWeekRanking - Number(trend);
        }

        const teamData = {
          record,
          ranking: currentWeekRanking,
          previousRanking: previousWeekRanking,
        };

        if (isNumber(points)) {
          teamData.points = points;
        }

        pollRankings[pollType].teams[teamName] = teamData;
      }
    });
  });

  return pollRankings;
};

/**
 * Returns a list of ESPN game IDs for the provided season.
 *
 * @param  {number} season The season whose game IDs to fetch.
 *
 * @return {Promise<number[]>} An array of game IDs.
 */
const fetchGameIdsForSeason = (season) => {
  return scraper
    .get(`http://www.espn.com/college-football/team/schedule/_/id/87/season/${season}`)
    .then(($) => {
      const gameIds = [];

      const $rows = $('tr.Table__TR');

      $rows.each((i, row) => {
        const $cols = $(row).find('td');
        if (
          // Get game IDs for both completed (7 columns) and upcoming (5 columns).
          ($cols.length === 5 || $cols.length === 7) &&
          $cols.eq(0).text().trim().toLowerCase() !== 'date'
        ) {
          const gameId = $cols.eq(2).find('a').attr('href').split('gameId/')[1].trim();

          gameIds.push(gameId);
        }
      });

      return gameIds;
    })
    .catch((error) => {
      logger.error(`Error fetching ESPN game IDs.`, {error, season});
      throw error;
    });
};

/**
 * Returns a list of game stats and line scores from ESPN for the provided game.
 *
 * @param  {number} gameId The game ID of the game whose data to fetch.
 *
 * @return {Promise<Object>} A promise fulfilled with game stats and line scores.
 */
const fetchStatsForGame = (gameId) => {
  return Promise.all([
    scraper.get(`http://www.espn.com/college-football/matchup?gameId=${gameId}`),
    scraper.get(`http://www.espn.com/college-football/boxscore?gameId=${gameId}`),
  ])
    .then(([$matchup, $boxscore]) => {
      // If the game is not over, return early with no data.
      const gameStatus = $matchup('.status-detail').text().trim();
      if (!gameStatus.startsWith('Final')) {
        return;
      }

      const $statsTable = $matchup('.team-stats-list');

      // Loop through each row in the stats table
      const stats = {
        away: {},
        home: {},
      };

      $statsTable.find('tr').each((i, row) => {
        const rowCells = $matchup(row).children('td');
        if (rowCells.length !== 0) {
          const statName = $matchup(rowCells[0]).text().trim();
          const awayValue = $matchup(rowCells[1]).text().trim();
          const homeValue = $matchup(rowCells[2]).text().trim();

          switch (statName) {
            case '1st Downs':
              stats.away['firstDowns'] = Number(awayValue);
              stats.home['firstDowns'] = Number(homeValue);
              break;
            case '3rd down efficiency':
              stats.away['thirdDownAttempts'] = Number(awayValue.split('-')[1]);
              stats.home['thirdDownAttempts'] = Number(homeValue.split('-')[1]);
              stats.away['thirdDownConversions'] = Number(awayValue.split('-')[0]);
              stats.home['thirdDownConversions'] = Number(homeValue.split('-')[0]);
              break;
            case '4th down efficiency':
              stats.away['fourthDownAttempts'] = Number(awayValue.split('-')[1]);
              stats.home['fourthDownAttempts'] = Number(homeValue.split('-')[1]);
              stats.away['fourthDownConversions'] = Number(awayValue.split('-')[0]);
              stats.home['fourthDownConversions'] = Number(homeValue.split('-')[0]);
              break;
            case 'Total Yards':
              stats.away['totalYards'] = Number(awayValue);
              stats.home['totalYards'] = Number(homeValue);
              break;
            case 'Passing':
              stats.away['passYards'] = Number(awayValue);
              stats.home['passYards'] = Number(homeValue);
              break;
            case 'Comp-Att':
              stats.away['passCompletions'] = Number(awayValue.split('-')[0]);
              stats.home['passCompletions'] = Number(homeValue.split('-')[0]);
              stats.away['passAttempts'] = Number(awayValue.split('-')[1]);
              stats.home['passAttempts'] = Number(homeValue.split('-')[1]);
              break;
            case 'Yards per pass':
              stats.away['yardsPerPass'] = Number(awayValue);
              stats.home['yardsPerPass'] = Number(homeValue);
              break;
            case 'Interceptions thrown':
              stats.away['interceptionsThrown'] = Number(awayValue);
              stats.home['interceptionsThrown'] = Number(homeValue);
              break;
            case 'Rushing':
              stats.away['rushYards'] = Number(awayValue);
              stats.home['rushYards'] = Number(homeValue);
              break;
            case 'Rushing Attempts':
              stats.away['rushAttempts'] = Number(awayValue);
              stats.home['rushAttempts'] = Number(homeValue);
              break;
            case 'Yards per rush':
              stats.away['yardsPerRush'] = Number(awayValue);
              stats.home['yardsPerRush'] = Number(homeValue);
              break;
            case 'Penalties':
              stats.away['penalties'] = Number(awayValue.split('-')[0]);
              stats.home['penalties'] = Number(homeValue.split('-')[0]);
              stats.away['penaltyYards'] = Number(awayValue.split('-')[1]);
              stats.home['penaltyYards'] = Number(homeValue.split('-')[1]);
              break;
            case 'Fumbles lost':
              stats.away['fumblesLost'] = Number(awayValue);
              stats.home['fumblesLost'] = Number(homeValue);
              break;
            case 'Possession':
              stats.away['possession'] = awayValue;
              stats.home['possession'] = homeValue;
              break;
            case 'Turnovers':
              // Ignore turnovers stat since it can be computed by adding interceptions and lost
              // fumbles.
              break;
            default:
              logger.error('Unexpected stat name.', {gameId, statName});
          }
        }
      });

      // Fetch total fumbles (lost and recovered) from the boxscore page since the matchup page only
      // provides stats for lost fumbles.
      const $fumbleStatsContainer = $boxscore('#gamepackage-fumbles');
      $fumbleStatsContainer.find('.col').each((i, teamFumbleStatsContainer) => {
        const teamFumbleRows = $boxscore(teamFumbleStatsContainer).find('tr');
        const teamFumbleTotalRow = _.last(teamFumbleRows);

        const $teamFumbleTotalTd = $boxscore(teamFumbleTotalRow).find('.fum');

        let teamFumblesCount;
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

        const homeOrAway = i === 0 ? 'away' : 'home';
        stats[homeOrAway].fumbles = teamFumblesCount;
      });

      // It is difficult to completely differentiate the two cases above in which a team's fumble
      // count is 0, but we can at the very least check to see if there were any fumbles lost in
      // the game (which is available right at the conclusion of the game). If there are any lost
      // fumbles at all, the fumbles count for at least one team should be non-zero. So if they are
      // both zero, we know the data is just not available yet, so delete the fumble counts for now
      // which will hide it on the site itself.
      if (
        stats.home.fumblesLost + stats.away.fumblesLost > 0 &&
        stats.home.fumbles + stats.away.fumbles === 0
      ) {
        delete stats.home.fumbles;
        delete stats.away.fumbles;
      }

      // Line score
      const linescore = {
        away: [],
        home: [],
      };
      $matchup('#linescore')
        .find('tbody')
        .find('tr')
        .each((i, row) => {
          const rowCells = $matchup(row).children('td');

          const homeOrAway = linescore.away.length === 0 ? 'away' : 'home';

          _.forEach(rowCells, (rowCell, index) => {
            // Skip first (team abbreviation) and last (total score) cells
            if (index > 0 && index !== rowCells.length - 1) {
              const score = Number($matchup(rowCell).text().trim());
              linescore[homeOrAway].push(score);
            }
          });
        });

      return {
        stats,
        score: {
          home: _.reduce(linescore.home, (sum, n) => sum + n, 0),
          away: _.reduce(linescore.away, (sum, n) => sum + n, 0),
        },
        linescore,
      };
    })
    .catch((error) => {
      logger.error(`Error fetching ESPN game stats.`, {error, gameId});
      throw error;
    });
};

/**
 * Returns the overall, home, and away records for the provided team during the provided season up
 * through their matchup against Notre Dame.
 *
 * @param  {number} season The season whose records to fetch.
 * @param  {string} teamId The team ID whose record to fetch.
 *
 * @return {Promise<Object>} A promise fulfilled with the provided team's overall, home, and away
 *     records.
 */
const fetchTeamRecordUpThroughNotreDameGameForSeason = async (season, teamId) => {
  const {espnId} = teams.getById(teamId);
  const $ = await scraper.get(_getEspnTeamScheduleUrl(season, espnId));

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
  $('tr.Table__TR').each((i, row) => {
    // Only fetch team records up through when they play Notre Dame for completed games (i.e., non-
    // header rows with 7 columns).
    const $cols = $(row).find('td');

    upcomingGameIsBowlGame =
      upcomingGameIsBowlGame ||
      ($cols.length === 1 && _.includes($cols.eq(0).text().toLowerCase(), 'bowl'));

    if (!teamAlreadyFacedNotreDame && $cols.length === 7 && $cols.eq(0).text().trim() !== 'Date') {
      const gameInfo = $cols.eq(1).text().trim();
      const gameResult = $cols.eq(2).text().trim()[0];

      // Bowl games are played at neutral sites and do not indicate either side with an @.
      let locationKey;
      if (upcomingGameIsBowlGame) {
        locationKey = 'neutral';
      } else {
        locationKey = !_.includes(gameInfo, '@') ? 'home' : 'away';
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

      teamAlreadyFacedNotreDame = _.includes(gameInfo, 'Notre Dame');
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
 * Returns the overall, home, and away records for each week of Notre Dame's provided season.
 *
 * @param  {number} season The season whose records to fetch.
 *
 * @return {Promise<Object>} A promise fulfilled with the provided team's overall, home, and away
 *     records.
 */
const fetchNotreDameWeeklyRecordsForSeason = async (season) => {
  // TODO: Re-use fetchTeamRecordUpThroughNotreDameGameForSeason() instead of copying it.

  const {espnId} = teams.getById('ND');
  const $ = await scraper.get(_getEspnTeamScheduleUrl(season, espnId));

  let wins = 0;
  let losses = 0;
  let homeWins = 0;
  let homeLosses = 0;
  let awayWins = 0;
  let awayLosses = 0;
  let neutralWins = 0;
  let neutralLosses = 0;

  let weeklyRecords = [];

  let upcomingGameIsBowlGame = false;
  $('tr.Table__TR').each((i, row) => {
    const $cols = $(row).find('td');

    // Ignore rows which are headers or do not have the proper number of columns (e.g., bowl games
    // have a header row above them which say the bowl's name).
    const isIgnoredRow =
      $cols.eq(0).text().trim().toLowerCase() === 'date' ||
      ($cols.length !== 5 && $cols.length !== 7);
    upcomingGameIsBowlGame =
      upcomingGameIsBowlGame ||
      ($cols.length === 1 && _.includes($cols.eq(0).text().toLowerCase(), 'bowl'));

    if (!isIgnoredRow) {
      if ($cols.length === 7) {
        const gameInfo = $cols.eq(1).text().trim();
        const gameResult = $cols.eq(2).text().trim()[0];

        // Bowl games are played at neutral sites and do not indicate either side with an @.
        let locationKey;
        if (upcomingGameIsBowlGame) {
          locationKey = 'neutral';
        } else {
          locationKey = !_.includes(gameInfo, '@') ? 'home' : 'away';
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
 *
 * @param  {number} season The season whose polls to fetch.
 *
 * @return {Promise<Object>} A promise fulfilled with the poll rankins for the provided season.
 */
const fetchPollsForSeason = async (season) => {
  const $currentWeekRankings = await scraper.get(`https://www.espn.com/college-football/rankings`);

  const $headline = $currentWeekRankings('.page-container .headline');
  const headlineText = $headline.text().trim();

  // Determine how many weeks of ranking have been released to date.
  let currentWeekIndex;
  if (_.includes(headlineText, 'Preseason')) {
    currentWeekIndex = 0;
  } else if (_.includes(headlineText, 'Week')) {
    currentWeekIndex = Number(headlineText.split('Week ')[1]) - 1;
  } else {
    currentWeekIndex = 15;
  }

  // Fetch the HTML for all previous week rankings.
  const $priorWeeksRankings = await Promise.all(
    _.range(1, currentWeekIndex + 1).map((i) => {
      return scraper.get(_getEspnRankingsUrl(season, i))})
  );

  // Scrape the actual rankings for each week using the HTML.
  const currentWeekRankings = _getPollRankingsForWeek($currentWeekRankings, currentWeekIndex);
  const priorWeeksRankings = _.map($priorWeeksRankings, ($priorWeekRankings, i) =>
    _getPollRankingsForWeek($priorWeekRankings, i)
  );

  // Loop through the weekly rankings and combine them into a standard format.
  const pollRankings = {};
  [...priorWeeksRankings, currentWeekRankings].forEach((rankings) => {
    Object.keys(rankings).forEach((pollType) => {
      pollRankings[pollType] = pollRankings[pollType] || [];
      pollRankings[pollType].push(rankings[pollType]);
    });
  });

  return pollRankings;
};

/**
 * Returns the kickoff time for the provided game.
 *
 * @return {Promise<Date>} The kickoff time for the provided game, or 'TBD' if the game has not yet
 *     been assigned a kickoff time.
 */
const fetchKickoffTimeForGame = (espnGameId) => {
  return scraper
    .get(`https://www.espn.com/college-football/game/_/gameId/${espnGameId}`)
    .then(($) => {
      const $gameStatusSpan = $('.game-date-time > span').eq(0);
      const gameKickoffTime = $gameStatusSpan.attr('data-date');
      const isKickoffTimeTbd = $gameStatusSpan.find('.game-date').attr('data-istbd') === 'true';

      if (!gameKickoffTime || isKickoffTimeTbd) {
        return 'TBD';
      }

      return new Date(gameKickoffTime);
    })
    .catch((error) => {
      logger.error(`Error fetching kickoff time for game.`, {error, espnGameId});
      throw error;
    });
};

module.exports = {
  fetchStatsForGame,
  fetchPollsForSeason,
  fetchGameIdsForSeason,
  fetchKickoffTimeForGame,
  fetchNotreDameWeeklyRecordsForSeason,
  fetchTeamRecordUpThroughNotreDameGameForSeason,
};
