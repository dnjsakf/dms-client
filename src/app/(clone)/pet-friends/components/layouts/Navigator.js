import { createRef, useRef, useState, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { useRouter } from 'next/navigation';

import styles from './Navigator.module.css';
import useNavigatorStore from '../../store/navigatorStore';
import useWindowEvent from '../../hooks/useWindowEvent';

export default function Navigator(props){
  const {
    maxWidth: maxWidth = 0,
    ...rest
  } = props;

  const { navItems, active, activeIndex, setActiveIndex } = useNavigatorStore();

  const router = useRouter();
  const scrollRef = useRef(null);
  const itemRefs = useRef([]);
  const [underlineStyle, setUnderlineStyle] = useState({});

  const { startEvent, dragging } = useWindowEvent();

  const handleWheel = ( e ) => {
    scrollRef.current.scrollLeft += e.deltaY;
  }

  const handleMouseDown = ( e ) => {
    startEvent("scrollX", scrollRef, e);
  }

  /**
   * 카테고리 클릭 시, 인덱스 저장 후 경로가 존재하는 경우 해당 페이지로 이동
   * @param {*} e 클릭 이벤트
   * @param {*} index 카테고리의 인덱스
   * @param {*} item 카테고리 정보
   * @returns 
   */
  const handleClickItem = ( e, index, item ) => {
    e.preventDefault();
    if( dragging ) return;
    if( item?.path ) {
      router.push(item.path);
    };
    setActiveIndex(index);
  }

  useEffect(() => {
    const { offsetLeft, offsetWidth } = (itemRefs.current[activeIndex]?.current || {});
    setUnderlineStyle({
      left: offsetLeft,
      width: offsetWidth,
    });
    // 선택된 아이템으로 스크롤
    scrollRef.current.scrollTo({
      left: (offsetLeft - ((maxWidth - offsetWidth) / 2)), // 약간의 여유 공간을 위해 offset을 조정
      // behavior: 'smooth'
    });
  }, [activeIndex, navItems, maxWidth]);

  return (
    <nav
      ref={ scrollRef }
      className={classNames(styles.navWrapper, 'gap-3')}
      onWheel={ handleWheel }
      onMouseDown={ handleMouseDown }
      style={{
        maxWidth: maxWidth,
      }}
    >
      {
        navItems?.map((navItem, navIndex) => {
          const isActive = (navItem.id === active);
          const itemRef = (itemRefs.current[navIndex] || createRef());
          itemRefs.current[navIndex] = itemRef;
          return (
            <a
              key={navItem.id}
              ref={itemRef}
              className={classNames(styles.navItem, { [styles.active]: isActive })}
              onClick={(e)=>handleClickItem(e, navIndex, navItem)}
            >
              <div className={classNames(styles.navItemText)}>{ navItem.name }</div>
            </a>
          );
        })
      }
      <div
        className={ classNames(styles.navItemUnderline, active) }
        style={underlineStyle}>
      </div>
    </nav>
  );
}