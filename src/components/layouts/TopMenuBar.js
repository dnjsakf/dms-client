'use client';

import { useState, useRef, useEffect } from 'react';

import { Menubar } from 'primereact/menubar';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';

import jwtUtil from '@/utils/jwtUtil';
import useAuthStore from '@/store/authStore';
import useWindowStore from '@/store/windowStore';
import useAuthHook from '@/hooks/useAuthHook';
import useLayoutHook from '@/hooks/useLayoutHook';


import { formatTimer } from '@/utils/commonUtil';

const TopMenuBar = () => {
  const menuRight = useRef(null);
  const timer = useRef(null);

  const {
    payloadToken,
    authenticated,
    doTokenRefresh,
    doLogout,
    goLoginPage,
  } = useAuthHook();
  
  const {
    openLeftMenu,
  } = useLayoutHook();

  const [expiredLeftTime, setExpiredLeftTime] = useState(0);
  const [expiredStatus, setExpiredStatus] = useState(false);
  
  /**
   * 로그인 상태에 따라 보여줄 메뉴 구성
   */
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
      }
    },
  ];

  /**
   * 타이머 클릭 시, 토큰 재발급
   * @param {*} e 
   */
  const handleClickTokenRefresh = ( e ) => {
    doTokenRefresh();
  }

  /**
   * 토큰 타이머 연산
   */
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
      
      // 화면을 보고 있을 때, 토근 시간 만료가 다가오면 자동으로 갱신
      if( visibility && time <= tokenRefreshTime ){
        // 여기서 오류가 발생하면, 인증 실패로?
      //   await doTokenRefresh();
      }
      
      setExpiredLeftTime(time);
      setExpiredStatus(status);
    }
  }

  /**
   * 인증이 된 상태인 경우, 토큰 타이머 실행
   */
  useEffect(()=>{
    if( timer.current !== null ) clearInterval(timer.current);
    if( authenticated && payloadToken ){
      getExpiredLeftTime();
      timer.current = setInterval(getExpiredLeftTime, 1000);
    }
    return () => clearInterval(timer.current);  
  }, [authenticated, payloadToken]);

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
            label={ formatTimer(expiredLeftTime) }
            onClick={ handleClickTokenRefresh }
          />
          <Menu
            ref={ menuRight }
            id="popup_menu_right"
            model={ menus }
            popup
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

export default TopMenuBar;