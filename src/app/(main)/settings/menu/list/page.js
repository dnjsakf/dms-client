'use client';

import { useState, useEffect, useRef } from 'react'
import { Toast } from 'primereact/toast';
import { Tree } from 'primereact/tree';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';

import MenuService from '@/services/common/MenuService';
import MenuForm from '@/components/forms/MenuForm';
import MenuTree from '@/components/tree/MenuTree';

const MenuListPage = () => {
  const toast = useRef(null);
  const formRef = useRef(null);
  const menuTreeRef = useRef(null);

  const [selectedNode, setSelectedNode] = useState(null);

  /**
   * 저장 API 호출
   * @param {*} params 
   * @returns 
   */
  const callCreate = async ( params ) => {
    try {
      const result = await MenuService.createData(params);
      return result;
    } catch ( error ){
      console.error(error);
    }
  }

  /**
   * 수정 API 호출
   * @param {*} params 
   * @returns 
   */
  const callUpdate = async ( params ) => {
    try {
      const result = await MenuService.updateData(params);
      return result;
    } catch ( error ){
      console.error(error);
    }
  }

  /**
   * 삭제 API 호출
   * @param {*} params 
   * @returns 
   */
  const callDelete = async ( params ) => {
    try {
      const result = await MenuService.deleteData(params);
      return result;
    } catch ( error ){
      console.error(error);
    }
  }

  /**
   * 저장 버튼 클릭 이벤트
   * @param {*} e 
   */
  const handleClickSave = async ( e ) => {
    const formData = await formRef.current?.getFormData();
    if( selectedNode ){
      const result = await callUpdate(formData);
      if( result ){
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Updated!!!',
        });
        await menuTreeRef.current?.reload();
      }
    } else {
      const result = await callCreate(formData);
      if( result ){
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Created!!!',
        });
        setSelectedNode(result);
        await menuTreeRef.current?.reload();
      }
    }
  }
  
  /**
   * 삭제 버튼 클릭 이벤트
   * @param {*} e 
   */
  const handleClickDelete = async ( e ) => {
    if( selectedNode ){
      const deleted = await callDelete(selectedNode);
      if( deleted > 0 ){
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Deleted!!!',
        });
        setSelectedNode(null);
        await menuTreeRef.current?.reload();
      }
    }
  }

  /**
   * 취소 버튼 클릭 이벤트
   * @param {*} e 
   */
  const handleClickCancel = async ( e ) => {
    if( selectedNode ){
      setSelectedNode(null);
    }
  }

  /**
   * 트리 선택 이벤트
   * @param {*} node
   */
  const handleSelectNode = async ( node ) => {
    setSelectedNode(node.data);
  }
  
  return (
    <div className="flex flex-wrap flex-column md:flex-row h-auto md:h-full">
      <Toast ref={toast} />
      <div className="flex col-12 md:col-4 h-15rem md:h-full">
        <div className="w-full">
          <MenuTree
            ref={menuTreeRef}
            expanded={true}
            onSelectNode={ handleSelectNode }
          />
        </div>
      </div>
      <div className="flex col-12 md:col-8 h-full">
        <div className="flex flex-column h-full w-full border-box">
          <div className="detail-view flex flex-grow-1 flex-column overflow-y-hidden">
            <div
              className="detail-header align-content-center"
              style={{ 
                height: "38px"
              }}>
              <span><b>{ selectedNode?.menuName } 설정</b></span>
            </div>
            <div
              className="detail-content align-content-start overflow-y-scroll"
              style={{
                height: "calc(100% - 48px)"
              }}>
                <MenuForm
                  ref={ formRef }
                  data={ selectedNode }
                />
            </div>
          </div>
          <div className="detail-buttons flex justify-content-end col-12">
            {
              selectedNode && (
                <>
                  <Button className="p-button-text" label="삭제" onClick={ handleClickDelete } />
                  <Button className="p-button-text" label="취소" onClick={ handleClickCancel } />
                </>
              )
            }
            <Button label="저장" onClick={ handleClickSave }/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuListPage;
