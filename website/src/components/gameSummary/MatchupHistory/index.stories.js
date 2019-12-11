import React from 'react';

import MatchupHistory from './index.js';

export default {
  component: MatchupHistory,
  title: 'MatchupHistory',
};

export const stanford2006 = () => (
  <MatchupHistory
    game={{
      season: 2006,
      opponentId: 'STAN',
      isHomeGame: true,
      weekIndex: 5,
    }}
  />
);

export const stanford2019 = () => (
  <MatchupHistory
    game={{
      season: 2019,
      opponentId: 'STAN',
      isHomeGame: false,
      weekIndex: 11,
    }}
  />
);

export const marshall2022 = () => (
  <MatchupHistory
    game={{
      season: 2022,
      opponentId: 'MRSH',
      isHomeGame: true,
      weekIndex: 1,
    }}
  />
);
