const fs = require('fs');
const _ = require('lodash');
const format = require('date-fns/format');

const filenames = fs.readdirSync('../data');

filenames.forEach((filename) => {
  const year = filename.split('.')[0];
  const yearData = require(`../data/${filename}`);

  yearData.forEach((gameData, i) => {
    if ('date' in gameData) {
      const date = new Date(gameData.date);

      gameData.date = format(date, `MM/DD/${year}`);
    }
  });

  fs.writeFileSync(`../data/${year}.json`, JSON.stringify(yearData, null, 2));
});
