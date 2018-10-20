import {darken} from 'polished';
import styled from 'styled-components';

export const ScorigamiChart = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 740px;
  justify-content: center;
  border: solid 3px ${(props) => darken(0.2, props.theme.colors.green)};
  background-color: ${(props) => props.theme.colors.gold}66;
`;

export const ScorigamiRow = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;

  &:last-of-type {
    div {
      border-bottom: solid 1px ${(props) => darken(0.2, props.theme.colors.green)};
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
  color: ${(props) => props.theme.colors.white};
  border: solid 1px ${(props) => darken(0.2, props.theme.colors.green)};
  border-bottom-width: 0;
  border-right-width: 0;

  &:last-of-type {
    border-right-width: 1px;
  }

  background-color: ${(props) => {
    let color = `${props.theme.colors.gray}40`;
    if (props.numGamesWithScore > 0) {
      color = darken(0.02 * props.numGamesWithScore, props.theme.colors.green);
    }

    return color;
  }};
`;
