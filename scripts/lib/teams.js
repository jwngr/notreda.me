const teams = require('../../website/src/resources/teams.json');

module.exports.get = (teamId) => {
  return teams[teamId];
};
