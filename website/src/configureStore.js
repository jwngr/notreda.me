import {createBrowserHistory} from 'history';
import {createStore} from 'redux';

import {createRootReducer} from './reducers';

export const history = createBrowserHistory();

// Store.
export function configureStore() {
  const store = createStore(createRootReducer());
  return store;
}
