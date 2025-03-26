import { createRef, useRef, useState, useEffect} from "react";

import styles from "./CarouselText.module.css";
import { classNames } from "primereact/utils";

import useCarouselStore from "../store/carouselStore";

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

  const [index, setIndex] = useState(0);
  const [height, setHeight] = useState(0);

  const carouselRef = useRef();
  const textRefs = useRef([]);
  const slideRef = useRef({
    index,
    height,
    interval: null,
    debounce: null,
    animate: null,
  });
  slideRef.current.index = index;
  slideRef.current.height = height;

  const updateCarouselTop = ( v ) => {
    carouselRef.current.style.top = ( v || 0 ) + "px";
  }

  const animateCarousel = () => {
    if( carouselRef.current ){;
      const index = slideRef.current.index;
      const height = textRefs.current[index].current.offsetHeight;
      
      const currentTop = parseFloat(getComputedStyle(carouselRef.current).top);

      if( index === 0 ){ 
        // 다시 위로 올라가야 할 때,
        let targetTop = currentTop + 3;
        const destTop = 0;
        if( targetTop >= destTop ){
          targetTop = 0;
        }
        if( targetTop <= destTop ){
          updateCarouselTop(targetTop);
          slideRef.current.animate = requestAnimationFrame(animateCarousel); // 반복 호출
        }
      } else {
        let targetTop = currentTop - 3;
        const destTop = (index === 0 ? 0 : index * height * -1);
        if( targetTop <= destTop ){
          targetTop = destTop;
        }
        if( targetTop >= destTop ){
          updateCarouselTop(targetTop);
          slideRef.current.animate = requestAnimationFrame(animateCarousel); // 반복 호출
        }
      }
    }
  }

  const increase = () => {
    const nowIndex = slideRef.current.index;
    const nextIndex = (nowIndex >= maxIndex ? minIndex : nowIndex + 1);
    setIndex(nextIndex);
    slideRef.current.animate = requestAnimationFrame(animateCarousel);
  }

  const debounce = (handler, ...args) => {
    if( slideRef.current.debounce ){
      clearTimeout(slideRef.current.debounce);
    }
    slideRef.current.debounce = setTimeout(()=>{
      slideRef.current.debounce = null;
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
    if( slideRef.current?.animate ){
      cancelAnimationFrame(slideRef.current.animate);
    }
  }

  const textRenderer = (item, idx) => {
    textRefs.current[idx] = (textRefs.current[idx] || createRef());
    return (
      <div
        key={ "text-"+idx }
        ref={ textRefs.current[idx] }
        className={ classNames(styles.ellipsis, 'no-scroll') }
      >
        <span className={ styles.noticeTitle } onClick={ (e)=> onClick && onClick(e, item) }>
          {
            typeof textTemplate === 'function'
            ? textTemplate(item, idx)
            : ( item.text )
          }
        </span>
      </div>
    );
  }

  useEffect(()=>{
    debounce(handleStart);
    return () => {
      handleStop();
    }
  }, []);

  return (
    <div className={ classNames(styles.wrapper) }>
      <div className={ classNames(styles.labelWrapper) }>
        <span>공지</span>
      </div>
      <div className={ classNames(styles.titleWrapper) }>
        <div className={ classNames(styles.textWrapper) } ref={ carouselRef } >
          { value?.map(textRenderer) }
        </div>
      </div>
      <div className={ classNames(styles.iconWrapper) }>
        <span className="pi pi-angle-right"></span>
      </div>
    </div>
  );
}

export default CarouselText;