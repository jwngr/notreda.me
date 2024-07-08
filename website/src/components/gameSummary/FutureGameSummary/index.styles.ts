import styled, {css} from 'styled-components';

import {TeamLogo} from '../../TeamLogo';

export const FutureGameWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 8px;
  }

  @media (max-width: 768px) {
    padding-bottom: 20px;
  }
`;

export const TeamsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-family: 'Bungee';
  margin: 16px 0;

  @media (max-width: 600px), (min-width: 950px) and (max-width: 1120px) {
    display: grid;
    grid-gap: 12px 20px;
    grid-template-areas:
      'awayTeamDetails awayTeamLogo'
      'atOrVersus atOrVersus'
      'homeTeamDetails homeTeamLogo';
    }
  }
`;

export const TeamWrapper = styled.div`
  display: flex;
  align-items: center;

  img {
    height: 80px;
    width: 80px;
    margin: 0 40px;
  }

  &:first-of-type img {
    margin-left: 8px;
    margin-right: 20px;
  }

  &:last-of-type img {
    margin-left: 20px;
    margin-right: 8px;
  }
`;

interface TeamDetailsWrapperProps {
  readonly $isHomeGame: boolean;
}

export const TeamDetailsWrapper = styled.div<TeamDetailsWrapperProps>`
  display: flex;
  flex-direction: column;
  font-family: 'Inter UI', serif;

  text-align: ${({$isHomeGame}) => ($isHomeGame ? 'left' : 'right')};

  @media (max-width: 600px), (min-width: 950px) and (max-width: 1120px) {
    text-align: right;
    align-self: center;
    justify-self: right;
    grid-area: ${({$isHomeGame}) => ($isHomeGame ? 'homeTeamDetails' : 'awayTeamDetails')};
  }
`;

export const TeamName = styled.p`
  font-size: 12px;
  text-transform: uppercase;

  @media (max-width: 600px), (min-width: 950px) and (max-width: 1120px) {
    font-size: 18px;
  }
`;

export const TeamNickname = styled.p`
  font-size: 20px;

  @media (max-width: 600px), (min-width: 950px) and (max-width: 1120px) {
    font-size: 24px;
  }
`;

interface TeamImageProps {
  readonly $isHomeGame: boolean;
}

export const TeamImage = styled(TeamLogo)<TeamImageProps>`
  width: 52px;
  height: 52px;

  ${({$isHomeGame}) =>
    $isHomeGame
      ? css`
          margin-left: 8px;
          margin-right: 8px;

          @media (max-width: 600px), (min-width: 950px) and (max-width: 1120px) {
            width: 72px;
            height: 72px;

            margin: 0 16px 0 0;
            align-self: center;
            justify-self: center;

            grid-area: homeTeamLogo;
          }
        `
      : css`
          order: 1;
          margin-left: 8px;
          margin-right: 8px;

          @media (max-width: 600px), (min-width: 950px) and (max-width: 1120px) {
            width: 72px;
            height: 72px;

            margin: 0 16px 0 0;
            align-self: center;
            justify-self: center;

            grid-area: awayTeamLogo;
          }
        `}
`;

export const TeamRanking = styled.span`
  font-size: 12px;
  margin-right: 4px;
  color: ${({theme}) => theme.colors.gray};

  @media (max-width: 600px), (min-width: 950px) and (max-width: 1120px) {
    font-size: 16px;
  }
`;

export const TeamRecord = styled.p`
  font-size: 12px;
  color: ${({theme}) => theme.colors.gray};

  @media (max-width: 600px), (min-width: 950px) and (max-width: 1120px) {
    font-size: 16px;
  }
`;

export const AtOrVersus = styled.p`
  font-size: 32px;

  @media (max-width: 600px), (min-width: 950px) and (max-width: 1120px) {
    align-self: center;
    justify-self: center;
    grid-area: atOrVersus;
  }
`;

export const StatsWrapper = styled.div`
  width: 100%;
  display: flex;
  margin-top: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;
