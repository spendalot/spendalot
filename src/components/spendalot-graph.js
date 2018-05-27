// @ts-check

import {
  html,
  LitElement,
} from '@polymer/lit-element';

console.time('graph');

class SpendalotGraph extends LitElement {
  _render({
    __history,
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

      .graph-container {
        max-height: 500px;
        min-height: 300px;
        width: 100%;
        height: 100%;
        background-color: var(--spendalot-app-primary-color);
        border-radius: var(--spendalot-app-primary-border-radius);
        z-index: 4;
        box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14),
                    0 1px 10px 0 rgba(0, 0, 0, 0.12),
                    0 2px 4px -1px rgba(0, 0, 0, 0.4);
      }

    </style>

    <div class="graph-container">
    </div>
    `;
  }

  static get properties() {
    return {
      __history: Array,
    };
  }

  constructor() {
    super();

    this.__history = [
      1,2,3,4,5,6,
    ];
  }

  _firstRendered() {
    console.timeEnd('graph');
  }
}

window.customElements.define('spendalot-graph', SpendalotGraph);