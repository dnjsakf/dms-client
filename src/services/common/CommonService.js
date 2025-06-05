import { getFetch } from '@/utils/api';

const API_FREFIX = '';

export const getInitData = async ( params ) => {
  const response = await getFetch(`${API_FREFIX}/init`);
  return response?.data;
}

const CommonService = {
  getInitData,
}

export default CommonService;
