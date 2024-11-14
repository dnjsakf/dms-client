'use client';

import { createContext, useContext, useEffect } from 'react';
import useAuthStore from '@/store/authStore';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const { authenticated } = useAuthStore();

  useEffect(()=>{
    if( !authenticated ){
      router.replace('/login');
    }
  }, [authenticated]);

  return (
    <AuthContext.Provider value={{ authenticated }}>
      { children }
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
