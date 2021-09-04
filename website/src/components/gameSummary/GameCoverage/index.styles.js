import styled from 'styled-components';

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

export const DateAndTimeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({center}) => (center ? 'center' : 'start')};
  justify-content: center;
`;

export const ChannelLogo = styled.img`
  width: ${({channel}) => {
    switch (channel) {
      case 'cbssn':
      case 'cstv':
      case 'espn2':
      case 'peacock':
        return '80px';
      case 'accn':
        return '72px';
      case 'espn':
        return '60px';
      case 'nbcsn':
      case 'usa':
        return '44px';
      case 'fox':
      case 'unknown':
        return '40px';
      case 'tbs':
        return '28px';
      default:
        return '32px';
    }
  }};
  margin-right: 16px;
`;

export const ChannelName = styled.p`
  font-size: 24px;
  font-weight: bold;
  margin-right: 16px;
`;

export const CanceledText = styled.p`
  color: ${({theme}) => theme.colors.red};
`;
