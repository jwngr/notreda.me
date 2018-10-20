const teams = require('../../src/resources/teams.json');

module.exports.get = (teamId) => {
  return teams[teamId];
};
