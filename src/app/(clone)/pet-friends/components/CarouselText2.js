import { forwardRef, createRef, useRef, useState, useEffect} from "react";

import styles from "./CarouselText.module.css";
import { classNames } from "primereact/utils";
import useWindowStore from "../store/windowStore";

const CarouselText = forwardRef(( props, ref ) => {
  const {
    horizontal,
    vertical = true,
    reverse = false,
    value = [],
    interval = 2000,
    duration = 300,
    textTemplate,
    onClick,
    onMouseOver,
    onMouseLeave,
    ...rest
  } = props;

  const maxCount = value.length;
  const minCount = 0;
  const maxIndex = (value.length - 1);
  const minIndex = 0;
  const minInterval = 1000;
  const minDuration = 300;

  const mode = (horizontal ? "horizontal" : "vertical");
  const startPos = 0;
  const targetPos = (mode === "horizontal" ? 100 : (100 / maxCount) * -1);

  const { visibility } = useWindowStore();
  const [index, setIndex] = useState(0);
  const [queue, setQueue] = useState(()=>{
    const _queue = value.slice(0, maxCount);
    return reverse ? _queue.reverse() : _queue;
  });

  const slideRef = useRef({
    index: 0,
    interval: null,
    animate: null,
    pos: {
      startPos: (reverse ? targetPos : startPos),
      targetPos: (reverse ? startPos : targetPos),
    },
    speed: {
      interval: (interval < minInterval ? minInterval : interval),
      animate: (duration < minDuration ? minDuration : duration),
    },
  });
  const carouselRef = useRef();
  const textRefs = useRef([]);
  const wrapperRef = useRef();

   // state 동기화
  slideRef.current.index = index;

  const updateQueue = () => {
    let pivot = slideRef.current.index;
    let lastIndex = (pivot + maxCount) >= maxIndex ? maxIndex : pivot + maxCount;

    let _queue = [];
    _queue = _queue.concat(value.slice(pivot, lastIndex));
    if( _queue.length < maxCount ){
      _queue = _queue.concat(value.slice(lastIndex, lastIndex + 1));
    }
    if( _queue.length < maxCount ){
      _queue = _queue.concat(value.slice(0, maxCount - _queue.length));
    }

    if( reverse ){
      _queue.reverse();
    }

    setQueue(_queue);
  }

  const updateTransform = ( value ) => {
    if( mode === "horizontal" ){
      carouselRef.current.style.transform = `translateX(${value}%)`; 
    } else {
      carouselRef.current.style.transform = `translateY(${value}%)`; 
    }
  }

  const animateCarousel = (currentTime) => {
    if( carouselRef.current ){
      if( !animateCarousel.startTime ){
        animateCarousel.startTime = currentTime; // 시작 시간 설정
      }

      const duration = slideRef.current.speed.animate;
      const startTime = animateCarousel.startTime;
      const elapsedTime = (currentTime - startTime);
      const progress = Math.min(elapsedTime / duration, 1); // 진행 비율 (0 ~ 1)

      const startPos = slideRef.current.pos.startPos;
      const targetPos = slideRef.current.pos.targetPos;
      const translatePos = startPos + (targetPos - startPos) * progress; // 위치 보간

      if( progress < 1 ){
        updateTransform(translatePos);
        slideRef.current.animate = requestAnimationFrame(animateCarousel); // 반복 호출
      } else {
        updateQueue();
        animateCarousel.startTime = null;
        slideRef.current.animate = null;
      }
    }
  }

  const increase = () => {
    const nowIndex = slideRef.current.index;
    const nextIndex = (nowIndex >= maxIndex ? minIndex : nowIndex + 1);
    setIndex(nextIndex);
    slideRef.current.animate = requestAnimationFrame(animateCarousel);
  }

  const handleStart = () => {
    if( interval ){
      if( slideRef.current?.interval ){
        clearInterval(slideRef.current.interval);
      }
      slideRef.current.interval = setInterval(()=>{
        increase();
      }, slideRef.current.speed.interval);
    }
  }

  const handleStop = () => {
    if( slideRef.current?.interval ){
      clearInterval(slideRef.current.interval);
    }
  }

  const handleClick = (e, item)=>{
    e.preventDefault();
    if( typeof onMouseOver === 'function' ){
      onClick(item)
    }
  }

  const handleMouseOver = (e) => {
    e.preventDefault();
    handleStop();
    if( typeof onMouseOver === 'function' ){
      onMouseOver();
    }
  }

  const handleMouseLeave = (e)=>{
    e.preventDefault();
    handleStart();
    if( typeof onMouseLeave === 'function' ){
      onMouseLeave();
    }
  }

  const textRenderer = (item, idx) => {
    textRefs.current[idx] = (textRefs.current[idx] || createRef());
    return (
      <div
        key={ "text-"+idx }
        ref={ textRefs.current[idx] }
        className={ classNames(styles.ellipsis, 'no-scroll') }
        style={{
          display: 'inline-block',
          width: carouselRef.current?.offsetWidth,
        }}
      >
        <span className={ styles.noticeTitle }
          onClick={(e)=>handleClick(e, item)}
          onMouseOver={ handleMouseOver }
          onMouseLeave={ handleMouseLeave }>
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
    // debounce(handleStart);
    ref.current = {
      start: handleStart,
      stop: handleStop,
    }
    return () => {
      handleStop();
      if( slideRef.current?.animate ){
        cancelAnimationFrame(slideRef.current.animate);
      }
    }
  }, []);

  useEffect(()=>{
    updateTransform(slideRef.current.pos.startPos);
  }, [queue]);

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
        <div
          ref={ carouselRef }
          className={ classNames(styles.textWrapper, 'w-full') }
          style={{
            overflow: 'hidden',
            width: ((carouselRef.current?.offsetWidth || 0 ) + 1) * maxCount,
          }}
        >
          { queue.map(textRenderer) }
        </div>
      </div>
      <div className={ classNames(styles.iconWrapper) }>
        <span className="pi pi-angle-right"></span>
      </div>
    </div>
  );
});

CarouselText.displayName = 'CarouselText';

export default CarouselText;