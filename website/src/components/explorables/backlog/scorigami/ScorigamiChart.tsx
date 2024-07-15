import max from 'lodash/max';
import range from 'lodash/range';
import {darken} from 'polished';
import React from 'react';
import styled from 'styled-components';

import scorigamiData from './data.json';

const ScorigamiChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 740px;
  justify-content: center;
  border: solid 3px ${({theme}) => darken(0.2, theme.colors.green)};
  background-color: ${({theme}) => theme.colors.gold}66;
`;

const ScorigamiRow = styled.div`
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

interface ScorigamiCellProps {
  readonly $numGamesWithScore: number;
}

const ScorigamiCell = styled.div<ScorigamiCellProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  min-height: 20px;
  font-family: 'Inter';
  font-size: 12px;
  color: ${({theme}) => theme.colors.white};
  border: solid 1px ${({theme}) => darken(0.2, theme.colors.green)};
  border-bottom-width: 0;
  border-right-width: 0;

  &:last-of-type {
    border-right-width: 1px;
  }

  background-color: ${({theme, $numGamesWithScore}) => {
    let color = `${theme.colors.gray}40`;
    if ($numGamesWithScore > 0) {
      color = darken(0.02 * $numGamesWithScore, theme.colors.green);
    }
    return color;
  }};
`;

export const ScorigamiChart: React.FC = () => {
  const longestRowLength = max(scorigamiData.map((row) => (row ? row.length : 0)));

  return (
    <ScorigamiChartWrapper>
      {longestRowLength}
      {scorigamiData.map((row) => {
        return (
          <ScorigamiRow>
            {range(0, longestRowLength).map((i) => {
              const numGamesWithScore = row ? (row[i] ?? 0) : 0;
              return (
                <ScorigamiCell $numGamesWithScore={numGamesWithScore}>
                  {numGamesWithScore === 0 ? null : numGamesWithScore}
                </ScorigamiCell>
              );
            })}
          </ScorigamiRow>
        );
      })}
    </ScorigamiChartWrapper>
  );
};
