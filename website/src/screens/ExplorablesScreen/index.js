import React from 'react';
import {Route, Switch, useRouteMatch} from 'react-router-dom';

import Explorables from '../../components/explorables/Explorables';
import ExplorablesS1E1 from '../../components/explorables/season1/episode1';
import ExplorablesS1E2 from '../../components/explorables/season1/episode2';

export default () => {
  const {path} = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/s1e1-down-to-the-wire`}>
        <ExplorablesS1E1 />
      </Route>
      <Route path={`${path}/s1e2-chasing-perfection`}>
        <ExplorablesS1E2 />
      </Route>
      <Route path="/">
        <Explorables />
      </Route>
    </Switch>
  );
};
