'use client';

import { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';

import JobService from '@/services/batch/JobService';

import RegistDialog from './registDialog';
import ScheduleDialog from './scheduleDialog';

const Jobs = () => {
  const toast = useRef(null);
  const [jobList, setJobList] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedList, setSelectedList] = useState(null);
  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useState({
    jobName: undefined,
  });

  const [visibleRegist, setVisibleRegist] = useState(false);
  const [visibleSchedule, setVisibleSchedule] = useState(false);

  const callSearch = async ( params ) => {
    try {
      setLoading(true);
      const result = await JobService.getDataList(params);
      setJobList(result||[]);
    } catch ( e ){
      console.error(e);
    } finally {
      setSearchParams({
        ...searchParams,
        ...params,
      });
      setLoading(false);
    }
  }

  const callDelete = async ( datas ) => {
    try {
      const result = await JobService.deleteAllData(datas);
      console.log(result);
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Deleted!!!',
      });
      return true;
    } catch ( e ) {
      console.error(e);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: e,
      });
      return false;
    } finally {
      // @TODO:
    }
  }

  const handleOpenRegistDialog = ( e ) => {
    setVisibleRegist(true);
  }

  const handleCloseRegistDialog = ( e ) => {
    setVisibleRegist(false);
    setSelectedData(null);
  }

  const handleOpenScheduleDialog = ( e ) => {
    setVisibleSchedule(true);
  }

  const handleCloseScheduleDialog = ( e ) => {
    setVisibleSchedule(false);
  }

  const handleChangeSelection = ( e ) => {
    setSelectedList(e.value);
  }

  const handleClickClose = async ( e ) => {
    console.debug('onClose');
  }

  const handleClickSave = async ( e ) => {
    console.debug('onSave');
    toast.current.show({
      severity: 'success',
      summary: 'Success',
      detail: 'Saved!!!',
    });
    await callSearch(searchParams);
  }

  const handleClickDelete = async ( e ) => {
    if( selectedList?.length > 0 ){
      const result = await callDelete(selectedList);
      if( result ){
        setJobList(
          jobList.filter((job)=>( !selectedList.some((deleteJob)=>(deleteJob === job)) ))
        );
        setSelectedList(null);
      }
    } else {
      toast.current.show({
        severity: 'warn',
        summary: 'Warnning',
        detail: 'No selected.',
      });
    }
  }

  const handleDoubleClickRow = ( e ) => {
    const rowData = e.data;
    setSelectedData(rowData);
    handleOpenRegistDialog();
  }

  useEffect(()=>{
    callSearch(searchParams);
  }, []);

  return (
    <div>
      <Toast ref={ toast } />
      {/* <pre>{ JSON.stringify(selectedList, null, 2) }</pre> */}
      <div className="content-header">
        <Card>
          <div className="flex col-12">
            <div className="flex md-12 md:col-10">
              <InputText name="jobNm" onChange={(e)=>setSearchParams({ jobName: e.target.value })}/>
            </div>
            <div className="flex md-12 md:col-2 justify-content-end">
              <Button onClick={ ()=>{ callSearch(searchParams) }} icon="pi pi-search" />
            </div>
          </div>
        </Card>
      </div>
      <div className="content-body p-fluid">
        <DataTable
          value={ jobList }
          paginator
          rows={ 10 }
          loading={ loading }
          dataKey="jobId"
          selectionMode="checkbox"
          selection={ selectedList }
          onSelectionChange={ handleChangeSelection }
          onRowDoubleClick={ handleDoubleClickRow }
        >
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
          <Column field="jobId" header="JOB ID" sortable style={{ width: '10%' }}></Column>
          <Column field="jobName" header="JOB Name" sortable style={{ width: '40%' }}></Column>
          <Column field="pauseYn" header="pauseYn" sortable></Column>
          <Column field="useYn" header="useYn" sortable></Column>
          {/*
          <Column field="regUserId" header="regUserId" sortable></Column>
          <Column field="regDttm" header="regDttm" sortable></Column>
          <Column field="regUserId" header="regUserId" sortable></Column>
          <Column field="updDttm" header="updDttm" sortable></Column>
          */}
          <Column
            body={(rowData)=>(
              <Button
                className="p-button-text"
                icon="pi pi-caret-right"
                onClick={()=>{
                  setSelectedData(rowData);
                  handleOpenScheduleDialog();
                }}
              />
            )}
          ></Column>
        </DataTable>
      </div>
      <div className="content-fotter">
        <div className="flex col-12">
          <div className="flex md-12 md:col-12 justify-content-end">
            <Button onClick={ handleClickDelete }>삭제</Button>
            <Button onClick={ handleOpenRegistDialog }>등록</Button>
          </div>
        </div>
      </div>
      {
        visibleRegist && (
          <RegistDialog
            data={ selectedData }
            visible={ visibleRegist }
            closeDialog={ handleCloseRegistDialog }
            onClose={ handleClickClose }
            onSave={ handleClickSave }
          />
        )
      }
      {
        visibleSchedule && (
          <ScheduleDialog
            data={ selectedData }
            visible={ visibleSchedule }
            closeDialog={ handleCloseScheduleDialog }
            onSave={ handleClickSave }
          />
        )
      }
    </div>
  );
}

export default Jobs;
