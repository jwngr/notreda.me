import {darken} from 'polished';
import {Link} from 'react-router-dom';
import styled, {css} from 'styled-components';

import {assertNever} from '../lib/utils';
import {GameResult, TVNetwork} from '../models/games.models';
import {FlexRow} from './common/Flex';
import {TeamLogo} from './common/TeamLogo';

interface GameWrapperProps {
  readonly $isSelected: boolean;
  readonly $isHomeGame: boolean;
}

export const GameWrapper = styled(Link)<GameWrapperProps>`
  height: 52px;
  padding: 0 4px;

  display: flex;
  align-content: center;
  justify-content: space-between;

  text-decoration: none;
  color: ${({theme}) => theme.colors.black};

  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
  }

  @media (max-width: 600px) {
    justify-content: space-between;
  }

  @media (max-width: 768px) {
    &:hover {
      transform: none;
    }
  }

  ${({$isHomeGame}) => ($isHomeGame ? homeGameWrapperStyles : awayGameWrapperStyles)}
`;

const homeGameWrapperStyles = css<GameWrapperProps>`
  ${({theme, $isSelected}) => ($isSelected ? `background: ${theme.colors.gold}cc;` : null)}

  &:hover {
    background: ${({theme, $isSelected}) =>
      $isSelected ? `${theme.colors.gold}cc` : `${theme.colors.black}20`};
  }
`;

const awayGameWrapperStyles = css<GameWrapperProps>`
  background-size: 4px 4px;

  ${({theme, $isSelected}) =>
    $isSelected
      ? css`
          background-image: repeating-linear-gradient(
            135deg,
            ${theme.colors.gold},
            ${theme.colors.gold} 1px,
            transparent 2px,
            transparent 2px,
            ${theme.colors.gold} 3px
          );

          &:hover {
            background-image: repeating-linear-gradient(
              135deg,
              ${({theme}) => theme.colors.gold},
              ${({theme}) => theme.colors.gold} 1px,
              transparent 2px,
              transparent 2px,
              ${({theme}) => theme.colors.gold} 3px
            );
          }
        `
      : css`
          background-image: repeating-linear-gradient(
            135deg,
            ${darken(0.2, theme.colors.blue)}30,
            ${darken(0.2, theme.colors.blue)}30 1px,
            transparent 2px,
            transparent 2px,
            ${darken(0.2, theme.colors.blue)}30 3px
          );

          &:hover {
            background-image: repeating-linear-gradient(
              135deg,
              ${({theme}) => theme.colors.black}30,
              ${({theme}) => theme.colors.black}30 1px,
              transparent 2px,
              transparent 2px,
              ${({theme}) => theme.colors.black}30 3px
            );
          }
        `}
`;

export const OpponentLogo = styled(TeamLogo)`
  // TODO: Handle this explicitly via the size prop.
  @media (max-width: 600px) {
    height: 28px;
    width: 28px;
  }
`;

export const DateOpponentDetailsWrapper = styled.div`
  margin-left: 10px;
`;

export const GameDate = styled.p`
  font-size: 14px;
  font-family: 'Inter', serif;

  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

export const OpponentDetailsWrapper = styled(FlexRow)`
  width: 250px;

  @media (max-width: 600px) {
    width: initial;
  }
`;

export const AwayGamePrefix = styled.span`
  font-size: 16px;
  font-family: 'Bungee';
  margin-right: 4px;

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

export const OpponentRanking = styled.span`
  font-size: 16px;
  font-family: 'Bungee';
  margin-right: 4px;

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

export const OpponentName = styled.span`
  font-size: 20px;
  font-family: 'Bungee';
  white-space: nowrap;

  @media (max-width: 600px) {
    font-size: 18px;
  }
`;

export const Location = styled.p`
  font-family: 'Inter', serif;
  font-size: 14px;
  width: 200px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 600px) {
    display: none;
  }

  @media (min-width: 950px) and (max-width: 1200px) {
    display: none;
  }
`;

export const Score = styled(FlexRow).attrs({
  justify: 'space-between',
})`
  min-width: 112px;
  font-size: 22px;
  font-family: 'Bungee';
  text-align: center;

  @media (max-width: 600px) {
    font-size: 18px;
    margin-right: 0;
    min-width: 100px;
  }
`;

interface ScoreResultProps {
  readonly $result: GameResult;
}

export const ScoreResult = styled.p<ScoreResultProps>`
  width: 20px;
  margin-right: 4px;

  ${({$result}) => {
    switch ($result) {
      case GameResult.Win:
        return css`
          color: ${({theme}) => theme.colors.green};
          margin-right: 5px;
          -webkit-text-stroke: 2px; /* TODO: cross-browser solution */
          -webkit-text-stroke-color: ${({theme}) => darken(0.2, theme.colors.green)};
        `;
      case GameResult.Loss:
        return css`
          color: ${({theme}) => theme.colors.red};
          -webkit-text-stroke: 2px; /* TODO: cross-browser solution */
          -webkit-text-stroke-color: ${({theme}) => darken(0.2, theme.colors.red)};
        `;
      case GameResult.Tie:
        return css`
          color: ${({theme}) => theme.colors.gold};
          -webkit-text-stroke: 2px; /* TODO: cross-browser solution */
          -webkit-text-stroke-color: ${({theme}) => darken(0.2, theme.colors.gold)};
        `;
      default:
        assertNever($result);
    }
  }}
`;

interface ScoreTotalsProps {
  readonly $isOvertimeGame: boolean;
}

export const ScoreTotals = styled.div<ScoreTotalsProps>`
  flex: 1;

  ${({$isOvertimeGame}) =>
    $isOvertimeGame
      ? css`
    margin-top: 6px;
    line-height: 14px;
  }`
      : null}
`;

interface TelevisionCoverageProps {
  readonly $network: TVNetwork;
}

export const TelevisionCoverage = styled(FlexRow).attrs({
  justify: 'center',
})<TelevisionCoverageProps>`
  min-width: 120px;

  p {
    width: auto;
    font-size: 16px;
    font-family: 'Inter', serif;
  }

  img {
    height: ${({$network}) => {
      switch ($network) {
        case TVNetwork.ESPN2:
          return '11px';
        case TVNetwork.ACCN:
        case TVNetwork.ESPN:
        case TVNetwork.CBSSN:
          return '14px';
        case TVNetwork.FOX:
        case TVNetwork.CSTV:
        case TVNetwork.USA:
          return '20px';
        case TVNetwork.TBS:
          return '26px';
        case TVNetwork.Pac12Network:
          return '44px';
        case TVNetwork.Peacock:
          return '48px';
        case TVNetwork.ABC:
        case TVNetwork.CBS:
        case TVNetwork.KATZ:
        case TVNetwork.NBC:
        case TVNetwork.NBCSN:
        case TVNetwork.SportsChannel:
        case TVNetwork.WGN_TV:
        case TVNetwork.ABC_ESPN:
        case TVNetwork.ABC_ESPN2:
        case TVNetwork.RAYCOM_WGN:
        case TVNetwork.USA_WGN_TV:
        case TVNetwork.Unknown:
          return '32px';
        default:
          assertNever($network);
      }
    }};
    margin-left: 10px;
  }

  @media (max-width: 600px) {
    min-width: 100px;

    p {
      font-size: 14px;
    }

    img {
      height: ${({$network}) => {
        switch ($network) {
          case TVNetwork.ESPN:
          case TVNetwork.ESPN2:
          case TVNetwork.Peacock:
            return '10px';
          case TVNetwork.FOX:
          case TVNetwork.ACCN:
          case TVNetwork.CSTV:
          case TVNetwork.CBSSN:
            return '14px';
          case TVNetwork.USA:
          case TVNetwork.TBS:
            return '18px';
          case TVNetwork.ABC:
          case TVNetwork.CBS:
          case TVNetwork.KATZ:
          case TVNetwork.NBC:
          case TVNetwork.NBCSN:
          case TVNetwork.SportsChannel:
          case TVNetwork.WGN_TV:
          case TVNetwork.ABC_ESPN:
          case TVNetwork.ABC_ESPN2:
          case TVNetwork.RAYCOM_WGN:
          case TVNetwork.USA_WGN_TV:
          case TVNetwork.Pac12Network:
          case TVNetwork.Unknown:
            return '24px';
          default:
            assertNever($network);
        }
      }};
    }
  }
`;

export const ShamrockSeriesLogo = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 4px;
`;

export const OvertimeIndicator = styled.span`
  font-size: 12px;
`;
