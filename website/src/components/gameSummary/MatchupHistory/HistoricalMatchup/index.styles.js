import styled from 'styled-components';
import {darken} from 'polished';

export const HistoricalMatchupWrapper = styled.div`
  text-align: center;
  margin: ${({isSeasonOnTop}) => (isSeasonOnTop ? '0 0 0 0' : '120px -20px 0 -20px')};
`;

export const FootballScoreWrapper = styled.div`
  position: relative;
  text-align: center;
`;

export const Season = styled.p`
  cursor: pointer;
  color: ${({theme, isSelected}) =>
    isSelected ? darken(0.2, theme.colors.gold) : theme.colors.black};
  font-size: 14px;
  font-family: 'Bungee';
  margin: ${({isSeasonOnTop}) => (isSeasonOnTop ? 0 : '-4px 0 0 0')};
`;
