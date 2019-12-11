import React from 'react';

import FootballShape from './index.js';

export default {
  component: FootballShape,
  title: 'FootballShape',
};

export const pastHomeWin = () => (
  <FootballShape
    type="past"
    text="Text"
    title="Title"
    result="W"
    isSelected={false}
    isHomeGame={true}
    uniqueFillPatternId={'past-home-win'}
  />
);

export const pastHomeLoss = () => (
  <FootballShape
    type="past"
    text="Text"
    title="Title"
    result="L"
    isSelected={false}
    isHomeGame={true}
    uniqueFillPatternId={'past-home-loss'}
  />
);

export const pastHomeTie = () => (
  <FootballShape
    type="past"
    text="Text"
    title="Title"
    result="T"
    isSelected={false}
    isHomeGame={true}
    season={2020}
    weekIndex={1}
    uniqueFillPatternId={'past-home-tie'}
  />
);
