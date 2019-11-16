import styled from 'styled-components';
import {darken} from 'polished';

export const HistoricalMatchupWrapper = styled.div`
  text-align: center;
  margin: ${({isSeasonOnTop}) => (isSeasonOnTop ? '-60px 0 0 0' : '60px -20px 0 -20px')};
`;

export const FootballScoreWrapper = styled.div`
  position: relative;
  text-align: center;
  cursor: pointer;
`;

export const Score = styled.p`
  position: absolute;
  top: calc(50% - 10px);
  color: ${({theme, result, isSelected}) => {
    if (isSelected) {
      return result === 'T' ? darken(0.2, theme.colors.gold) : theme.colors.gold;
    } else {
      return theme.colors.white;
    }
  }};
  font-size: 14px;
  font-family: 'Inter UI', serif;
  width: 100%;
`;

export const Season = styled.p`
  color: ${({theme, isSelected}) =>
    isSelected ? darken(0.2, theme.colors.gold) : theme.colors.black};
  font-size: 14px;
  font-family: 'Bungee';
  margin: ${({isSeasonOnTop}) => (isSeasonOnTop ? 0 : '-4px 0 0 0')};
`;
