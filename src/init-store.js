import { 
  createStore,
  compose,
  applyMiddleware,
  combineReducers,
} from 'redux';
import thunk from 'redux-thunk';
import { lazyReducerEnhancer } from 'pwa-helpers/lazy-reducer-enhancer.js';

import app from './reducers/app.js';

const LOCALSTORAGE_STATE_KEY = 'spendalot::state::key';
const composer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const loadState = () => {
  const state = JSON.parse(window.localStorage.getItem(LOCALSTORAGE_STATE_KEY) || '{}');

  return state
    ? state
    : undefined;
};

export const initStore = (reducers, useLocalstorage) => {
  const shouldUseLocalstorage = typeof useLocalstorage === 'boolean' && useLocalstorage;
  const store = createStore(
    ...[
      (state, action) => state,
      ...(shouldUseLocalstorage
        ? [loadState()]
        : []),
      composer(lazyReducerEnhancer(combineReducers), applyMiddleware(thunk))
    ]
  );
  
  store.addReducers({ app: reducers });

  if (shouldUseLocalstorage) {
    store.subscribe(() => {
      window.localStorage.setItem(LOCALSTORAGE_STATE_KEY, JSON.stringify(store.getState()));
    });
  }
  
  return store;
};

export default initStore;