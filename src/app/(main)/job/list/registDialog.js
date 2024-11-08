'use client';

import { useState, useEffect } from 'react'
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import JobService from '@/services/batch/JobService';

const Mode = {
  CREATE: Symbol('create'),
  UPDATE: Symbol('update'),
  DETAIL: Symbol('detail'),
}

const defaultFormData = {
  jobName: '',
  jobParams: '',
  jobDesc: '',
  pauseYn: 'N',
  useYn: 'Y',
}

const defaultCode = {
  pauseYn : [
    { label: '중지', value: 'Y', },
    { label: '수행', value: 'N', },
  ],
  useYn: [
    { label: '사용', value: 'Y', },
    { label: '미사용', value: 'N', },
  ],
};

const RegistDialog = ( props ) => {
  const {
    data,
    visible,
    closeDialog,
    onClose,
    onSave,
    ...rest
  } = props;

  const [mode, setMode] = useState(data ? Mode.UPDATE : Mode.CREATE);
  const [loading, setLoading] = useState(data ? true : false);
  const [formData, setFormData] = useState({ ...defaultFormData });

  const callDetail = async ( data ) => {
    try {
      setLoading(true);
      const result = await JobService.getDataDetail(data);
      setFormData({
        ...defaultFormData,
        ...result,
      });
    } catch ( e ) {
      console.error(e);
    } finally {
      setLoading(false);
    }  
  }
  
  const callSave = async ( data ) => {
    try {
      let result = null;
      if( mode === Mode.UPDATE ) {
        result = await JobService.updateData(data);
      } else {
        result = await JobService.createData(data);
      }
      return true;
    } catch ( e ) {
      console.error(e);
      return false;
    } finally {
      // @TODO:
    }
  }

  const handleClickClose = async () => {
    await closeDialog();
    if( typeof onClose === 'function') {
      onClose();
    }
  }

  const handleClickSave = async () => {
    let doClose = true;
    const result = await callSave(formData);
    if( typeof onSave === 'function') {
      const saved = await onSave(result);
      if( saved === false ){
        doClose = false;
      }
    }
    if( doClose ) {
      await closeDialog();
    }
  }

  const handleChangeInput = ( e ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const dialogHeader = (
    `Job ${ mode === Mode.UPDATE ? '상제' : '등록' }`
  );
  const dialogFooter = (
    <div>
      <Button className="p-button-text" icon="pi pi-times" label="취소" onClick={ handleClickClose } />
      <Button className="" icon="pi pi-check" label="저장" onClick={ handleClickSave } />
    </div>
  );

  useEffect(()=>{
    if( mode === Mode.UPDATE ){
      callDetail(data);
    }
  }, [ mode, data ]);

  return (
    <Dialog
      header={ dialogHeader }
      visible={ visible && !loading }
      style={{ width: '50vw' }}
      closeOnEscape={ true }
      closeable={ true }
      onHide={ handleClickClose }
      footer={ dialogFooter }
    >
      <div className="p-fluid">
        <div className="flex align-items-center">
          <div className="md-12 md:col-4">
            <label htmlFor="jobName">Job 명</label>
          </div>
          <div className="md-12 md:col-8">
            <InputText
              id="jobName"
              name="jobName"
              value={ formData.jobName }
              onChange={ handleChangeInput }
            />
          </div>
        </div>
        <div className="flex align-items-center">
          <div className="md-12 md:col-4">
            <label htmlFor="jobDesc">Job 설명</label>
          </div>
          <div className="md-12 md:col-8">
            <InputText
              id="jobDesc"
              name="jobDesc"
              value={ formData.jobDesc }
              onChange={ handleChangeInput }
            />
          </div>
        </div>
        <div className="flex align-items-center">
          <div className="md-12 md:col-4">
            <label htmlFor="jobParams">Job 파라미터</label>
          </div>
          <div className="md-12 md:col-8">
            <InputTextarea
              id="jobParams"
              name="jobParams"
              value={ formData.jobParams }
              onChange={ handleChangeInput }
            />
          </div>
        </div>
        <div className="flex align-items-center">
          <div className="md-12 md:col-4">
            <label htmlFor="pauseYn">일시정지여부</label>
          </div>
          <div className="md-12 md:col-8">
            <Dropdown
              id="pauseYn"
              name="pauseYn"
              options={ defaultCode.pauseYn }
              value={ formData.pauseYn }
              onChange={ handleChangeInput }
            />
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
        {
          mode === Mode.UPDATE ? (
            <>
              <div className="flex align-items-center">
                <div className="md-12 md:col-4">
                  <label htmlFor="regUserId">등록자</label>
                </div>
                <div className="md-12 md:col-8">
                  { formData.regUserId }
                </div>
              </div>
              <div className="flex align-items-center">
                <div className="md-12 md:col-4">
                  <label htmlFor="regDttm">등록시간</label>
                </div>
                <div className="md-12 md:col-8">
                  { formData.regDttm }
                </div>
              </div>
            </>
          ) : null 
        }
      </div>
    </Dialog>
  );
}

export default RegistDialog;
