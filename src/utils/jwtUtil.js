import { jwtDecode } from "jwt-decode";

/**
 * 토큰 재발급 시간
 * - 해당 값 보다 작은 경우 재발급 필요
 * @returns getRegenerateTime
 */
export const getTokenRefreshTime = () => {
  let refreshTime = process.env.NEXT_PUBLIC_TOKEN_REFRESH_TIME;
  if( !refreshTime || !isNaN(refreshTime) ){
    refreshTime = 150;
  }
  return Number(refreshTime);
}

/**
 * 토큰 유효성 확인
 * @returns 
 */
export const verify = ( token ) => {
  let verified = false;
  try {
    if( token ){
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      verified = ( decodedToken.exp > currentTime );
    }
  } catch ( error ){
    console.error(error);
    verified = false;
  } finally {
    return verified;
  }
}

/**
 * 토큰 만료 여부 확인
 * @returns 
 */
export const expiredLeftTime = ( toekn ) => {
  let timeLeft = 0;
  try {
    if( verify(toekn) ){
      const decodedToken = jwtDecode(toekn);
      const currentTime = Math.floor(Date.now() / 1000);
      timeLeft = decodedToken.exp - currentTime;
    }
    if( typeof timeLeft !== 'number' ){
      timeLeft = 0;
    }
  } catch ( error ) {
    console.error(error);
    timeLeft = 0;
  } finally {
    return timeLeft;
  }
}

/**
 * 토큰 만료 재발급 여부
 * @returns
 */
export const checkRefreshTime = ( token ) => {
  let refreshing = false;
  try {
    const leftTime = expiredLeftTime(token);
    const refreshTime = getTokenRefreshTime();
    refreshing = ( leftTime < refreshTime );
  } catch ( error ){
    console.error(error);
    refreshing = false;
  } finally {
    return refreshing;
  }
}

const jwtUtil = {
  verify,
  expiredLeftTime,
  getTokenRefreshTime,
  checkRefreshTime,
}

export default jwtUtil