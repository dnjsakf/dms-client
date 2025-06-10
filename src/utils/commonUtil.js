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

export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return null;
}

export default {
  getPlatform,
  getCookie,
}