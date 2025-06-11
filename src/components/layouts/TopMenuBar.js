'use client';

import { useState, useRef, useEffect } from 'react';

import { Menubar } from 'primereact/menubar';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';

import jwtUtil from '@/utils/jwtUtil';
import AuthService from '@/services/common/AuthService';
import useAuthStore from '@/store/authStore';
import useWindowStore from '@/store/windowStore';
import useLayoutStore from '@/store/layoutStore';
import useAuthHook from '@/hooks/useAuthHook';

const TopBar = ({ children }) => {
  const menuRight = useRef(null);
  const [expiredLeftTime, setExpiredLeftTime] = useState(0);
  const [expiredStatus, setExpiredStatus] = useState(false);
  
  const { openLeftMenu } = useLayoutStore();

  const { authenticated, doLogout, goLoginPage, doTokenRefresh } = useAuthHook();
  
  const menus = [
    {
      label: authenticated ? 'Logout' : 'Login',
      icon: 'pi pi-sign-out',
      command: async ({ originalEvent, item }) => {
        if( authenticated ){
          await doLogout();
        } else {
          await goLoginPage();
        }
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

  const getExpiredLeftTime = async () => {
    const { visibility } = useWindowStore.getState();

    const tokenRefreshTime = jwtUtil.getTokenRefreshTime();
    const { authenticated, payloadToken } = useAuthStore.getState();
    const time = jwtUtil.expiredLeftTime(payloadToken);

    if( authenticated ){
      let status = 'info';
      if( time <= 60 ){
        if( time <= 0 ){
          await doLogout();
        }
        status = 'danger';
      } else if ( time <= tokenRefreshTime ){
        status = 'warning';
      }
      
      // 화면을 보고 있을 때, 토근 시간 만료가 다가오면 갱신
      if( visibility && time <= tokenRefreshTime ){
        // 여기서 오류가 발생하면, 인증 실패로?
        await AuthService.refreshToken();
      }
      
      setExpiredLeftTime(time);
      setExpiredStatus(status);
    }
  }

  const formattedTime = ( time ) => {
    const minutes = Math.floor(( time / 60 ));
    const seconds = time - ( minutes * 60 );
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  const handleClickTokenRefresh = ( e ) => {
    doTokenRefresh();
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
            onClick={ handleClickTokenRefresh }
          />
          <Menu
            id="popup_menu_right"
            model={ menus }
            popup ref={ menuRight }
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