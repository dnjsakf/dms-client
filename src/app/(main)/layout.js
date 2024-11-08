'use client';

import MainLayout from "@/components/layouts/MainLayout";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { classNames } from 'primereact/utils';
import { ProgressSpinner } from "primereact/progressspinner";
import { Badge } from 'primereact/badge';

import CommonService from "@/services/common/CommonService";
import AuthService from "@/services/common/AuthService";
import MenuService from "@/services/common/MenuService";

import useWindowSize from "@/hooks/useWindowSize";

import useAuthStore from "@/store/authStore";
import useLayoutStore from "@/store/layoutStore";

const MainLayoutWrapper = ({ children }) => {
  useWindowSize();

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { setRoles } = useAuthStore();
  const { setMenu, setMenus, closeLeftMenu } = useLayoutStore();

  const generateCommand = (item) => {
    if( item.target ){
      router.push(item.target);
      setMenu(item);
      closeLeftMenu();
    }
  }

  const generateTemplate = (item, options) => {
    const hasItems = (item?.items && item.items.length > 0);
    const expandedIconClassName = hasItems ? classNames('p-tree-toggler-icon pi pi-fw', {
      'pi-caret-right': !options.active,
      'pi-caret-down': options.active
    }) : '';
    const iconClassName = item.icon ? item.icon : '';

    let label = item.label;

    let wrapperClassName = ''; //'mr-1 ml-1';
    if( item.key === useLayoutStore.getState().currentMenu?.key ){
      wrapperClassName += " surface-300";
    }

    return (
      <div className={ wrapperClassName }>
        <a
          className="flex align-items-center px-3 py-2 cursor-pointer"
          onClick={(e)=>{
            e.preventDefault();
            if( !hasItems ){
              item.command(item)
            }
          }}
        >
          <span className={`${expandedIconClassName} pr-4`} />
          <span className={`${iconClassName}`} />
          <span className={`mx-2 ${hasItems && 'font-semibold'}`}>{ label }</span>
          {item.badge && <Badge className="ml-auto" value={item.badge} />}
          {item.shortcut && <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{item.shortcut}</span>}
        </a>
      </div>
    );
  };

  useEffect(()=>{
    /**
     * 화면 초기 설정값
     */
    CommonService.initData().then((result)=>{
      if( !result ){
        return false;
      }
      const { menus, roles } = result;
      if( roles?.length > 0 ){
        setRoles(roles);
      }
      if( menus?.length > 0 ){
        const treeMenu = MenuService.generateTree(menus, 0, {
          itemsField: "items",
          fields: {
            command: generateCommand,
            template: generateTemplate,
          }
        });
        // 메뉴 트리 저장
        setMenus(treeMenu);

        console.log(treeMenu);

        // 현재 경로의 메뉴 탐색
        const pathname = new URL(location.href).pathname;
        const currentMenu = MenuService.findTreeItem(treeMenu, pathname);
        setMenu(currentMenu);
      }
    });
  }, []);

  useEffect(() => {
    /**
     * 인중 확인
     */
    AuthService.isAuthenticated().then((result)=>{
      if( result ){
        setLoading(false);
      } else {
        router.push('/login');
      }
    });
  }, [router]);

  if( loading ){
    return (
      <div
        className="flex justify-content-center align-items-center"
        style={{
          height: '100vh'
        }}
      >
        <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration="1.0s" />
      </div>
    );
  }

  return (
    <MainLayout>
      { children }
    </MainLayout>
  );
}

export default MainLayoutWrapper;