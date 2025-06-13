'use client';

import './styles/global.css';

import { useRef, useState, useEffect } from "react";

import Head from 'next/head';

import Header from "./components/layouts/Header";
import Navigator from "./components/layouts/Navigator";
import Content from "./components/layouts/Content";
import Footer from "./components/layouts/Footer";

import WindowEventListener from "./listeners/WindowEventListener";
import useNavigatorStore from "./store/navigatorStore";
import useWindowStore from './store/useWindowStore';

export default function PetFriendsLayout ({ children }) {
  
  const defaultWidth = 480;
  const defaultHeight = 580;

  const bodyScrollRef = useRef();
  const bodyRef = useRef();

  const { deviceType } = useWindowStore();
  const { setNavItems } = useNavigatorStore();

  const [maxWidth, setMawWidth] = useState(defaultWidth);
  const [maxHeight, setMaxHeight] = useState(defaultHeight);

  const navItems = [
    {
      active: true,
      id: "cate-1",
      name: "HOME",
      path: "/pet-friends/pages/cate/home",
    },
    {
      id: "cate-2",
      name: "웰컴펫페어",
      path: "/pet-friends/pages/cate/02",
    },
    {
      id: "cate-3",
      name: "사료 최저가 도전!",
      path: "/pet-friends/pages/cate/03",
    },
    {
      id: "cate-4",
      name: "심쿵펫페어",
      path: "/pet-friends/pages/cate/04",
    },
    {
      id: "cate-5",
      name: "NEW신상",
      path: "/pet-friends/pages/cate/05",
    },
    {
      id: "cate-6",
      name: "맘마샘플",
      path: "/pet-friends/pages/cate/06",
    },
    {
      id: "cate-7",
      name: "체험단",
      path: "/pet-friends/pages/cate/07",
    },
    {
      id: "cate-8",
      name: "비밀상점",
      path: "/pet-friends/pages/cate/08",
    },
    {
      id: "cate-9",
      name: "중대형견",
      path: "/pet-friends/pages/cate/09",
    },
    {
      id: "cate-10",
      name: "이벤트",
      path: "/pet-friends/pages/cate/event",
    },
  ];

  useEffect(()=>{
    setNavItems(navItems);
  }, []);

  useEffect(()=>{
    setMaxHeight(bodyScrollRef.current.offsetHeight);
  }, [ bodyRef.current ]);

  useEffect(()=>{
    console.log(deviceType);
  }, [ deviceType ]);

  return (
    <>
      <Head>
        <title>새로운 페이지 제목</title>
      </Head>
      <WindowEventListener />
      <div
        id="main-container"
        className="w-full h-full p-0 pt-5 pb-5 m-0 flex justify-content-center"
      >
        <div
          id="body-container"
          className="flex flex-column col-5 row-1 h-full p-0 m-0"
          style={{
            width: maxWidth,
            maxWidth: maxWidth,
            minWidth: maxWidth,
            boxShadow: "darkgray 1px 1px 2px 2px"
          }}
        >
          <div className="layout-wrapper layout-header flex-grow-0">
            <Header maxWidth={ maxWidth } />
          </div>
          <div className="layout-wrapper layout-nav flex-grow-0">
            <Navigator maxWidth={ maxWidth } />
          </div>
          <div className="layout-wrapper layout-body flex-grow-1 flex-column" ref={ bodyScrollRef }>
            <Content 
              ref={ bodyRef }
              maxWidth={ maxWidth }
              maxHeight={ maxHeight }
            >
              { children }
            </Content>
          </div>
          <div className="layout-wrapper layout-footer flex-grow-0">
            <Footer maxWidth={ maxWidth } />
          </div>
        </div>
      </div>
    </>
  );
}
