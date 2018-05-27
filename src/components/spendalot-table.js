// @ts-check

import {
  html,
  LitElement,
} from '@polymer/lit-element';
import { repeat } from 'lit-html/lib/repeat.js';

import '@polymer/paper-checkbox/paper-checkbox.js';

console.time('table');

class SpendalotTable extends LitElement {
  _render({
    tableTitle,
    tableData,
  }) {
    const firstProp = tableData[0];

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

      .header {
        display: flex;
        flex-direction: row;
        align-items: center;

        height: 64px;
      }

      table,
      td {
        border: 1px solid #ddd;
        border-collapse: collapse;
      }
      table {
        width: 100%;
        height: 100%;
        padding: 0 0 0 16px;
      }
      thead {
        text-transform: capitalize;
        min-height: 48px;
      }
      tr > td:first-of-type {
        padding: 0 0 0 16px;
      }
      tr > td {
        height: 48px;
      }
      tr > td > div {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      tr > td > div > paper-checkbox {
        width: 24px;
        height: 24px;
        padding: 3px;
        margin: 0 12px 0 0;
      }

    </style>

    <div class="header">
      <h2>${tableTitle}</h2>
      <div></div>
    </div>

    <table>
      <thead>
        <tr>${repeat(Object.keys(firstProp), (n, i) =>
          html`<td>
            <div>${
              i === 0
                ? html`<paper-checkbox></paper-checkbox>`
                : ''
            }${n}</div>
          </td>`)}</tr>
      </thead>
      <tbody>${
        repeat(tableData, item => item.id, n =>
          html`<tr>${
            Object.keys(n).map((nn, nni) =>
              html`<td>
                <div>${
                  nni === 0
                    ? html`<paper-checkbox></paper-checkbox>`
                    : ''
                }${n[nn]}</div>
              </td>`)
          }</tr>`)
      }</tbody>
      <tfoot></tfoot>
    </table>
    `;
  }

  static get properties() {
    return {
      tableTitle: String,
      tableData: Array,
    };
  }

  constructor() {
    super();
  }

  _firstRendered() {
    console.timeEnd('table');
  }

}

window.customElements.define('spendalot-table', SpendalotTable);