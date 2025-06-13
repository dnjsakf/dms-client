import { useEffect } from "react";
import useWindowStore from "../store/useWindowStore";

const WindowEventListener = () => {
  const setDeviceType = useWindowStore((state) => state.setDeviceType);
  const setWidth = useWindowStore((state) => state.setWidth);
  const setHeight = useWindowStore((state) => state.setHeight);
  const setVisibility = useWindowStore((state) => state.setVisibility);
  const setMousePosition = useWindowStore((state) => state.setMousePosition);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);

      if (window.innerWidth <= 768) {
        setDeviceType('Mobile');
      } else if (window.innerWidth <= 1024) {
        setDeviceType('Tablet');
      } else {
        setDeviceType('PC');
      }
    };

    const handleMouseMove = (event) => {
      // setVisibility(event.clientX > window.innerWidth / 2 ? 'visible' : 'hidden');
      setMousePosition({ mouseX: event.clientX, mouseY: event.clientY }); // 마우스 위치 업데이트
    };

    const handleVisibilityChange = (event) => {
      setVisibility(document.visibilityState === "visible");
    }

    // 초기 값 설정
    handleResize();
    handleMouseMove({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 });
    handleVisibilityChange();

    // 이벤트 리스너 추가
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [setWidth, setHeight, setVisibility, setMousePosition]);

  return null;
};

export default WindowEventListener;