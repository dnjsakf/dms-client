'use client';

import { useState, useRef, useEffect } from 'react';

import { Menubar } from 'primereact/menubar';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';

import jwtUtil from '@/utils/jwtUtil';
import AuthService from '@/services/common/AuthService';
import useAuth from '@/hooks/useAuth';
import useAuthStore from '@/store/authStore';
import useWindowStore from '@/store/windowStore';
import useLayoutStore from '@/store/layoutStore';

const TopBar = ({ children }) => {
  const menuRight = useRef(null);
  const [expiredLeftTime, setExpiredLeftTime] = useState(0);
  const [expiredStatus, setExpiredStatus] = useState(false);
  
  const { openLeftMenu } = useLayoutStore();
  const { logout } = useAuth();
  
  const menus = [
    {
      menuId: 'menu100100',
      menuPid: 'menu100000',
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: async ({ originalEvent, item }) => {
        logout();
      },
      template: (item, props) => {
        return (
          <div className="p-menuitem-content">
            <a className="p-menuitem-link" onClick={ (originalEvent)=>{ item.command({ originalEvent, item}) }}>
              { item.icon ? <span className={ ['p-menuitem-icon', item.icon].join(' ') } /> : null }
              <span className="p-menuitem-text">{ item.label }</span>
            </a>
          </div>
        );
      },
    },
  ];
  
  const callRefreshToken = async () => {
    try {
      const response = await AuthService.token();
      console.log(response);
    } catch ( error ){
      console.error(error);
    }
  }

  const getExpiredLeftTime = async () => {
    const { visibility } = useWindowStore.getState();

    const tokenRefreshTime = jwtUtil.getTokenRefreshTime();
    const { accessToken } = useAuthStore.getState();
    const time = jwtUtil.expiredLeftTime(accessToken);

    // const expiredStatus = (time < tokenRefreshTime);
    let status = 'info';
    if( time <= 60 ){
      if( time <= 0 ){
        useAuthStore.getState().setAuthenticated(false);
      }
      status = 'danger';
    } else if ( time <= tokenRefreshTime ){
      status = 'warning';
    }
    
    // 화면을 보고 있을 때, 토근 시간 만료가 다가오면 갱신
    if( visibility && time <= tokenRefreshTime ){
      await AuthService.token();
    }
    
    setExpiredLeftTime(time);
    setExpiredStatus(status);
  }

  const formattedTime = ( time ) => {
    const minutes = Math.floor(( time / 60 ));
    const seconds = time - ( minutes * 60 );
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  const handleClickRefreshToken = ( e ) => {
    callRefreshToken();
  }

  useEffect(()=>{
    getExpiredLeftTime();
    const timer = setInterval(getExpiredLeftTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Menubar
      model={[]}
      start={ <Button icon="pi pi-bars" onClick={ openLeftMenu } /> }
      end={
        <div className="flex align-items-center gap-2">
          <InputText placeholder="Search" type="text" className="w-8rem sm:w-auto" />
          <Button
            className="p-button-text"
            severity={ expiredStatus }
            /* 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'help' | 'contrast' | undefined; */
            label={ formattedTime(expiredLeftTime) }
            onClick={ handleClickRefreshToken }
          />
          <Menu
            id="popup_menu_right"
            model={ menus }
            popup ref={menuRight}
            popupAlignment="right"
          />
          <Avatar
            label="A" shape="circle"
            onClick={(event) => menuRight.current.toggle(event)} 
            aria-controls="popup_menu_right"
            aria-haspopup
          />
        </div>
      }
    />
  );
}

export default TopBar;