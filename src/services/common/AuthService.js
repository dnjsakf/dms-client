import { postFetch } from '@/utils/api';
import cryptoUtil from '@/utils/cryptoUtil';

import APIResponse from '@/models/common/APIResponse';

const API_PREFIX = '/auth';

/**
 * 게스트로 방문 처리
 * @returns {Promise<APIResponse>} 응답 객체 반환
 */
export const guest = async () => {
  const response = await postFetch(`${API_PREFIX}/logout`);
  return APIResponse.from({
    code: 200,
    data: null,
    message: "Guest login successful."
  });
}

/**
 * 회원가입 요청
 * @returns {Promise<APIResponse} 응답 객체 반환
 */
export const register = async ( params ) => {
  const response = await postFetch(`${API_PREFIX}/register`, {
    ...params,
    loginPwd: cryptoUtil.encrypt(params.loginPwd),
  });
  return response;
}

/**
 * 로그인 요청
 * @param {object} params 로그인 계정/패스워드 정보
 * @returns {Promise<APIResponse} 응답 객체 반환
 */
export const login = async ( params ) => {
  const response = await postFetch(`${API_PREFIX}/login`, {
    loginId: params.loginId,
    loginPwd: cryptoUtil.encrypt(params.loginPwd),
  });
  return response;
}

/**
 * 로그인 요청
 * @returns {Promise<APIResponse} 응답 객체 반환
 */
export const logout = async () => {
  const response = await postFetch(`${API_PREFIX}/logout`);
  return response;
}

export const checkDuplicate = async ( params ) => {
  const response = await postFetch(`${API_PREFIX}/check-duplicate`, params);
  return response;
}

/**
 * 토큰 유효성 검사 
 * @returns {Promise<boolean>} 유효성 여부
 */
export const tokenVerify = async () => {
  const response = await postFetch(`${API_PREFIX}/token/verify`);
  return response;
}

/**
 * 토큰 재발급 요청
 * @returns {Promise<APIResponse} 응답 객체 반환
 */
export const tokenRefresh = async () => {
  const response = await postFetch(`${API_PREFIX}/token/refresh`);
  return response;
}

const AuthService = {
  tokenVerify,
  tokenRefresh,
  guest,
  login,
  logout,
  register,
  checkDuplicate,
}

export default AuthService;
