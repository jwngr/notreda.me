const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const OUTPUT_DATA_DIRECTORY = path.resolve(__dirname, './data');
const SCHEDULE_DATA_DIRECTORY = path.resolve(__dirname, '../../../../schedules/data');

const scheduleDataFilenames = fs.readdirSync(SCHEDULE_DATA_DIRECTORY);

let games = {
  total: 0,
  home: {
    total: 0,
    wins: 0,
    losses: 0,
    ties: 0,
  },
  away: {
    total: 0,
    wins: 0,
    losses: 0,
    ties: 0,
  },
  ndStadium: {
    total: 0,
    wins: 0,
    losses: 0,
    ties: 0,
  },
  cartierField: {
    total: 0,
    wins: 0,
    losses: 0,
    ties: 0,
  },
  neutralHomeGames: {
    total: 0,
    wins: 0,
    losses: 0,
    ties: 0,
  },
};

const ndStadiums = new Set();

const GAME_RESULTS_MAP = {
  W: 'wins',
  L: 'losses',
  T: 'ties',
};

// TODO: per coach stats

scheduleDataFilenames.forEach((scheduleDataFilename) => {
  const year = scheduleDataFilename.replace('.json', '');
  const schedule = require(`${SCHEDULE_DATA_DIRECTORY}/${scheduleDataFilename}`);

  let currentYearStats = {
    total: 0,
    home: {
      total: 0,
      wins: 0,
      losses: 0,
      ties: 0,
    },
    away: {
      total: 0,
      wins: 0,
      losses: 0,
      ties: 0,
    },
  };

  schedule.forEach((gameData) => {
    if (gameData.result) {
      games.total++;
      currentYearStats.total++;

      if (gameData.isHomeGame) {
        games.home.total++;
        games.home[GAME_RESULTS_MAP[gameData.result]]++;

        currentYearStats.home.total++;
        currentYearStats.home[GAME_RESULTS_MAP[gameData.result]]++;

        if (gameData.location.city === 'Notre Dame') {
          ndStadiums.add(gameData.location.stadium);
        }

        // TODO: what is "Green Stocking Ball Park"?

        if (gameData.location.stadium === 'Notre Dame Stadium') {
          games.ndStadium.total++;
          games.ndStadium[GAME_RESULTS_MAP[gameData.result]]++;
        } else if (gameData.location.stadium === 'Cartier Field') {
          games.cartierField.total++;
          games.cartierField[GAME_RESULTS_MAP[gameData.result]]++;
        } else {
          games.neutralHomeGames.total++;
          games.neutralHomeGames[GAME_RESULTS_MAP[gameData.result]]++;
        }
      } else {
        games.away.total++;
        games.away[GAME_RESULTS_MAP[gameData.result]]++;

        currentYearStats.away.total++;
        currentYearStats.away[GAME_RESULTS_MAP[gameData.result]]++;
      }
    }
  });

  console.log(
    `${year} HOME GAMES WIN PERCENTAGE:`,
    ((currentYearStats.home.wins / currentYearStats.home.total) * 100).toFixed(2) + '%'
  );
  console.log(
    `${year} AWAY GAMES WIN PERCENTAGE:`,
    ((currentYearStats.away.wins / currentYearStats.away.total) * 100).toFixed(2) + '%'
  );

  console.log('-------------------------');
});

console.log(ndStadiums);

console.log('NUM GAMES:', games.total);

console.log('-------------------------');

console.log('NUM HOME GAMES:', games.home.total);
console.log('HOME GAMES RECORD:', `${games.home.wins}-${games.home.losses}-${games.home.ties}`);
console.log(
  'HOME GAMES WIN PERCENTAGE:',
  ((games.home.wins / games.home.total) * 100).toFixed(2) + '%'
);

console.log('-------------------------');

console.log('NUM AWAY GAMES:', games.away.total);
console.log('AWAY GAMES RECORD:', `${games.away.wins}-${games.away.losses}-${games.away.ties}`);
console.log(
  'AWAY GAMES WIN PERCENTAGE:',
  ((games.away.wins / games.away.total) * 100).toFixed(2) + '%'
);

console.log('-------------------------');

console.log('NUM ND STADIUM GAMES:', games.ndStadium.total);
console.log(
  'ND STADIUM GAMES RECORD:',
  `${games.ndStadium.wins}-${games.ndStadium.losses}-${games.ndStadium.ties}`
);
console.log(
  'ND STADIUM GAMES WIN PERCENTAGE:',
  ((games.ndStadium.wins / games.ndStadium.total) * 100).toFixed(2) + '%'
);

console.log('-------------------------');

console.log('NUM CARTIER FIELD GAMES:', games.cartierField.total);
console.log(
  'CARTIER FIELD GAMES RECORD:',
  `${games.cartierField.wins}-${games.cartierField.losses}-${games.cartierField.ties}`
);
console.log(
  'CARTIER FIELD GAMES WIN PERCENTAGE:',
  ((games.cartierField.wins / games.cartierField.total) * 100).toFixed(2) + '%'
);

console.log('-------------------------');

console.log('NUM NEUTRAL HOME GAMES:', games.neutralHomeGames.total);
console.log(
  'NEUTRAL HOME GAMES RECORD:',
  `${games.neutralHomeGames.wins}-${games.neutralHomeGames.losses}-${games.neutralHomeGames.ties}`
);
console.log(
  'NEUTRAL HOME GAMES WIN PERCENTAGE:',
  ((games.neutralHomeGames.wins / games.neutralHomeGames.total) * 100).toFixed(2) + '%'
);

// fs.writeFileSync(
//   `${OUTPUT_DATA_DIRECTORY}/scorigami.json`,
//   JSON.stringify(scorigamiMatrix, null, 2)
// );
