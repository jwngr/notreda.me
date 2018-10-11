const fs = require('fs');
const path = require('path');

const SCHEDULE_DATA_DIRECTORY = path.resolve(__dirname, '../../data/schedules');
const COMBINED_SCHEDULE_FILENAME = path.resolve(__dirname, '../../src/resources/schedule.json');

const combinedScheduleData = {};

fs.readdirSync(SCHEDULE_DATA_DIRECTORY).forEach((scheduleDataFilename) => {
  const year = scheduleDataFilename.split('.')[0];
  const scheduleData = require(`${SCHEDULE_DATA_DIRECTORY}/${scheduleDataFilename}`);

  // Optional: perform any updates to the yearly data here.
  scheduleData.forEach((gameData, i) => {});

  combinedScheduleData[year] = scheduleData;

  // Write the current year's schedule data.
  fs.writeFileSync(
    `${SCHEDULE_DATA_DIRECTORY}/${scheduleDataFilename}`,
    JSON.stringify(scheduleData, null, 2)
  );
});

// Write the combined schedule.
fs.writeFileSync(COMBINED_SCHEDULE_FILENAME, JSON.stringify(combinedScheduleData, null, 2));
