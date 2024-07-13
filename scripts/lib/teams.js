import _ from 'lodash';

import teams from '../../website/src/resources/teams.json';

const existsById = (teamId) => _.has(teams, teamId);

const getById = (teamId) => {
  if (!_.has(teams, teamId)) {
    throw new Error(`No team exists with the ID "${teamId}"`);
  }

  return {
    id: teamId,
    ...teams[teamId],
  };
};

const getByName = (teamName) => {
  const team = _.chain(teams)
    .map((teamData, teamId) => ({id: teamId, ...teamData}))
    .find(({name}) => name === teamName)
    .value();

  if (typeof team === 'undefined') {
    throw new Error(`No team exists with the name "${teamName}"`);
  }

  return team;
};

module.exports = {
  getById,
  getByName,
  existsById,
};
