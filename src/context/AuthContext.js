  'use client';

import { createContext, useContext, useEffect } from 'react';
import useAuthStore from '@/store/authStore';
import { useRouter, usePathname } from 'next/navigation';
import AuthService from "@/services/common/AuthService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isGuest, authenticated, loading, setLoading } = useAuthStore();

  useEffect(()=>{
    setLoading(true);
    AuthService.isAuthenticated().then((verified)=>{
      if( !verified ){
        router.replace('/login');
      }
    }).finally(()=>{
      setLoading(false);
    });
  }, [router]);

  useEffect(()=>{
    if( !authenticated ){
      router.replace('/login');
    }
  }, [authenticated]);

  return (
    <AuthContext.Provider value={{ authenticated, isGuest, loading, pathname }}>
      { children }
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
