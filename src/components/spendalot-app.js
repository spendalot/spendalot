// @ts-check

import {
  html,
  LitElement,
} from '@polymer/lit-element';

import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';

import { store } from '../store.js';
import './spendalot-pages.js';

console.time('app');

class SpendalotApp extends store(LitElement) {
  _render({
    appTitle,

    __selectedPage,
  }) {
    return html`
    <style>
      :host {
        display: block;
        box-sizing: border-box;

        --spendalot-app-primary-color: #2779ff;
      }

      * {
        box-sizing: border-box;
      }

      app-toolbar {
        background-color: var(--spendalot-app-primary-color);
        color: #fff;
      }
    </style>

    <!-- Header -->
    <app-header>
      <app-toolbar>${appTitle}</app-toolbar>
    </app-header>

    <main>
      <spendalot-pages selectedPage="${__selectedPage}">
        <div page="page-1">page 1</div>
        <div page="page-2">page 2</div>
        <div page="page-3">page 3</div>
      </spendalot-pages>
    </main>
    `;
  }

  static get properties() {
    return {
      appTitle: String,

      __selectedPage: {
        type: String,
        readonly: true,
      },
    };
  }

  constructor() {
    super();
    setPassiveTouchGestures(true);

    this.__selectedPage = this.__selectedPage == null
      ? 'page-1'
      : this.__selectedPage;
  }

  _firstRendered() {
    console.debug('_firstRendered');
    console.timeEnd('app');
  }

  _didRender(props, changed) {
    console.debug('_didRender', props, changed);
  }

  _stateChanged(state) {
    console.debug('_stateChanged', state);
  }

  get pages() {
    return this.shadowRoot.querySelector('spendalot-pages');
  }

}

window.customElements.define('spendalot-app', SpendalotApp);