import {
  getFetch,
  postFetch,
  putFetch,
  deleteFetch,
} from '@/utils/api';

const API_PREFIX = '/job';

export const getDataList = async ( params ) => {
  const result = await getFetch(`${API_PREFIX}/list`, params);
  return result?.data || [];
}

export const getDataDetail = async ( params ) => {
  const result = await getFetch(`${API_PREFIX}/detail`, params);
  return result?.data || [];
}

export const createData = async ( params ) => {
  const result = await postFetch(`${API_PREFIX}/save`, params);
  return result?.data;
}

export const updateData = async ( params ) => {
  const result = await putFetch(`${API_PREFIX}/save`, params);
  return result?.data;
}

export const deleteData = async ( params ) => {
  const result = await deleteFetch(`${API_PREFIX}/delete`, params); 
  return result?.data;
}

export const deleteAllData = async ( params ) => {
  const result = await deleteFetch(`${API_PREFIX}/deleteAll`, params); 
  return result?.data;
}

const JobService = {
  getDataList,
  getDataDetail,
  createData,
  updateData,
  deleteData,
  deleteAllData,
}

export default JobService;
