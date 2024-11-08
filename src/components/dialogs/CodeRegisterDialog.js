'use client';

import { useState } from "react";

import { InputText } from 'primereact/inputtext';
import { Message } from "primereact/message";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

import CodeService from "@/services/common/CodeService";
// import BaseDialog from "./BaseDialog";

const defaultFormData = {
  codeId: '',
  codeName: '',
  codeDesc: '',
  realValue: '',
  sortOrder: 0,
  useYn: 'Y',
}

const defaultCode = {
  useYn: [
    { label: '사용', value: 'Y', },
    { label: '미사용', value: 'N', },
  ],
};

const CodeRegisterDialog = ( props ) => {
  const {
    headerLabel,
    closeDialog,
    onCancel,
    onOk,
    ...rest
  } = props;

  const [formData, setFormData] = useState({ ...defaultFormData });
  const [errors, setErrors] = useState({ });

  const validate = () => {
    const tempErrors = {}
    if( !formData.codeId ){
      tempErrors.codeId = 'codeId is required.';  
    }
    if( !formData.codeName ){
      tempErrors.codeName = 'codeName is required.';  
    }
    setErrors(tempErrors);
    return (Object.keys(tempErrors).length === 0);
  }

  const callSave = async ( params ) => {
    try {
      const result = await CodeService.createData(params);
      return result;
    } catch ( error ){
      console.error(error);
    }
  }

  const handleChangeInput = ( e ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleChangeInputNumber = ({ originalEvent, value }) => {
    const { name } = originalEvent.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleClickOk = async ( e ) => {
    let doClose = true;
    if( validate() ){
      const result = await callSave(formData);
      if( typeof onOk === 'function' ){
        let r = await onOk(result);
        if( r === false ){
          doClose = false;
        }
      }
    } else {
      doClose = false;
    }
    if( doClose ){
      handleClickCancel();
    }
  }

  const handleClickCancel = async ( e ) => {
    let doClose = true;
    if( typeof onCancel === 'function' ){
      let r = await onCancel();
      if( r === false ){
        r = false;
      }
    }
    if( doClose ){
      if( typeof closeDialog === 'function' ){
        closeDialog();
      }
    }
  }

  return (
    <Dialog
      visible={ true }
      closeOnEscape={ true }
      className="w-full md:w-5 h-full md:h-30rem"
      header={(
        <div className="dialog-header">
          <span>코드 등록</span>
        </div>
      )}
      footer={(
        <div className="dialog-footer btn-group">
          <Button
            className="btn-cancel p-button-text"
            icon="pi pi-times"
            label={ '취소' }
            onClick={ handleClickCancel }
          />
          <Button
            className="btn-ok"
            icon="pi pi-check"
            label={ '저장' }
            onClick={ handleClickOk }
          />
        </div>
      )}
      onHide={ handleClickCancel }
    >
      <div className="p-fluid">
        <div className="flex align-items-center">
          <div className="md-12 md:col-4">
            <label htmlFor="codeId">코드ID</label>
          </div>
          <div className="md-12 md:col-8">
            <div className="p-inputgroup flex-1">
              <InputText
                id="codeId"
                name="codeId"
                placeholder="코드ID"
                value={ formData.codeId }
                invalid={ errors.codeId }
                onChange={ handleChangeInput }
              />
            </div>
            {
              errors.codeId && (
                <Message severity="error" text={ errors.codeId } className="justify-content-start" />
              )
            }
          </div>
        </div>
        <div className="flex align-items-center">
          <div className="md-12 md:col-4">
            <label htmlFor="codeName">코드명</label>
          </div>
          <div className="md-12 md:col-8">
            <div className="p-inputgroup flex-1">
              <InputText
                id="codeName"
                name="codeName"
                placeholder="코드명"
                value={ formData.codeName }
                invalid={ errors.codeName }
                onChange={ handleChangeInput }
              />
            </div>
            {
              errors.codeName && (
                <Message severity="error" text={ errors.codeName } className="justify-content-start" />
              )
            }
          </div>
        </div>
        <div className="flex align-items-center">
          <div className="md-12 md:col-4">
            <label htmlFor="codeDesc">코드설명</label>
          </div>
          <div className="md-12 md:col-8">
            <div className="p-inputgroup flex-1">
              <InputText
                id="codeDesc"
                name="codeDesc"
                placeholder="코드설명"
                value={ formData.codeDesc }
                invalid={ errors.codeDesc }
                onChange={ handleChangeInput }
              />
            </div>
            {
              errors.codeDesc && (
                <Message severity="error" text={ errors.codeDesc } className="justify-content-start" />
              )
            }
          </div>
        </div>
        <div className="flex align-items-center">
          <div className="md-12 md:col-4">
            <label htmlFor="sortOrder">정렬순서</label>
          </div>
          <div className="md-12 md:col-8">
            <div className="p-inputgroup flex-1">
              <InputNumber
                id="sortOrder"
                name="sortOrder"
                placeholder="정렬순서"
                value={ formData.sortOrder }
                invalid={ errors.sortOrder }
                onChange={ handleChangeInputNumber }
              />
            </div>
            {
              errors.sortOrder && (
                <Message severity="error" text={ errors.sortOrder } className="justify-content-start" />
              )
            }
          </div>
        </div>
        <div className="flex align-items-center">
          <div className="md-12 md:col-4">
            <label htmlFor="useYn">사용여부</label>
          </div>
          <div className="md-12 md:col-8">
            <Dropdown
              id="useYn"
              name="useYn"
              options={ defaultCode.useYn }
              value={ formData.useYn }
              onChange={ handleChangeInput }
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default CodeRegisterDialog;