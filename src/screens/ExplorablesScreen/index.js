import React from 'react';
import {Fragment} from 'redux-little-router';

import Explorables from '../../components/explorables/Explorables';
import ExplorablesS1E1 from '../../components/explorables/season1/episode1';
import ExplorablesS1E2 from '../../components/explorables/season1/episode2';

export default () => {
  return (
    <React.Fragment>
      <Fragment forRoute="/s1e1-down-to-the-wire">
        <ExplorablesS1E1 />
      </Fragment>
      <Fragment forRoute="/s1e2-chasing-perfection">
        <ExplorablesS1E2 />
      </Fragment>
      <Fragment forRoute="/">
        <Explorables />
      </Fragment>
    </React.Fragment>
  );
};
