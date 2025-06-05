import { postFetch } from '@/utils/api';
import jwtUtil from '@/utils/jwtUtil';
import cryptoUtil from '@/utils/cryptoUtil';

import useAuthStore from '@/store/authStore';

const API_PREFIX = '/auth';

export const login = async ( params ) => {
  const store = useAuthStore.getState();
  const response = await postFetch(`${API_PREFIX}/login`, {
    loginId: params.loginId,
    loginPwd: cryptoUtil.encrypt(params.loginPwd),
  });
  if( response?.code === 200 && response?.data ){
    const { accessToken, refreshToken } = response.data;
    store.setTokens(accessToken, refreshToken);
    store.setAuthenticated(true);
  }
  return response;
}

export const logout = async () => {
  const store = useAuthStore.getState();
  const response = await postFetch(`${API_PREFIX}/logout`);
  if( response?.code === 200 ){
    store.clearTokens();
    store.setAuthenticated(false);
  }
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

export const token = async () => {
  const store = useAuthStore.getState();
  const response = await postFetch(`${API_PREFIX}/token`, {
    refreshToken: store.refreshToken,
  }, {
    credentials: "include"
  });
  if( response?.code === 200 && response?.data ){
    const { accessToken } = response.data;
    store.setTokens(accessToken, store.refreshToken);
  }
  return response;
}

export const isAuthenticated = async () => {
  let valid = false;
  try {
    const { authenticated, accessToken, refreshToken } = useAuthStore.getState();
    // 1. 인증된 상태인가?
    if( !authenticated ){
      // 1-1. 인증되지 않은 경우인데, AccessToken을 가지고 있는가?
      if( accessToken ){
        // 1-1-1. AccessToken을 가지고 있으면, 로그아웃 시도
        await logout();
      }
      // 1-2. 인증실패
      return false;
    }
    // 2. AccessToken을 가지고 있는가?
    // 2-1. AccessToken이 없으면, 인증실패
    if( !accessToken ){ return false; }

    // 2-2. AccessToken을 가지고 있으면, RefreshToken을 전달하여 유효성 검사
    //   - 현재 접속한 IP와 Client Agent를 비교
    //   - 토큰에 저장된 IP와 Client가 일치하는지 비교
    const response = await postFetch(`${API_PREFIX}/verify-token`, {
      accessToken,
      refreshToken,
    });

    // 3. 토큰 정보가 유효한지 확인
    if( response.code === 200 && response.data?.verify ){
      // if( jwtUtil.checkRefreshTime(accessToken) ){
      //   await token();
      // }
      valid = jwtUtil.verify(accessToken);
    }
  } catch ( error ){
    console.error(error);
    // * 오류 발생 시, 인증 실패
    valid = false;
  } finally {
    // 4. 토큰 인증 결과 반환
    return valid;
  }
};

const AuthService = {
  token,
  login,
  logout,
  register,
  checkDuplicate,
  isAuthenticated,
}

export default AuthService;
