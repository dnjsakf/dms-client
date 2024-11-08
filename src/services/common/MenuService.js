import {
  getFetch,
  postFetch,
  putFetch,
  deleteFetch,
} from '@/utils/api';

const API_FREFIX = '/menu';

export const getDataList = async ( params ) => {
  const result = await getFetch(`${API_FREFIX}/list`, params);
  return generateTree(result?.data || []);
}

export const getDataDetail = async ( params ) => {
  const result = await getFetch(`${API_FREFIX}/detail`, params);
  return result?.data;
}

export const getDataRole = async ( params ) => {
  const result = await getFetch(`${API_FREFIX}/role`, params);
  return result?.data || [];
}

export const createData = async ( params ) => {
  const result = await postFetch(`${API_FREFIX}/save`, params);
  return result?.data;
}

export const updateData = async ( params ) => {
  const result = await putFetch(`${API_FREFIX}/save`, params);
  return result?.data;
}

export const deleteData = async ( params ) => {
  const result = await deleteFetch(`${API_FREFIX}/delete`, params); 
  return result?.data;
}

export const deleteAllData = async ( params ) => {
  const result = await deleteFetch(`${API_FREFIX}/deleteAll`, params); 
  return result?.data;
}

/**
 * 메뉴 Array 데이터를 Tree 형식으로 변환
 * - level은 시작점을 찾기 위한 값
 * @param {*} menus 
 * @param {*} level 
 * @param {*} options 
 * @returns 
 */
export const generateTree = (menus, level=0, options={}) => {
  const _menus = menus?.slice() || [];
  const _options = {
    ...options,
    itemsField: (options.itemsField || "children"),
    rootMenuType: (options.rootMenuType || "ROOT"),
    fields: {
      ...options?.fields
    },
  }

  const levelMenus = (
    level === 0
    ? _menus.slice()?.filter(( menu )=>( menu?.menuType === _options.rootMenuType ))
    : _menus.filter(( menu )=>( menu?.menuType !== _options.rootMenuType ))
  );
  const lowerMenus = (
    level === 0
    ? _menus.filter(( menu )=>( menu?.menuType !== _options.rootMenuType ))
    : levelMenus
  );
  
  const treeMenus = levelMenus.slice()
    .filter((menu)=>(
      !options?.parent
      || menu.upperMenuId === options.parent.menuId
    ))
    .map(( upperMenu )=>{
      const _upperMenu = {
        key: `${_options.parent ? _options.parent.key+"_" : ''}${upperMenu.menuId}`,
        menuId: upperMenu.menuId, 
        label: upperMenu.menuName,
        icon: upperMenu.menuIcon,
        target: upperMenu.menuPath,
        data: upperMenu,
        parent: _options.parent,
        ..._options.fields,
      }
    
      const children = lowerMenus?.slice()
        .filter(( lowerMenu )=>(
          lowerMenu.menuLevel === (upperMenu.menuLevel + 1)
          && lowerMenu.upperMenuId === upperMenu.menuId
        )).map((lowerMenu)=>{
          const _lowerMenu = {
            key: `${_upperMenu.key}_${lowerMenu.menuId}`,
            menuId: lowerMenu.menuId,
            menuPid: lowerMenu.upperMenuId,
            label: lowerMenu.menuName,
            icon: lowerMenu.menuIcon,
            target: lowerMenu.menuPath,
            data: lowerMenu,
            parent: { ..._upperMenu },
            ..._options.fields,
          }
          _lowerMenu[_options.itemsField] = generateTree(_menus, level + 1, {
            ..._options,
            parent: { ..._lowerMenu }
          });
          return _lowerMenu;
        });

      if( children && children.length > 0 ){
        _upperMenu[_options.itemsField] = children;
      }

      return _upperMenu;
    });

  return treeMenus;
}

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

const generateBreadcrumb = ( menu ) => {
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

const MenuService = {
  getDataList,
  getDataDetail,
  getDataRole,
  createData,
  updateData,
  deleteData,
  deleteAllData,
  generateTree,
  generateBreadcrumb,
  findTreeItem,
}

export default MenuService;
