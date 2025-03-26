import { createRef, useRef, useState, useEffect} from "react";

import styles from "./CarouselText.module.css";
import { classNames } from "primereact/utils";
import useWindowStore from "../store/windowStore";

const CarouselText = ( props ) => {
  const {
    value = [],
    interval = 2000,
    textTemplate,
    onClick,
    ...rest
  } = props;

  const minIndex = 0;
  const maxIndex = (value.length - 1);

  const { visibility } = useWindowStore();
  const [index, setIndex] = useState(0);

  const slideRef = useRef({
    index: 0,
    interval: null,
    debounce: null,
    animate: null,
  });
  const carouselRef = useRef();
  const textRefs = useRef([]);

  slideRef.current.index = index; // state 동기화

  const animateCarousel = (currentTime) => {
    if( carouselRef.current ){
      if( !animateCarousel.startTime ){
        animateCarousel.startTime = currentTime; // 시작 시간 설정
      }
      const startY = 100;
      const targetY = 0; 
      const duration = 300; 
      const startTime = animateCarousel.startTime;

      const elapsedTime = (currentTime - startTime);
      const progress = Math.min(elapsedTime / duration, 1); // 진행 비율 (0 ~ 1)
      const translateY = startY + (targetY - startY) * progress; // 위치 보간

      if( progress < 1 ){
        carouselRef.current.style.transform = `translateY(${translateY}%)`;
        slideRef.current.animate = requestAnimationFrame(animateCarousel); // 반복 호출
      } else {
        carouselRef.current.style.transform = `translateY(0%)`;
        animateCarousel.startTime = null;
      }
    }
  }

  const increase = () => {
    const nowIndex = slideRef.current.index;
    const nextIndex = (nowIndex >= maxIndex ? minIndex : nowIndex + 1);
    setIndex(nextIndex);
    carouselRef.current.style.transform = `translateY(100%)`;
    slideRef.current.animate = requestAnimationFrame(animateCarousel);
  }

  const debounce = (handler, ...args) => {
    if( slideRef.current.debounceTimeout ){
      clearTimeout(slideRef.current.debounceTimeout);
    }
    slideRef.current.debounceTimeout = setTimeout(()=>{
      slideRef.current.debounceTimeout = null;
      handler(...args);
    }, 300);
  }

  const handleStart = () => {
    if( interval ){
      if( slideRef.current?.interval ){
        clearInterval(slideRef.current.interval);
      }
      slideRef.current.interval = setInterval(()=>{
        increase();
      }, interval);
    }
  }

  const handleStop = () => {
    if( slideRef.current?.interval ){
      clearInterval(slideRef.current.interval);
    }
  }

  const textRenderer = () => {
    const item = value[index];
    textRefs.current[index] = (textRefs.current[index] || createRef());
    
    return (
      <div
        ref={ textRefs.current[index] }
        className={ classNames(styles.ellipsis, 'no-scroll') }
      >
        <span className={ styles.noticeTitle } onClick={ (e)=> onClick && onClick(e, item) }>
          {
            typeof textTemplate === 'function'
            ? textTemplate(item, index)
            : ( item.text )
          }
        </span>
      </div>
    );
  }

  useEffect(()=>{
    // debounce(handleStart);
    return () => {
      handleStop();
      if( slideRef.current?.animate ){
        cancelAnimationFrame(slideRef.current.animate);
      }
    }
  }, []);

  useEffect(()=>{
    if( visibility ){
      handleStart();
    } else {
      handleStop();
    }
  }, [visibility]);

  return (
    <div className={ classNames(styles.wrapper) }>
      <div className={ classNames(styles.labelWrapper) }>
        <span>공지</span>
      </div>
      <div className={ classNames(styles.titleWrapper) }>
        <div className={ classNames(styles.textWrapper) } ref={ carouselRef } >
          { textRenderer() }
        </div>
      </div>
      <div className={ classNames(styles.iconWrapper) }>
        <span className="pi pi-angle-right"></span>
      </div>
    </div>
  );
}

export default CarouselText;