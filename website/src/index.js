import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import {Route, Switch} from 'react-router-dom';
import {createStore, applyMiddleware} from 'redux';
import {ConnectedRouter, routerMiddleware} from 'react-router-redux';

import registerServiceWorker from './registerServiceWorker';

import Victory from './components/explorables/Victory';
import YardPoints from './components/explorables/YardPoints';
import WinPercentage from './components/explorables/WinPercentage';
import HomeContainer from './containers/HomeContainer';

import './index.css';

// Reducers
import rootReducer from './reducers/index.js';

// Load fonts
require('typeface-bungee');
require('typeface-bungee-shade');
require('typeface-merriweather');

// Create a browser history
const history = createHistory();

// Middleware
const middleware = [routerMiddleware(history)];
if (process.env.NODE_ENV !== 'production') {
  const {logger} = require('redux-logger');
  middleware.push(logger);
}

// Create the Redux store
const store = createStore(rootReducer, applyMiddleware(...middleware));

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route path="/explorables/yard-points" component={YardPoints} />
        <Route path="/explorables/win-percentage" component={WinPercentage} />
        <Route path="/explorables/victory" component={Victory} />
        <Route path="/:year?/:selectedGameIndex?" component={HomeContainer} />
      </Switch>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
