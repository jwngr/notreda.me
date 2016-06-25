// Libraries
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Route, Router, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

// Presentational components
import App from '../components/App';
import About from '../components/About';
import YearSchedule from '../components/YearSchedule';

// Reducers
import rootReducer from '../reducers/index.js';

// Middlewares
const middlewares = [];
if (process.env.NODE_ENV !== 'production') {
  const createLogger = require('redux-logger');
  const logger = createLogger();
  middlewares.push(logger);
}

// Create the redux store
const store = createStore(
  rootReducer,
  applyMiddleware(...middlewares)
);

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

render(
  <Provider store={ store }>
    <Router history={ history }>
      <Route path='/' component={ App }>
        <IndexRoute component={ YearSchedule } />
        <Route path='about' component={ About } />
        <Route path=':year' component={ YearSchedule } />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
