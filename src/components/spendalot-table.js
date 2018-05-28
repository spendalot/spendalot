// @ts-check

import {
  html,
  LitElement,
} from '@polymer/lit-element';
import { repeat } from 'lit-html/lib/repeat.js';

import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-icon-button/paper-icon-button.js';

import './spendalot-icons.js';

console.time('table');

class SpendalotTable extends LitElement {
  _render({
    tableTitle,
    tableData,

    __perPage,
    __pageNumber,
  }) {
    const firstProp = tableData[0];
    const firstPropKey = Object.keys(firstProp);
    const cachedPropCls = firstPropKey.map(n =>
      typeof firstProp[n] !== 'boolean'
        && (typeof firstProp[n] === 'number' || !isNaN(firstProp[n])));
    const totalPages = Math.ceil(tableData.length / __perPage);
    const firstItem = __pageNumber * __perPage;
    const lastItem = firstItem + __perPage;
    
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
        border-collapse: collapse;
      }
      table {
        width: 100%;
        height: 100%;
        padding: 0 0 0 16px;
        color: #222;
        font-weight: 500;
      }
      thead {
        min-height: 48px;
        color: #555;
        text-transform: capitalize;
      }
      tr > td {
        height: 48px;
        padding: 0 0 0 16px;
      }
      tr > td:not(:last-of-type) {
        padding: 0 56px 0 16px;
      }
      tr > td > div {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      thead > tr > td > div.is-number,
      tr > td > div.is-number {
        justify-content: flex-end;
      }
      tr > td > div > paper-checkbox {
        --paper-checkbox-checked-color: var(--spendalot-app-primary-text-color);
        --paper-checkbox-checked-ink-color: var(--spendalot-app-primary-text-color);
        --paper-checkbox-unchecked-color: #555;
        --paper-checkbox-unchecked-ink-color: #555;
        --paper-checkbox-label-spacing: 12px;
        --paper-checkbox-label-color: #555;
      }
      tbody > tr > td > div > paper-checkbox {
        --paper-checkbox-label-color: currentColor;
      }
      tbody > tr:hover {
        background-color: #eee;
      }

      .table__footer {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;

        margin: 0 0 16px;
        color: #757575;
        font-size: 14px;
      }
      .table__footer > select {
        margin: 0 0 0 16px;
      }
      .table__footer > .pages {
        margin: 0 0 0 30px;
      }
      .table__footer > .actions {
        margin: 0 0 0 44px;
      }
      .table__footer > .actions > paper-icon-button {
        color: #333;
      }
      .table__footer > .actions > paper-icon-button + paper-icon-button {
        margin: 0 0 0 8px;
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
            <div class$="${cachedPropCls[i] ? 'is-number' : ''}">${
              i === 0
                ? html`<paper-checkbox>${n}</paper-checkbox>`
                : html`${n}`
            }</div>
          </td>`)}</tr>
      </thead>

      <tbody>${
        repeat(tableData, item => item.id, n =>
          html`<tr>${
            firstPropKey.map((nn, nni) =>
              html`<td>
                <div class$="${cachedPropCls[nni] ? 'is-number' : ''}">${
                  nni === 0
                    ? html`<paper-checkbox>${n[nn]}</paper-checkbox>`
                    : html`${n[nn]}`
                }</div>
              </td>`)
          }</tr>`)
      }</tbody>
    </table>

    <div class="table__footer">
      <div>Rows per page</div>

      <select>
        <option value="10" selected>10</option>
        <option value="15">15</option>
        <option value="20">20</option>
      </select>

      <div class="pages">${1 + firstItem} - ${lastItem} of ${totalPages}</div>

      <div class="actions">
        <paper-icon-button alt="previous page" icon="app:chevron-left"></paper-icon-button>
        <paper-icon-button alt="next page" icon="app:chevron-right"></paper-icon-button>
      </div>
    </div>
    `;
  }

  static get properties() {
    return {
      tableTitle: String,
      tableData: Array,

      __perPage: Number,
      __pageNumber: Number,
    };
  }

  constructor() {
    super();

    this.__perPage = 10;
    this.__pageNumber = 0;
  }

  _firstRendered() {
    console.timeEnd('table');
  }

}

window.customElements.define('spendalot-table', SpendalotTable);