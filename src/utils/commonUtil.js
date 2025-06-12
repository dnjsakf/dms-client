/**
 * 현재 사용하는 브라우저의 플랫폼을 탐색
 * @returns 
 */
export const getPlatform = () => {
  let platform = "desktop";
  try {
    const platformAgent = navigator.userAgent.toLowerCase();
    const checkMobileRegex = new RegExp('mobile|android|iphone|ipad', 'i');
    if( checkMobileRegex.test(platformAgent) ){
      platform = "mobile";
    }
  } catch ( err ){
    console.error(err);
  }
  return platform;
}

/**
 * 
 * @param {string} name 쿠키명
 * @returns 
 */
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return null;
}

export const delCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

/**
 * 
 * @param {number} time 
 * @returns 
 */
export const formatTimer = ( time, fmt="mm:dd" ) => {
  let seconds = Math.floor(time % 60);
  let minutes = Math.floor((time / 60) % 60);
  let hours = Math.floor(time / 3600);

  const pad = (n) => (n < 10 ? '0' : '') + n;

  if( hours > 0 ){ fmt = "hh:mm:ss"; }

  if (fmt === "hh:mm:ss") {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  } else if (fmt === "mm:ss") {
    // 분:초만 표시
    let totalMinutes = Math.floor(time / 60);
    return `${pad(totalMinutes)}:${pad(seconds)}`;
  } else {
    // 기본: mm:ss
    let totalMinutes = Math.floor(time / 60);
    return `${pad(totalMinutes)}:${pad(seconds)}`;
  }
}

export default {
  getPlatform,
  getCookie,
  delCookie,
  formatTimer,
}