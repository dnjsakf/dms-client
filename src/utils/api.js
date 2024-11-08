import useAuthStore from '@/store/authStore';
import { jwtDecode } from 'jwt-decode';
import jwtUtil from './jwtUtil';

export const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_BASE_URL;
}

export const customFetch = async (url, method, params, options) => {
  const defaultMethod = (method || 'GET').toUpperCase();
  const defaultOptions = {
    baseURL: getApiUrl(),
    method: defaultMethod,    
    headers: {
      'Content-Type': 'application/json',
    },
    onResponse: ({ response }) => {
      console.log('onResponse', response);
    },
    onResponseError: ({ response }) => {
      console.log('onResponseError', response);
    }
  }

  const fullURL = new URL(`${defaultOptions.baseURL}${url.startsWith('/') ? url : '/'+url}`);
  if( params ){
    const dataField = (defaultMethod  === 'GET' ? 'params' : 'body');
    if( dataField === 'params' ){
      for(const [paramKey, paramValue] of Object.entries(params)){
        if( paramValue ){
          fullURL.searchParams.append(paramKey, paramValue)
        }
      }
    } else {
      defaultOptions[dataField] = JSON.stringify(params);
    }
  }

  // 0. API 요청 옵션 병합
  const fullOptions = {
    ...defaultOptions,
    ...options,
  }

  // 1. 인증토큰 확인, 토큰이 없으면 로그인 화면으로 이동
  //   - /api/auth/* 로 가는 요청은 제외
  const store = await useAuthStore.getState();
  if( jwtUtil.verify(store.accessToken) ){
    fullOptions.headers = {
      ...fullOptions.headers,
      'Authorization': `Bearer ${store.accessToken}`
    }
  } else if( !fullURL.pathname?.startsWith('/api/auth') ){
    return store.setAuthenticated(false);
  }

  // 2. API 요청, 401 오류 발생하면 로그인 화면으로 이동
  const response = await fetch(fullURL, fullOptions);
  const data = await response.json();
  if( response.status === 401 ){
    // throw new Error(data.message);
    return store.setAuthenticated(false);
  } if( !response.ok ) {
    throw new Error(data.message);
  }
  return data;
};

export const getFetch = (url, params, options) => {
  return customFetch(url, 'GET', params, options);
}

export const postFetch = (url, params, options) => {
  return customFetch(url, 'POST', params, options);
}

export const putFetch = (url, params, options) => {
  return customFetch(url, 'PUT', params, options);
}

export const deleteFetch = (url, params, options) => {
  return customFetch(url, 'DELETE', params, options);
}

const api = {
  getFetch,
  postFetch,
  putFetch,
  deleteFetch,
}

export default api;
