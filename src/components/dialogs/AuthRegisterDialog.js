'use client';

import { useState } from "react";

import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { Message } from "primereact/message";

import AuthService from "@/services/common/AuthService";
import BaseDialog from "./BaseDialog";

const defaultFormData = {
  loginId: '',
  loginPwd: '',
  loginPwdChk: '',
  name: '',
  email: '',
}

const AuthRegisterDialog = ( props ) => {
  const {
    headerLabel,
    cancelLabel,
    okLabel,
    closeDialog,
    onClose,
    onSave,
    ...rest
  } = props;

  const [formData, setFormData] = useState({ ...defaultFormData });
  const [passLoginId, setPassLoginId] = useState(false);
  const [passLoginPwd, setPassLoginPwd] = useState(false);
  const [errors, setErrors] = useState({ });

  const validate = () => {
    const invalid = {}
    if( !formData.loginId ){
      invalid.loginId = 'loginId is required.';  
    }
    if( !passLoginId ){
      if( !invalid.loginId ){
        invalid.loginId = 'Do check duplicated loginId.';
      }
    }
    if( !formData.loginPwd ){
      invalid.loginPwd = 'loginPwd is required';
    }
    if( !formData.loginPwdChk ){
      invalid.loginPwdChk = 'loginPwdChk is required';
    }
    if( !passLoginPwd ){
      if( !invalid.loginPwd && !invalid.loginPwdChk ){
        invalid.loginPwd = 'Not matched password.';
      }
    }
    if( !formData.name ){
      invalid.name = 'name is required';
    }
    setErrors(invalid);
    return (Object.keys(invalid).length === 0);
  }

  const callSave = async ( params ) => {
    try {
      const response = await AuthService.register(params);
      if( typeof onSave === 'function' ){
        await onSave(response);
      }
      return ( response.code === 200 );
    } catch ( error ){
      console.error(error);
    }
  }

  const callCheckDuplicate = async ( params ) => {
    try {
      const response = await AuthService.checkDuplicate(params);
      if( !response ){
        setPassLoginId(true);
        setErrors({
          ...errors,
          loginId: null,
        });
      } else {
        setPassLoginId(false);
        setErrors({
          ...errors,
          loginId: 'Duplicated.',
        });
      }
      return ( response.code === 200 );
    } catch ( error ){
      console.error(error);
    }
  }

  const handleChangeLoginId = ( e ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setPassLoginId(false);
  }

  const handleChangeLoginPwd = ( e ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setPassLoginPwd(false);
    if( formData.loginPwdChk && formData.loginPwdChk === value ){
      setPassLoginPwd(true);
    }
  }

  const handleChangeLoginPwdChk = ( e ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setPassLoginPwd(false);
    if( formData.loginPwd && formData.loginPwd === value ){
      setPassLoginPwd(true);
    }
  }

  const handleChangeInput = ( e ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleClickCheckDuplicate = async ( e ) => {
    await callCheckDuplicate(formData);
  }

  const handleClickOk = async ( e ) => {
    if( validate() ){
      const saved = await callSave(formData);
      if( saved ){
        handleClickCancel();
      }
    } else {
      return false;
    }
  }

  const handleClickCancel = async ( e ) => {
    if( typeof closeDialog === 'function' ){
      closeDialog();
    }
  }

  return (
    <BaseDialog
      headerLabel="사용자 등록"
      cancelLabel="닫기"
      okLabel="등록"
      style={{
        minWidth: '320px',
        maxWidth: '380px',
        width: '30vw',
      }}
      onClose={ handleClickCancel }
      onSave={ handleClickOk }
    >
      <div className="p-fluid">
        <div className="flex">
          <div className="md-12 col-12">
            <div className="p-inputgroup flex-1">
              <InputText
                type="text"
                id="loginId"
                name="loginId"
                placeholder="로그인 ID"
                value={ formData.loginId }
                invalid={ errors.loginId }
                onChange={ handleChangeLoginId }
              />
              <Button
                label="중복확인"
                severity={ errors.loginId ? 'danger' : 'success' }
                disabled={ !formData.loginId }
                onClick={ handleClickCheckDuplicate }
              />
            </div>
            {
              errors.loginId && (
                <Message severity="error" text={ errors.loginId } className="justify-content-start" />
              )
            }
          </div>
        </div>
        <div className="flex align-items-center">
          <div className="md-12 col-12">
            <div className="p-inputgroup flex-1">
              <InputText
                type="password"
                id="loginPwd"
                name="loginPwd"
                placeholder="비밀번호"
                value={ formData.loginPwd }
                invalid={ errors.loginPwd }
                onChange={ handleChangeLoginPwd }
              />
            </div>
            {
              errors.loginPwd && (
                <Message severity="error" text={ errors.loginPwd } className="justify-content-start" />
              )
            }
          </div>
        </div>
        <div className="flex">
          <div className="md-12 col-12">
            <div className="p-inputgroup flex-1">
              <InputText
                type="password"
                id="loginPwdChk"
                name="loginPwdChk"
                placeholder="비밀번호 확인"
                value={ formData.loginPwdChk }
                invalid={ errors.loginPwdChk || errors.loginPwd }
                onChange={ handleChangeLoginPwdChk }
              />
            </div>
            {
              errors.loginPwdChk && (
                <Message severity="error" text={ errors.loginPwdChk } className="justify-content-start" />
              )
            }
          </div>
        </div>
        <div className="flex align-items-center">
          <div className="md-12 col-12">
            <div className="p-inputgroup flex-1">
              <InputText
                type="text"
                id="name"
                name="name"
                placeholder="이름"
                value={ formData.name }
                invalid={ errors.name }
                onChange={ handleChangeInput }
              />
            </div>
            {
              errors.name && (
                <Message severity="error" text={ errors.name } className="justify-content-start" />
              )
            }
          </div>
        </div>
      </div>
    </BaseDialog>
  );
}

export default AuthRegisterDialog;