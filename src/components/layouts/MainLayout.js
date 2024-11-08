'use client';

import { useEffect, useRef, useState } from 'react';

import { Sidebar } from 'primereact/sidebar';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Avatar } from 'primereact/avatar';
import { PanelMenu } from 'primereact/panelmenu';
import { Menu } from 'primereact/menu';

import useLayoutStore from '@/store/layoutStore';
import TopMenuBar from './TopMenuBar';

const MainLayout = ({ children }) => {

  const topbarRef = useRef();
  const breadcrumbRef = useRef();

  const { menuHome, menus, breadcrumb, leftMenu, closeLeftMenu } = useLayoutStore();  
  const [expandedKeys, setExpandedKeys] = useState({});

  const sideBarHeader = (
    <div className="flex align-items-center gap-2">
      <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" />
      <span className="font-bold">DMS</span>
    </div>
  );

  useEffect(()=>{
    const retval = {}
    breadcrumb.forEach((menu)=>{
      retval[menu.key] = true;
    });
    setExpandedKeys(retval);
  }, [breadcrumb]);

  return (
    <div className="main-layout">
      <div className="layout-topbar" ref={topbarRef}>
        <TopMenuBar />
      </div>
      <div className="layout-sidebar">
        <Sidebar
          header={sideBarHeader} 
          pt={{
            content: {
              className: "p-0"
            }
          }}
          visible={ leftMenu }
          onHide={ closeLeftMenu }
        >
          <PanelMenu
            multiple
            className="col-12"
            model={ menus }
            expandedKeys={ expandedKeys }
            onExpandedKeysChange={ setExpandedKeys } 
          />
        </Sidebar>
      </div>
      <div
        className="layout-content-container"
        style={{
          height: "calc(100% - "+(
            Math.ceil(
              (topbarRef?.current?.offsetHeight||0)
            ) + 0.5
          )+"px)"
        }}>
        <div className="layout-breadcrumb" ref={breadcrumbRef}>
          <BreadCrumb model={ breadcrumb } home={ menuHome } />
        </div>
        <div
          className="layout-content p-2"
          style={{
            height: "calc(100% - "+(
              Math.ceil(
                (breadcrumbRef?.current?.offsetHeight||0)
              )
            )+"px)"
          }}>
          { children }
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
