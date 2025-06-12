  'use client';

import { createContext, useContext, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useAuthHook from '@/hooks/useAuthHook';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isGuest, authenticated, checkAuthenticated } = useAuthHook();

  // useEffect(()=>{
  //   checkAuthenticated().then((verified)=>{
  //     if( !verified ){
  //       router.replace('/login');
  //     }
  //   });
  // }, [pathname]);

  // useEffect(()=>{
  //   if( !isGuest && !authenticated ){
  //     router.replace('/login');
  //   }
  // }, [isGuest, authenticated]);

  return (
    <AuthContext.Provider value={{ authenticated, pathname }}>
      { children }
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
