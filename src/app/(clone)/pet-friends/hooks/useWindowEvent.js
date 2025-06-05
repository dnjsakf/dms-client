
import { createRef, useEffect } from "react";

import useWindowEventStore from "../store/windowEventStore";

const useWindowEvent = () => {
  const clientRef = createRef();

  const {
    dragging,
    grabbing,
    initPos,
    setPos,
    getPos,
    setDragging,
  } = useWindowEventStore();

  const unbindEvent = () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseleave', handleMouseLeave);
    window.removeEventListener('mouseup', handleMouseUp);
  }

  const bindEvent = () => {
    unbindEvent();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseup', handleMouseUp);
  }

  const handleMouseDown = (e, mode, scrollRef) => {
    e.preventDefault();

    clientRef.current = scrollRef.current;

    const startPosX = (e.clientX - clientRef.current.offsetLeft);
    const startPosY = (e.clientY - clientRef.current.offsetTop);

    const scrollLeft = clientRef.current.scrollLeft;
    const scrollTop = clientRef.current.scrollTop;
    
    setPos({
      mode,
      startPosX,
      startPosY,
      scrollLeft,
      scrollTop,
      dragging: false,
      grabbing: true
    });

    bindEvent();
  }
  
  const handleMouseMove = ( e ) => {
    e.preventDefault();

    const {
      mode,
      startPosX,
      startPosY,
      scrollLeft,
      scrollTop,
      grabbing
    } = getPos();

    if( !grabbing ) return;
    setDragging(true);

    if( mode === "scrollX" ){
      const x = e.clientX - clientRef.current.offsetLeft;
      const walk = (x - startPosX) * 1; // 드래그 속도 조정
      clientRef.current.scrollLeft = scrollLeft - walk;
    } else if ( mode === "scrollY" ){
      const y = e.clientY - clientRef.current.offsetTop;
      const walk = (y - startPosY) * 1; // 드래그 속도 조정
      clientRef.current.scrollTop = scrollTop - walk;
    }
  }

  const handleMouseLeave = ( e ) => {
    e.preventDefault();
    initPos();
    unbindEvent();
  }

  const handleMouseUp = ( e ) => {
    e.preventDefault();
    initPos();
    unbindEvent();
  }

  useEffect(()=>{
    () => {
      unbindEvent();
    }
  }, []);

  return {
    startEvent: (mode, scrollRef, mouseEvent) => {
      handleMouseDown(mouseEvent, mode, scrollRef);
    },
    dragging,
    grabbing,
  };
}

export default useWindowEvent;