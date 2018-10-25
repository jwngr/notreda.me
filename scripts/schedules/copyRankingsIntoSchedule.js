const _ = require('lodash');

const polls = require('../lib/polls');
const teams = require('../lib/teams');
const logger = require('../lib/logger');
const ndSchedules = require('../lib/ndSchedules');

logger.info('Updating poll rankings in schedule data...');

polls.AP_POLL_SEASONS.forEach((season) => {
  const seasonPollsData = polls.getForSeason(season);
  const seasonScheduleData = ndSchedules.getForSeason(season);

  seasonScheduleData.forEach((game) => {
    const gameDate = new Date(game.date || game.fullDate || game.timestamp);

    _.forEach(seasonPollsData, (pollData, pollId) => {
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

  ndSchedules.updateForSeason(season, seasonScheduleData);
});

logger.success('Poll rankings in schedule data updated!');
