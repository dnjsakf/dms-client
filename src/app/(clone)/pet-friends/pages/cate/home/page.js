"use client";

import useNavigator from "../../../hooks/useNavigator";
import ImageSlide from "../../../components/ImageSlide";
import { classNames } from "primereact/utils";
import IconList from "../../../components/IconList";

import styles from "./page.module.css";
import CarouselText from "../../../components/CarouselText";
import CarouselText2 from "../../../components/CarouselText2";
import BandBanner from "../../../components/BandBanner";
import { useRef } from "react";
import PartnerBanner from "../../../components/PartnerBanner";

const banners = [
  {
    image: "/images/4bd4d0c6effe22b4bbf97d360be6412e.jpeg",
    alt: "Description for Image 1",
    title: "Title 1",
    path: "",
    cate: "cate-2"
  },
  {
    image: "/images/06d7f1363f4601c86ba1fede7eae6dd5.png",
    alt: "Description for Image 1",
    title: "Title 1",
    path: "",
    cate: "cate-3"
  },
  {
    image: "/images/40fa7bad8d0dca456a2e0f15c746228d.png",
    alt: "Description for Image 1",
    title: "Title 1",
    path: "",
    cate: "cate-4"
  },
  {
    image: "/images/41c35daca9b1f943c9544a6d330f74c5.png",
    alt: "Description for Image 1",
    title: "Title 1",
    path: "",
    cate: "cate-5"
  }
];

export default function HomePage(props){
  const {
    params,
    ...rest
  } = props;

  const { moveToCate, moveToEvent } = useNavigator();

  const carouselRef = useRef();

  return (
    <div className={ classNames(styles.contentSection) }>
      <section className={ classNames(styles.eventBannerSection) }>
        <ImageSlide
          // images={ banners }
          autoplay={ false }
          interval={ 2000 }
          onClickImage={( image )=>{
            console.debug("Move To Event", image);
            moveToCate(image.cate);
          }}
          onClickPage={( page ) => {
            moveToEvent();
          }}
        />
      </section>
      <section className={ classNames(styles.noticeSesion) }>
        <CarouselText2
          ref={ carouselRef }
          interval={ 1500 }
          duration={ 300 }
          value={[
            { text: "111111111111111111111111", link: "/abcd" },
            { text: "222222222222222222222222", link: "/abcd" },
            { text: "333333333333333333333333", link: "/abcd" },
          ]}
          onClick={( event, item )=>{
            console.log(event, item);
          }}
          onMouseOver={()=>{
            console.log('onMouseOver')
          }}
          onMouseLeave={()=>{
            console.log('onMouseLeave')
          }}
        />
      </section>
      <section className={ classNames(styles.noticeSesion) }>
        <CarouselText2
          ref={ carouselRef }
          interval={ 1500 }
          duration={ 300 }
          reverse
          value={[
            { text: "111111111111111111111111", link: "/abcd" },
            { text: "222222222222222222222222", link: "/abcd" },
            { text: "333333333333333333333333", link: "/abcd" },
          ]}
          onClick={( event, item )=>{
            console.log(event, item);
          }}
          onMouseOver={()=>{
            console.log('onMouseOver')
          }}
          onMouseLeave={()=>{
            console.log('onMouseLeave')
          }}
        />
      </section>
      <section className={ classNames(styles.noticeSesion) }>
        <CarouselText2
          ref={ carouselRef }
          interval={ 1500 }
          duration={ 300 }
          horizontal
          value={[
            { text: "111111111111111111111111", link: "/abcd" },
            { text: "222222222222222222222222", link: "/abcd" },
            { text: "333333333333333333333333", link: "/abcd" },
          ]}
          onClick={( event, item )=>{
            console.log(event, item);
          }}
          onMouseOver={()=>{
            console.log('onMouseOver')
          }}
          onMouseLeave={()=>{
            console.log('onMouseLeave')
          }}
        />
      </section>
      <section className={ classNames(styles.categorySection) }>
        <IconList />
      </section>
      <section className={ classNames(styles.partnerSection) }>
        <PartnerBanner />
      </section>
      <section className={ classNames(styles.bandBannerSection) }>
        <BandBanner />
      </section>
    </div>
  )
}