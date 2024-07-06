import React from 'react';

import defaultLogoPath from '../images/defaultTeamLogo.png';

export const TVNetworkLogo = ({coverage}) => {
  // TODO: Fix this.
  // const logoPath = `../images/tvLogos/${coverage.toLowerCase()}.png`;

  return <img src={defaultLogoPath} alt={`${coverage} logo`} />;
};
