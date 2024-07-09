const _ = require('lodash');

const logger = require('../../../lib/logger');
const ndSchedules = require('../../../../website/src/resources/schedules');
const {ALL_SEASONS} = require('../../../lib/constants');

const _getResultString = (result) => (result === 'W' ? 'wins' : result === 'L' ? 'losses' : 'ties');

const _getInitialStats = () =>
  _.clone({
    wins: 0,
    losses: 0,
    ties: 0,
  });

const _getGamesPlayed = (statsKey) => {
  const {wins, losses, ties} = _.get(stats, statsKey);
  return wins + losses + ties;
};

const _getRecord = (statsKey) => {
  const {wins, losses, ties} = _.get(stats, statsKey);
  return `${wins}-${losses}-${ties}`;
};

const _getWinPercentage = (statsKey) => {
  const {wins, ties} = _.get(stats, statsKey);

  const gamesPlayed = _getGamesPlayed(statsKey);
  if (gamesPlayed === 0) {
    return '0%';
  }

  // Ties count as half of a win.
  const adjustedWins = wins + ties * 0.5;

  return ((adjustedWins / gamesPlayed) * 100).toFixed(2) + '%';
};

// Initialize stats.
const stats = {
  overall: _getInitialStats(),
  locations: {
    home: _getInitialStats(),
    away: _getInitialStats(),
    neutral: _getInitialStats(),
  },
  headCoaches: {},
  homeStadiums: {
    notreDameStadium: _getInitialStats(),
    cartierField: _getInitialStats(),
    greenStockingBallPark: _getInitialStats(),
    neutralHome: _getInitialStats(),
  },
};

ALL_SEASONS.forEach((season) => {
  const currentYearStats = _getInitialStats();
  
  const seasonScheduleData = ndSchedules.getForSeason(season);
  seasonScheduleData.forEach((gameData) => {
    if (gameData.result) {
      const resultString = _getResultString(gameData.result);

      let homeAwayOrNeutral;
      if (gameData.isHomeGame) {
        homeAwayOrNeutral = gameData.location.city === 'Notre Dame' ? 'home' : 'neutral';
      } else {
        // TODO: Handle neutral site away games.
        homeAwayOrNeutral = 'away';
      }

      stats.headCoaches[gameData.headCoach] =
        stats.headCoaches[gameData.headCoach] || _getInitialStats();

      stats.overall[resultString]++;
      stats.locations[homeAwayOrNeutral][resultString]++;
      currentYearStats[resultString]++;
      stats.headCoaches[gameData.headCoach][resultString]++;

      if (gameData.location.city === 'Notre Dame') {
        let homeStadiumsKey;
        switch (gameData.location.stadium) {
          case 'Notre Dame Stadium':
            homeStadiumsKey = 'notreDameStadium';
            break;
          case 'Cartier Field':
            homeStadiumsKey = 'cartierField';
            break;
          case 'Green Stocking Ball Park':
            homeStadiumsKey = 'greenStockingBallPark';
            break;
          default:
            throw new Error('Unexpected home game stadium.');
        }

        stats.homeStadiums[homeStadiumsKey].total++;
        stats.homeStadiums[homeStadiumsKey][resultString]++;
      }
    }
  });
});

const headers = ['Stat', 'Games Played', 'Record', 'Win Percentage'];
logger.log(headers.join('\t'));

const rows = [
  ['Overall', 'overall'],
  ['Home', 'locations.home'],
  ['Away', 'locations.away'],
  ['Neutral', 'locations.neutral'],
  ['ND Stadium', 'homeStadiums.notreDameStadium'],
  ['Cartier Field', 'homeStadiums.cartierField'],
  ['Green Stocking Ball Park', 'homeStadiums.greenStockingBallPark'],
  ..._.map(Object.keys(stats.headCoaches), (headCoach) => [headCoach, ['headCoaches', headCoach]]),
];

_.forEach(rows, ([statName, statsKey]) => {
  logger.log(
    [statName, _getGamesPlayed(statsKey), _getRecord(statsKey), _getWinPercentage(statsKey)].join(
      '\t'
    )
  );
});
