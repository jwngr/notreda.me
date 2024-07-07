import styled from 'styled-components';

import {assertNever} from '../../../lib/utils';
import {TVNetwork} from '../../../models';

export const CoverageInnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 100%;
  height: 100%;

  p {
    font-size: 16px;
    font-family: 'Inter UI', serif;
    margin-bottom: 4px;
  }

  p:last-of-type {
    margin-bottom: 0;
  }
`;

interface DateAndTimeWrapperProps {
  readonly center: boolean;
}

export const DateAndTimeWrapper = styled.div<DateAndTimeWrapperProps>`
  display: flex;
  flex-direction: column;
  align-items: ${({center}) => (center ? 'center' : 'start')};
  justify-content: center;
`;

interface ChannelLogoProps {
  readonly network: TVNetwork;
}

export const ChannelLogo = styled.div<ChannelLogoProps>`
  img {
    margin-right: 16px;
    width: ${({network}) => {
      switch (network) {
        case TVNetwork.ABC:
        case TVNetwork.CBS:
        case TVNetwork.NBC:
          return '32px';
        case TVNetwork.CBSSN:
        case TVNetwork.CSTV:
        case TVNetwork.ESPN2:
        case TVNetwork.Peacock:
          return '80px';
        case TVNetwork.ACCN:
          return '72px';
        case TVNetwork.ESPN:
          return '60px';
        case TVNetwork.NBCSN:
        case TVNetwork.USA:
          return '44px';
        case TVNetwork.FOX:
        case TVNetwork.KATZ:
        case TVNetwork.SPORTSCHANNEL:
        case TVNetwork.WGN_TV:
        case TVNetwork.ABC_ESPN:
        case TVNetwork.ABC_ESPN2:
        case TVNetwork.RAYCOM_WGN:
        case TVNetwork.USA_WGN_TV:
        case TVNetwork.Unknown:
          return '40px';
        case TVNetwork.TBS:
          return '28px';
        default:
          assertNever(network);
      }
    }};
  }
`;

export const CanceledText = styled.p`
  color: ${({theme}) => theme.colors.red};
`;
