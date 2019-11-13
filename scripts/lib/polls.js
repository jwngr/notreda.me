const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const teams = require('./teams');
const {CURRENT_SEASON} = require('./ndSchedules');

const POLLS_DATA_DIRECTORY = path.resolve(__dirname, '../../data/polls');

module.exports.AP_POLL_SEASONS = _.range(1936, 2019);

module.exports.getForSeason = (season) => {
  try {
    return require(`${POLLS_DATA_DIRECTORY}/${season}.json`);
  } catch (error) {
    return null;
  }
};

const updateForSeason = (season, seasonPollsData, seasonScheduleData = []) => {
  fs.writeFileSync(
    `${POLLS_DATA_DIRECTORY}/${season}.json`,
    JSON.stringify(seasonPollsData, null, 2)
  );

  // Copy the updated poll rankings into the ND season schedule data.
  seasonScheduleData.forEach((game) => {
    const gameDate = new Date(game.date || game.fullDate);

    _.forEach(seasonPollsData, (pollData, pollId) => {
      let currentWeekPollData;
      pollData.forEach((weekPollData) => {
        if (weekPollData.date === 'Preseason') {
          currentWeekPollData = weekPollData;
        } else {
          const pollDate = new Date(weekPollData.date);
          pollDate.setHours(23);
          if (pollDate < gameDate) {
            currentWeekPollData = weekPollData;
          }
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

        const opponentTeamName = teams.get(game.opponentId).name;
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
};
module.exports.updateForSeason = updateForSeason;

module.exports.updateForCurrentSeason = (seasonPollsData) => {
  return updateForSeason(CURRENT_SEASON, seasonPollsData);
};
