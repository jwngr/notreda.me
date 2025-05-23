import _ from 'lodash';

import {getGameLocation} from '../../../../website/src/lib/locations';
import {getForSeason} from '../../../../website/src/resources/schedules';
import {ALL_SEASONS} from '../../../lib/constants';
import {Logger} from '../../../lib/logger';

const logger = new Logger({isSentryEnabled: false});

const _getResultString = (result) => (result === 'W' ? 'wins' : result === 'L' ? 'losses' : 'ties');

const _getInitialStats = () => _.clone({wins: 0, losses: 0, ties: 0});

const _getGamesPlayed = (stats, statsKey) => {
  const {wins, losses, ties} = _.get(stats, statsKey);
  return wins + losses + ties;
};

const _getRecord = (stats, statsKey) => {
  const {wins, losses, ties} = _.get(stats, statsKey);
  return `${wins}-${losses}-${ties}`;
};

const _getWinPercentage = (stats, statsKey) => {
  const {wins, ties} = _.get(stats, statsKey);

  const gamesPlayed = _getGamesPlayed(stats, statsKey);
  if (gamesPlayed === 0) {
    return '0%';
  }

  // Ties count as half of a win.
  const adjustedWins = wins + ties * 0.5;

  return ((adjustedWins / gamesPlayed) * 100).toFixed(2) + '%';
};

async function main() {
  // Initialize stats.
  const stats = {
    overall: _getInitialStats(),
    locations: {home: _getInitialStats(), away: _getInitialStats(), neutral: _getInitialStats()},
    headCoaches: {},
    homeStadiums: {
      notreDameStadium: _getInitialStats(),
      cartierField: _getInitialStats(),
      greenStockingBallPark: _getInitialStats(),
      neutralHome: _getInitialStats(),
    },
  };

  for (const season of ALL_SEASONS) {
    const currentYearStats = _getInitialStats();

    const seasonScheduleData = await getForSeason(season);
    seasonScheduleData.forEach((gameData) => {
      if (gameData.result) {
        const resultString = _getResultString(gameData.result);

        let homeAwayOrNeutral;
        if (gameData.isHomeGame) {
          // Home games have no location.
          homeAwayOrNeutral = gameData.location ? 'neutral' : 'home';
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

        const location = getGameLocation({date: gameData, season});

        if (gameData.isHomeGame && !gameData.isNeutralSiteGame) {
          let homeStadiumsKey;
          switch (location.stadium) {
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
  }

  const headers = ['Stat', 'Games Played', 'Record', 'Win Percentage'];
  logger.info(headers.join('\t'));

  const rows = [
    ['Overall', 'overall'],
    ['Home', 'locations.home'],
    ['Away', 'locations.away'],
    ['Neutral', 'locations.neutral'],
    ['ND Stadium', 'homeStadiums.notreDameStadium'],
    ['Cartier Field', 'homeStadiums.cartierField'],
    ['Green Stocking Ball Park', 'homeStadiums.greenStockingBallPark'],
    ...Object.keys(stats.headCoaches).map((headCoach) => [headCoach, ['headCoaches', headCoach]]),
  ];

  rows.forEach(([statName, statsKey]) => {
    logger.info(
      [
        statName,
        _getGamesPlayed(stats, statsKey),
        _getRecord(stats, statsKey),
        _getWinPercentage(stats, statsKey),
      ].join('\t')
    );
  });
}

main();
