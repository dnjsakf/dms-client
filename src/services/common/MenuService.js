import {
  getFetch,
  postFetch,
  putFetch,
  deleteFetch,
} from '@/utils/api';

import { generateTree } from '@/utils/menuUtil';

const API_FREFIX = '/menu';

export const getDataList = async ( params ) => {
  const result = await getFetch(`${API_FREFIX}/list`, params);
  return generateTree(result?.data || []);
}

export const getDataDetail = async ( params ) => {
  const result = await getFetch(`${API_FREFIX}/detail`, params);
  return result?.data;
}

export const getDataRole = async ( params ) => {
  const result = await getFetch(`${API_FREFIX}/role`, params);
  return result?.data || [];
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

const MenuService = {
  getDataList,
  getDataDetail,
  getDataRole,
  createData,
  updateData,
  deleteData,
  deleteAllData,
}

export default MenuService;
