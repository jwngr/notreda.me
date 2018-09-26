const _ = require('lodash');

const onePossessionGameData = require('./data/top25OnePossessionGames.json');
const onePossessionNdCoachData = require('./data/ndCoachesOnePossessionGames.json');

const padString = (str) => {
  return str + Array(24 - str.length).join('-');
};

_.forEach(onePossessionGameData, (data, teamName) => {
  onePossessionGameData[teamName].teamName = teamName;
  onePossessionGameData[teamName].percentageOfGamesWhichAreOnePossessionGames = (
    (data.onePossesssionGamesCount * 100.0) /
    data.totalGamesCount
  ).toFixed(1);
});

_.forEach(onePossessionNdCoachData, (data, coachName) => {
  onePossessionNdCoachData[coachName].percentageOfGamesWhichAreOnePossessionGames = (
    (data.onePossesssionGamesCount * 100.0) /
    data.totalGamesCount
  ).toFixed(1);
});

const teamsSortedByPercentOfGamesWhichAreOnePossessionGames = _.sortBy(
  onePossessionGameData,
  'percentageOfGamesWhichAreOnePossessionGames'
);

console.log('\n\n');

teamsSortedByPercentOfGamesWhichAreOnePossessionGames.forEach(
  ({teamName, top25Finishes, percentageOfGamesWhichAreOnePossessionGames}) => {
    // console.log(padString(teamName), percentageOfGamesWhichAreOnePossessionGames);
    console.log(
      `["${teamName}", ${top25Finishes}, "", "${percentageOfGamesWhichAreOnePossessionGames}%"],`
    );
  }
);

console.log('\n\n');

const coachesSortedByPercentOfGamesWhichAreOnePossessionGames = _.sortBy(
  onePossessionNdCoachData,
  'percentageOfGamesWhichAreOnePossessionGames'
);

coachesSortedByPercentOfGamesWhichAreOnePossessionGames.forEach(
  ({name, totalGamesCount, percentageOfGamesWhichAreOnePossessionGames}) => {
    if (totalGamesCount > 10 && name !== 'No coach') {
      // console.log(padString(name), percentageOfGamesWhichAreOnePossessionGames);
      console.log(
        `["${name}", ${totalGamesCount}, "${percentageOfGamesWhichAreOnePossessionGames}%"],`
      );
    }
  }
);
