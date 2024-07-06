import _ from 'lodash';
import React from 'react';

import scorigamiData from '../data.json';
import {ScorigamiCell, ScorigamiChartWrapper, ScorigamiRow} from './index.styles';

export const ScorigamiChart = () => {
  const longestRowLength = _.max(scorigamiData.map((row) => (row ? row.length : 0)));

  return (
    <ScorigamiChartWrapper>
      {longestRowLength}
      {scorigamiData.map((row) => {
        return (
          <ScorigamiRow>
            {_.range(0, longestRowLength).map((i) => {
              let numGamesWithScore = _.get(row, i, 0);
              return (
                <ScorigamiCell numGamesWithScore={numGamesWithScore}>
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
