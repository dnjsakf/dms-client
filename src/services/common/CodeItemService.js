import {
  getFetch,
  postFetch,
  putFetch,
  deleteFetch,
} from '@/utils/api';

const API_FREFIX = '/code/item';

export const getDataList = async ( params ) => {
  const result = await getFetch(`${API_FREFIX}/list`, params);
  return result?.data;
}

export const getDataPage = async ( params ) => {
  const result = await getFetch(`${API_FREFIX}/page`, params);
  return result?.data;
}

export const getDataDetail = async ( params ) => {
  const result = await getFetch(`${API_FREFIX}/detail`, params);
  return result?.data;
}

export const createData = async ( params ) => {
  const result = await postFetch(`${API_FREFIX}/save`, params);
  return result;
}

export const updateData = async ( params ) => {
  const result = await putFetch(`${API_FREFIX}/save`, params);
  return result;
}

export const deleteData = async ( params ) => {
  const result = await deleteFetch(`${API_FREFIX}/delete`, params); 
  return result;
}

export const deleteAllData = async ( params ) => {
  const result = await deleteFetch(`${API_FREFIX}/deleteAll`, params); 
  return result;
}

const CodeItemService = {
  getDataList,
  getDataPage,
  getDataDetail,
  createData,
  updateData,
  deleteData,
  deleteAllData,
}

export default CodeItemService;
