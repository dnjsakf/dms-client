'use client';

import { forwardRef, useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";

const SearchTable = ( props, ref ) => {
  const {
    dataKey,
    value,
    header,
    headerButtons,
    footer,
    totalItems,
    emptyMessage,
    onPageChange,
    children,
    ...rest
  } = props;

  const paginator = useRef();
  const contentRef = useRef();
  const paginatorRef = useRef();

  const [pageInfo, setPageInfo] = useState({
    first: 0,
    totalPages: 10,
    page: 1,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 20, 30],
  });

  const [scrollHeight, setScrollHeight] = useState(0);

  const handlePageChange = async ( event ) => {
    const tempPageInfo = {
      ...pageInfo,
      first: event.first,
      totalPages: event.totalPages,
      page: (event.page + 1),
      rowsPerPage: event.rows,
    }
    setPageInfo(tempPageInfo);
    if( typeof onPageChange === 'function' ){
      await onPageChange(tempPageInfo);
    }
  };

  useEffect(()=>{
    if( ref ){
      ref.current = {
        getPageInfo: () => ({
          ...pageInfo,
        }),
        goToFirstPage: (force=false) => {
          if( force ){
            handlePageChange({
              ...pageInfo,
              rows: pageInfo.rowsPerPage,
              first: 0,
              page: 0,
            });
          } else {
            setPageInfo({
              ...pageInfo,
              first: 0,
              page: 1,
            });
          }
        },
        goToLastPage: (force=false) => {
          const lastPage = Math.floor((totalItems - 1) / pageInfo.rowsPerPage);
          const lastPageFirst = lastPage * pageInfo.rowsPerPage;
          if( force ){
            handlePageChange({
              ...pageInfo,
              rows: pageInfo.rowsPerPage,
              first: lastPageFirst,
              page: lastPage,
            });
          } else {
            setPageInfo({
              ...pageInfo,
              first: lastPageFirst,
              page: lastPage + 1,
            });
          }
        },
      }
    }
  }, [ref, pageInfo, totalItems]);

  useEffect(()=>{
    const contentHeight = (contentRef.current?.offsetHeight||0) + ( contentRef.current?.offsetLeft||0 );
    const paginatorHeight = (paginatorRef.current?.offsetHeight||0) + ( paginatorRef.current?.offsetLeft||0 );
    setScrollHeight(Math.floor((contentHeight - paginatorHeight - 0.5)));
  }, [contentRef.current, paginatorRef.current]);

  return (
    <div
      className="search-content flex flex-column flex-grow-1 p-2 border-solid border-round border-200"
    >
      {
        (header || headerButtons) ? (
          <div className="content-header flex col-12 h-4rem">
            <div className="flex col-6 p-0 align-items-center pl-2">
              { header }
            </div>
            <div className="flex col-6 p-0 justify-content-end">
              { headerButtons }
            </div>
          </div>
        ) : null
      }
      <div
        ref={ contentRef }
        className="content-body flex flex-column flex-grow-1 col-12 pt-0 pb-0"
        >
        <div className="content-table flex-grow-1">
          <DataTable
            className="overflow-y-auto  w-full"
            dataKey={dataKey}
            showGridlines
            scrollable
            scrollHeight={`${scrollHeight}px`}
            selectionMode="checkbox"
            value={value}
            emptyMessage={()=>(
              <div className="text-center">
                <span>{ emptyMessage || "No Data" }</span>
              </div>
            )}
            { ...rest }
            >
              { children }
          </DataTable>
        </div>
        <div ref={paginatorRef} className="content-paginator">
          <Paginator
            ref={paginator}
            first={pageInfo.first}
            rows={pageInfo.rowsPerPage}
            totalRecords={totalItems}
            rowsPerPageOptions={pageInfo.rowsPerPageOptions}
            onPageChange={ handlePageChange }
          />
        </div>
      </div>
      {
        footer ? (
          <div className="content-footer flex col-12 h-4rem align-items-center">
            <div className="flex col-6 p-0">
            </div>
            <div className="flex col-6 p-0 justify-content-end">
              { footer }
            </div>
          </div>
        ) : null
      }
    </div>
  );
}

export default forwardRef(SearchTable);