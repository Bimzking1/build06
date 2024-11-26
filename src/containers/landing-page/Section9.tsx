'use client';
import next from '@/assets/landing-page/next.svg';
import prev from '@/assets/landing-page/prev.svg';
import { eventHighlightLandingPage } from '@/utils/_static/dummy';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import type { Settings } from 'react-slick';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import Section9Card from './Section9Card';

export default function Section9(): React.ReactElement {
  const sliderRef = useRef<Slider>(null);

  const { t } = useTranslation();
  const [isBottom, setBottom] = useState(0);
  const measurement = 900;

  const { ref, inView, entry } = useInView({
    threshold: 0.2
  });
  useEffect(() => {
    const bottom = entry?.boundingClientRect.bottom ?? 0;
    setBottom(bottom);
  }, [entry]);

  const settings: Settings = {
    slidesToShow: 4,
    speed: 1000,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    infinite: true,
    dots: false,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          dots: true,
          slidesToShow: 3
        }
      },
      {
        breakpoint: 768,
        settings: {
          dots: true,
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 640,
        settings: {
          dots: true,
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  const handlePrevious = (): void => {
    if (sliderRef.current !== null) {
      sliderRef.current.slickPrev();
    }
  };

  const handleNext = (): void => {
    if (sliderRef.current !== null) {
      sliderRef.current.slickNext();
    }
  };

  return (
    <section
      ref={ref}
      className="h-auto min-w-full cursor-default relative font-poppins py-4"
    >
      <div
        className={`min-w-full cursor-default font-poppins ${
          inView && isBottom >= measurement
            ? 'animate-fade-in-slide'
            : isBottom >= measurement
            ? 'animate-fade-out-slide'
            : ''
        }`}
      >
        <div className="flex flex-col justify-center items-center mt-[60px] mx-8 md:mx-[200px] xl:mx-[400px]">
          {/* xl:flex-row xl:gap-[80px] items-center justify-center mx-auto */}
          {/* xl:px-[100px] px-8 mt-10 xl:mt-[100px] */}
          <h1 className="text-4xl lg:text-5xl font-semibold font-poppins text-center bg-clip-text text-transparent bg-gradient-to-r from-[#9A76FE] to-[#4FE6AF]">
            {t('landingV2.section9.text1')} {''}
            Seeds?
          </h1>
        </div>
        <Image
          src="/assets/images/vector119.png"
          width={1440}
          height={580}
          alt=""
          className="absolute z-0 w-full object-cover h-[75%]"
        />
        <div className="z-10 w-full h-full lg:mb-16 mt-10">
          <Slider ref={sliderRef} {...settings}>
            {eventHighlightLandingPage.map((data, key) => (
              <Section9Card key={key} data={data} />
            ))}
          </Slider>
        </div>
        <div className="lg:hidden flex justify-end mt-8 mx-3 py-1">
          <button
            className="rounded-full lg:p-2 border lg:mx-6 mx-3 p-1 border-1 border-[#4FE6AF]"
            onClick={handlePrevious}
          >
            <Image
              src={prev}
              width={30}
              height={30}
              alt="Previous"
              className="cursor-pointer"
            />
          </button>
          <button
            className="rounded-full lg:p-2 lg:mx-6 border mx-3 p-1 border-1 border-[#4FE6AF]"
            onClick={handleNext}
          >
            <Image
              src={next}
              width={30}
              height={30}
              alt="Next"
              className="cursor-pointer"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
