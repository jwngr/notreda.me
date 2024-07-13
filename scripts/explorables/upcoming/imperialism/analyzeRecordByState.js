import _ from 'lodash';

import {getForSeason} from '../../../../website/src/resources/schedules';
import {ALL_SEASONS} from '../../../lib/constants';
import {Logger} from '../../../lib/logger';

// TODO: Analyze record based on location of opponent's campus, not just where the game was played.

const logger = new Logger({isSentryEnabled: false});

const _getResultString = (result) => (result === 'W' ? 'wins' : result === 'L' ? 'losses' : 'ties');

const _getInitialStats = () =>
  _.clone({
    games: 0,
    wins: 0,
    losses: 0,
    ties: 0,
    latestResult: null,
    nextScheduledGame: null,
    teams: new Set(),
  });

const _getGamesPlayed = (statsKey) => {
  const {wins, losses, ties} = _.get(stats, statsKey);
  return wins + losses + ties;
};

const _getRecord = (statsKey) => {
  const {wins, losses, ties} = _.get(stats, statsKey);
  return `${wins}-${losses}-${ties}`;
};

// const _getWinPercentage = (statsKey) => {
//   const {wins, ties} = _.get(stats, statsKey);

//   const gamesPlayed = _getGamesPlayed(statsKey);
//   if (gamesPlayed === 0) {
//     return '0%';
//   }

//   // Ties count as half of a win.
//   const adjustedWins = wins + ties * 0.5;

//   return ((adjustedWins / gamesPlayed) * 100).toFixed(2) + '%';
// };

let stats = {
  state: {},
  country: {},
};

ALL_SEASONS.forEach((season) => {
  const seasonScheduleData = getForSeason(season);
  seasonScheduleData.forEach((gameData) => {
    if (gameData.location !== 'TBD') {
      const stateOrCountryKey =
        typeof gameData.location.state === 'undefined' ? 'country' : 'state';
      const stateOrCountryValue = _.get(gameData, ['location', stateOrCountryKey]);

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
});

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

_.forEach(stats.state, (stateStats, state) => {
  logger.log(
    [
      state,
      _getGamesPlayed(['state', state]),
      _getRecord(['state', state]),
      _getGamesPlayed(['state', state]),
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

_.forEach(stats.country, (countryStats, country) => {
  logger.log(
    [
      country,
      _getGamesPlayed(['country', country]),
      _getRecord(['country', country]),
      _getGamesPlayed(['country', country]),
      countryStats.latestResult,
      countryStats.nextScheduledGame || 'None',
    ].join('\t')
  );
});
