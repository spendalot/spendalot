import { 
  createStore,
  compose,
  applyMiddleware,
  combineReducers,
} from 'redux';
import thunk from 'redux-thunk';
import { lazyReducerEnhancer } from 'pwa-helpers/lazy-reducer-enhancer.js';

import app from './reducers/app.js';

const composer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const initStore = (reducers) => {
  const store = createStore(
    (state, action) => state,
    composer(lazyReducerEnhancer(combineReducers), applyMiddleware(thunk))
  );
  
  store.addReducers({ app: reducers });
  
  return store;
};

export default initStore;