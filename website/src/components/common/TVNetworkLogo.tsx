import React from 'react';
import styled from 'styled-components';

import abcLogo from '../../images/tvLogos/abc.png';
import accnLogo from '../../images/tvLogos/accn.png';
import cbsLogo from '../../images/tvLogos/cbs.png';
import cbssnLogo from '../../images/tvLogos/cbssn.png';
import cstvLogo from '../../images/tvLogos/cstv.png';
import espnLogo from '../../images/tvLogos/espn.png';
import espn2Logo from '../../images/tvLogos/espn2.png';
import foxLogo from '../../images/tvLogos/fox.png';
import nbcLogo from '../../images/tvLogos/nbc.png';
import nbcsnLogo from '../../images/tvLogos/nbcsn.png';
import pac12NetworkLogo from '../../images/tvLogos/pacn.png';
import peacockLogo from '../../images/tvLogos/peacock.png';
import tbsLogo from '../../images/tvLogos/tbs.png';
import unknownNetworkLogo from '../../images/tvLogos/unknown.png';
import usaLogo from '../../images/tvLogos/usa.png';
import {assertNever} from '../../lib/utils';
import {TVNetwork} from '../../models/games.models';

export const ChannelName = styled.p`
  font-size: 24px;
  font-weight: bold;
  margin-right: 16px;
`;

function getTvNetworkLogo(network: TVNetwork): string | null {
  switch (network) {
    case TVNetwork.ABC:
      return abcLogo;
    case TVNetwork.ACCN:
      return accnLogo;
    case TVNetwork.CBS:
      return cbsLogo;
    case TVNetwork.CBSSN:
      return cbssnLogo;
    case TVNetwork.CSTV:
      return cstvLogo;
    case TVNetwork.ESPN:
      return espnLogo;
    case TVNetwork.ESPN2:
      return espn2Logo;
    case TVNetwork.FOX:
      return foxLogo;
    case TVNetwork.NBC:
      return nbcLogo;
    case TVNetwork.NBCSN:
      return nbcsnLogo;
    case TVNetwork.Pac12Network:
      return pac12NetworkLogo;
    case TVNetwork.Peacock:
      return peacockLogo;
    case TVNetwork.TBS:
      return tbsLogo;
    case TVNetwork.USA:
      return usaLogo;
    case TVNetwork.Unknown:
      return unknownNetworkLogo;
    case TVNetwork.KATZ:
    case TVNetwork.SportsChannel:
    case TVNetwork.WGN_TV:
    case TVNetwork.ABC_ESPN:
    case TVNetwork.ABC_ESPN2:
    case TVNetwork.RAYCOM_WGN:
    case TVNetwork.USA_WGN_TV:
      return null;
    default:
      assertNever(network);
  }
}

export const TVNetworkLogo: React.FC<{readonly network: TVNetwork}> = ({network}) => {
  const logo = getTvNetworkLogo(network);

  if (!logo) {
    return <ChannelName>{network}</ChannelName>;
  }

  return <img key={network} src={logo} alt={`${network} logo`} />;
};
