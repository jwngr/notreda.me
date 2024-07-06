import {routerMiddleware} from 'connected-react-router';
import {createBrowserHistory} from 'history';
import {applyMiddleware, compose, createStore} from 'redux';

import {createRootReducer} from './reducers';

export const history = createBrowserHistory();

// Store.
export function configureStore() {
  const store = createStore(
    createRootReducer(history),
    undefined,
    compose(applyMiddleware(routerMiddleware(history)))
  );

  return store;
}
