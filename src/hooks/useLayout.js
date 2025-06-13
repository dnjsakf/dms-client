import { usePathname, useRouter } from 'next/navigation';

import useLayoutStore from '@/store/useLayoutStore';
import menuUtil from '@/utils/menuUtil';

const useLayout = () => {

  const router = useRouter();
  const pathname = usePathname();

  const {
    // variables
    currentMenu,
    menuHome,
    menus,
    treeMenu,
    breadcrumb,
    leftMenu,
    // setter
    setLoading,
    setMenu,
    setBreadcrumb,
    setLeftMenu,
  } = useLayoutStore();

  /**
   * 특정 메뉴로 이동
   * @param {object} menu 
   */
  const handleMoveToMenu = ( menu ) => {
    if( menu.menuPath ){
      setLoading(true); // 이동 후 오버레이 로딩 종료
      const breadcrumb = menuUtil.generateBreadcrumb(menu).map((item)=>({
        key: item.menuId,
        icon: item.menuIcon,
        data: item,
        label: item.menuName,
        menuId: item.menuId,
      }));

      setMenu(menu);
      setBreadcrumb(breadcrumb);
      handleCloseLeftMenu();

      try {
        router.push(menu.menuPath);
      } finally {
        setLoading(false); // 이동 후 오버레이 로딩 종료
      }
    }
  }

  /**
   * 왼쪽 메뉴 열기
   */
  const handleOpenLeftMenu = () => setLeftMenu(true);

  /**
   * 왼쪽 메뉴 닫기
   */
  const handleCloseLeftMenu = () => setLeftMenu(false);

  return {
    // variables
    currentMenu,
    menuHome,
    menus,
    treeMenu,
    breadcrumb,
    leftMenu,
    // setter
    setLoading,
    openLeftMenu: handleOpenLeftMenu,
    closeLeftMenu: handleCloseLeftMenu,
    // handlers
    moveToMenu: handleMoveToMenu,
  };
}

export default useLayout;