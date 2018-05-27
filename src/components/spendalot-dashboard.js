// @ts-check

import {
  html,
  LitElement,
} from '@polymer/lit-element';
import { repeat } from 'lit-html/lib/repeat.js';

import './spendalot-graph.js';
import './spendalot-table.js';

console.time('dashboard');

class SpendalotDashboard extends LitElement {
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

      spendalot-graph,
      spendalot-table {
        max-width: calc(100% - 16px / 2);
        margin: 0 16px;
      }

      spendalot-graph.graph + spendalot-table.history {
        margin: 16px 16px 0;
      }

    </style>

    <div>
      <spendalot-graph class="graph"></spendalot-graph>

      <spendalot-table class="history"
        tableTitle="History"
        tableData="${__history}"></spendalot-table>
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
      {
        date: '2017-01-01',
        debit: 200,
        credit: 0,
        isHoliday: false,
        isWeekend: false,
      },
    ];
  }

  _firstRendered() {
    console.timeEnd('dashboard');
  }
}

window.customElements.define('spendalot-dashboard', SpendalotDashboard);