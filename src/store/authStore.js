import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useAuthStore = create(devtools((set, get) => ({
  roles: [],
  payloadToken: null,
  isGuest: false,
  authenticated: false,
  setRoles: (roles) => set({ roles }),
  setAuthenticated: ( authenticated ) => {
    set({ authenticated });
  },
  setPayloadToken: ( payloadToken ) => {
    set({ payloadToken });
  },
  setGuest: (isGuest) => {
    set({ isGuest });
  },
})));

export default useAuthStore;
