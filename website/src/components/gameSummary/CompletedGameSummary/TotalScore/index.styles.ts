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

interface TeamWrapperProps {
  readonly $isHomeGame: boolean;
}

export const TeamWrapper = styled.div<TeamWrapperProps>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: ${({$isHomeGame}) => ($isHomeGame ? 'flex-start' : 'flex-end')};
`;

interface TeamImageProps {
  readonly $isHomeGame: boolean;
}

export const TeamImage = styled(TeamLogo)<TeamImageProps>`
  width: 52px;
  margin-left: 8px;
  margin-right: 8px;
  height: 52px;
  order: ${({$isHomeGame}) => ($isHomeGame ? 0 : 1)};

  @media (max-width: 600px), (min-width: 950px) and (max-width: 1120px) {
    margin: 0 16px 0 0;
    align-self: center;
    justify-self: center;
    grid-area: ${({$isHomeGame}) => ($isHomeGame ? 'homeTeamLogo' : 'awayTeamLogo')};
  }
`;

interface TeamDetailsWrapperProps {
  readonly $isHomeGame: boolean;
}

export const TeamDetailsWrapper = styled.div<TeamDetailsWrapperProps>`
  display: flex;
  flex-direction: column;
  text-align: ${({$isHomeGame}) => ($isHomeGame ? 'left' : 'right')};
  font-family: 'Inter UI', serif;

  @media (max-width: 600px), (min-width: 950px) and (max-width: 1120px) {
    text-align: right;
    align-self: center;
    justify-self: right;
    grid-area: ${({$isHomeGame}) => ($isHomeGame ? 'homeTeamDetails' : 'awayTeamDetails')};
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
  color: ${({theme}) => theme.colors.gray};
  margin-right: 4px;
`;

export const TeamRecord = styled.p`
  font-size: 14px;
  color: ${({theme}) => theme.colors.gray};
`;

interface ScoreProps {
  readonly $isHomeGame: boolean;
}

export const Score = styled.p<ScoreProps>`
  font-size: 36px;
  text-align: right;
  white-space: nowrap;

  @media (max-width: 600px), (min-width: 950px) and (max-width: 1120px) {
    align-self: center;
    justify-self: center;
    grid-area: ${({$isHomeGame}) => ($isHomeGame ? 'homeTeamScore' : 'awayTeamScore')};
  }
`;

export const FinalScore = styled.p`
  margin: 0 8px;
  font-size: 36px;
  align-self: center;
  justify-self: center;
`;
