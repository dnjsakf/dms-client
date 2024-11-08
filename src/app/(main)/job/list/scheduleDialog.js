'use client';

import { useState, useEffect, useRef } from 'react'
import dayjs from 'dayjs';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Messages } from 'primereact/messages';

import JobService from '@/services/batch/JobService';
import JobScheduleService from '@/services/batch/JobScheduleService';

const Mode = {
  CREATE: Symbol('create'),
  UPDATE: Symbol('update'),
  DETAIL: Symbol('detail'),
}

const defaultFormData = {
  jobId: '',
  jobName: '',
  schType: 'datetime',
  schedule: '',
  schStartDttm: '',
  schEndDttm: '',
  pauseYn: 'N',
  useYn: 'Y',
}

const defaultCode = {
  schType: [
    { label: '선택', value: '' },
    { label: '일회성', value: 'datetime' },
    { label: '주기성', value: 'crontab' },
  ],
  pauseYn : [
    { label: '중지', value: 'Y', },
    { label: '수행', value: 'N', },
  ],
  useYn: [
    { label: '사용', value: 'Y', },
    { label: '미사용', value: 'N', },
  ],
};

const ScheduleDialog = ( props ) => {
  
  const {
    data,
    visible,
    closeDialog,
    onClose,
    onSave,
    ...rest
  } = props;
  
  const messages = useRef(null);

  const [mode, setMode] = useState(data ? Mode.UPDATE : Mode.CREATE);
  const [loading, setLoading] = useState(data ? true : false);

  const [formData, setFormData] = useState({ ...defaultFormData });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if ( !formData.jobId ) {
      tempErrors.jobId = 'jobId is required.';
    }
    if ( !formData.schType ) {
      tempErrors.schType = 'schType is required.';
    }
    if ( !formData.schStartDttm ) {
      tempErrors.schStartDttm = 'schStartDttm is required.';
    }
    if ( !formData.schEndDttm ) {
      tempErrors.schEndDttm = 'schEndDttm is required.';
    }
    console.log('tempErrors', tempErrors);
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  }

  const callDetail = async ( data ) => {
    try {
      setLoading(true);
      const result = await JobService.getDataDetail(data);
      const updateData = {
        ...formData,
      }
      for(const key of Object.keys(defaultFormData)){
        if( result?.hasOwnProperty(key) ){
          updateData[key] = result[key];
        }
      }

      setFormData(updateData);

    } catch ( e ) {
      console.error(e);
    } finally {
      setLoading(false);
    }  
  }
  
  const callSave = async ( data ) => {
    try {
      let result = await JobScheduleService.createData(data);
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
    if( validate() ){
      let doClose = true;
  
      const savedData = {}
      for(const [key, value] of Object.entries(formData)){
        if( value instanceof Date ){
          savedData[key] = dayjs(value).format('YYYYMMDDHHmmss');
        } else {
          savedData[key] = value;
        }
      }
  
      const result = await callSave(savedData);
      if( typeof onSave === 'function') {
        const saved = await onSave(result);
        if( saved === false ){
          doClose = false;
        }
      }
      if( doClose ) {
        await closeDialog();
      }
    } else {
      messages.current.show({ severity: 'error', summary: 'Error', detail: 'Please fix the errors.' });
    }
  }

  const handleChangeInput = ( e ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleChangeDatetime = ( e ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const dialogHeader = (
    `Schedule ${ mode === Mode.UPDATE ? '상제' : '등록' }`
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
      draggable={ false }
      onHide={ handleClickClose }
      footer={ dialogFooter }
    >
      <Messages ref={ messages } />
      <div className="p-fluid">
        <div className="flex align-items-center">
          <div className="md-12 md:col-4">
            <label htmlFor="jobId">Job ID</label>
          </div>
          <div className="md-12 md:col-8">
            <InputText
              id="jobId"
              name="jobId"
              value={ formData.jobId }
              invalid={ errors.jobId }
              onChange={ handleChangeInput }
            />
          </div>
        </div>
        <div className="flex align-items-center">
          <div className="md-12 md:col-4">
            <label htmlFor="jobName">Job 명</label>
          </div>
          <div className="md-12 md:col-8">
            <InputText
              id="jobName"
              name="jobName"
              value={ formData.jobName }
              invalid={ errors.jobName }
              onChange={ handleChangeInput }
            />
          </div>
        </div>
        <div className="flex align-items-center">
          <div className="md-12 md:col-4">
            <label htmlFor="schType">스케줄 유형</label>
          </div>
          <div className="md-12 md:col-8">
            <Dropdown
              id="schType"
              name="schType"
              options={ defaultCode.schType }
              value={ formData.schType }
              invalid={ errors.schType }
              onChange={ handleChangeInput }
            />
          </div>
        </div>
        <div className="flex align-items-center">
          <div className="md-12 md:col-4">
            <label htmlFor="schStartDttm">시작일시</label>
          </div>
          <div className="md-12 md:col-8">
            <Calendar
              dateFormat="yy-mm-dd"
              touchUI
              showIcon
              showTime
              showSeconds
              hourFormat="24" 
              id="schStartDttm"
              name="schStartDttm"
              value={ formData.schStartDttm }
              invalid={ errors.schStartDttm }
              minDate={dayjs().toDate()}
              onChange={ handleChangeDatetime }
            />
          </div>
        </div>
        <div className="flex align-items-center">
          <div className="md-12 md:col-4">
            <label htmlFor="schEndDttm">종료일시</label>
          </div>
          <div className="md-12 md:col-8">
            <Calendar
              dateFormat="yy-mm-dd"
              touchUI
              showIcon
              showTime
              showSeconds
              hourFormat="24" 
              id="schEndDttm"
              name="schEndDttm"
              value={ formData.schEndDttm }
              invalid={ errors.schEndDttm }
              minDate={dayjs(formData.schStartDttm).toDate()}
              onChange={ handleChangeDatetime }
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
              invalid={ errors.pauseYn }
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
              invalid={ errors.useYn }
              onChange={ handleChangeInput }
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default ScheduleDialog;
