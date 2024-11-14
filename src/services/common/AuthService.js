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
    if( !authenticated ){
      if( accessToken ){
        await logout();
      }
      return false;
    }
    if( !accessToken ){ return false; }
    const response = await postFetch(`${API_PREFIX}/verify-token`, {
      accessToken,
      refreshToken,
    });
    if( response.code === 200 && response.data?.verify ){
      // if( jwtUtil.checkRefreshTime(accessToken) ){
      //   await token();
      // }
      valid = jwtUtil.verify(accessToken);
    }
  } catch ( error ){
    console.error(error);
    valid = false;
  } finally {
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
