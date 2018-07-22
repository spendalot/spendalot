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
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';

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
    __isMobile,
  }) {
    return html`
    <style>
      :host {
        display: grid;
        grid-template-columns: minmax(var(--spendalot-app-main-max-width), 1fr) minmax(var(--spendalot-app-trend-max-width), 1fr);
        grid-template-areas: "content nav";
        box-sizing: border-box;

        min-height: 100vh;

        --spendalot-app-main-max-width: 80vw;
        --spendalot-app-trend-max-width: 20vw;
        --spendalot-app-primary-color: #2779ff;
        --spendalot-app-secondary-color: #fff;
        --spendalot-app-primary-border-radius: 20px;
        --spendalot-app-side-margin: 96px;
      }

      * {
        box-sizing: border-box;
      }

      .content-container {
        grid-area: content;
        
        position: relative;
        display: grid;
        grid-template-rows: minmax(auto, 150px) minmax(auto, 1fr) 64px;
        grid-template-areas: "header"
                             "main"
                             "bottomsheet";
      }

      header {
        grid-area: header;

        width: 100%;
      }
      header::before {
        display: content;
        content: '';
        position: absolute;
        max-height: 480px;;
        width: 100%;
        /* height: calc((100vw * .8) / 3 * 2); */
        height: 100vh;
        background-color: var(--spendalot-app-primary-color);
        color: var(--spendalot-app-secondary-color);
        border-radius: 0 0 0 100px;
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
        grid-area: main;

        width: 100%;
      }

      .main-container {
        margin: 0 var(--spendalot-app-side-margin) 40px;
        max-width: calc(100% - (2 * var(--spendalot-app-side-margin)));
        width: 100%;
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
        height: 140px;
      }
      .data-table {
        max-height: calc(100vh - 150px - 140px - 24px * 2 - 64px - 40px);
        height: 100vh;
        overflow: auto;
      }

      .nav-bottomsheet {
        grid-area: bottomsheet;

        position: fixed;
        left: 0;
        bottom: 0;
        max-width: var(--spendalot-app-main-max-width);
        width: 100%;
        height: 64px;
        padding: 0 16px;
        background-color: var(--spendalot-app-secondary-color);
        color: var(--spendalot-app-primary-color);
        border-radius: var(--spendalot-app-primary-border-radius) var(--spendalot-app-primary-border-radius) 0 0;
      }

      .fab {
        position: fixed;
        right: calc(20% + 16px);
        bottom: calc(64px + 16px);

        width: 64px;
        height: 64px;
        background-color: #fb0097;
        border-radius: 50%;
      }

      .nav-trend {
        grid-area: nav;

        position: relative;
        display: grid;
        grid-template-columns: 16px 1fr 16px;
        grid-template-rows: 64px minmax(auto, 1fr);
        grid-template-areas: ". header ."
                             ". trend .";
        min-width: 20vw;
        background-color: #30517a;
        overflow: auto;
      }
      .nav-trend__title {
        grid-area: header;
        align-self: center;
        justify-self: center;

        color: #6eea82;
        font-size: 24px;
        font-weight: 500;
        letter-spacing: 2px;
      }

      .nav-trend__trend-card-container {
        grid-area: trend;

        margin: 24px 0 0;
      }
      .trend-card {
        margin: 0 0 24px;
      }
      .trend-card__title {
        color: #fff;
      }
      .trend-card__content {
        height: 300px;
        background-color: #fff;
        border-radius: var(--spendalot-app-primary-border-radius);
      }

      @media screen and (max-width: 500px) {
        :host {
          grid-template-columns: 1fr;
        }

        header::before {
          max-height: calc(150px + 24px + 140px + 24px + 64px);
          border-radius: 0 0 0 16px;
        }

        app-toolbar {
          margin: 24px 16px 0;
        }
        .bottom-toolbar {
          margin: 0 16px;
        }

        .main-container {
          max-width: calc(100% - 16px * 2);
          margin: 0 16px;
        }

        .fab {
          bottom: calc(64px - (64px / 2));
          right: calc(50% - (64px / 2));
        }

        .nav-bottomsheet {
          max-width: 100%;
        }
      }
    </style>

    <div class="content-container">
      <header>
        <app-toolbar class="top-toolbar">
          ${__isMobile
            ? html`<paper-icon-button
              style="margin: 0 16px 0 0;" icon="app:menu"></paper-icon-button>`
            : null}
          <div title style="font-size: 24px;">${appName}</div>
          <paper-icon-button style="margin: 0 0 0 autp;" class="avatar" src=""></paper-icon-button>
        </app-toolbar>
  
        <app-toolbar class="bottom-toolbar">
          <div style="margin: 0 0 0 auto;">Good day, ${'motss'}!</div>
        </app-toolbar>
      </header>
  
      <main>
        <div class="main-container">
          <div class="trend-graph"></div>
          <div class="data-table"></div>
        </div>
  
      </main>
  
      <nav class="nav-bottomsheet">
      </nav>

      <paper-icon-button class="fab"></paper-icon-button>
    </div>
      
    ${__isMobile
      ? null
      : html`<nav class="nav-trend">
        <div class="nav-trend__title">Trends</div>

        <div class="nav-trend__trend-card-container">
          <div class="trend-card">
            <h3 class="trend-card__title">Tue, Jan 7, 2014</h3>
            <div class="trend-card__content"></div>
          </div>
        </div>
      </nav>`}

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
      __isMobile: Boolean,
    };
  }

  constructor() {
    super();
    setPassiveTouchGestures(true);

    this.__isMobile = false;
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
    installMediaQueryWatcher('(max-width: 500px)', (matches) => {
      console.log({ matches });

      this.__isMobile = matches;
    });
  }

  _didRender(props, changed) {
    console.debug('_didRender', props, changed);
  }

  _stateChanged(state = {}) {
    console.debug('_stateChanged', state);

    const {
      app: {
        page,
        offline,
        snackbarOpened,
      } = {},
    } = state || {};

    this.__selectedPage = page;
    this.__offline = offline;
    this.__snackbarOpened = snackbarOpened;
  }

  get pages() {
    return this.shadowRoot.querySelector('spendalot-pages');
  }

}

window.customElements.define('spendalot-app', SpendalotApp);