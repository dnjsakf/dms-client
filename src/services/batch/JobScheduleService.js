import {
  getFetch,
  postFetch,
  putFetch,
  deleteFetch,
} from '@/utils/api';

const API_PREFIX = '/job';

export const getDataList = async ( params ) => {
  const result = await getFetch(`${API_PREFIX}/schedule/list`, params);
  return result?.data || [];
}

export const getDataDetail = async ( params ) => {
  const result = await getFetch(`${API_PREFIX}/schedule/detail`, params);
  return result?.data || [];
}

export const createData = async ( params ) => {
  const result = await postFetch(`${API_PREFIX}/schedule/save`, params);
  return result?.data;
}

export const updateData = async ( params ) => {
  const result = await putFetch(`${API_PREFIX}/schedule/save`, params);
  return result?.data;
}

export const deleteData = async ( params ) => {
  const result = await deleteFetch(`${API_PREFIX}/schedule/delete`, params); 
  return result?.data;
}

export const deleteAllData = async ( params ) => {
  const result = await deleteFetch(`${API_PREFIX}/schedule/deleteAll`, params); 
  return result?.data;
}

const JobScheduleService = {
  getDataList,
  getDataDetail,
  createData,
  updateData,
  deleteData,
  deleteAllData,
}

export default JobScheduleService;
