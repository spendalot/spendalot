// @ts-check

import {
  html,
  LitElement,
} from '@polymer/lit-element';

console.time('footer');

class SpendalotFooter extends LitElement {
  _render({
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
    
      footer {
        display: flex;
        flex-direction: column;

        width: 100%;
        height: 100%;
        background-color: var(--spendalot-app-primary-color);
        color: var(--spendalot-app-primary-text-color);
      }

      :host ::slotted(*) {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        width: 100%;
        height: 48px;
        padding: 0 16px;
      }

    </style>
    
    <footer>
      <slot></slot>
    </footer>
    `;
  }

  static get properties() {
    return {
    };
  }
}

window.customElements.define('spendalot-footer', SpendalotFooter);