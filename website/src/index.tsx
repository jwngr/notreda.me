import {ConnectedRouter} from 'connected-react-router';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import {ThemeProvider} from 'styled-components';

// @ts-expect-error TODO: Fix this.
import {configureStore, history} from './configureStore';
import theme from './resources/theme.json';

import './index.css';
import './weather-icons.min.css';
// Load fonts
import 'typeface-bungee';

import {lazy, Suspense} from 'react';

export const AsyncFootballScheduleScreen = lazy(() =>
  // @ts-expect-error TODO: Fix this.
  import('./screens/FootballScheduleScreen/container').then((module) => ({
    default: module.FootballScheduleScreenContainer,
  }))
);

export const AsyncExplorablesScreen = lazy(() =>
  // @ts-expect-error TODO: Fix this.
  import('./screens/ExplorablesScreen/index').then((module) => ({
    default: module.ExplorablesScreen,
  }))
);

// Create the Redux store.
const store = configureStore();

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <>
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
        </>
      </ConnectedRouter>
    </Provider>
  </ThemeProvider>,
  document.getElementById('root')
);
