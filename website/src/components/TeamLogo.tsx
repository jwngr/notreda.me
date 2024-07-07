import React from 'react';

import defaultLogo from '../images/defaultTeamLogo.png';
import {Team} from '../models';

const teamLogos = import.meta.glob('../images/teamLogos/*.png', {eager: true});

export const TeamLogo: React.FC<{
  readonly team: Team;
  readonly className: string;
}> = ({team, className}) => {
  // TODO: Is there a less hacky way to do this? I don't want to have to import / load all images.
  const logoModule = teamLogos[`../images/teamLogos/${team.abbreviation}.png`] as {default: string};
  const logo = logoModule ? logoModule.default : defaultLogo;

  return <img className={className} src={logo} alt={`${team.name} logo`} />;
};
