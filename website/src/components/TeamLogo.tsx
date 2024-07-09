import React from 'react';

import defaultLogo from '../images/defaultTeamLogo.png';
import {Teams} from '../lib/teams';
import {TeamId} from '../models';

const teamLogos = import.meta.glob('../images/teamLogos/*.png', {eager: true});

export const TeamLogo: React.FC<{
  readonly teamId: TeamId;
  readonly className?: string;
}> = ({teamId, className}) => {
  const team = Teams.getTeam(teamId);

  const logoModule = teamLogos[`../images/teamLogos/${teamId}.png`] as {default: string};
  const logo = logoModule ? logoModule.default : defaultLogo;

  return <img key={teamId} className={className} src={logo} alt={`${team.name} logo`} />;
};
