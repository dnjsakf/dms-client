import { getFetch } from '@/utils/api';

const API_FREFIX = '';

export const initData = async ( params ) => {
  const response = await getFetch(`${API_FREFIX}/init`);
  return response?.data;
}

const CommonService = {
  initData,
}

export default CommonService;
