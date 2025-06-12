import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useAuthStore = create(devtools((set, get) => ({
  roles: [],
  menus: [],
  isGuest: false,
  authenticated: false,
  payloadToken: null,
  setRoles: (roles) => set({ roles }),
  setMenus: (menus) => set({ menus }),
  setGuest: (isGuest) => set({ isGuest }),
  setAuthenticated: (authenticated) => set({ authenticated }),
  setPayloadToken: (payloadToken) => set({ payloadToken }),
  setLogin: ( payloadToken ) => set({
    payloadToken,
    authenticated: true,
    isGuest: false,
  }),
  setLogout: () => set({
    payloadToken: null,
    authenticated: false,
    isGuest: false,
  }),
  setGuestLogin: () => set({
    payloadToken: null,
    authenticated: true,
    isGuest: true,
  }),
})));

export default useAuthStore;
