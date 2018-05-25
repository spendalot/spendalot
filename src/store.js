// @ts-check

import { connect } from 'pwa-helpers/connect-mixin.js';

import { app } from './reducers/app.js';
import { initStore } from './init-store.js';

export const store = connect(initStore(app));

export default store;