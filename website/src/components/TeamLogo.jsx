import React from 'react';

import defaultLogo from '../images/defaultTeamLogo.png';

export const TeamLogo = ({team, className}) => {
  // TODO: Fix this.
  // const logoPath = `/images/teamLogos/${team.abbreviation}.png`;

  return <img className={className} src={defaultLogo} alt={`${team.name} logo`} />;
};
