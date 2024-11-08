'use client';

import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

import SearchForm from "@/components/datatables/SearchForm";
import SearchTable from "@/components/datatables/SearchTable";
import CodeService from "@/services/common/CodeService";

import CodeRegisterDialog from "@/components/dialogs/CodeRegisterDialog";
import CodeItemRegisterDialog from "@/components/dialogs/CodeItemRegisterDialog";

const defaultSearchParams = {
  codeName: '',
  codeDesc: '',
  realValue: '',
  totalItems: 0,
  page: 1,
}

const CodeListPage = ( props ) => {
  const {
    ...rest
  } = props;

  const toast = useRef();
  const tableRef = useRef();

  const [showDialog, setShowDialog] = useState(false);
  const [showItemDialog, setShowItemDialog] = useState(false);

  const [searchParams, setSearchParams] = useState({ ...defaultSearchParams });
  const [dataList, setDataList] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [selectedData, setSelectedData] = useState(null);

  /**
   * 목록 조회 API 호출
   * - 목록 데이터 및 페이지 정보 갱신
   */
  const callSearch = async ( params ) => {
    try {
      const tempParams = {
        codeName: params?.codeName,
        codeDesc: params?.codeDesc,
        realValue: params?.realValue,
        page: params?.page||1,
        rowsPerPage: params?.rowsPerPage||10,
      }
      const result = await CodeService.getDataPage(tempParams);
      if( result ){
        setDataList(result.data);
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
  const callDelete = async ( params ) => {
    try {
      const tempParams = [ ...params ];
      const result = await CodeService.deleteAllData(tempParams);
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
   * 팝업 닫기
   */
  const closeDialog = () => {
    setShowDialog(false);
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
    });
  }

  /**
   * 등록 버튼 클릭 이벤트
   */
  const handleClickRegist = async () => {
    setShowDialog(true);
  }

  /**
   * 삭제 버튼 클릭 이벤트
   */
  const handleClickDelete = async () => {
    await callDelete(selectedList);
    const params = tableRef.current.getPageInfo();
    await callSearch(params);
  }

  /**
   * 팝업: 저장 버튼 클릭 이벤트
   */
  const handleClickOk = async (resp) => {
    if( resp.code === 200 ){
      const params = tableRef.current.getPageInfo();
      return await callSearch(params);
    }
    return false;
  }

  /**
   * 팝업: 닫기 버튼 클릭 이벤트
   */
  const handleClickCancel = async () => {
    closeDialog();
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
   * 목록 더블 클릭 이벤트
   */
  const handleDoubleClick = async ( e ) => {
    const rowData = e.data;
    setSelectedData(rowData);
    setShowItemDialog(true)
  }

  /**
   * 문자 입력 이벤트
   */
  const handleChangeInputText = ( e ) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  }

  /**
   * 초기 데이터 설정
   */
  useEffect(()=>{
    callSearch(searchParams);
  }, []);

  return (
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
                name="codeName"
                value={ searchParams.codeName }
                onChange={ handleChangeInputText }
              />
            </div>,
            <div className="p-inputgroup flex-1" key="2">
              <span className="p-inputgroup-addon col-4">코드설명</span>
              <InputText
                className="col-8"
                name="codeDesc"
                value={ searchParams.codeDesc }
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
              icon="pi pi-pencil"
              onClick={ handleClickRegist }
              />
          </>
        )}
        value={dataList}
        selection={ selectedList }
        onSelectionChange={ handleChangeSelection }
        onPageChange={ handleChangePage }
        onRowDoubleClick={ handleDoubleClick }
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
        {/* <Column header="순번" field="rn" className="text-center" /> */}
        <Column header="코드ID" field="codeId" className="text-center" />
        <Column header="코드명" field="codeName" />
        <Column header="코드설명" field="codeDesc" />
        <Column header="실제값" field="realValue" />
        <Column header="정렬순서" field="sortOrder" className="text-center" />
      </SearchTable>
      {
        showDialog ? (
          <CodeRegisterDialog
            closeDialog={ closeDialog }
            onCancel={ handleClickCancel }
            onOk={ handleClickOk }
          />
        ) : null
      }
      {
        showItemDialog ? (
          <CodeItemRegisterDialog
            code={ selectedData }
            closeDialog={ ()=>setShowItemDialog(false) }
          />
        ) : null
      }
    </div>
  );
}

export default CodeListPage;