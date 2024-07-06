import styled from 'styled-components';

import {TeamLogo} from '../../../TeamLogo';

export const TotalScoreWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-family: 'Bungee';
  margin-bottom: 44px;

  @media (max-width: 600px), (min-width: 950px) and (max-width: 1120px) {
    display: grid;
    grid-gap: 12px 8px;
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

  @media (max-width: 600px), (min-width: 950px) and (max-width: 1120px) {
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
  font-family: 'Inter UI', serif;

  &.away {
    text-align: right;
  }

  @media (max-width: 600px), (min-width: 950px) and (max-width: 1120px) {
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
  font-size: 14px;
  text-transform: uppercase;
`;

export const TeamNickname = styled.p`
  font-size: 22px;
`;

export const TeamRanking = styled.span`
  font-size: 14px;
  color: ${(props) => props.theme.colors.gray};
  margin-right: 4px;
`;

export const TeamRecord = styled.p`
  font-size: 14px;
  color: ${(props) => props.theme.colors.gray};
`;

export const Score = styled.p`
  font-size: 36px;
  text-align: center;
  white-space: nowrap;

  @media (max-width: 600px), (min-width: 950px) and (max-width: 1120px) {
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
