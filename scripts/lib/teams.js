const _ = require('lodash');

const teams = require('../../website/src/resources/teams.json');

module.exports.get = (teamId) => {
  return {
    id: teamId,
    ...teams[teamId],
  };
};

module.exports.getFromName = (teamName) => {
  const team = _.chain(teams)
    .map((teamData, teamId) => ({id: teamId, ...teamData}))
    .find(({name}) => name === teamName)
    .value();

  if (typeof team === 'undefined') {
    throw new Error(`No team exists with the name "${teamName}"`);
  }

  return team;
};
