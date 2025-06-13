'use client';

import { useEffect } from 'react';

import MainLayout from "@/components/layouts/MainLayout";

import { AuthProvider } from '@/context/AuthContext';
import useAuthService from "@/hooks/services/common/useAuthService";

const MainLayoutWrapper = ({ children }) => {
  const { doTokenVerifyAndRefresh } = useAuthService();

  /**
   * 화면 랜더링 시
   * - 쿠키 조회해서 인증 초기값 셋팅
   */
  useEffect(()=>{
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