import React from 'react';

import defaultLogo from '../images/defaultTeamLogo.png';
import {Team, TeamId} from '../models';
import teamsJson from '../resources/teams.json';

const teamLogos = import.meta.glob('../images/teamLogos/*.png', {eager: true});

const teams = teamsJson as Record<TeamId, Team>;

export const TeamLogo: React.FC<{
  readonly teamId: TeamId;
  readonly className?: string;
}> = ({teamId, className}) => {
  const team = teams[teamId];

  const logoModule = teamLogos[`../images/teamLogos/${teamId}.png`] as {default: string};
  const logo = logoModule ? logoModule.default : defaultLogo;

  return <img key={teamId} className={className} src={logo} alt={`${team.name} logo`} />;
};
