import MenuService from '@/services/common/MenuService';
import useLayoutStore from '@/store/useLayoutStore';

const useMenuService = () => {

  const {
    setLoading,
    setBreadcrumb,
  } = useMenuStore();

  const {
    setLoading
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

      try {
        router.push(menu.menuPath);
      } finally {
        setLoading(false); // 이동 후 오버레이 로딩 종료
      }
    }
  }

  return {
    moveToMenu: handleMoveToMenu,
  }
}

export default useMenuService;