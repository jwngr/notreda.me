import styled from 'styled-components';

import TeamLogo from '../../../TeamLogo';

export const TotalScoreWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-family: 'Bungee';
  margin-bottom: 32px;
  width: 100%;

  @media (max-width: 600px) {
    & > div {
      display: flex;
      flex-direction: column;

      & > *:first-of-type {
        margin-bottom: 12px;
      }
    }
  }
`;

export const TeamWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const TeamImage = styled(TeamLogo)`
  height: 60px;
  width: 60px;

  &.away {
    order: 1;
    margin-left: 8px;
    margin-right: 20px;
  }

  &.home {
    margin-left: 20px;
    margin-right: 8px;
  }

  @media (max-width: 600px) {
    width: 40px;
    height: 40px;
    margin: 0 12px;
  }
`;

export const TeamDetailsWrapper = styled.div`
  display: flex;
  text-align: left;
  flex-direction: column;
  font-family: 'Merriweather', serif;

  &.away {
    text-align: right;
  }

  @media (max-width: 600px) {
    flex: 1;
    width: 100%;

    &.home {
      text-align: right;
    }
  }
`;

export const TeamName = styled.p`
  font-size: 12px;
  text-transform: uppercase;
`;

export const TeamNickname = styled.p`
  font-size: 20px;
`;

export const TeamRanking = styled.span`
  font-size: 12px;
  color: #777;
  margin-right: 4px;
`;

export const TeamRecord = styled.p`
  font-size: 12px;
  color: #777;
`;

export const Score = styled.p`
  font-size: 40px;
  white-space: nowrap;

  @media (max-width: 600px) {
    flex: 1;
    font-size: 32px;
  }
`;
