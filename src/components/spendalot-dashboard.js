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
        id: '9516',
        date: '2017-01-01',
        debit: 200,
        credit: 0,
        isHoliday: false,
        isWeekend: false,
      },
      {
        id: '61558',
        date: '2017-01-02',
        debit: 300,
        credit: 0,
        isHoliday: false,
        isWeekend: false,
      },
      {
        id: '12685',
        date: '2017-01-03',
        debit: 400,
        credit: 0,
        isHoliday: false,
        isWeekend: false,
      },
      {
        id: '62327',
        date: '2017-01-04',
        debit: 400,
        credit: 0,
        isHoliday: false,
        isWeekend: false,
      },
      {
        id: '6935',
        date: '2017-01-05',
        debit: 400,
        credit: 0,
        isHoliday: false,
        isWeekend: false,
      },
      {
        id: '23952',
        date: '2017-01-06',
        debit: 400,
        credit: 0,
        isHoliday: false,
        isWeekend: false,
      },
      {
        id: '6286',
        date: '2017-01-07',
        debit: 400,
        credit: 0,
        isHoliday: false,
        isWeekend: false,
      },
      {
        id: '22935',
        date: '2017-01-08',
        debit: 400,
        credit: 0,
        isHoliday: false,
        isWeekend: false,
      },
      {
        id: '7946',
        date: '2017-01-09',
        debit: 400,
        credit: 0,
        isHoliday: false,
        isWeekend: false,
      },
      {
        id: '34586',
        date: '2017-01-10',
        debit: 400,
        credit: 0,
        isHoliday: false,
        isWeekend: false,
      },
      {
        id: '11003',
        date: '2017-01-11',
        debit: 400,
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