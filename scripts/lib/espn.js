const _ = require('lodash');

const teams = require('./teams');
const logger = require('./logger');
const scraper = require('./scraper');

const ESPN_TEAM_HOME_PAGE_URL_PREFIX = `https://www.espn.com/college-football/team/_/id/`;

const NORMALIZED_TEAM_NAMES = {
  Pitt: 'Pittsburgh',
  'Miami (FL)': 'Maimi',
  'Texas Christian': 'TCU',
  SMU: 'Southern Methodist',
  'North Carolina State': 'NC State',
};

// TODO: pull these dynamically instead of hard-coding them.
const AP_COACHES_POLL_DATES_2019 = [
  "Preseason",
  "2019-09-03",
  "2019-09-08",
  "2019-09-15",
  "2019-09-22",
  "2019-09-29",
  "2019-10-06",
  "2019-10-14",
  "2019-10-21",
  "2019-10-27",
  "2019-11-03",
  "2019-11-10",
  "2019-11-17",
  "2019-11-24",
  "2019-12-01",
  "2019-12-08",
]

const CFP_POLL_DATES_2019 = [
  "2019-11-06",
  "2019-11-13",
  "2019-11-20",
  "2019-11-27",
  "2019-12-04",
  "2019-12-08",
]

const _getEspnRankingsUrl = (season, weekIndex) => {
  return `https://www.espn.com/college-football/rankings/_/week/${weekIndex}/year/${season}/seasontype/2`;
}

const _normalizeTeamName = (teamName) => {
  return NORMALIZED_TEAM_NAMES[teamName] || teamName;
};

const _getPollRankingsForWeek = ($, weekIndex) => {
  const pollRankings = {};

  $(".InnerLayout__child.mb2").each((i, poll) => {
    const pollTitle = $(poll).find(".Table__Title").text().trim();

    let pollType;
    if (_.includes(pollTitle, 'AP')) {
      pollType = 'ap';
    } else if (_.includes(pollTitle, 'Coaches')) {
      pollType = 'coaches';
    } else if (_.includes(pollTitle, 'College Football Playoff ')) {
      pollType = 'cfbPlayoff'
    } else {
      throw new Error(`Unexpected poll title: "${pollTitle}"`);
    }

    pollRankings[pollType] = {
      date: pollType === 'cfbPlayoff' ? CFP_POLL_DATES_2019[weekIndex - 10] : AP_COACHES_POLL_DATES_2019[weekIndex],
      teams: {},
    };

    const $pollRows = $(poll).find("tr");
    let previousTeamCurrentWeekRanking = null;
    $pollRows.each((j, pollRow) => {
      const $rowCells = $(pollRow).find("td");
      if ($rowCells.length !== 0) {
        const rowCellValues = _.map($rowCells, (rowCell) => $(rowCell).text().trim());

        const currentWeekRanking = Number(rowCellValues[0]) || previousTeamCurrentWeekRanking;
        previousTeamCurrentWeekRanking = currentWeekRanking;
        const teamName = _normalizeTeamName($($rowCells[1]).find(".pl3").text().trim());
        const record = rowCellValues[2];
        const points =Number(rowCellValues[3]);

        const trend = rowCellValues[4];
        let previousWeekRanking;
        if (trend === 'NR') {
          previousWeekRanking = 'NR';
        } else if (trend === '-') {
          previousWeekRanking = currentWeekRanking;
        } else {
          const trendElementClasses = $($rowCells[4]).find('.trend').attr("class");
          previousWeekRanking = _.includes(trendElementClasses, 'positive') ? currentWeekRanking + Number(trend) : currentWeekRanking - Number(trend);
        }

        const teamData = {
          record,
          ranking: currentWeekRanking,
          previousRanking: previousWeekRanking
        }

        if (typeof points === 'number' && !isNaN(points)) {
          teamData.points = points;
        }

        pollRankings[pollType].teams[teamName] = teamData;
      }
    })
  })

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
          $cols.length === 7 &&
          $cols
            .eq(0)
            .text()
            .trim() !== 'Date'
        ) {
          const $spans = $cols.eq(2).find('span');

          const gameId = $spans
            .eq(1)
            .find('a')
            .attr('href')
            .split('gameId/')[1]
            .trim();

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
    scraper
    .get(`http://www.espn.com/college-football/matchup?gameId=${gameId}`),
    scraper
    .get(`http://www.espn.com/college-football/boxscore?gameId=${gameId}`),
  ])
    .then(([$matchup, $boxscore]) => {
      const $statsTable = $matchup('.team-stats-list');

      // Loop through each row in the stats table
      const stats = {
        away: {},
        home: {},
      };

      $statsTable.find('tr').each((i, row) => {
        const rowCells = $matchup(row).children('td');
        if (rowCells.length !== 0) {
          const statName = $matchup(rowCells[0])
            .text()
            .trim();
          const awayValue = $matchup(rowCells[1])
            .text()
            .trim();
          const homeValue = $matchup(rowCells[2])
            .text()
            .trim();

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
        const teamFubmleTotalsRow = $boxscore(teamFumbleStatsContainer).find('tr');
        const teamFumbles = $boxscore(_.last(teamFubmleTotalsRow)).find('.fum')
            .text()
            .trim();

        const homeOrAway = i === 0 ? 'away' : 'home';
        stats[homeOrAway].fumbles = Number(teamFumbles);
      });

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
              const score = Number(
                $matchup(rowCell)
                  .text()
                  .trim()
              );
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
 * Returns the overall, home, and away records for the provided team during the current season up
 * through their matchup against Notre Dame.
 *
 * @param  {string} teamId The team ID whose record to fetch.
 * 
 * @return {Promise<Object>} A promise fulfilled with the provided team's overall, home, and away
 *     records.
 */
const fetchTeamRecordUpThroughNotreDameGameForCurrentSeason = async (teamId) => {
  const {espnId} = teams.get(teamId); 
  const $ = await scraper.get(`${ESPN_TEAM_HOME_PAGE_URL_PREFIX}${espnId}`);

  let wins = 0;
  let losses = 0;
  let homeWins = 0;
  let homeLosses = 0;
  let awayWins = 0;
  let awayLosses = 0;

  let teamAlreadyFacedNotreDame = false;
  $('.club-schedule li').each((i, row) => {
    // Only fetch team records up through when they play Notre Dame.
    if (!teamAlreadyFacedNotreDame) {
      const gameInfo = $(row)
        .find('.game-info')
        .text()
        .trim();
      const gameResult = $(row)
        .find('.game-result')
        .text()
        .trim();

      const isHomeGame = !_.includes(gameInfo, '@');

      if (gameResult === 'W') {
        wins += 1;
        if (isHomeGame) {
          homeWins += 1;
        } else {
          awayWins += 1;
        }
      } else if (gameResult === 'L') {
        losses += 1;
        if (isHomeGame) {
          homeLosses += 1;
        } else {
          awayLosses += 1;
        }
      }
      
      teamAlreadyFacedNotreDame = _.endsWith(gameInfo, ' ND');
    }
  });

  return {
    overall: `${wins}-${losses}`,
    home: `${homeWins}-${homeLosses}`,
    away: `${awayWins}-${awayLosses}`,
  };
};

/**
 * Returns the overall, home, and away records for each week of Notre Dame's current season.
 *
 * @param  {string} teamId The team ID whose record to fetch.
 * 
 * @return {Promise<Object>} A promise fulfilled with the provided team's overall, home, and away
 *     records.
 */
const fetchNotreDameWeeklyRecordsForCurrentSeason = async () => {
  const {espnId} = teams.get('ND'); 
  const $ = await scraper.get(`${ESPN_TEAM_HOME_PAGE_URL_PREFIX}${espnId}`);

  let wins = 0;
  let losses = 0;
  let homeWins = 0;
  let homeLosses = 0;
  let awayWins = 0;
  let awayLosses = 0;

  let weeklyRecords = [];

  $('.club-schedule li').each((i, row) => {
    const gameInfo = $(row)
      .find('.game-info')
      .text()
      .trim();
    const gameResult = $(row)
      .find('.game-result')
      .text()
      .trim();

    const isHomeGame = !_.includes(gameInfo, '@');

    if (gameResult === 'W') {
      wins += 1;
      if (isHomeGame) {
        homeWins += 1;
      } else {
        awayWins += 1;
      }
    } else if (gameResult === 'L') {
      losses += 1;
      if (isHomeGame) {
        homeLosses += 1;
      } else {
        awayLosses += 1;
      }
    }

    weeklyRecords.push({
      overall: `${wins}-${losses}`,
      home: `${homeWins}-${homeLosses}`,
      away: `${awayWins}-${awayLosses}`,
    })
  });

  return weeklyRecords;
}

/**
 * Returns the weekly poll rankings for the provided season.
 *
 * @param  {number} season The season whose polls to fetch.
 * 
 * @return {Promise<Object>} A promise fulfilled with the poll rankins for the provided season.
 */
const fetchPollsForSeason = async (season) => {
  const $currentWeekRankings = await scraper.get(`https://www.espn.com/college-football/rankings`);
  
  const $headline = $currentWeekRankings(".page-container .headline");
  const headlineText = $headline.text().trim();

  // Determine how many weeks of ranking have been released to date.
  const currentweekIndex = _.includes(headlineText, 'Preseason') ? 0 : Number(headlineText.split('Week ')[1]) - 1;

  // Fetch the HTML for all previous week rankings.
  const $priorWeeksRankings = await Promise.all(_.range(1, currentweekIndex + 1).map((i) => scraper.get(_getEspnRankingsUrl(season, i))));

  // Scrape the actual rankings for each week using the HTML.
  const currentWeekRankings = _getPollRankingsForWeek($currentWeekRankings, currentweekIndex);
  const priorWeeksRankings = _.map($priorWeeksRankings, ($priorWeekRankings, i) => _getPollRankingsForWeek($priorWeekRankings, i));

  // Loop through the weekly rankings and combine them into a standard format.
  const pollRankings = {};
  [...priorWeeksRankings, currentWeekRankings].forEach((rankings) => {
    Object.keys(rankings).forEach((pollType) => {
      pollRankings[pollType] = pollRankings[pollType] || [];
      pollRankings[pollType].push(rankings[pollType]);
    })
  })

  return pollRankings;
};

module.exports = {
  fetchStatsForGame,
  fetchPollsForSeason,
  fetchGameIdsForSeason,
  fetchNotreDameWeeklyRecordsForCurrentSeason,
  fetchTeamRecordUpThroughNotreDameGameForCurrentSeason
};
