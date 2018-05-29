// @ts-check

import {
  html,
  LitElement,
} from '@polymer/lit-element';
import { repeat } from 'lit-html/lib/repeat.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import {
  timeOut,
  animationFrame,
} from '@polymer/polymer/lib/utils/async.js';

import '@polymer/iron-icon/iron-icon.js';

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
    __rowSelected,
  }) {
    const firstProp = tableData[0];
    const firstPropKey = Object.keys(firstProp);
    // const cachedPropCls = firstPropKey.map(n =>
    //   typeof firstProp[n] !== 'boolean'
    //     && (typeof firstProp[n] === 'number' || !isNaN(firstProp[n])));
    const cachedPropCls = firstPropKey.map(n => typeof firstProp[n] === 'number');
    const tableDataLen = tableData.length;
    const firstItem = __pageNumber * __perPage;
    const lastItem = firstItem + __perPage;
    const itemsToRender = tableData.slice(firstItem, lastItem);

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
      .header > .has-selected-items {
        display: flex;
        flex-direction: row;
        align-items: center;

        position: relative;
        width: 100%;
        height: 100%;
        padding: 0 16px;
        color: var(--spendalot-app-primary-text-color);
        font-size: 18px;
      }
      .header > .has-selected-items::after {
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        content: '';
        width: 100%;
        height: 100%;
        background-color: var(--spendalot-app-primary-text-color);
        opacity: .25;
        transition: opacity 150ms cubic-bezier(0, 0, .4, 1);
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
      thead > tr > td > div.thead__cell.is-number,
      tr > td > div.is-number {
        justify-content: flex-end;
      }
      thead > tr > td > div.thead__cell > iron-icon {
        top: -2px;
        margin: 0 0 0 6px;
        opacity: 0;
        transform: rotate(180deg);
        transition: opacity 150ms cubic-bezier(0, 0, .4, 1),
                    transform 250ms cubic-bezier(0, 0, .4, 1);
        pointer-events: none;
      }
      thead > tr > td > div.thead__cell.is-number > iron-icon {
        margin: 0 6px 0 0;
      }
      thead > tr > td > div.thead__cell.show-sorting > iron-icon,
      thead > tr > td > div.thead__cell.show-sorting.is-number > iron-icon {
        opacity: 1;
      }
      thead > tr > td > div.thead__cell.show-sorting.show-sorting-reversed > iron-icon,
      thead > tr > td > div.thead__cell.show-sorting.show-sorting-reversed.is-number > iron-icon {
        transform: rotate(0deg);
      }
      tr > td > div > paper-checkbox {
        --paper-checkbox-checked-color: var(--spendalot-app-primary-text-color);
        --paper-checkbox-checked-ink-color: var(--spendalot-app-primary-text-color);
        --paper-checkbox-unchecked-color: #555;
        --paper-checkbox-unchecked-ink-color: #555;
        --paper-checkbox-label-spacing: calc(12px + (24px - 18px) / 2);
        --paper-checkbox-label-color: #555;
      }
      tbody > tr > td > div > paper-checkbox {
        --paper-checkbox-label-color: currentColor;
      }
      tbody > tr.row-selected,
      tbody > tr:hover {
        background-color: #eee;
      }
      tbody > tr.row-selected:hover {
        background-color: rgba(0, 0, 0, .2);
      }

      .table__footer {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;

        margin: 16px 0 0;
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
        margin: 0 0 0 calc(44px - (40px - 24px) / 2);
      }
      .table__footer > .actions > paper-icon-button {
        color: #333;
      }
      .table__footer > .actions > paper-icon-button[disabled] {
        color: rgba(0, 0, 0, .35);
      }
      .table__footer > .actions > paper-icon-button + paper-icon-button {
        margin: 0 0 0 8px;
      }
    </style>

    <div class="header">${
      Array.isArray(__rowSelected) && __rowSelected.length > 0
        ? html`<div class="has-selected-items">${__rowSelected.length} item${__rowSelected.length > 1 ? 's' : ''} selected</div>`
        : html`<h2>${tableTitle}</h2>
        <div></div>`
    }</div>

    <table on-click="${ev => this.tableSelected(ev)}">
      <thead>
        <tr>${repeat(Object.keys(firstProp), (n, i) => {
          const sortIcon = html`<iron-icon alt="sort by value"
            icon="app:arrow-upward"></iron-icon>`;

          return html`<td>
            <div class$="thead__cell ${cachedPropCls[i] ? 'is-number' : ''}"
              data-row-thead-cell$="${n}">${
              i === 0
                ? html`<paper-checkbox>${n}</paper-checkbox>${sortIcon}`
                : typeof tableData[0][n] === 'number'
                  ? html`${sortIcon}${n}`
                  : html`${n}${sortIcon}`
            }</div>
          </td>`;
        })}</tr>
      </thead>

      <tbody>${
        repeat(itemsToRender, item => item.id, n => {
          const isRowSelected = !(__rowSelected.find(rs => rs.id === n.id) == null);

          return html`<tr data-row-id$="${n.id}"
            class$="${isRowSelected ? 'row-selected' : ''}">${
            firstPropKey.map((nn, nni) =>
              html`<td>
                <div class$="${cachedPropCls[nni] ? 'is-number' : ''}">${
                  nni === 0
                    ? html`<paper-checkbox readonly checked?="${isRowSelected}">${n[nn]}</paper-checkbox>`
                    : html`${n[nn]}`
                }</div>
              </td>`)
          }</tr>`;
        })
      }</tbody>
    </table>

    <div class="table__footer">
      <div>Rows per page</div>

      <select on-change="${ev => this.updatePerPage(ev)}">
        <option value="10" selected>10</option>
        <option value="15">15</option>
        <option value="20">20</option>
      </select>

      <div class="pages">${
        itemsToRender.length === 1
          ? 1 + firstItem
          : html`${1 + firstItem} - ${lastItem > tableDataLen ? tableDataLen : lastItem}`
      } of ${tableDataLen}</div>

      <div class="actions">
        <paper-icon-button alt="previous page"
          disabled?="${__pageNumber < 1}"
          icon="app:chevron-left"
          on-click="${ev => this.showPreviousPage(ev)}"></paper-icon-button>
        <paper-icon-button alt="next page"
          disabled?="${lastItem >= tableDataLen}"
          icon="app:chevron-right"
          on-click="${ev => this.showNextPage(ev)}"></paper-icon-button>
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
      __rowSelected: Array,
    };
  }

  constructor() {
    super();

    this.__perPage = 10;
    this.__pageNumber = 0;
    this.__rowSelected = [];
  }

  _firstRendered() {
    console.timeEnd('table');

    this.__tableHeader = this.tableHeader;
  }

  tableSelected(ev) {
    const oriTgt = ev.target;
    let tgt = ev.target;

    if (tgt == null) return;

    this._tableSelectedDebouncer = Debouncer.debounce(
      this._tableSelectedDebouncer,
      timeOut.after(250),
      () => animationFrame.run(() => {
        while (tgt.localName !== 'tr') {
          tgt = tgt.parentElement;
        }
        
        if (tgt == null) return;
    
        if (tgt.parentElement && tgt.parentElement.localName === 'thead') {
          if (oriTgt.localName === 'div' && oriTgt.classList.contains('thead__cell')) {
            const theadCellVal = oriTgt.getAttribute('data-row-thead-cell');

            if (oriTgt.classList.contains('show-sorting')) {
              const hasSortingReversed = oriTgt.classList.contains('show-sorting-reversed');

              this.tableData = [...this.tableData].sort((a, b) => {
                const diff = hasSortingReversed
                  ? a[theadCellVal] - b[theadCellVal]
                  : b[theadCellVal] - a[theadCellVal];

                return diff === 0
                  ? 0
                  : diff < 0
                    ? -1
                    : 1;
              });

              return hasSortingReversed
                ? oriTgt.classList.remove('show-sorting-reversed')
                : oriTgt.classList.add('show-sorting-reversed');
            }

            const allTheadCells = this.allTheadCells;

            allTheadCells.map((n) => {
              if (n.classList.contains('show-sorting')) {
                n.classList.remove('show-sorting', 'show-sorting-reversed');
              }
            });

            oriTgt.classList.add('show-sorting');
            this.tableData = [...this.tableData].sort((a, b) => {
              const diff = a[theadCellVal] - b[theadCellVal];

              return diff === 0
                ? 0
                : diff < 0
                  ? -1 
                  : 1;
            });

            return;
          }

          if (oriTgt.localName === 'paper-checkbox') {
            this.allTableRows.map((n) => {
              const checkboxInTableRow = n.querySelector('paper-checkbox');
    
              if (oriTgt.checked) {
                n.classList.add('row-selected');
                checkboxInTableRow && (checkboxInTableRow.checked = true);
                this.__rowSelected = [...this.tableData];
              } else {
                n.classList.remove('row-selected');
                checkboxInTableRow && (checkboxInTableRow.checked = false);
                this.__rowSelected = [];
              }
            });
    
            return;
          }
        }
        
        if (tgt.parentElement && tgt.parentElement.localName === 'tbody') {
          const checkboxInRow = tgt.querySelector('paper-checkbox');
    
          if (oriTgt.localName === 'paper-checkbox' ? !oriTgt.checked : checkboxInRow.checked) {
            const selectedRowIdx = this.__rowSelected.findIndex(n => n.id === tgt.getAttribute('data-row-id'));
    
            checkboxInRow && (checkboxInRow.checked = false);
            tgt.classList.remove('row-selected');
            this.__rowSelected = [...this.__rowSelected.slice(0, selectedRowIdx), ...this.__rowSelected.slice(selectedRowIdx + 1)];
          } else {
            const selectedRowDataIdx = this.tableData.findIndex(n => n.id === tgt.getAttribute('data-row-id'));
    
            checkboxInRow && (checkboxInRow.checked = true);
            tgt.classList.add('row-selected');
            this.__rowSelected = [...this.__rowSelected, this.tableData[selectedRowDataIdx]];
          }
        }
      })
    );
  }

  updatePerPage(ev) {
    const val = ev.target.value;

    this._updatePerPageDebouncer = Debouncer.debounce(
      this._updatePerPageDebouncer,
      timeOut.after(250),
      () => animationFrame.run(() => {
        const newPerPage = +val;
        const tableDataLen = this.tableData.length;

        this.__pageNumber = tableDataLen < newPerPage && this.__pageNumber > 0
          ? Math.floor(tableDataLen / newPerPage)
          : this.__pageNumber;
        this.__perPage = newPerPage;
      })
    );
  }

  showPreviousPage(ev) {
    this._showPreviousPageDebouncer = Debouncer.debounce(
      this._showPreviousPageDebouncer,
      timeOut.after(250),
      () => animationFrame.run(() => {
        this.__pageNumber = this.__pageNumber - 1;
      })
    );
  }

  showNextPage(ev) {
    this._showNextPageDebouncer = Debouncer.debounce(
      this._showNextPageDebouncer,
      timeOut.after(250),
      () => animationFrame.run(() => {
        this.__pageNumber = 1 + this.__pageNumber;
      })
    );
  }

  get tableHeader() {
    return this.shadowRoot.querySelector('.header');
  }

  get allTableRows() {
    return Array.from(this.shadowRoot.querySelectorAll('tbody > tr'));
  }

  get allTheadCells() {
    return Array.from(this.shadowRoot.querySelectorAll('thead > tr .thead__cell'));
  }

}

window.customElements.define('spendalot-table', SpendalotTable);