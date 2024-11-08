import {
  getFetch,
  postFetch,
  putFetch,
  deleteFetch,
} from '@/utils/api';

const API_FREFIX = '/permission';

export const getDataList = async ( params ) => {
  const result = await getFetch(`${API_FREFIX}/list`, params);
  return result?.data || [];
}

export const getDataDetail = async ( params ) => {
  const result = await getFetch(`${API_FREFIX}/detail`, params);
  return result?.data;
}

export const createData = async ( params ) => {
  const result = await postFetch(`${API_FREFIX}/save`, params);
  return result?.data;
}

export const updateData = async ( params ) => {
  const result = await putFetch(`${API_FREFIX}/save`, params);
  return result?.data;
}

export const deleteData = async ( params ) => {
  const result = await deleteFetch(`${API_FREFIX}/delete`, params); 
  return result?.data;
}

export const deleteAllData = async ( params ) => {
  const result = await deleteFetch(`${API_FREFIX}/deleteAll`, params); 
  return result?.data;
}

const PermissionService = {
  getDataList,
  getDataDetail,
  createData,
  updateData,
  deleteData,
  deleteAllData,
}

export default PermissionService;
