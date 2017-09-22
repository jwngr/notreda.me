const fs = require('fs');
const _ = require('lodash');

const filenames = fs.readdirSync('../data');

filenames.forEach(filename => {
  const year = filename.split('.')[0];
  const yearData = require(`../data/${filename}`);

  yearData.forEach((gameData, i) => {
    if ('linescores' in gameData) {
      gameData.linescore = gameData.linescores;
      delete gameData.linescores;
    }
  });

  fs.writeFileSync(`../data/${year}.json`, JSON.stringify(yearData, null, 2));
});
