'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import useAuthStore from '@/store/authStore';
import { useRouter } from 'next/navigation';
import AuthService from "@/services/common/AuthService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // const pathname = usePathname();
  const router = useRouter();
  const { isGuest, authenticated } = useAuthStore();
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    setChecking(true);
    AuthService.isAuthenticated().then((verified)=>{
      console.log('AuthProvider', verified);
      if( !verified ){
        router.replace('/login');
      }
    }).finally(()=>{
      setChecking(false);
    });
  }, [router]);

  return (
    <AuthContext.Provider value={{ authenticated, isGuest, checking }}>
      { children }
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
