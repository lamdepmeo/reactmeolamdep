import React, { useEffect, useRef, useMemo } from 'react';
import type SwiperCore from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import type { WpPost } from '../types';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface FeaturedSliderProps {
  posts: WpPost[];
  loading: boolean;
}

// Swiper is loaded from CDN, so we access it via the window object
declare global {
  interface Window {
    Swiper: typeof SwiperCore;
  }
}

export const FeaturedSlider: React.FC<FeaturedSliderProps> = ({ posts, loading }) => {
  const swiperRef = useRef<SwiperCore | null>(null);

  // To fix the loop issue, we need at least slidesPerView * 2 slides.
  // The max slidesPerView is 4.5, so we need at least 9 slides.
  // We duplicate the slides if we have between 1 and 9 slides to ensure the loop works smoothly.
  const displayPosts = useMemo(() => {
    if (posts.length > 0 && posts.length < 10) {
      return [...posts, ...posts];
    }
    return posts;
  }, [posts]);

  useEffect(() => {
    if (window.Swiper && !loading && displayPosts.length > 0) {
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
      }

      swiperRef.current = new window.Swiper('.featured-swiper', {
        modules: [Navigation, Autoplay],
        slidesPerView: 1.5,
        spaceBetween: 20,
        centeredSlides: true,
        loop: true,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          640: {
            slidesPerView: 2.5,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3.5,
            spaceBetween: 30,
          },
           1280: {
            slidesPerView: 4.5,
            spaceBetween: 30,
          },
        },
      });
    }

    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
        swiperRef.current = null;
      }
    };
  }, [loading, displayPosts]);

  const getCategory = (post: WpPost) => {
    return post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Uncategorized';
  };

  const getImageUrl = (post: WpPost) => {
    return post._embedded?.['wp:featuredmedia']?.[0]?.source_url || `https://picsum.photos/seed/${post.id}/600/800`;
  };

  if (loading) {
    return (
        <div className="relative w-full h-[400px] bg-gray-200 rounded-lg animate-pulse"></div>
    )
  }

  return (
    <div className="relative">
      <div className="swiper featured-swiper h-[400px]">
        <div className="swiper-wrapper">
          {displayPosts.map((post, index) => (
            <div key={`${post.id}-${index}`} className="swiper-slide rounded-lg overflow-hidden relative group">
              <img src={getImageUrl(post)} alt={post.title.rendered} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                <span className="text-sm font-semibold bg-pink-600 px-2 py-1 rounded">{getCategory(post)}</span>
                <h3 className="text-xl font-bold mt-2 leading-tight group-hover:underline"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                ></h3>
              </div>
              <a href={post.link} target="_blank" rel="noopener noreferrer" className="absolute inset-0"></a>
            </div>
          ))}
        </div>
      </div>
      <div className="swiper-button-prev absolute top-1/2 -translate-y-1/2 left-4 z-10 cursor-pointer p-2 bg-white/50 rounded-full hover:bg-white transition-colors">
        <ChevronLeftIcon />
      </div>
      <div className="swiper-button-next absolute top-1/2 -translate-y-1/2 right-4 z-10 cursor-pointer p-2 bg-white/50 rounded-full hover:bg-white transition-colors">
        <ChevronRightIcon />
      </div>
    </div>
  );
};
