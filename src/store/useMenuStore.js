import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useMenuStore = create(devtools((set, get)=>({
  // variables
  menu: null, // 현재 메뉴
  leftMenuOpen: false,// 좌첸 메뉴 오픈 여부
  leftMenuList: [], // 좌측 메뉴 목록
  leftMenuTree: [], // 좌측 메뉴 트리
  breadcrumb: [], // 현재 메뉴 경로
  // setters
  setMenu: ( menu ) => set({ menu }),
  setLeftMenuOpen: ( leftMenuOpen ) => set({ leftMenuOpen}),
  setLeftMenuList: ( leftMenuList ) => set({ leftMenuList}),
  setLeftMenuTree: ( leftMenuTree ) => set({ leftMenuTree}),
  setBreadcrumb: ( breadcrumb ) => set({ breadcrumb}),
})));

export default useMenuStore;