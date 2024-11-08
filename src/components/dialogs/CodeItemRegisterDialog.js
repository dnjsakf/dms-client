'use client';

import { useRef, useEffect, useState } from "react";

import { InputText } from 'primereact/inputtext';
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Column } from "primereact/column";

import SearchForm from "@/components/datatables/SearchForm";
import SearchTable from "@/components/datatables/SearchTable";

import CodeItemService from "@/services/common/CodeItemService";
import { InputNumber } from "primereact/inputnumber";

const defaultFormData = {
  codeId: '',
  codeItemId: '',
  codeItemName: '',
  codeItemDesc: '',
  realValue: '',
  sortOrder: 0,
  useYn: 'Y',
}

const defaultSearchParams = {
  codeId: '',
  codeItemName: '',
  codeItemDesc: '',
  realValue: '',
  totalItems: 0,
  page: 1,
}

const defaultCode = {
  useYn: [
    { label: '사용', value: 'Y', },
    { label: '미사용', value: 'N', },
  ],
};

const CodeItemRegisterDialog = ( props ) => {
  const {
    code,
    closeDialog,
    onCancel,
    onOk,
    ...rest
  } = props;

  const toast = useRef();
  const tableRef = useRef();

  const [searchParams, setSearchParams] = useState({
    ...defaultSearchParams,
    codeId: code.codeId||'',
  });
  const [dataList, setDataList] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [editingRows, setEditingRows] = useState({});
  const [errorRows, setErrorRows] = useState({});

  /**
   * 유효성 검사
   */
  const validate = ( formData ) => {
    const dataKey = formData._meta.key;
    const errors = {}
    if( !formData.codeItemId ){
      errors.codeItemId = 'codeItemId is required.';  
    }
    if( !formData.codeItemName ){
      errors.codeItemName = 'codeItemName is required.';  
    }

    const valid = (Object.keys(errors).length === 0);
    if( !valid ){
      setErrorRows({
        ...errorRows,
        [dataKey]: errors,
      });
    }
    return valid;
  }

  /**
   * 목록 조회 API 호출
   * - 목록 데이터 및 페이지 정보 갱신
   */
  const callSearch = async ( params ) => {
    try {
      const tempParams = {
        codeId: params?.codeId,
        codeItemName: params?.codeItemName,
        codeItemDesc: params?.codeItemDesc,
        realValue: params?.realValue,
        page: params?.page||1,
        rowsPerPage: params?.rowsPerPage||10,
      }
      const result = await CodeItemService.getDataPage(tempParams);
      if( result ){
        setDataList(result.data?.map((item, idx)=>{
          item._meta = {
            type: "load",
            index: idx,
            key: `${item.codeId}_${item.codeItemId}`,
          }
          return item;
        }));
        setSearchParams({
          ...searchParams,
          page: result.currentPage,
          totalItems: result.totalItems,
        });
        return true;
      } else {
        toast.current.show({
          severity: 'warn',
          detail: "조회 중 문제가 발생하였습니다.",
          summary: "경고",
        });
        return false;
      }
    } catch ( error ){
      console.error(error);
      toast.current.show({
        severity: 'error',
        detail: "조회 중 오류가 발생하였습니다.",
        summary: "오류",
      });
      return false;
    }
  }

  /**
   * 삭제 요청 API 호출
   */
  const callDelete = async (params) => {
    try {
      const tempParams = [
        ...params
      ];
      const result = await CodeItemService.deleteAllData(tempParams);
      if( result?.code === 200 ){
        setSearchParams({
          ...searchParams,
          page: 1,
        });
        toast.current.show({
          severity: 'success',
          detail: "삭제되었습니다.",
          summary: "완료",
        });
      } else {
        toast.current.show({
          severity: 'warn',
          detail: "삭제 중 문제가 발생하였습니다.",
          summary: "경고",
        });
      }
    } catch ( error ){
      console.error(error);
      toast.current.show({
        severity: 'error',
        detail: "삭제 중 오류가 발생하였습니다.",
        summary: "오류",
      });
    }
  }

  /**
   * 생성 요청 API 호출
   */
  const callCreate = async ( params ) => {
    try {
      const result = await CodeItemService.createData(params);
      return result;
    } catch ( error ){
      console.error(error);
      toast.current.show({
        severity: 'error',
        detail: "삭제 중 오류가 발생하였습니다.",
        summary: "오류",
      });
    }
  }

  /**
   * 수정 요청 API 호출
   */
  const callUpdate = async ( params ) => {
    try {
      const result = await CodeItemService.updateData(params);
      return result;
    } catch ( error ){
      console.error(error);
      toast.current.show({
        severity: 'error',
        detail: "삭제 중 오류가 발생하였습니다.",
        summary: "오류",
      });
    }
  }

  /**
   * 목록 체크박스 선택 이벤트
   */
  const handleChangeSelection = ( e ) => {
    setSelectedList(e.value);
  }

  /**
   * 검색 버튼 클릭 이벤트
   */
  const handleClickSearch = async () => {
    const params = tableRef.current.getPageInfo();
    const result = await callSearch({
      ...searchParams,
      ...params,
      page: 1,
    });
    if( result ){
      tableRef.current.goToFirstPage();
    }
  }

  /**
   * 검색 초기휘 버튼 클릭 이벤트
   */
  const handleClickClear = async () => {
    setSearchParams({
      ...defaultSearchParams,
      totalItems: searchParams.totalItems,
      codeId: searchParams.codeId,
    });
  }

  /**
   * 등록 버튼 클릭 이벤트
   * - 기존에 Editing 중이던 행이 있는 경우, 
   */
  const handleClickRegist = async () => {

    const tempEditingRows = {
      ...editingRows,
    }

    // 접었다가 펼치기
    // setEditingRows({});

    const nextIndex = Math.max(0, ...dataList.map((item)=>(item._meta.index || 0))) + 1;
    const newData = {
      ...defaultFormData,
      _meta: {
        type: "add",
        index: nextIndex,
        key: `TEMP${nextIndex}`,
      },
      codeId: code.codeId,
    }
    const tempDataList = [
      newData,
      ...dataList
    ];
    setDataList(tempDataList);

    tempEditingRows[newData._meta.key] = true;
    setEditingRows(tempEditingRows);
  }

  /**
   * 삭제 버튼 클릭 이벤트
   */
  const handleClickDelete = async () => {
    if( selectedList?.length > 0 ){
      const savedList = selectedList.slice().filter((item)=>( item._meta?.type === "load" ));
      
      setDataList([...dataList].filter((item)=>(
        !selectedList.some((selected)=>(
          selected.codeId === item.codeId
          && selected.codeItemId === item.codeItemId
        ))
      )));

      setSelectedList([]);
  
      if( savedList?.length > 0 ){
        await callDelete(savedList);
      }
    }
  }

  /**
   * 페이지 변경 이벤트
   */
  const handleChangePage = async ( pageInfo ) => {
    await callSearch({
      ...searchParams,
      ...pageInfo,
    });
  }

  /**
   * 닫기 버튼 클릭 이벤트
   */
  const handleClickCancel = async ( e ) => {
    let doClose = true;
    if( typeof onCancel === 'function' ){
      let r = await onCancel();
      if( r === false ){
        doClose = false;
      }
    }
    if( doClose ){
      if( typeof closeDialog === 'function' ){
        closeDialog();
      }
    }
  }

  /**
   * Row 입력 상태 변경 이벤트
   */
  const handleRowEditChange = ( e ) => {
    console.log('handleRowEditChange', e.data);
    // setEditingRows(e.data);
  } 

  /**
   * Row 입력 시작 이벤트
   * - 입력 대상 목록에 추가
   */
  const handleRowEditInit = ( e ) => {
    console.log('handleRowEditInit');
    const { data, index } = e;
    const dataKey = data._meta.key; // e.index
    setEditingRows({
      ...editingRows,
      [dataKey]: true
    });
  }

  /**
   * Row 입력 취소 이벤트
   * - 입력 대상 목록에서 삭제
   */
  const handleRowEditCancel = ( e ) => {
    console.log('handleRowEditCancel');
    const { data, index } = e;
    const dataKey = data._meta.key; // e.index
    let _editingRows = { ...editingRows };
    delete _editingRows[dataKey];
    setEditingRows(_editingRows);
  }

  /**
   * Row 입력 저장 이벤트
   * - 데이터 유형에 따라 생성/수정 요청
   */
  const handleRowEditSave = ( e ) => {
    console.log('handleRowEditSave');
    const { newData, index } = e;
    const tempDataList = [...dataList];
    tempDataList[index] = {
      ...newData,
      _meta: {
        ...newData._meta,
        state: "saving",
      }
    };
    setDataList(tempDataList);
  }

  /**
   * Row 입력 완료 이벤트
   * - 데이터 유형에 따라 생성/수정 요청
   */
  const handleRowEditComplete = async ( e ) => {
    console.log('handleRowEditComplete');
    let { newData, index, originalEvent } = e;

    const tempEditingRows = {
      ...editingRows,
    }

    newData._meta = {
      ...newData._meta,
      state: "done",
    }

    if( validate(newData) ){
      delete tempEditingRows[newData._meta.key];

      if( newData._meta?.type === "load" ){
        const result = await callUpdate(newData);
        if( result.code === 200 ){
          // await callSearch({
          //   ...searchParams,
          //   page: 1,
          // });
        }
      } else {
        const result = await callCreate(newData);
        if( result.code === 200 ){
          // await callSearch({
          //   ...searchParams,
          //   page: 1,
          // });
          newData = {
            ...result.data,
            _meta: {
              ...newData._meta,
              type: "load",
              key: `${result.data.codeId}_${result.data.codeItemId}`,
              index: newData._meta.index,
            }
          };
        }
      }
    }

    const tempDataList = [...dataList];
    tempDataList[index] = newData;
    setDataList(tempDataList);
    setEditingRows(tempEditingRows);
  }

  /**
   * 입력/수정 가능한 대상 설정
   */
  const allowEdit = (rowData) => {
    // return rowData.name !== 'Blue Band';
    return true;
  };

  /**
   * 문자 입력 이벤트
   */
  const handleChangeInputText = ( e ) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  }

  /**
   * 수정 버튼 랜더링
   */
  const rowEditorTemplate = (rowData, props) => {
    const saving = (rowData._meta.state === "saving");
    const { rowEditor } = props;
    if ( rowEditor.editing ) {
      if( saving ){
        return (
          <Button
            icon="pi pi-check"
            className="p-button-text p-button-success p-1"
            loading={ saving }
          />
        )
      }
      return (
        <>
          <Button
            icon="pi pi-check"
            className="p-button-text p-button-success p-1"
            onClick={(e)=>{
              rowEditor.onSaveClick(e);
            }}
          />
          <Button
            icon="pi pi-times"
            className="p-button-text p-button-danger p-1"
            onClick={(e)=>{
              rowEditor.onCancelClick(e);
            }}
          />
        </>
      );
    } else {
      return (
        <Button
          icon="pi pi-pencil"
          className="p-button-text p-button-primary p-1"
          onClick={(e)=>{
            rowEditor.onInitClick(e);
          }}
        />
      );
    }
};

  /**
   * 초기 데이터 설정
   */
  useEffect(()=>{
    callSearch(searchParams);
  }, []);

  return (
    <Dialog
      visible={ true }
      closeOnEscape={ true }
      className="w-full md:w-10 h-full md:h-full"
      header={(
        <div className="dialog-header">
          <span>코드 아이템 목록</span>
        </div>
      )}
      footer={(
        <div className="dialog-footer btn-group">
          <Button
            className="btn-cancel p-button-text"
            icon="pi pi-times"
            label={ '닫기' }
            onClick={ handleClickCancel }
          />
        </div>
      )}
      onHide={ handleClickCancel }
    >
      <div className="flex flex-column h-full">
        <Toast ref={ toast } />
        <SearchForm
          onSearch={ handleClickSearch }
          onClear={ handleClickClear }
          rows={[
            [
              <div className="p-inputgroup flex-1" key="1">
                <span className="p-inputgroup-addon col-4">코드명</span>
                <InputText
                  className="col-8"
                  name="codeItemName"
                  value={ searchParams.codeItemName }
                  onChange={ handleChangeInputText }
                />
              </div>,
              <div className="p-inputgroup flex-1" key="2">
                <span className="p-inputgroup-addon col-4">코드설명</span>
                <InputText
                  className="col-8"
                  name="codeItemDesc"
                  value={ searchParams.codeItemDesc }
                  onChange={ handleChangeInputText }
                />
              </div>,
              <div className="p-inputgroup flex-1" key="3">
                <span className="p-inputgroup-addon col-4">실제값</span>
                <InputText
                  className="col-8"
                  name="realValue"
                  value={ searchParams.realValue }
                  onChange={ handleChangeInputText }
                />
              </div>,
            ],
          ]}
        />
        <SearchTable
          ref={tableRef}
          // dataKey={(data)=>(data._meta?.key)}
          dataKey="_meta.key"
          className="p-fluid"
          totalItems={searchParams.totalItems}
          headerButtons={(
            <>
              <Button
                className="p-button-text text-cyan-800 hover:text-cyan-600"
                size="small"
                icon="pi pi-trash"
                onClick={ handleClickDelete }
              />
              <Button
                className="p-button-text text-cyan-800 hover:text-cyan-600 ml-2"
                size="small"
                icon="pi pi-plus"
                onClick={ handleClickRegist }
              />
            </>
          )}
          value={ dataList }
          selection={ selectedList }
          onSelectionChange={ handleChangeSelection }
          onPageChange={ handleChangePage }
          editMode="row"
          editingRows={ editingRows }
          onRowEditChange={ handleRowEditChange }
          onRowEditInit={ handleRowEditInit }
          onRowEditCancel={ handleRowEditCancel }
          onRowEditSave={ handleRowEditSave }
          onRowEditComplete={ handleRowEditComplete }
        >
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
          {/* <Column field="rn" header="순번" className="text-center" headerStyle={{ width: '5rem' }} /> */}
          <Column
            field="codeItemId"
            header="코드ID"
            className="text-center"
            headerStyle={{ width: 'calc(40% - 9rem)' }}
            editor={(options)=>(
              <InputText
                tabIndex={1}
                value={options.value}
                onChange={(e) => options.editorCallback(e.target.value)}
                invalid={!!errorRows[options.rowData._meta.key]?.hasOwnProperty(options.field)}
              />
            )}
          />
          <Column
            field="codeItemName"
            header="코드명"
            headerStyle={{ width: '15%' }}
            editor={(options) => (
              <InputText
                tabIndex={2}
                value={options.value}
                onChange={(e) => options.editorCallback(e.target.value)}
                invalid={!!errorRows[options.rowData._meta.key]?.hasOwnProperty(options.field)}
              />
            )}
          />
          <Column
            field="codeItemDesc"
            header="코드설명"
            headerStyle={{ width: '15%' }}
            editor={(options) => (
              <InputText
                tabIndex={3}
                value={options.value}
                onChange={(e) => options.editorCallback(e.target.value)}
                invalid={!!errorRows[options.rowData._meta.key]?.hasOwnProperty(options.field)}
              />
            )}
          />
          <Column
            field="realValue"
            header="실제값"
            headerStyle={{ width: '15%' }}
            editor={(options) => (
              <InputText
                tabIndex={4}
                value={options.value}
                onChange={(e) => options.editorCallback(e.target.value)}
                invalid={!!errorRows[options.rowData._meta.key]?.hasOwnProperty(options.field)}
              />
            )}
          />
          <Column
            field="sortOrder"
            header="정렬순서"
            className="text-center" 
            headerStyle={{ width: '15%' }}
            editor={(options) => (
              <InputText
                tabIndex={5}
                value={options.value}
                onChange={(e) => options.editorCallback(e.target.value)}
                invalid={!!errorRows[options.rowData._meta.key]?.hasOwnProperty(options.field)}
              />
            )}
          />
          <Column
            className="text-center"
            headerStyle={{ width: '6rem' }}
            rowEditor={ allowEdit }
            body={ rowEditorTemplate }
          />
        </SearchTable>
      </div>
    </Dialog>
  );
}

export default CodeItemRegisterDialog;