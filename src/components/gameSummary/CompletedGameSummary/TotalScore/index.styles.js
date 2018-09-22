import styled from 'styled-components';

import TeamLogo from '../../../TeamLogo';

export const TotalScoreWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-family: 'Bungee';
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    display: grid;
    grid-gap: 4px 8px;
    grid-template-areas:
      'awayTeamDetails awayTeamLogo awayTeamScore'
      'homeTeamDetails homeTeamLogo homeTeamScore';
    }
  }
`;

export const TeamWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;

  &.away {
    justify-content: flex-end;
  }

  &.home {
    justify-content: flex-start;
  }
`;

export const TeamImage = styled(TeamLogo)`
  width: 52px;
  height: 52px;

  &.away {
    order: 1;
    margin-left: 8px;
    margin-right: 8px;
  }

  &.home {
    margin-left: 8px;
    margin-right: 8px;
  }

  @media (max-width: 1024px) {
    width: 40px;
    height: 40px;

    &.away,
    &.home {
      margin: 0 16px 0 0;
      align-self: center;
      justify-self: center;
    }

    &.away {
      grid-area: awayTeamLogo;
    }

    &.home {
      grid-area: homeTeamLogo;
    }
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

  @media (max-width: 1024px) {
    &.away,
    &.home {
      text-align: right;
      align-self: center;
      justify-self: right;
    }

    &.away {
      grid-area: awayTeamDetails;
    }

    &.home {
      text-align: right;
      grid-area: homeTeamDetails;
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
  font-size: 36px;
  text-align: center;
  white-space: nowrap;

  @media (max-width: 1024px) {
    &.away,
    &.home {
      align-self: center;
      justify-self: center;
    }

    &.away {
      grid-area: awayTeamScore;
    }

    &.home {
      grid-area: homeTeamScore;
    }
  }
`;
