import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import MenuService from '@/services/common/MenuService';

const useLayoutStore = create(devtools((set, get)=>({
  currentMenu: null,
  menuHome: {
    icon: 'pi pi-home',
    target: '/',
  },
  breadcrumb: [],
  menus: [],
  leftMenu: false,
  setMenu: ( menu ) => {
    set({
      breadcrumb: MenuService.generateBreadcrumb(menu).map((menu)=>({
        key: menu.key,
        icon: menu.icon,
        data: menu.data,
        label: menu.label,
        menuId: menu.menuId,
      })),
      currentMenu: menu
    })
  },
  setMenus: ( menus ) => set({ menus }),
  openLeftMenu: () => set({ leftMenu: true }),
  closeLeftMenu: () => set({ leftMenu: false }),
})));

export default useLayoutStore;