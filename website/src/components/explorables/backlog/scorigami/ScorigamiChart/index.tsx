import max from 'lodash/max';
import range from 'lodash/range';
import React from 'react';

import scorigamiData from '../data.json';
import {ScorigamiCell, ScorigamiChartWrapper, ScorigamiRow} from './index.styles';

export const ScorigamiChart: React.FC = () => {
  const longestRowLength = max(scorigamiData.map((row) => (row ? row.length : 0)));

  return (
    <ScorigamiChartWrapper>
      {longestRowLength}
      {scorigamiData.map((row) => {
        return (
          <ScorigamiRow>
            {range(0, longestRowLength).map((i) => {
              const numGamesWithScore = row ? row[i] ?? 0 : 0;
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
