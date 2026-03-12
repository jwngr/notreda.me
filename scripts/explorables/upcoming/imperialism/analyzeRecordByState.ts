import _ from 'lodash';

import {GameInfo, GameResult} from '../../../../website/src/models/games.models';
import {TeamId} from '../../../../website/src/models/teams.models';
import {ALL_SEASONS} from '../../../lib/constants';
import {Logger} from '../../../lib/logger';
import {NDSchedules} from '../../../lib/ndSchedules';

// TODO: Analyze record based on location of opponent's campus, not just where the game was played.

const logger = new Logger({isSentryEnabled: false});

type ResultKey = 'wins' | 'losses' | 'ties';

interface StatsRow {
  games: number;
  wins: number;
  losses: number;
  ties: number;
  latestResult: GameResult | null;
  nextScheduledGame: string | null;
  teams: Set<TeamId>;
}

interface Stats {
  state: Record<string, StatsRow>;
  country: Record<string, StatsRow>;
}

const _getResultString = (result: GameResult): ResultKey =>
  result === GameResult.Win ? 'wins' : result === GameResult.Loss ? 'losses' : 'ties';

const _getInitialStats = (): StatsRow => ({
  games: 0,
  wins: 0,
  losses: 0,
  ties: 0,
  latestResult: null,
  nextScheduledGame: null,
  teams: new Set(),
});

const _getGamesPlayed = (stats: Stats, statsKey: string | (string | number)[]) => {
  const {wins, losses, ties} = _.get(stats, statsKey) as StatsRow;
  return wins + losses + ties;
};

const _getRecord = (stats: Stats, statsKey: string | (string | number)[]) => {
  const {wins, losses, ties} = _.get(stats, statsKey) as StatsRow;
  return `${wins}-${losses}-${ties}`;
};

// const _getWinPercentage = (statsKey) => {
//   const {wins, ties} = _.get(stats, statsKey);

//   const gamesPlayed = _getGamesPlayed(stats, statsKey);
//   if (gamesPlayed === 0) {
//     return '0%';
//   }

//   // Ties count as half of a win.
//   const adjustedWins = wins + ties * 0.5;

//   return ((adjustedWins / gamesPlayed) * 100).toFixed(2) + '%';
// };

async function main() {
  const stats: Stats = {state: {}, country: {}};

  for (const season of ALL_SEASONS) {
    const seasonScheduleData = await NDSchedules.getForSeason(season);
    seasonScheduleData.forEach((gameData: GameInfo) => {
      if (gameData.location !== 'TBD') {
        let stateOrCountryKey: keyof Stats;
        let stateOrCountryValue: string;
        if (gameData.location) {
          // Away games and neutral site games have a location.
          stateOrCountryKey = typeof gameData.location.state === 'undefined' ? 'country' : 'state';
          stateOrCountryValue = _.get(gameData, ['location', stateOrCountryKey]);
        } else {
          // Home games happen in Notre Dame, IN.
          stateOrCountryKey = 'state';
          stateOrCountryValue = 'IN';
        }

        if (!_.has(stats[stateOrCountryKey], stateOrCountryValue)) {
          stats[stateOrCountryKey][stateOrCountryValue] = _getInitialStats();
        }

        if (gameData.result) {
          stats[stateOrCountryKey][stateOrCountryValue][_getResultString(gameData.result)] += 1;
          stats[stateOrCountryKey][stateOrCountryValue].latestResult = gameData.result;
          stats[stateOrCountryKey][stateOrCountryValue].teams.add(gameData.opponentId);
        } else if (stats[stateOrCountryKey][stateOrCountryValue].nextScheduledGame === null) {
          stats[stateOrCountryKey][stateOrCountryValue].nextScheduledGame =
            gameData.date === 'TBD' ? `${season} TBD` : gameData.date;
        }
      }
    });
  }

  logger.log(
    [
      'State',
      'Games Played',
      'Record',
      'Win Percentage',
      'Latest Result',
      'Next Scheduled Game',
    ].join('\t')
  );

  _.forEach(stats.state, (stateStats: StatsRow, state: string) => {
    logger.log(
      [
        state,
        _getGamesPlayed(stats, ['state', state]),
        _getRecord(stats, ['state', state]),
        _getGamesPlayed(stats, ['state', state]),
        stateStats.latestResult,
        stateStats.nextScheduledGame || 'None',
      ].join('\t')
    );
  });

  logger.newline();

  logger.log(
    [
      'Country',
      'Games Played',
      'Record',
      'Win Percentage',
      'Latest Result',
      'Next Scheduled Game',
    ].join('\t')
  );

  _.forEach(stats.country, (countryStats: StatsRow, country: string) => {
    logger.log(
      [
        country,
        _getGamesPlayed(stats, ['country', country]),
        _getRecord(stats, ['country', country]),
        _getGamesPlayed(stats, ['country', country]),
        countryStats.latestResult,
        countryStats.nextScheduledGame || 'None',
      ].join('\t')
    );
  });
}

main();
