'use client';

import { forwardRef, useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";

import MenuRoleTable from "../datatables/MenuRoleTable";

import MenuTreeDialog from '@/components/dialogs/MenuTreeDialog';
import MenuService from "@/services/common/MenuService";

const Mode = {
  CREATE: Symbol('create'),
  UPDATE: Symbol('update'),
  DETAIL: Symbol('detail'),
}

const defaultFormData = {
  menuId: "",
  menuName: "",
  menuType: "NONE",
  menuLevel: "0",
  menuPath: "",
  menuIcon: "pi pi-search",
  upperMenuId: "",
  upperMenuName: "",
  useYn: "Y"
}

const defaultCode = {
  useYn: [
    { label: '사용', value: 'Y', },
    { label: '미사용', value: 'N', },
  ],
}

const MenuForm = ( props, ref ) => {
  const {
    data,
    ...rest
  } = props;
  
  const toast = useRef();
  const roleRef = useRef();
  const [mode, setMode] = useState(Mode.CREATE);

  const [formData, setFormData] = useState({ ...defaultFormData });
  const [errors, setErrors] = useState({});
  const [openMenuTree, setOpenMenuTree] = useState(false);

  /**
   * 문자열 변경 저장
   * @param {*} e 
   */
  const handleChangeInputText = ( e ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  /**
   * 숫자 변경 저장
   * @param {*} param0 
   */
  const handleChangeInputNumber = ({ originalEvent, value }) => {
    const { name } = originalEvent.target;
    setFormData({ ...formData, [name]: value });
  }
  
  /**
   * 상위 메뉴 선택 팝업 열기
   */
  const openDialog = () => { setOpenMenuTree(true); }

  /**
   * 상위 메뉴 선택 팝업 닫기
   */
  const closeDialog = () => { setOpenMenuTree(false); }

  /**
   * 확인 버튼 클릭 이벤트
   */
  const handleClickOk = ( node ) => {
    const upperMenuData = node?.data;
    if( upperMenuData ){
      /**
       * 동일한 메뉴를 선택 할 수 없음
       */
      if( upperMenuData.menuId === formData.menuId ){
        return toast.current.show({
          severity: 'warn',
          summary: 'Wraning',
          detail: '동일한 메뉴를 선택할 수 없습니다.',
        });
      }
      /**
       * 입력중인 메뉴보다 하위 메뉴를 선택 할 수 없음
       */
      const breadcrumb = MenuService.generateBreadcrumb(node);
      if( breadcrumb.some((menu)=>(menu.menuId === formData.menuId)) ){
        return toast.current.show({
          severity: 'warn',
          summary: 'Wraning',
          detail: '하위 메뉴를 선택할 수 없습니다.',
        });
      }
      const tempFormData = {
        ...formData,
        upperMenuId: upperMenuData.menuId,
        upperMenuName: upperMenuData.menuName,
        menuLevel: (upperMenuData.menuLevel + 1),
      }
      if( !tempFormData.menuPath && upperMenuData.menuPath ){
        tempFormData.menuPath = upperMenuData.menuPath;
      }
      setFormData(tempFormData);
    }
  }

  /**
   * 초기값 호출
   */
  useEffect(()=>{
    let tempMode = Mode.CREATE;
    const tempData = { ...defaultFormData }
    if( data ){
      tempMode = Mode.UPDATE;
      for(const [key, value] of Object.entries(data)){
        if( value !== undefined && value !== null){
          tempData[key] = value;
        }
      }
    }
    setMode(tempMode);
    setFormData(tempData);
  }, [data]);

  /**
   * ref 변수 정의
   */
  useEffect(()=>{
    if( ref ){
      ref.current = {
        mode: mode,
        getFormData: () => {
          const tempFormData = {
            ...formData,
          };
          if( mode === Mode.CREATE ){
            delete tempFormData.menuId;
          }
          if( roleRef.current ){
            tempFormData.roles = roleRef.current.getRoles();
          }
          return tempFormData;
        },
      }
    }
  }, [ref, roleRef, mode, formData]);

  return (
    <div className="p-fluid">
      <Toast ref={toast} />
      <div className="flex flex-column md:flex-row align-items-center">
        <div className="col-12 md:col-2">
          <label htmlFor="upperMenu">상위 메뉴</label>
        </div>
        <div className="flex col-12 md:col-10 p-0">
          <div className="col-3 md:col-2">
            <Button label="선택" onClick={ openDialog } />
          </div>
          <div className="col-4 md:col-2">
            <InputText
              id="upperMenuId"
              name="upperMenuId"
              value={ formData.upperMenuId }
              disabled={ true }
            />
          </div>
          <div className="col-5 md:col-8">
            <InputText
              id="upperMenuName"
              name="upperMenuName"
              value={ formData.upperMenuName }
              disabled={ true }
            />
          </div>
        </div>
      </div>
      <div className="flex align-items-center">
        <div className="col-4 md:col-2">
          <label htmlFor="menuId">메뉴ID</label>
        </div>
        <div className="col-8 md:col-10">
          <InputText
            id="menuId"
            name="menuId"
            placeholder="저장 시 자동생성"
            value={ formData.menuId }
            onChange={ handleChangeInputText }
            disabled={ true }
          />
        </div>
      </div>
      <div className="flex align-items-center">
        <div className="col-4 md:col-2">
          <label htmlFor="menuName">메뉴명</label>
        </div>
        <div className="col-8 md:col-10">
          <InputText
            id="menuName"
            name="menuName"
            value={ formData.menuName }
            onChange={ handleChangeInputText }
          />
        </div>
      </div>
      <div className="flex align-items-center">
        <div className="col-4 md:col-2">
          <label htmlFor="menuType">메뉴유형</label>
        </div>
        <div className="col-8 md:col-10">
          <InputText
            id="menuType"
            name="menuType"
            value={ formData.menuType }
            onChange={ handleChangeInputText }
          />
        </div>
      </div>
      <div className="flex align-items-center">
        <div className="col-4 md:col-2">
          <label htmlFor="menuLevel">메뉴레벨</label>
        </div>
        <div className="col-8 md:col-10">
          <InputNumber
            id="menuLevel"
            name="menuLevel"
            value={ formData.menuLevel }
            onChange={ handleChangeInputNumber }
          />
        </div>
      </div>
      <div className="flex align-items-center">
        <div className="col-4 md:col-2">
          <label htmlFor="menuPath">메뉴경로</label>
        </div>
        <div className="col-8 md:col-10">
          <InputText
            id="menuPath"
            name="menuPath"
            value={ formData.menuPath }
            onChange={ handleChangeInputText }
          />
        </div>
      </div>
      <div className="flex align-items-center">
        <div className="col-4 md:col-2">
          <label htmlFor="menuIcon">메뉴아이콘</label>
        </div>
        <div className="col-8 md:col-10">
          <InputText
            id="menuIcon"
            name="menuIcon"
            value={ formData.menuIcon }
            onChange={ handleChangeInputText }
          />
        </div>
      </div>
      <div className="flex align-items-center">
        <div className="col-4 md:col-2">
          <label htmlFor="useYn">사용여부</label>
        </div>
        <div className="col-8 md:col-10">
          <Dropdown
            id="useYn"
            name="useYn"
            options={ defaultCode.useYn }
            value={ formData.useYn }
            onChange={ handleChangeInputText }
          />
        </div>
      </div>
      <div className="flex align-items-center">
        <div className="col-12">
          <MenuRoleTable
            ref={ roleRef }
            menuId={ formData.menuId }
          />
        </div>
      </div>
      {
        openMenuTree && (
          <MenuTreeDialog
            closeDialog={closeDialog}
            onOk={ handleClickOk }
          />
        )
      }
    </div>
  );
}

export default forwardRef(MenuForm);