  'use client';

import { createContext, useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useAuthService from '@/hooks/services/common/useAuthService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { loading, isGuest, authenticated } = useAuthService();

  useEffect(()=>{
    if( !loading && !isGuest && !authenticated ){
      router.replace('/login');
    }
  }, [isGuest, authenticated, loading, router]);

  // 초기 인증이 진행중이면, 빈화면 출력
  if( loading ){ return null; }
  // 인증 진행중이면, 빈화면 출력
  if( !isGuest && !authenticated ){ return null; }

  return (
    <AuthContext.Provider value={{ authenticated, pathname }}>
      { children }
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
