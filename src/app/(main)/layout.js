'use client';

import { useEffect } from 'react';

import MainLayout from "@/components/layouts/MainLayout";

import { AuthProvider } from '@/context/AuthContext';
import useAuthHook from "@/hooks/useAuthHook";

const MainLayoutWrapper = ({ children }) => {
  const { doTokenVerifyAndRefresh } = useAuthHook();

  /**
   * 화면 랜더링 시
   * - 쿠키 조회해서 인증 초기값 셋팅
   */
  useEffect(()=>{
    console.log("여기가 메번 다시 호출됨?")
    doTokenVerifyAndRefresh();
  }, []);

  return (
    <AuthProvider>
      <MainLayout>
        { children }
      </MainLayout>
    </AuthProvider>
  );
}

export default MainLayoutWrapper;