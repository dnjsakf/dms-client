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

export default {
  getPlatform,
}