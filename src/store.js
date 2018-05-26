// @ts-check

import { connect } from 'pwa-helpers/connect-mixin.js';

import { app } from './reducers/app.js';
import { initStore } from './init-store.js';

export const store = initStore(app, true);
export const connectStore = connect(store);

export default store;