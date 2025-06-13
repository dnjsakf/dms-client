import { usePathname, useRouter } from 'next/navigation';

import AuthService from "@/services/common/AuthService";
import CommonService from '@/services/common/CommonService';

import useAuthStore from '@/store/useAuthStore';
import useLayoutStore from '@/store/useLayoutStore';
import useLayout from '@/hooks/useLayout';

import APIResponse from '@/models/common/APIResponse';

import { getCookie, delCookie } from '@/utils/commonUtil';
import { generateTree, findTreeItem } from '@/utils/menuUtil';

const useAuthService = () => {

  const router = useRouter();
  const pathname = usePathname();

  const {
    // variables
    loading,
    isGuest,
    payloadToken,
    authenticated,
    // setter
    setLoading: setAuthLoading,
    setPayloadToken,
    setLogin,
    setLogout,
    setGuestLogin,
    setRoles,
  } = useAuthStore();

  const {
    // setter
    setLoading,
    setMenu,
    setMenus,
    setTreeMenu,
  } = useLayoutStore();

  const {
    moveToMenu
  } = useLayout();

  /**
   * 로그인에 성공한 후, 처리할 이벤트
   */
  const postLogin = async () => {
    // 초기 데이터 조회
    const resInit = await CommonService.getInitData();
    if( resInit.code === 200 ){
      const { menus, roles } = resInit.data;

      // 권한 목록 저장
      setRoles(roles||[]);

      // 메뉴 목록 저장
      setMenus(menus);

      // 메뉴 목록으로 트리 데이터 생성
      const treeMenu = generateTree(menus, { command: moveToMenu });
      setTreeMenu(treeMenu);

      // 현재 경로의 메뉴 탐색
      // const pathname = new URL(location.href).pathname;
      const currentMenu = findTreeItem(treeMenu, pathname);
      setMenu(currentMenu);
    }
  }

  /**
   * 로그인한 사용자의 인증 유효성 검사
   * @returns {Promise<boolean>} 인증 성공 여부
   */
  const handleCheckAuthenticated = async () => {
    try {
      // 0. 게스트인가?
      if( isGuest ) { return true; } // 게스트 로그인 상태는 항상 인증된 것으로 간주?

      // 1. 인증된 상태인가?
      if( !authenticated ){ return false; } // 인증 실패

      // 2. 데이터 토큰을 가지고 있는가?
      if( !payloadToken ){ return false; } // 인증 실패

      // 3. 현재 토큰이 유효한가?
      const verified = await handleTokenVerify();
      if( !verified ){ return false; } // 인증 실패

      // 4. 인증 성공
      return true;
    } catch ( error ){
      // 오류 발생
      console.error(error);
      return false; // 인증 실패
    }
  }

  /**
   * 회원가입 요청
   * @param {object} regData 회원가입 정보 객체
   */
  const handleRegister = async ( regData ) => {
    const response = await AuthService.register( regData )
    return response;
  }

  /**
   * 로그인ID 중복 여부 확인
   * @param {object} loginData 로그인ID
   */
  const handleCheckDuplicate = async ({ loginId }) => {
    const response = await AuthService.checkDuplicate({ loginId });
    return ( response.code === 200 && !response.data.duplicated );
  }

  /**
   * 로그인 요청
   * - 로그인에 성공한 경우, 메인페이지(/)로 이동
   * @param {*} loginData 로그인 계정/비밀번호
   * @returns {Promise<APIResponse>} 응답 객체 반환
   */
  const handleLogin = async ({ loginId, loginPwd }) => {
    const resLogin = await AuthService.login({ loginId, loginPwd })
    if( resLogin.code === 200  ){
      const payloadToken = getCookie('payloadToken', null);
      setLogin(payloadToken);
      await postLogin();
      router.push('/');
    }
    return resLogin;
  }

  /**
   * 게스트 로그인 요청
   * - 로그인에 성공한 경우, 메인페이지(/)로 이동
   * @returns {Promise<APIResponse>} 응답 객체 반환
   */
  const handleGuestLogin = async () => {
    const response = await AuthService.guest()
    if( response.code === 200  ){
      delCookie('payloadToken');
      setGuestLogin();
      await postLogin();
      router.push('/');
    }
    return response;
  }

  /**
   * 로그아웃 요청
   * @returns {Promise<APIResponse>} 응답 객체 반환
   */
  const handleLogout = async () => {
    const response = await AuthService.logout();
    if( response.code === 200 ){
      delCookie('payloadToken');
      setLogout();
      router.push('/login');
    }
    return response;
  }

  /**
   * 토큰 유효성 검사 요청
   * @returns {Promise<boolean} 유효성 검사 성공 여부
   */
  const handleTokenVerify = async () => {
    const response = await AuthService.tokenVerify();
    return ( response.code === 200 && !!response.data?.verify );
  }

  /**
   * 토큰 갱신 요청
   * @returns {Promise<boolean} 갱신 성공 여부
   */
  const handleTokenRefresh = async () => {
    const response = await AuthService.tokenRefresh();
    switch( response.code ){
      case 200: // 갱신 성공
        // 새로 발급한 토큰 저장
        const payloadToken = getCookie('payloadToken');
        setPayloadToken(payloadToken);
        return true;
      case 401: // 인증 실패
      default: // 갱신 실패
        await handleLogout();
        return false;
    }
  }

  /**
   * 토큰 유효성 검사 및 갱신 요청
   * - 새로고침 시 사용
   * @returns {Promise<boolean} 갱신 성공 여부
   */
  const handleTokenVerifyAndRefresh = async () => {
    // 0. 게스트인 경우 제외
    if( isGuest ){ return true; }

    setLoading(true); // 오버레이로딩 시작

    // 1. 이미 가지고 있는 토큰이 있는가?
    const payloadToken = getCookie('payloadToken');
    if( payloadToken ){
      // 2. 토큰이 있다면, 토큰이 유효한가?
      const verified = await handleTokenVerify();
      if( !verified ){
        // 3. 토큰이 유효하지 않으면, 로그인 페이지로 이동
        router.push('/login');
      } else {
        // 3. 토큰이 유효하면, 해당 토큰을 계속 사용
        setLogin(payloadToken);
        await postLogin();
      }
    } else {
      // 2. 토큰이 없다면, httpOnly 쿠키가 있을 수 있으니 갱신 요청청
      // return await handleTokenRefresh();
      // 2. 토큰이 없다면, 로그아웃처리
      await handleLogout();
    }

    setLoading(false); // 오버레이로딩 종료

    setAuthLoading(false); // 로딩 종료
  }

  const goHome = async () => {
    router.replace('/');
  }
  const goLoginPage = async () => {
    const response = await AuthService.logout();
    router.replace('/login');
  }

  return {
    // 회원가입 관련
    doRegister: handleRegister,
    doCheckDuplicate: handleCheckDuplicate,
    // 로그인 관련
    doLogin: handleLogin,
    doGuestLogin: handleGuestLogin,
    doLogout: handleLogout,
    // 토큰 관련
    checkAuthenticated: handleCheckAuthenticated,
    doTokenVerify: handleTokenVerify,
    doTokenRefresh: handleTokenRefresh,
    doTokenVerifyAndRefresh: handleTokenVerifyAndRefresh,
    // 기타 기능
    goHome,
    goLoginPage,
    // 상태 변수
    setAuthLoading,
    loading,
    isGuest,
    payloadToken,
    authenticated
  }
}

export default useAuthService;