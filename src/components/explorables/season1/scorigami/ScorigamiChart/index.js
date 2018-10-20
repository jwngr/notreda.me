import _ from 'lodash';
import React from 'react';

import scorigamiData from '../data.json';

import {ScorigamiRow, ScorigamiCell, ScorigamiChart} from './index.styles';

const getBackgroundColor = (value) => {
  switch (value) {
    case 0:
      return;
  }
  if (value === 0) {
  } else {
  }
};

export default () => {
  const longestRowLength = _.max(scorigamiData.map((row) => (row ? row.length : 0)));

  return (
    <ScorigamiChart>
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
    </ScorigamiChart>
  );
};
