const fs = require('fs');

const filenames = fs.readdirSync('../data');

const combinedSchedule = {};

filenames.forEach((filename) => {
  const year = filename.split('.')[0];
  combinedSchedule[year] = require(`../data/${filename}`);
});

fs.writeFileSync('../schedule.json', JSON.stringify(combinedSchedule));
