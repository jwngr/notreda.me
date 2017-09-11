const fs = require('fs');
const _ = require('lodash');

const combinedScheduleData = require('./schedule.json');

_.forEach(combinedScheduleData, (yearData, year) => {
  yearData.forEach(gameData => {
    console.log(gameData);
    gameData.score = {
      away: gameData.score.away,
      home: gameData.score.home
    };
  });

  fs.writeFileSync(`newData/${year}.json`, JSON.stringify(yearData, null, 2));
});
