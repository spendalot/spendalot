// @ts-check

import {
  html,
  LitElement,
} from '@polymer/lit-element';
import { repeat } from 'lit-html/lib/repeat.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import {
  timeOut,
} from '@polymer/polymer/lib/utils/async.js';

import '@polymer/iron-icon/iron-icon.js';

import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-tooltip/paper-tooltip.js';

import './spendalot-icons.js';

console.time('table');

class SpendalotTable extends LitElement {
  _render({
    tableTitle,
    tableData,
    tableDataDescription,

    perPage,
    pageNumber,
    pageLimits,
    showSelected,
  }) {
    const firstProp = tableData[0];
    const firstPropKey = showSelected
      ? [...new Set([...Object.keys(firstProp), 'selected'])]
      : Object.keys(firstProp).filter(n => n !== 'selected');
    // const cachedPropCls = firstPropKey.map(n =>
    //   typeof firstProp[n] !== 'boolean'
    //     && (typeof firstProp[n] === 'number' || !isNaN(firstProp[n])));
    const cachedPropCls = firstPropKey.map(n => typeof firstProp[n] === 'number');
    const tableDataLen = tableData.length;
    const firstItem = pageNumber * perPage;
    const lastItem = firstItem + perPage;
    const itemsToRender = tableData.slice(firstItem, lastItem);
    const rowSelected = tableData.filter(n => n.selected);

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

      .content-container {
        width: 100%;
        height: 100%;
        overflow: auto;
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
        padding: 0 0 0 64px;
      }
      tr > td:first-of-type {
        padding: 0 64px 0 16px;
      }
      tr > td:last-of-type {
        padding: 0 16px 0 64px;
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
      thead > tr > td > div.thead__cell.show-sorting {
        color: #000;
      }
      thead > tr > td > div.thead__cell > iron-icon {
        top: -2px;
        margin: 0 0 0 6px;
        opacity: 0;
        transform: rotate(180deg);
        transition: opacity 150ms cubic-bezier(0, 0, .4, 1),
                    transform this.debounceRatems cubic-bezier(0, 0, .4, 1);
        pointer-events: none;
      }
      thead > tr > td > div.thead__cell.is-number > iron-icon {
        margin: 0 6px 0 0;
      }
      thead > tr > td > div.thead__cell.show-sorting > iron-icon,
      thead > tr > td > div.thead__cell.show-sorting.is-number > iron-icon {
        color: #000;
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
        --paper-checkbox-label-color: #222;
      }
      tbody > tr.row-selected {
        background-color: #eee;
      }
      tbody > tr:hover {
        background-color: rgba(0, 0, 0, .15);
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
        min-width: calc(40px * 2 + 8px + (44px - (40px - 24px) / 2));
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
      Array.isArray(rowSelected) && rowSelected.length > 0
        ? html`<div class="has-selected-items">${rowSelected.length} item${rowSelected.length > 1 ? 's' : ''} selected</div>`
        : html`<h2>${tableTitle}</h2>
        <div class="header__actions">
          <slot name="header-actions"></slot>
        </div>`
    }</div>

    <div class="content-container">
      <table on-click="${ev => this.tableSelected(ev)}">
        <thead>
          <tr>${repeat(firstPropKey, (n, i) => {
            const sortIcon = html`<iron-icon alt="sort by value"
              icon="app:arrow-upward"></iron-icon>`;
            const theadId = `thead-id__${n.replace(/\W/gi, '-')}`;

            return html`<td>
              <div id$="${theadId}"
                class$="thead__cell ${cachedPropCls[i] ? 'is-number' : ''}"
                data-row-thead-cell$="${n}">${
                  i === 0
                    ? html`<paper-checkbox>${n}</paper-checkbox>${sortIcon}`
                    : typeof tableData[0][n] === 'number'
                      ? html`${sortIcon}${n}`
                      : html`${n}${sortIcon}`
                }
                <paper-tooltip for$="${theadId}" offset="0">${tableDataDescription[n]}</paper-tooltip>
              </div>
            </td>`;
          })}</tr>
        </thead>

        <tbody>${
          repeat(itemsToRender, item => item.id, (n) => {
            return html`<tr data-row-id$="${n.id}"
              class$="${n.selected ? 'row-selected' : ''}">${
              firstPropKey.map((nn, nni) => {
                return html`<td>
                  <div class$="${cachedPropCls[nni] ? 'is-number' : ''}">${
                    nni === 0
                      ? html`<paper-checkbox readonly checked?="${n.selected}">${n[nn]}</paper-checkbox>`
                      : html`${nn === 'selected' ? Boolean(n[nn]) : n[nn]}`
                  }</div>
                </td>`;
              })
            }</tr>`;
          })
        }</tbody>
      </table>
    </div>

    <div class="table__footer">
      <div>Rows per page</div>

      <select on-change="${ev => this.updatePerPage(ev)}">${
        pageLimits.map(n =>
          html`<option value="${n}" selected?="${n === perPage}">${n}</option>`)
      }</select>

      <div class="pages">${
        itemsToRender.length === 1
          ? 1 + firstItem
          : html`${1 + firstItem} - ${lastItem > tableDataLen ? tableDataLen : lastItem}`
      } of ${tableDataLen}</div>

      <div class="actions">
        <paper-icon-button alt="previous page"
          disabled?="${pageNumber < 1}"
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
      tableDataDescription: Object,

      perPage: Number,
      pageNumber: Number,
      pageLimits: Array,
      debounceRate: Number,
      showSelected: Boolean,
    };
  }

  constructor() {
    super();

    this.perPage = 10;
    this.pageNumber = 0;
    this.pageLimits = [
      10,
      30,
      50,
      100,
      200,
    ];
    this.debounceRate = 150;
    this.showSelected = false;
  }

  _firstRendered() {
    console.timeEnd('table');
  }

  tableSelected(ev) {
    let oriTgt = ev.target;
    let tgt = ev.target;

    if (tgt == null) return;

    this._tableSelectedDebouncer = Debouncer.debounce(
      this._tableSelectedDebouncer,
      timeOut.after(this.debounceRate),
      () => {
        while (tgt && tgt.localName !== 'tr') {
          tgt = tgt.parentElement;
        }
        
        if (tgt == null) return;
    
        if (tgt.parentElement && tgt.parentElement.localName === 'thead') {
          if (oriTgt.localName === 'td') {
            oriTgt = oriTgt.querySelector('.thead__cell');
          }
          
          if (oriTgt.localName === 'div' && oriTgt.classList.contains('thead__cell')) {
            const theadCellVal = oriTgt.getAttribute('data-row-thead-cell');

            if (oriTgt.classList.contains('show-sorting')) {
              const hasSortingReversed = oriTgt.classList.contains('show-sorting-reversed');

              this.tableData = [...this.tableData].sort((a, b) =>
                this.sortTableData(a, b, theadCellVal, !hasSortingReversed));

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
            this.tableData = [...this.tableData].sort((a, b) =>
              this.sortTableData(a, b, theadCellVal));

            return;
          }

          if (oriTgt.localName === 'paper-checkbox') {
            this.allTableRows.map((n) => {
              const checkboxInTableRow = n.querySelector('paper-checkbox');
    
              if (oriTgt.checked) {
                n.classList.add('row-selected');
                checkboxInTableRow && (checkboxInTableRow.checked = true);
                this.tableData = this.tableData.map((n) => {
                  return {
                    ...n,
                    selected: true,
                  };
                });
              } else {
                n.classList.remove('row-selected');
                checkboxInTableRow && (checkboxInTableRow.checked = false);
                this.tableData = this.tableData.map((n) => {
                  return {
                    ...n,
                    selected: false,
                  };
                });
              }
            });
    
            return;
          }
        }
        
        if (tgt.parentElement && tgt.parentElement.localName === 'tbody') {
          const checkboxInRow = tgt.querySelector('paper-checkbox');
    
          if (oriTgt.localName === 'paper-checkbox' ? !oriTgt.checked : checkboxInRow.checked) {
            const rowSelected = this.tableData.map((n) => {
              return {
                ...n,
                selected: n.id === tgt.getAttribute('data-row-id')
                  ? false
                  : n.selected,
              };
            });
    
            checkboxInRow && (checkboxInRow.checked = false);
            tgt.classList.remove('row-selected');
            
            this.tableData = rowSelected;
            this.dispatchEvent(new CustomEvent('row-selected', {
              detail: {
                rowSelected,
                perPage: this.perPage,
                pageNumber: this.pageNumber,
              },
              bubbles: true,
              composed: true,
            }));
          } else {
            const rowSelected = this.tableData.map((n) => {
              return {
                ...n,
                selected: n.id === tgt.getAttribute('data-row-id')
                  ? true
                  : n.selected,
              };
            });
    
            checkboxInRow && (checkboxInRow.checked = true);
            tgt.classList.add('row-selected');
            
            this.tableData = rowSelected;
            this.dispatchEvent(new CustomEvent('row-selected', {
              detail: {
                rowSelected,
                perPage: this.perPage,
                pageNumber: this.pageNumber,
              },
              bubbles: true,
              composed: true,
            }));
          }
        }
      }
    );
  }

  updatePerPage(ev) {
    const val = ev.target.value;

    this._updatePerPageDebouncer = Debouncer.debounce(
      this._updatePerPageDebouncer,
      timeOut.after(this.debounceRate),
      () => {
        const newPerPage = +val;
        const tableDataLen = this.tableData.length;

        this.pageNumber = tableDataLen < newPerPage && this.pageNumber > 0
          ? Math.floor(tableDataLen / newPerPage)
          : this.pageNumber;
        this.perPage = newPerPage;
      }
    );
  }

  showPreviousPage(ev) {
    this._showPreviousPageDebouncer = Debouncer.debounce(
      this._showPreviousPageDebouncer,
      timeOut.after(this.debounceRate),
      () => {
        this.pageNumber = this.pageNumber - 1;
      }
    );
  }

  showNextPage(ev) {
    this._showNextPageDebouncer = Debouncer.debounce(
      this._showNextPageDebouncer,
      timeOut.after(this.debounceRate),
      () => {
        this.pageNumber = 1 + this.pageNumber;
      }
    );
  }

  sortTableData(a, b, theadCellVal, hasSortingReversed = false) {
    const diff = ((na, nb, sr) => {
      switch (true) {
        case (typeof na === 'number'): {
          return sr
            ? nb - na
            : na - nb;
        }
        case (typeof na === 'string' && new Date(na).toJSON() == null): {
          return sr
            ? Intl.Collator('co', { numeric: true, usage: 'sort' }).compare(b, a)
            : Intl.Collator('co', { numeric: true, usage: 'sort' }).compare(a, b);
        }
        case (na != null && new Date(na).toJSON() != null): {
          return sr
            ? +new Date(nb) - +new Date(na)
            : +new Date(na) - +new Date(nb);
        }
        default: {
          return sr
            ? nb - na
            : na - nb;
        }
      }
    })(a[theadCellVal], b[theadCellVal], hasSortingReversed);
      
    return diff === 0
      ? 0
      : diff < 0
        ? -1
        : 1;
  }

  get allTableRows() {
    return Array.from(this.shadowRoot.querySelectorAll('tbody > tr'));
  }

  get allTheadCells() {
    return Array.from(this.shadowRoot.querySelectorAll('thead > tr .thead__cell'));
  }

}

window.customElements.define('spendalot-table', SpendalotTable);

// TODO: Yet to implement better sorting algo for other data types like Date