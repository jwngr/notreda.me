const _ = require('lodash');

const logger = require('../lib/logger');
const scraper = require('../lib/scraper');
const schedules = require('../lib/schedules');

logger.info('Updating records for current season...');

const teams = {
  ND: 'http://www.espn.com/college-football/team/_/id/87/notre-dame-fighting-irish',
  MICH: 'http://www.espn.com/college-football/team/_/id/130/michigan-wolverines',
  BALL: 'http://www.espn.com/college-football/team/_/id/2050/ball-state-cardinals',
  VANDY: 'http://www.espn.com/college-football/team/_/id/238/vanderbilt-commodores',
  WAKE: 'http://www.espn.com/college-football/team/_/id/154/wake-forest-demon-deacons',
  STAN: 'http://www.espn.com/college-football/team/_/id/24/stanford-cardinal',
  VT: 'http://www.espn.com/college-football/team/_/id/259/virginia-tech-hokies',
  PITT: 'http://www.espn.com/college-football/team/_/id/221/pittsburgh-panthers',
  NAVY: 'http://www.espn.com/college-football/team/_/id/2426/navy-midshipmen',
  NW: 'http://www.espn.com/college-football/team/_/id/77/northwestern-wildcats',
  FSU: 'http://www.espn.com/college-football/team/_/id/52/florida-state-seminoles',
  SYR: 'http://www.espn.com/college-football/team/_/id/183/syracuse-orange',
  USC: 'http://www.espn.com/college-football/team/_/id/30/usc-trojans',
};

const teamRecords = {};

const promises = _.map(teams, async (espnUrl, teamAbbreviation) => {
  const $ = await scraper.get(espnUrl);

  const $gameRows = $('.club-schedule li');

  let wins = 0;
  let losses = 0;
  let homeWins = 0;
  let homeLosses = 0;
  let awayWins = 0;
  let awayLosses = 0;

  $gameRows.each((i, row) => {
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
  });

  teamRecords[teamAbbreviation] = {
    overall: `${wins}-${losses}`,
    home: `${homeWins}-${homeLosses}`,
    away: `${awayWins}-${awayLosses}`,
  };
});

return Promise.all(promises)
  .then(() => {
    const seasonScheduleData = schedules.getForCurrentSeason();

    const ndOverallRecordTokens = teamRecords.ND.overall.split('-');
    const ndGamesPlayed = Number(ndOverallRecordTokens[0]) + Number(ndOverallRecordTokens[1]);

    seasonScheduleData.forEach((gameData, i) => {
      if (i + 1 >= ndGamesPlayed) {
        if (!_.has(teamRecords, gameData.opponentId)) {
          throw new Error(`Opponent ${gameData.opponentId} is not in team records dictionary`);
        }

        if (gameData.isHomeGame) {
          gameData.records = {
            home: teamRecords['ND'],
            away: teamRecords[gameData.opponentId],
          };
        } else {
          gameData.records = {
            home: teamRecords[gameData.opponentId],
            away: teamRecords['ND'],
          };
        }
      }
    });

    schedules.updateForCurrentSeason(seasonScheduleData);

    logger.success('Records for current season updated!');
  })
  .catch((error) => {
    logger.success('Failed to update records for current season!', {error});
  });
