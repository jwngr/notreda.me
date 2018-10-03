const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const teams = require('../../src/resources/teams.json');

const red = chalk.bold.red;
const green = chalk.bold.green;

const POLL_DATA_DIRECTORY = path.resolve(__dirname, '../../resources/polls');
const SCHEDULE_DATA_DIRECTORY = path.resolve(__dirname, '../../schedules/data');

const CURRENT_YEAR = 2018;
const AP_POLL_YEARS = _.range(1936, CURRENT_YEAR + 1);

_.forEach(AP_POLL_YEARS, (year) => {
  const pollFilename = `${POLL_DATA_DIRECTORY}/${year}.json`;
  const scheduleFilename = `${SCHEDULE_DATA_DIRECTORY}/${year}.json`;

  const polls = require(pollFilename);
  const games = require(scheduleFilename);

  games.forEach((game) => {
    const gameDate = new Date(game.date || game.fullDate || game.timestamp);

    _.forEach(polls, (pollData, pollId) => {
      let currentWeekPollData;
      pollData.forEach((weekPollData) => {
        if (weekPollData.date === 'Preseason' || new Date(weekPollData.date) < gameDate) {
          currentWeekPollData = weekPollData;
        }
      });

      if (typeof currentWeekPollData !== 'undefined') {
        if ('Notre Dame' in currentWeekPollData.teams) {
          const homeOrAway = game.isHomeGame ? 'home' : 'away';
          _.set(
            game,
            ['rankings', homeOrAway, pollId],
            currentWeekPollData.teams['Notre Dame'].ranking
          );
        }

        const opponentTeamName = teams[game.opponentId].name;
        if (opponentTeamName in currentWeekPollData.teams) {
          const homeOrAway = game.isHomeGame ? 'away' : 'home';
          _.set(
            game,
            ['rankings', homeOrAway, pollId],
            currentWeekPollData.teams[opponentTeamName].ranking
          );
        }
      }
    });
  });

  fs.writeFileSync(scheduleFilename, JSON.stringify(games, null, 2));
});

console.log(green('Success!'));
