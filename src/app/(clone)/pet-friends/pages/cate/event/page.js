'use client';

import { Image } from 'primereact/image';

export default function Cate01Page(props){
  const {
    params,
    ...rest
  } = props;

  const banners = [
    {
      itemImageSrc: "/images/4bd4d0c6effe22b4bbf97d360be6412e.jpeg",
      alt: 'Description for Image 1',
      title: 'Title 1'
    },
    {
      itemImageSrc: "/images/06d7f1363f4601c86ba1fede7eae6dd5.png",
      alt: 'Description for Image 1',
      title: 'Title 1'
    },
    {
      itemImageSrc: "/images/40fa7bad8d0dca456a2e0f15c746228d.png",
      alt: 'Description for Image 1',
      title: 'Title 1'
    },
    {
      itemImageSrc: "/images/41c35daca9b1f943c9544a6d330f74c5.png",
      alt: 'Description for Image 1',
      title: 'Title 1'
    }
  ];

  const bannerImageTemplate = (banner) => {
      return (
        <Image
          src={banner.itemImageSrc}
          alt={banner.title}
          onClick={()=>{
            console.log("move to page")
          }}
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

  return (
      <div className="card">
        {
          banners.map(bannerImageTemplate)
        }
      </div>
  )
}