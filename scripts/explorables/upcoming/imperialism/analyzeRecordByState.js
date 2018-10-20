const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const SCHEDULE_DATA_DIRECTORY = path.resolve(__dirname, '../../../../schedules/data');

const schedulesDataFilenames = fs.readdirSync(SCHEDULE_DATA_DIRECTORY);

let stateRecords = {};
let countryRecords = {};

// TODO: analyze record based on state where opponent is from, now where game was played

const GAME_RESULTS_MAP = {
  W: 'wins',
  L: 'losses',
  T: 'ties',
};

schedulesDataFilenames.forEach((schedulesDataFilename) => {
  const year = schedulesDataFilename.split('.')[0];
  const schedule = require(`${SCHEDULE_DATA_DIRECTORY}/${schedulesDataFilename}`);

  schedule.forEach((gameData) => {
    const state = _.get(gameData, 'location.state');
    const country = _.get(gameData, 'location.country', 'USA');

    if (state) {
      if (!(state in stateRecords)) {
        stateRecords[state] = {
          games: 0,
          wins: 0,
          losses: 0,
          ties: 0,
          latestResult: null,
          nextScheduledGame: null,
          teams: new Set(),
        };
      }

      if (gameData.result) {
        stateRecords[state].games += 1;
        stateRecords[state][GAME_RESULTS_MAP[gameData.result]] += 1;
        stateRecords[state].latestResult = gameData.result;
        stateRecords[state].teams.add(gameData.opponentId);
      } else if (stateRecords[state].nextScheduledGame === null) {
        stateRecords[state].nextScheduledGame =
          gameData.date === 'TBD' ? `${year} TBD` : gameData.date;
      }
    }

    if (!(country in countryRecords)) {
      countryRecords[country] = {
        games: 0,
        wins: 0,
        losses: 0,
        ties: 0,
        latestResult: null,
        nextScheduledGame: null,
        teams: new Set(),
      };
    }

    if (gameData.result) {
      countryRecords[country].games += 1;
      countryRecords[country][GAME_RESULTS_MAP[gameData.result]] += 1;
      countryRecords[country].latestResult = gameData.result;
      countryRecords[country].teams.add(gameData.opponentId);
    } else if (countryRecords[country].nextScheduledGame === null) {
      countryRecords[country].nextScheduledGame =
        gameData.date === 'TBD' ? `${year} TBD` : gameData.date;
    }
  });
});

const getWinPercentage = ({games, wins}) => {
  return ((wins / games) * 100).toFixed(2);
};

_.forEach(stateRecords, (details, state) => {
  console.log(
    state,
    details.games,
    `${details.wins}-${details.losses}-${details.ties}`,
    getWinPercentage(details) + '%',
    details.latestResult,
    details.nextScheduledGame || 'None',
    details.teams
  );
});

console.log('-------------------------');

const stateRecordsPlayed = _.filter(stateRecords, ({games}) => games > 0);

console.log('NUM STATES PLAYED:', _.size(stateRecordsPlayed));
console.log(
  'LATEST GAME IN STATES PLAYED RECORD:',
  _.size(_.filter(stateRecordsPlayed, ({latestResult}) => latestResult === 'W')),
  '-',
  _.size(_.filter(stateRecordsPlayed, ({latestResult}) => latestResult === 'L')),
  '-',
  _.size(_.filter(stateRecordsPlayed, ({latestResult}) => latestResult === 'T'))
);

console.log('-------------------------');

_.forEach(countryRecords, (details, country) => {
  console.log(
    country,
    details.games,
    `${details.wins}-${details.losses}-${details.ties}`,
    getWinPercentage(details) + '%',
    details.latestResult,
    details.nextScheduledGame || 'None',
    details.teams
  );
});

console.log('-------------------------');

const countryRecordsPlayed = _.filter(countryRecords, ({games}) => games > 0);

console.log('NUM COUNTRIES PLAYED:', _.size(countryRecordsPlayed));
console.log(
  'LATEST GAME IN COUNTRIES PLAYED RECORD:',
  _.size(_.filter(countryRecordsPlayed, ({latestResult}) => latestResult === 'W')),
  '-',
  _.size(_.filter(countryRecordsPlayed, ({latestResult}) => latestResult === 'L')),
  '-',
  _.size(_.filter(countryRecordsPlayed, ({latestResult}) => latestResult === 'T'))
);
