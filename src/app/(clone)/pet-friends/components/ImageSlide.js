import { useRef, useState } from 'react';
import { Carousel } from 'primereact/carousel';
import { Image } from 'primereact/image';

import { classNames } from 'primereact/utils';

import styles from './ImageSlide.module.css';

const ImageSlide = ({
  images = [],
  autoplay = true,
  interval = 2000, /* 기본값: 2초 */
  onClickImage,
  onClickPage,
  onChangePage,
  ...props
}) => {
  const defaultStartPage = 0;
  const defaultAutoplay = (autoplay && typeof interval === 'number');
  const defaultInterval = defaultAutoplay ? (interval && interval >= 2000 ? interval : interval ? 2000 : null) : null;
  
  const slideRef = useRef(null);
  const [imagePage, setBannerPage] = useState(0);
  const [playing, setPlaying] = useState(defaultAutoplay);

  /**
   * 슬라이드 페이지 전환 이벤트 핸들러
   * @param {number} page - 슬라이드의 현재 페이지
   */
  const handleChangePage = ({ page }) => {
    setBannerPage(page);

    let doAfter = true;
    if( typeof onChangePage === 'function' ){
      doAfter = (onChangePage(page) !== false);
    }
  }

  /**
   * 슬라이드 이미지 클릭 이벤트 핸들러
   * onClickImage 함수가 있는 경우 호출되며 "false"를 리턴하면 다음 작업이 수행되지 않음
   * @param {PointerEvent} event 
   * @param {JSON} image 
   * 
   * @TODO - PrevButton, NextButton 클릭 후 페이징 처리가 정상적이지 않음
   */
  const handleClickImage = ( event, image ) => {
    let doAfter = true;
    if( typeof onClickImage === 'function' ){
      doAfter = (onClickImage(image, event) !== false);
    }
    if( doAfter ){
      /**
       * @TODO 후속 이벤트 처리
       */
    }
  }
  
  /**
   * 페이지 버튼 클릭 이벤트 핸들러
   * @param {PointerEvent} event 
   */
  const handleClickPage = ( event ) => {
    let doAfter = true;
    if( typeof onClickPage === 'function' ){
      doAfter = (onClickPage(imagePage, event) !== false);
    }
    if( doAfter ){
      /**
       * @TODO 후속 이벤트 처리
       */
    }
  }

  /**
   * 슬라이드 중지/재생 클릭 이벤트 핸들러
   */
  const handleTogglePlay = () => {
    if( defaultAutoplay ){
      const nextPlaying = !playing;
      
      setPlaying(nextPlaying);

      if( nextPlaying ){
        slideRef.current?.startAutoplay();
      } else {
        slideRef.current?.stopAutoplay();
      }
    }
  }

  const imageTemplate = ( item ) => {
    return (
      <Image
        src={ item.image }
        alt={ item.title }
        onClick={(e)=>handleClickImage(e, item)}
        onDragStart={(e)=>e.preventDefault()}
        style={{
          cursor: "pointer",
        }}
        pt={{
          image: {
            className: "w-full h-full"
          }
        }}
      />
    );
  };

  const footerTemplate = () => {
    const currentPage = (images.length > 0 ? (imagePage + 1) : 0);
    const maxPage = images.length;
    return (
      <div className={ classNames(styles.imageSlideFooter) }>
        <div
          className={ classNames(styles.wrapper, styles.imageSlidePagination) }
          onClick={ handleClickPage }
        >
          <span>{ `${currentPage} / ${maxPage} +` }</span>
        </div>
        {
          ( defaultAutoplay ) && (
            <div
              className={ classNames(styles.wrapper, styles.imageSlidePlayer) }
              onClick={ handleTogglePlay }
            >
              <span className={ classNames({ 'pi pi-pause': playing, 'pi pi-play': !playing }) }></span>
            </div>
          )
        }
      </div>
    );
  }

  const FooterNode = footerTemplate();

  return (
      <div className={ classNames(styles.imageSlideWrapper) }>
        <Carousel
          ref={ slideRef }
          page={ defaultStartPage }
          value={ images }
          numVisible={ 1 }
          numScroll={ 1 } 
          circular={ true }
          autoplayInterval={ playing ? defaultInterval : null }
          showIndicators={ false }
          showNavigators={ true }
          itemTemplate={ imageTemplate }
          onPageChange={ handleChangePage }
          footer={ FooterNode }
          pt={{
            root: {
              style: {
                position: "relative",
                height: "100%",
              }
            },
            container: {
              style: {
                position: "relative",
              }
            },
            previousButton: {
              style: {
                position: "absolute",
                left: 0,
                zIndex: 9999,
                color: "black",
              }
            },
            nextButton: {
              style: {
                position: "absolute",
                right: 0,
                zIndex: 9999,
                color: "black"
              },
            },
            footer: {
              style: {
                position: "absolute",
                bottom: 10,
                right: 10,
                zIndex: 9999,
                cursor: "pointer",
              }
            }
          }}
        />
      </div>
  )
}

export default ImageSlide;