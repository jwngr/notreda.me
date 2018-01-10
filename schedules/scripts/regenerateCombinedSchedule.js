const fs = require('fs');
const path = require('path');

const INPUT_DATA_DIRECTORY = path.resolve(__dirname, '../data');
const OUTPUT_SCHEDULE_FILENAME = path.resolve(__dirname, '../../src/resources/schedule.json');

const dataFilenames = fs.readdirSync(INPUT_DATA_DIRECTORY);

const combinedSchedule = {};
dataFilenames.forEach((dataFilename) => {
  const year = dataFilename.split('.')[0];
  combinedSchedule[year] = require(`${INPUT_DATA_DIRECTORY}/${dataFilename}`);
});

fs.writeFileSync(OUTPUT_SCHEDULE_FILENAME, JSON.stringify(combinedSchedule, null, 2));
