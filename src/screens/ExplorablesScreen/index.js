import React from 'react';
import {Fragment} from 'redux-little-router';

import ExplorableSeasonOneEpisodeOne from '../../components/explorables/season1/episode1';

import {} from './index.styles';

export default () => {
  return (
    <React.Fragment>
      <Fragment forRoute="/s1e1-down-to-the-wire">
        <ExplorableSeasonOneEpisodeOne />
      </Fragment>
    </React.Fragment>
  );
};
