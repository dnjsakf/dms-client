import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useLayoutStore = create(devtools((set, get)=>({
  loading: false, // 오버레이 로딩
  currentMenu: null, // 현재 메뉴 위치
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