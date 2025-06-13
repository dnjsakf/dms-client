'use client';

import { useState } from "react";

import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { Message } from "primereact/message";

import useAuthService from "@/hooks/services/common/useAuthService";
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
  const authHook = useAuthService();

  const validate = () => {
    const invalid = {}
    if( !formData.loginId ){
      invalid.loginId = {
        invalid: true,
        message: 'loginId is required.',
      };
    }
    if( !passLoginId ){
      if( !invalid.loginId ){
        invalid.loginId = {
          invalid: true,
          message: 'Do check duplicated loginId.',
        };

      }
    }
    if( !formData.loginPwd ){
      invalid.loginPwd = {
        invalid: true,
        message: 'loginPwd is required',
      };
    }
    if( !formData.loginPwdChk ){
      invalid.loginPwdChk = {
        invalid: true,
        message: 'loginPwdChk is required',
      };
    }
    if( !passLoginPwd ){
      if( !invalid.loginPwd && !invalid.loginPwdChk ){
        invalid.loginPwd = {
          invalid: true,
          message: 'Not matched password.',
        };
      }
    }
    if( !formData.name ){
      invalid.name = {
        invalid: true,
        message: 'name is required',
      };
    }
    setErrors(invalid);
    return (Object.keys(invalid).length === 0);
  }

  const callSave = async ( params ) => {
    try {
      const response = await authHook.doRegister(params);
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
      const passed = await authHook.doCheckDuplicate(params);
      setPassLoginId(passed);
      setErrors({
        ...errors,
        loginId: {
          invalid: !passed,
          message: passed ? '사용 가능한 ID 입니다.' : `이미 사용중인 ID 입니다.`
        },
      });
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

  const validMessage = ( valid ) => {
    const invalid = !!(valid?.invalid);
    const message = valid?.message;
    if( !message ){ return null; }
    return (
      <Message
        severity={ invalid ? "error" : "success" }
        text={ message }
        className="justify-content-start"
      />
    );
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
                invalid={ errors.loginId?.invalid }
                onChange={ handleChangeLoginId }
              />
              <Button
                label="중복확인"
                severity={ errors.loginId?.invalid ? 'danger' : 'success' }
                disabled={ !formData.loginId }
                onClick={ handleClickCheckDuplicate }
              />
            </div>
            { validMessage(errors.loginId) }
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
                invalid={ errors.loginPwd?.invalid }
                onChange={ handleChangeLoginPwd }
              />
            </div>
            { validMessage(errors.loginPwd) }
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
                invalid={ errors.loginPwdChk?.invalid || errors.loginPwd?.invalid }
                onChange={ handleChangeLoginPwdChk }
              />
            </div>
            { validMessage(errors.loginPwdChk) }
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
                invalid={ errors.name?.invalid }
                onChange={ handleChangeInput }
              />
            </div>
            { validMessage(errors.name) }
          </div>
        </div>
      </div>
    </BaseDialog>
  );
}

export default AuthRegisterDialog;