import { usePathname, useRouter } from 'next/navigation';

import useLayoutStore from '@/store/layoutStore';
import menuUtil from '@/utils/menuUtil';

const useLayoutHook = () => {

  const router = useRouter();
  const pathname = usePathname();

  const {
    // variables
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

      router.push(menu.menuPath);
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

export default useLayoutHook;