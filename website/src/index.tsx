import {createBrowserHistory} from 'history';
import ReactDOM from 'react-dom';
import {Route, Router, Switch} from 'react-router-dom';
import {ThemeProvider} from 'styled-components';

import theme from './resources/theme.json';

import './index.css';
import './weather-icons.min.css';
// Load fonts
import 'typeface-bungee';

import {lazy, Suspense} from 'react';

const history = createBrowserHistory();

export const AsyncFootballScheduleScreen = lazy(() =>
  // @ts-expect-error TODO: Fix this.
  import('./screens/FootballScheduleScreen/index').then((module) => ({
    default: module.FootballScheduleScreen,
  }))
);

export const AsyncExplorablesScreen = lazy(() =>
  // @ts-expect-error TODO: Fix this.
  import('./screens/ExplorablesScreen/index').then((module) => ({
    default: module.ExplorablesScreen,
  }))
);

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Router history={history}>
      <Switch>
        <Route path="/explorables">
          <Suspense fallback={null}>
            <AsyncExplorablesScreen />
          </Suspense>
        </Route>
        <Route path="/">
          <Suspense fallback={null}>
            <AsyncFootballScheduleScreen />
          </Suspense>
        </Route>
      </Switch>
    </Router>
  </ThemeProvider>,
  document.getElementById('root')
);
