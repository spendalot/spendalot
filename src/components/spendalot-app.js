// @ts-check

import {
  html,
  LitElement,
} from '@polymer/lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';

// import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';

import { installRouter } from 'pwa-helpers/router.js';
import { installOfflineWatcher } from 'pwa-helpers/network.js';

import '@polymer/paper-icon-button/paper-icon-button.js';

import { store, connectStore } from '../store.js';
import { navigate, updateOffline } from '../actions/app.js';
import './spendalot-icons.js';
import './spendalot-pages.js';
import './spendalot-footer.js';

console.time('app');

class SpendalotApp extends connectStore(LitElement) {
  _render({
    appTitle,

    __selectedPage,
  }) {
    return html`
    <style>
      :host {
        display: block;
        box-sizing: border-box;

        --spendalot-app-primary-color: #fff;
        --spendalot-app-primary-text-color: #2779ff;
        --spendalot-app-primary-border-radius: 20px;
      }

      * {
        box-sizing: border-box;
      }

      header {
        display: flex;
        flex-direction: column;

        width: 100%;
        height: 100%;
      }

      app-toolbar {
        background-color: var(--spendalot-app-primary-color);
        color: var(--spendalot-app-primary-text-color);
      }
      app-toolbar > paper-icon-button {
        margin: 0 8px 0 0;

        --paper-icon-button-ink-color: var(--spendalot-app-primary-text-color);
      }

      main {
        min-height: 100vh;
        width: 100%;
        height: 100%;
        background-color: #fff;
      }
    </style>

    <!-- Header -->
    <header>
      <app-toolbar>
        <paper-icon-button alt="menu" icon="app:menu"></paper-icon-button>
        <div main-title>${appTitle}</div>
      </app-toolbar>
      <app-toolbar></app-toolbar>
    </header>

    <main>
      <spendalot-pages selectedPage="${__selectedPage}">
        <spendalot-dashboard page="dashboard"></spendalot-dashboard>
      </spendalot-pages>
    </main>

    <spendalot-footer>
      <div>Build with ❤️ and Lit-Element</div>
    </spendalot-footer>
    `;
  }

  static get properties() {
    return {
      appTitle: String,

      __selectedPage: String,
      __offline: Boolean,
      __snackbarOpened: Boolean,
    };
  }

  constructor() {
    super();
    setPassiveTouchGestures(true);
  }

  _firstRendered() {
    console.debug('_firstRendered');
    console.timeEnd('app');

    installRouter((location) => {
      store.dispatch(navigate(window.decodeURIComponent(window.location.pathname)));
    });
    installOfflineWatcher((offline) => {
      store.dispatch(updateOffline(offline));
    });
  }

  _didRender(props, changed) {
    console.debug('_didRender', props, changed);
  }

  _stateChanged(state) {
    console.debug('_stateChanged', state);

    this.__selectedPage = state.app.page;
    this.__offline = state.app.offline;
    this.__snackbarOpened = state.app.snackbarOpened;
  }

  get pages() {
    return this.shadowRoot.querySelector('spendalot-pages');
  }

}

window.customElements.define('spendalot-app', SpendalotApp);