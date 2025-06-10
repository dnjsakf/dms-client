import { postFetch } from '@/utils/api';
import jwtUtil from '@/utils/jwtUtil';
import cryptoUtil from '@/utils/cryptoUtil';

import useAuthStore from '@/store/authStore';
import { getCookie } from '@/utils/commonUtil';

const API_PREFIX = '/auth';

/**
 * 게스트로 방문 처리
 * @param {*} params 
 * @returns 
 */
export const guest = async ( params ) => {
  const store = useAuthStore.getState();
  store.setGuest(true);
  return {
    code: 200,
    data: null,
    message: "Guest login successful."
  };
}

/**
 * 로그인 요청
 * @param {*} params 
 * @returns 
 */
export const login = async ( params ) => {
  const store = useAuthStore.getState();
  const response = await postFetch(`${API_PREFIX}/login`, {
    loginId: params.loginId,
    loginPwd: cryptoUtil.encrypt(params.loginPwd),
  });
  if( response?.code === 200  ){
    const payloadToken = getCookie('payloadToken', null);
    store.setAuthenticated(true);
    store.setPayloadToken(payloadToken);
  }
  store.setGuest(false);
  return response;
}

export const logout = async () => {
  const store = useAuthStore.getState();
  const response = await postFetch(`${API_PREFIX}/logout`);
  if( response?.code === 200 ){
    const payloadToken = getCookie('payloadToken', null);
    store.setAuthenticated(false);
    store.setPayloadToken(payloadToken);
  }
  store.setGuest(false);
  return response;
}

export const register = async ( params ) => {
  const response = await postFetch(`${API_PREFIX}/register`, {
    ...params,
    loginPwd: cryptoUtil.encrypt(params.loginPwd),
  });
  return response;
}

export const checkDuplicate = async ( params ) => {
  const response = await postFetch(`${API_PREFIX}/check-duplicate`, params);
  if( response.code === 200 ){
    return response.data;
  }
  return false;
}

export const refreshToken = async () => {
  const store = useAuthStore.getState();
  const response = await postFetch(`${API_PREFIX}/token/refresh`);
  if( response?.code === 200 ){
    const payloadToken = getCookie('payloadToken');
    store.setPayloadToken(payloadToken);
  }
  return response;
}

/**
 * 인증 상태 체크
 * @returns 
 */
export const isAuthenticated = async () => {
  try {
    const { isGuest, authenticated, payloadToken } = useAuthStore.getState();
    console.log('isAuthenticated', { isGuest, authenticated, payloadToken });
    if( isGuest ) {
      return true; // 게스트 로그인 상태는 항상 인증된 것으로 간주
    }
    // 1. 인증된 상태인가?
    if( !authenticated ){ return false; } // 인증 실패

    // 2. 데이터 토큰을 가지고 있는가?
    if( !payloadToken ){ return false; } // 인증 실패

    // 3. 현재 토큰이 유효한가?
    const response = await postFetch(`${API_PREFIX}/token/verify`);
    if( response.code != 200 ){ return false; } // 인증 실패

    // 4. 인증 성공
    return true;
  } catch ( error ){
    // 오류 발생
    console.error(error);
    return false; // 인증 실패
  }
};

const AuthService = {
  refreshToken,
  guest,
  login,
  logout,
  register,
  checkDuplicate,
  isAuthenticated,
}

export default AuthService;
