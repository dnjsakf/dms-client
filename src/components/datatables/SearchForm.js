'use client';

import { forwardRef, useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";

const SearchForm = ( props, ref ) => {
  const {
    rows,
    onSearch,
    onClear,
    ...rest
  } = props;

  const handleClickSearch = async ( ) => {
    if( typeof onSearch === 'function' ){
      await onSearch();
    }
  }
  
  const handleClickClear = async ( ) => {
    if( typeof onClear === 'function' ){
      await onClear();
    }
  }

  const buttonTemplate = () => {
    return (
      <div className="serach-row-buttons flex col-12 p-0 justify-content-end">
        <div className="flex col-4 pr-2 pt-0 justify-content-end">
          <Button className="p-button-text text-cyan-800 hover:text-cyan-600" icon="pi pi-refresh" onClick={ handleClickClear } />
          <Button className="p-button-text text-cyan-800 hover:text-cyan-600" icon="pi pi-search" onClick={ handleClickSearch } />
        </div>
      </div>
    );
  }

  const rowTemplate = () => {
    const _rows = (rows||[]);
    const maxColspan = Math.max(..._rows.map((row)=>(row.length)));
    return _rows.map((row, rowIdx)=>{
      const rowId = (rowIdx + 1);
      const columns = (row||[]).map((col, colIdx, arr)=>{
        const colId = (colIdx + 1);
        const split = Math.floor((12 / maxColspan));
        return (
          <div key={`search-column-${rowId}-${colId}`} className={classNames("flex", `col-${split}`)}>
            { col }
          </div>
        );
      });
      return (
        <div
          key={`esarch-row-${rowId}`}
          className={`serach-row-${rowId} flex col-12 p-0`}
        >
          { columns }
        </div>
      );
    });
  }

  return (
    <div ref={ ref } className="search-form flex flex-wrap col-12 p-2 mb-2 border-solid border-round border-200">
      { rowTemplate() }
      { buttonTemplate() }
    </div>
  );
}

export default forwardRef(SearchForm);