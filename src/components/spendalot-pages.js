// @ts-check

import {
  html,
  LitElement,
} from '@polymer/lit-element';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';

import { store, connectStore } from '../store.js';

console.time('pages');

class SpendalotPages extends connectStore(LitElement) {
  _render({
    page,
  }) {
    return html`
    <style>
      :host {
        display: block;
        box-sizing: border-box;
      }
    
      * {
        box-sizing: border-box;
      }

      [hidden] {
        display: none !important;
      }
    
      .content-container {
        width: 100%;
        height: 100%;
      }

    </style>
    
    <div class="content-container">
      <slot></slot>
    </div>
    `;
  }

  static get properties() {
    return {
      page: String,
      selectedPage: String,

      __slotted: Array,
    };
  }

  constructor() {
    super();
  }

  ready() {
    super.ready();

    this.__slotObserver = new FlattenedNodesObserver(this, (info) => {
      console.debug('info', info);

      const slotted = info.addedNodes.filter(n => n.localName);

      slotted.map((n) => {
        return !n.hasAttribute('page-selected')
          && n.getAttribute('page') !== this.selectedPage
          && n.setAttribute('hidden', '');
      });

      this.__slotted = slotted;
    });
  }

  _firstRendered() {
    console.debug('_firstRendered');
    console.timeEnd('pages');
  }

  _didRender(props, changed) {
    console.debug('_didRender', props, changed);

    switch (true) {
      case Array.isArray(props.__slotted)
        && props.__slotted.length > 0
        && 'selectedPage' in changed: {
        this.__slotted.map((n) => {
          const page = n.getAttribute('page');
  
          if (page == null) return;

          page === props.selectedPage
            ? n.removeAttribute('hidden')
            : n.setAttribute('hidden', '');
        });
      }
    }
  }

  _stateChanged(state) {
    console.debug('_stateChanged', state);
  }

}

window.customElements.define('spendalot-pages', SpendalotPages);