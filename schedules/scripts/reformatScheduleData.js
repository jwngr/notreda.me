const fs = require('fs');
const path = require('path');
const format = require('date-fns/format');

const INPUT_DATA_DIRECTORY = path.resolve(__dirname, '../data');

const dataFilenames = fs.readdirSync(INPUT_DATA_DIRECTORY);

dataFilenames.forEach((dataFilename) => {
  const year = dataFilename.split('.')[0];
  const yearData = require(`${INPUT_DATA_DIRECTORY}/${dataFilename}`);

  yearData.forEach((gameData, i) => {
    if ('date' in gameData) {
      const date = new Date(gameData.date);

      gameData.date = format(date, `MM/DD/${year}`);
    }
  });

  fs.writeFileSync(`${INPUT_DATA_DIRECTORY}/${dataFilename}`, JSON.stringify(yearData, null, 2));
});
