// Libraries
import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Route, Router, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

// Presentational components
import App from '../components/App';
import About from '../components/About';
import YearSchedule from '../components/YearSchedule';

// Reducers
import rootReducer from '../reducers/index.js';

// Create the redux store
const store = createStore(rootReducer);

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
