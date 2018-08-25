import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {compose, createStore, applyMiddleware, combineReducers} from 'redux';
import {routerForBrowser, initializeCurrentLocation} from 'redux-little-router';

import rootReducers from './reducers/index.js';
import registerServiceWorker from './registerServiceWorker';

import App from './App';

import './index.css';

// Load fonts
require('typeface-bungee');
require('typeface-bungee-shade');
require('typeface-merriweather');

// Router
const routes = {
  '/': {
    '/:year': {
      '/:selectedGameIndex': true,
    },
  },
};

const {reducer: routerReducer, middleware: routerMiddleware, enhancer} = routerForBrowser({
  routes,
});

// Middleware
const middleware = [routerMiddleware];
if (process.env.NODE_ENV !== 'production') {
  const {logger} = require('redux-logger');
  middleware.push(logger);
}

// Create the Redux store
const store = createStore(
  combineReducers({
    router: routerReducer,
    ...rootReducers,
  }),
  compose(
    enhancer,
    applyMiddleware(...middleware)
  )
);

// Initialize the current location of redux-little-router.
const initialLocation = store.getState().router;
if (initialLocation) {
  store.dispatch(initializeCurrentLocation(initialLocation));
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
