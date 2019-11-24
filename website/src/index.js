import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from 'react-loadable';
import {Provider} from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import {ThemeProvider} from 'styled-components';
import {ConnectedRouter} from 'connected-react-router';

import configureStore, {history} from './configureStore.js';

import theme from './resources/theme.json';
// import registerServiceWorker from './registerServiceWorker';
import {unregister} from './registerServiceWorker';

import './index.css';
import './weather-icons.min.css';

// Load fonts
require('typeface-bungee');

// TODO: migrate to React.lazy().
const AsyncFootballScheduleScreen = Loadable({
  loader: () => import('./screens/FootballScheduleScreen/container'),
  loading: () => null,
});

const AsyncExplorablesScreen = Loadable({
  loader: () => import('./screens/ExplorablesScreen'),
  loading: () => null,
});

// Create the Redux store.
const store = configureStore();

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <>
          <Switch>
            <Route path="/explorables">
              <AsyncExplorablesScreen />
            </Route>
            <Route path="/">
              <AsyncFootballScheduleScreen />
            </Route>
          </Switch>
        </>
      </ConnectedRouter>
    </Provider>
  </ThemeProvider>,
  document.getElementById('root')
);

// TODO: get service workers working again at some point...
unregister();
