import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useNavigatorStore = create(devtools((set, get)=>({
  active: undefined,
  activeIndex: undefined,
  navItems: [],
  setActive: ( active ) => {
    const navItems = get().navItems;
    let activeIndex = navItems.findIndex((item)=>(item.id === active));
    if( activeIndex < 0 ){
      activeIndex = 0;
    }
    set({
      active,
      activeIndex,
    });
  },
  setActiveIndex: ( activeIndex ) => {
    const navItems = get().navItems;
    const active = (navItems?.length >= 0 ? navItems[activeIndex] : null);
    set({
      active,
      activeIndex,
    });
  },
  setNavItems: ( navItems ) => {
    const state = get();
    if( state.activeIndex === undefined || state.activeIndex === null ){
      const activeIndex = navItems.findIndex((item)=>(!!item.active));
      set({
        activeIndex: activeIndex,
        active: navItems[activeIndex >= 0 ? activeIndex : 0]?.id,
        navItems
      });
    } else {
      set({ navItems });
    }
  },
  getNavItem: () => get().active,
  getNavItems: () => get().navItems,
})));

export default useNavigatorStore;