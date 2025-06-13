// import useAuthStore from '@/store/useAuthStore';
// import jwtUtil from './jwtUtil';
import commonUtil from './commonUtil';
import APIResponse from '@/models/common/APIResponse';

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
      'platform': commonUtil.getPlatform(),
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
  // const store = await useAuthStore.getState();
  // const isAuth = (!fullURL.pathname?.startsWith('/api/mb')); // 특정 URL은 인증패스
  // if( isAuth ){
  //   // fullOptions.headers['Authorization'] = `Bearer ${store.payloadToken}`;
  //   if( !fullURL.pathname?.startsWith('/api/auth') ){
  //     // return store.setAuthenticated(false);
  //     return APIResponse.from({
  //       code: 401,
  //       data: null,
  //       message: 'Unauthorized'
  //     });
  //   }
  // }

  // 2. API 요청, 401 오류 발생하면 로그인 화면으로 이동
  const response = await fetch(fullURL, fullOptions);
  const data = await response.json();
  if( response.status === 401 ){
    return APIResponse.from({
      code: 401,
      data: null,
      message: 'Unauthorized'
    });
  }
  // if( !response.ok ) {
  //   throw new Error(data.message);
  // }
  return APIResponse.from(data);
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
