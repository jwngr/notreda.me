import {darken} from 'polished';
import styled from 'styled-components';

interface HistoricalMatchupWrapperProps {
  readonly $isSeasonOnTop: boolean;
}

export const HistoricalMatchupWrapper = styled.div<HistoricalMatchupWrapperProps>`
  text-align: center;
  margin: ${({$isSeasonOnTop}) => ($isSeasonOnTop ? '0 0 0 0' : '120px -20px 0 -20px')};
`;

export const FootballScoreWrapper = styled.div`
  position: relative;
  text-align: center;
`;

interface SeasonProps {
  readonly $isSeasonOnTop: boolean;
  readonly $isSelected: boolean;
}

export const Season = styled.p<SeasonProps>`
  cursor: pointer;
  color: ${({theme, $isSelected}) =>
    $isSelected ? darken(0.2, theme.colors.gold) : theme.colors.black};
  font-size: 14px;
  font-family: 'Bungee';
  margin: ${({$isSeasonOnTop}) => ($isSeasonOnTop ? '0 0 -2px 1px' : '-6px 0 0 1px')};

  span {
    display: inline-block;

    &:nth-of-type(1) {
      transform: ${({$isSeasonOnTop}) =>
        $isSeasonOnTop
          ? 'translate3d(-2px, 2px, 0) rotate(-14deg)'
          : 'translate3d(-2px, -2px, 0) rotate(14deg)'};
    }

    &:nth-of-type(2) {
      transform: ${({$isSeasonOnTop}) =>
        $isSeasonOnTop
          ? 'translate3d(-1px, 0, 0) rotate(-5deg)'
          : 'translate3d(-1px, 0, 0) rotate(5deg)'};
    }

    &:nth-of-type(3) {
      transform: ${({$isSeasonOnTop}) =>
        $isSeasonOnTop
          ? 'translate3d(0px, 0, 0) rotate(5deg)'
          : 'translate3d(0px, 0, 0) rotate(-5deg)'};
    }

    &:nth-of-type(4) {
      transform: ${({$isSeasonOnTop}) =>
        $isSeasonOnTop
          ? 'translate3d(1px, 2px, 0) rotate(14deg)'
          : 'translate3d(1px, -2px, 0) rotate(-14deg)'};
    }
  }
`;
