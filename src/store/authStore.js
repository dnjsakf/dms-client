import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useAuthStore = create(devtools((set, get) => ({
  roles: [],
  authenticated: (localStorage.getItem('authenticated') === 'true'),
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  setRoles: (roles) => set({ roles }),
  setAuthenticated: (authenticated) => {
    localStorage.setItem('authenticated', authenticated);
    if( !authenticated ){
      get().clearTokens();
    }
    set({
      authenticated,
    });
  },
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    set({
      accessToken,
      refreshToken
    });
  },
  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({
      accessToken: null,
      refreshToken: null
    });
  },
})));

export default useAuthStore;
