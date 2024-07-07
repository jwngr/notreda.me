import {darken} from 'polished';
import styled from 'styled-components';

export const ScorigamiChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 740px;
  justify-content: center;
  border: solid 3px ${({theme}) => darken(0.2, theme.colors.green)};
  background-color: ${({theme}) => theme.colors.gold}66;
`;

export const ScorigamiRow = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;

  &:last-of-type {
    div {
      border-bottom: solid 1px ${({theme}) => darken(0.2, theme.colors.green)};
    }
  }
`;

export const ScorigamiCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  min-height: 20px;
  font-family: 'Inter UI';
  font-size: 12px;
  color: ${({theme}) => theme.colors.white};
  border: solid 1px ${({theme}) => darken(0.2, theme.colors.green)};
  border-bottom-width: 0;
  border-right-width: 0;

  &:last-of-type {
    border-right-width: 1px;
  }

  background-color: ${({theme, numGamesWithScore}) => {
    let color = `${theme.colors.gray}40`;
    if (numGamesWithScore > 0) {
      color = darken(0.02 * numGamesWithScore, theme.colors.green);
    }
    return color;
  }};
`;
