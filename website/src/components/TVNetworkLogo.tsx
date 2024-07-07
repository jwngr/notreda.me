import React from 'react';

import abcLogo from '../images/tvLogos/abc.png';
import accnLogo from '../images/tvLogos/accn.png';
import cbsLogo from '../images/tvLogos/cbs.png';
import cbssnLogo from '../images/tvLogos/cbssn.png';
import cstvLogo from '../images/tvLogos/cstv.png';
import espnLogo from '../images/tvLogos/espn.png';
import espn2Logo from '../images/tvLogos/espn2.png';
import foxLogo from '../images/tvLogos/fox.png';
import nbcLogo from '../images/tvLogos/nbc.png';
import nbcsnLogo from '../images/tvLogos/nbcsn.png';
import peacockLogo from '../images/tvLogos/peacock.png';
import tbsLogo from '../images/tvLogos/tbs.png';
import unknownNetworkLogo from '../images/tvLogos/unknown.png';
import usaLogo from '../images/tvLogos/usa.png';
import {assertNever} from '../lib/utils';
import {TVNetwork} from '../models';

function getTvNetworkLogo(network: TVNetwork) {
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
    case TVNetwork.Peacock:
      return peacockLogo;
    case TVNetwork.TBS:
      return tbsLogo;
    case TVNetwork.USA:
      return usaLogo;
    case TVNetwork.Unknown:
      return unknownNetworkLogo;
    default:
      assertNever(network);
  }
}

export const TVNetworkLogo: React.FC<{readonly network: TVNetwork}> = ({network}) => {
  return <img key={network} src={getTvNetworkLogo(network)} alt={`${network} logo`} />;
};
