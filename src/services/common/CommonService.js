import APIResponse from '@/models/common/APIResponse';
import { getFetch } from '@/utils/api';

const API_FREFIX = '';

/**
 * 초기 데이터 조회
 * - 인증없이 요청 가능
 * @returns {Promise<APIResponse} 응답 객체 반환
 */
export const getInitData = async () => {
  const response = await getFetch(`${API_FREFIX}/init`);
  return response;
}

export default {
  getInitData,
};
