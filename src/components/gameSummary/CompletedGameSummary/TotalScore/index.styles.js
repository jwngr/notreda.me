import styled from 'styled-components';

export const TotalScoreWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-family: 'Bungee';
  margin-bottom: 32px;
`;

export const TeamWrapper = styled.div`
  display: flex;
  align-items: center;

  img {
    height: 60px;
    width: 60px;
  }

  &.away img {
    order: 1;
    margin-left: 8px;
    margin-right: 20px;
  }

  &.home img {
    margin-left: 20px;
    margin-right: 8px;
  }

  @media (max-width: 600px) {
    img {
      height: 40px;
      width: 40px;
    }

    &.away img {
      margin-right: 12px;
    }

    &.home img {
      margin-left: 12px;
    }
  }
`;

export const TeamDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'Merriweather', serif;

  &.away {
    text-align: right;
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
`;

export const TeamRecord = styled.p`
  font-size: 12px;
  color: #777;
`;

export const Score = styled.p`
  font-size: 40px;
  white-space: nowrap;

  @media (max-width: 600px) {
    font-size: 32px;
  }
`;
