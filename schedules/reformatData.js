const fs = require('fs');
const _ = require('lodash');

const combinedScheduleData = require('./schedule.json');

_.forEach(combinedScheduleData, (yearData, year) => {
  yearData.forEach(gameData => {
    if (gameData.isBowlGame === false) {
      delete gameData.isBowlGame;
    } else {
      console.log(year);
    }
  });

  fs.writeFileSync(`data/${year}.json`, JSON.stringify(yearData, null, 2));
});
