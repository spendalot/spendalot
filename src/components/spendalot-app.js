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
    appName,

    __selectedPage,
  }) {
    return html`
    <style>
      :host {
        display: block;
        box-sizing: border-box;

        --spendalot-app-primary-color: #2779ff;
        --spendalot-app-secondary-color: #fff;
        --spendalot-app-primary-border-radius: 20px;
        --spendalot-app-side-margin: 96px;
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
      header::before {
        display: content;
        content: '';
        position: absolute;
        max-height: 480px;
        width: 100%;
        height: calc((100vw * .8) / 3 * 2);
        background-color: var(--spendalot-app-primary-color);
        color: var(--spendalot-app-secondary-color);
        border-radius: 0 0 var(--spendalot-app-primary-border-radius) var(--spendalot-app-primary-border-radius);
        z-index: -1;
      }

      app-toolbar {
        margin: 24px var(--spendalot-app-side-margin) 0;
        padding: 0;
        color: var(--spendalot-app-secondary-color);
        font-size: 16px;
      }
      .top-toolbar > .avatar {
        margin: 0 0 0 auto;
        width: 48px;
        height: 48px;
        background-color: rgba(255, 255, 255, .5);
        border-radius: 50%;
      }
      .bottom-toolbar {
        align-items: flex-start;
        margin: 0 96px;
      }

      main {
        min-height: 100vh;
        width: 100%;
        height: 100%;
      }

      .content-container {
        margin: 0 var(--spendalot-app-side-margin) 40px;
        width: calc(100% - (2 * var(--spendalot-app-side-margin)));
      }

      .trend-graph,
      .data-table {
        margin: 24px 0 0;
        width: 100%;
        background-color: var(--spendalot-app-secondary-color);
        color: var(--spendalot-app-primary-color);
        border-radius: var(--spendalot-app-primary-border-radius);
      }
      .trend-graph {
        height: 131px;
      }
      .data-table {
        height: 100vh;
      }

      .bottomsheet-nav {
        width: 100%;
        height: 64px;
        background-color: var(--spendalot-app-secondary-color);
        color: var(--spendalot-app-primary-color);
        border-radius: var(--spendalot-app-primary-border-radius) var(--spendalot-app-primary-border-radius) 0 0;
      }
    </style>

    <header>
      <app-toolbar class="top-toolbar">
        <paper-icon-button style="margin: 0 16px 0 0;" icon="app:menu"></paper-icon-button>
        <div title style="font-size: 24px;">${appName}</div>
        <paper-icon-button style="margin: 0 0 0 autp;" class="avatar" src=""></paper-icon-button>
      </app-toolbar>

      <app-toolbar class="bottom-toolbar">
        <div style="margin: 0 0 0 auto;">Good day, ${'motss'}!</div>
      </app-toolbar>
    </header>

    <main>
      <div class="content-container">
        <div class="trend-graph"></div>
        <div class="data-table"></div>
      </div>
    </main>

    <nav class="bottomsheet-nav">

    </nav>

    <!-- <spendalot-footer>
      <div>Build with ❤️ and Lit-Element</div>
    </spendalot-footer> -->
    `;
  }

  static get properties() {
    return {
      appName: String,

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