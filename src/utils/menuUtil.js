
/**
 * 메뉴 Array 데이터를 PrimeReact PanelMenu 형식으로 변환
 * @param {Array} menus
 * @param {Object} options
 * @returns {Array}
 */
export const generateTree = (menus, options = {}) => {
  if (!Array.isArray(menus)) return [];

  // 최상위 메뉴만 추출 (upperMenuId가 null 또는 0 등)
  const rootMenus = menus.filter(menu => !menu.upperMenuId || menu.upperMenuId === 0);

  const toPanelMenuItem = (menu) => {
    const children = menus.filter(m => m.upperMenuId === menu.menuId);
    return {
      key: String(menu.menuId),
      label: menu.menuName,
      icon: menu.menuIcon,
      data: menu,
      command: () => options.command && options.command(menu),
      ...(options.template && { template: options.template }),
      ...(children.length > 0 ? { items: children.map(toPanelMenuItem) } : {}),
    };
  };

  return rootMenus.map(toPanelMenuItem);
};

export const findTreeItem = (treeMenu, menuPath) => {
  let retval = undefined;
  for(const menu of treeMenu.values()){
    if( menu.target === menuPath ){
      retval = menu;
    } else if ( menu.items?.length > 0 ){
      retval = findTreeItem(menu.items, menuPath);
    }
    if( retval ){
      break;
    }
  }
  return retval;
}

export const generateBreadcrumb = ( menu ) => {
  function _generate(menu){
    let retval = [];
    if( menu ){
      retval.push(menu);
      if( menu?.parent ){
        retval = retval.concat(_generate(menu.parent));
      }
    }
    return retval;
  }
  return _generate(menu).reverse();
}

export default {
  findTreeItem,
  generateTree,
  generateBreadcrumb,
}