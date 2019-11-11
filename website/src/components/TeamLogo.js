import React from 'react';

export default ({team, className}) => {
  let logo;
  try {
    logo = require(`../images/teamLogos/${team.abbreviation}.png`);
  } catch (error) {
    logo = require('../images/defaultTeamLogo.png');
  }

  return <img className={className} src={logo} alt={`${team.name} logo`} />;
};
