import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

import defaultLogo from '../../images/defaultTeamLogo.png';
import {Teams} from '../../lib/teams';
import {TeamId} from '../../models';

const teamLogos = import.meta.glob('../../images/teamLogos/*.png');

export type LogoSize = 40 | 52;

interface TeamLogoWrapperProps {
  readonly size: LogoSize;
}

const TeamLogoWrapper = styled.img<TeamLogoWrapperProps>`
  width: ${({size}) => size}px;
  height: ${({size}) => size}px;
`;

export const TeamLogo: React.FC<{
  readonly teamId: TeamId;
  readonly size: LogoSize;
  readonly className?: string;
}> = ({teamId, size, className}) => {
  const [logo, setLogo] = useState<string | null>(null);
  const team = Teams.getTeam(teamId);

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const logoModule = await teamLogos[`../../images/teamLogos/${teamId}.png`]();
        setLogo((logoModule as {default: string}).default);
      } catch (error) {
        // TODO: Add error logging.
        setLogo(defaultLogo);
      }
    };

    loadLogo();
  }, [teamId]);

  if (!logo) return <div style={{width: size, height: size}}>&nbsp;</div>;

  return (
    <TeamLogoWrapper
      key={teamId}
      className={className}
      src={logo}
      size={size}
      alt={`${team.name} logo`}
    />
  );
};
