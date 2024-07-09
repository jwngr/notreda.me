import React, {useEffect, useState} from 'react';

import defaultLogo from '../images/defaultTeamLogo.png';
import {Teams} from '../lib/teams';
import {TeamId} from '../models';

const teamLogos = import.meta.glob('../images/teamLogos/*.png');

export const TeamLogo: React.FC<{
  readonly teamId: TeamId;
  readonly className?: string;
}> = ({teamId, className}) => {
  const [logo, setLogo] = useState<string>(defaultLogo);
  const team = Teams.getTeam(teamId);

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const logoModule = await teamLogos[`../images/teamLogos/${teamId}.png`]();
        setLogo((logoModule as {default: string}).default);
      } catch {
        setLogo(defaultLogo);
      }
    };

    loadLogo();
  }, [teamId]);

  return <img key={teamId} className={className} src={logo} alt={`${team.name} logo`} />;
};
