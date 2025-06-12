import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import menuUtil from '@/utils/menuUtil';

const useLayoutStore = create(devtools((set, get)=>({
  loading: false,
  currentMenu: null,
  menuHome: {
    icon: 'pi pi-home',
    target: '/',
  },
  breadcrumb: [],
  menus: [],
  treeMenu: [],
  leftMenu: false,
  // setter
  setLoading: ( loading ) => set({ loading }),
  setMenu: ( menu ) => set({ currentMenu: menu }),
  setMenus: ( menus ) => set({ menus }),
  setTreeMenu: ( treeMenu ) => set({ treeMenu }),
  setBreadcrumb: ( breadcrumb ) => set({ breadcrumb }),
  setLeftMenu: ( leftMenu ) => set({ leftMenu }),
})));

export default useLayoutStore;