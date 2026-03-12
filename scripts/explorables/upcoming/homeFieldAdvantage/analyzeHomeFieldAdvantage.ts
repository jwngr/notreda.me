import _ from 'lodash';

import {getGameLocation} from '../../../../website/src/lib/locations';
import {GameResult} from '../../../../website/src/models/games.models';
import {ALL_SEASONS} from '../../../lib/constants';
import {Logger} from '../../../lib/logger';
import {NDSchedules} from '../../../lib/ndSchedules';

const logger = new Logger({isSentryEnabled: false});

type ResultKey = 'wins' | 'losses' | 'ties';

interface StatsRow {
  wins: number;
  losses: number;
  ties: number;
  total: number;
}

type LocationKey = 'home' | 'away' | 'neutral';

type HomeStadiumKey = 'notreDameStadium' | 'cartierField' | 'greenStockingBallPark' | 'neutralHome';

interface Stats {
  overall: StatsRow;
  locations: Record<LocationKey, StatsRow>;
  headCoaches: Record<string, StatsRow>;
  homeStadiums: Record<HomeStadiumKey, StatsRow>;
}

const _getResultString = (result: GameResult): ResultKey =>
  result === GameResult.Win ? 'wins' : result === GameResult.Loss ? 'losses' : 'ties';

const _getInitialStats = (): StatsRow => ({wins: 0, losses: 0, ties: 0, total: 0});

const _getGamesPlayed = (stats: Stats, statsKey: string | (string | number)[]) => {
  const {wins, losses, ties} = _.get(stats, statsKey) as StatsRow;
  return wins + losses + ties;
};

const _getRecord = (stats: Stats, statsKey: string | (string | number)[]) => {
  const {wins, losses, ties} = _.get(stats, statsKey) as StatsRow;
  return `${wins}-${losses}-${ties}`;
};

const _getWinPercentage = (stats: Stats, statsKey: string | (string | number)[]) => {
  const {wins, ties} = _.get(stats, statsKey) as StatsRow;

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
  const stats: Stats = {
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

    const seasonScheduleData = await NDSchedules.getForSeason(season);
    seasonScheduleData.forEach((gameData) => {
      if (gameData.result) {
        const resultString = _getResultString(gameData.result);

        let homeAwayOrNeutral: LocationKey;
        if (gameData.isHomeGame) {
          // Home games have no location.
          homeAwayOrNeutral = gameData.location ? 'neutral' : 'home';
        } else {
          // TODO: Handle neutral site away games.
          homeAwayOrNeutral = 'away';
        }

        const headCoach = gameData.headCoach || 'Unknown';
        stats.headCoaches[headCoach] = stats.headCoaches[headCoach] || _getInitialStats();

        stats.overall[resultString]++;
        stats.locations[homeAwayOrNeutral][resultString]++;
        currentYearStats[resultString]++;
        stats.headCoaches[headCoach][resultString]++;

        const location = getGameLocation({game: gameData, season});

        if (gameData.isHomeGame && !gameData.isNeutralSiteGame) {
          if (!location || location === 'TBD') {
            return;
          }

          let homeStadiumsKey: HomeStadiumKey;
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

  const rows: [string, string | (string | number)[]][] = [
    ['Overall', 'overall'],
    ['Home', 'locations.home'],
    ['Away', 'locations.away'],
    ['Neutral', 'locations.neutral'],
    ['ND Stadium', 'homeStadiums.notreDameStadium'],
    ['Cartier Field', 'homeStadiums.cartierField'],
    ['Green Stocking Ball Park', 'homeStadiums.greenStockingBallPark'],
    ...Object.keys(stats.headCoaches).map((headCoach): [string, (string | number)[]] => [
      headCoach,
      ['headCoaches', headCoach],
    ]),
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
