'use client';

import useNavigator from '../../../hooks/useNavigator';
import ImageSlide from '../../../components/ImageSlide';

const banners = [
  {
    image: "/images/4bd4d0c6effe22b4bbf97d360be6412e.jpeg",
    alt: 'Description for Image 1',
    title: 'Title 1',
    path: '',
    cate: 'cate-2'
  },
  {
    image: "/images/06d7f1363f4601c86ba1fede7eae6dd5.png",
    alt: 'Description for Image 1',
    title: 'Title 1',
    path: '',
    cate: 'cate-3'
  },
  {
    image: "/images/40fa7bad8d0dca456a2e0f15c746228d.png",
    alt: 'Description for Image 1',
    title: 'Title 1',
    path: '',
    cate: 'cate-4'
  },
  {
    image: "/images/41c35daca9b1f943c9544a6d330f74c5.png",
    alt: 'Description for Image 1',
    title: 'Title 1',
    path: '',
    cate: 'cate-5'
  }
];

export default function Cate01Page(props){
  const {
    params,
    ...rest
  } = props;

  const { moveToCate, moveToEvent } = useNavigator();

  return (
    <div className="card">
      <ImageSlide
        images={ banners }
        interval={ 2000 }
        onClickImage={( image )=>{
          console.debug("Move To Event", image);
          moveToCate(image.cate);
        }}
        onClickPage={( page ) => {
          moveToEvent();
        }}
      />
    </div>
  )
}