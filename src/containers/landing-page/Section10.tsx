'use client';
import next from '@/assets/landing-page/next.svg';
import prev from '@/assets/landing-page/prev.svg';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import Slider, { type Settings } from 'react-slick';

export default function Section10(): React.ReactElement {
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
    centerMode: true,
    slidesToShow: 1,
    dots: false,
    arrows: false,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          centerMode: true,
          dots: false,
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 600,
        settings: {
          centerMode: true,
          dots: false,
          slidesToShow: 0.94,
          slidesToScroll: 0.5
        }
      },
      {
        breakpoint: 480,
        settings: {
          centerMode: true,
          dots: false,
          slidesToShow: 0.94,
          slidesToScroll: 0.5
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
      className="h-auto min-w-full relative font-poppins text-center"
    >
      <div
        className={`h-auto min-w-full font-poppins ${
          inView && isBottom >= measurement
            ? 'animate-fade-in-slide'
            : isBottom >= measurement
            ? 'animate-fade-out-slide'
            : ''
        }`}
      >
        <div className="flex justify-center flex-col gap-6 py-4 px-6">
          <p className="text-3xl md:text-4xl lg:text-5xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#9A76FE] from-20% to-[#4FE6AF] to-75%">
            {t('landingV2.section10.text1')}
          </p>
          <p className="text-md lg:text-2xl">
            {t('landingV2.section10.text2')}
          </p>
        </div>
        <div className="hidden md:block py-8">
          <div className="flex justify-center relative z-10">
            <div className="mx-4 z-10">
              <div className="relative p-4 rounded-[20px] backdrop-blur-lg [box-shadow:0px_0px_0px_1px_rgba(219,_200,_255,_1)_inset] [box-shadow-width:1px] ">
                <iframe
                  width="100%"
                  height="500"
                  src="https://www.youtube.com/embed/70nsXsFUr70?controls=1"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  className="rounded-[15px] lg:w-[240px] lg:h-[426px] h-[330px] w-[220px]"
                ></iframe>
              </div>
            </div>
            <div className="mx-4 z-10">
              <div className="relative p-4 rounded-[20px] backdrop-blur-lg [box-shadow:0px_0px_0px_1px_rgba(219,_200,_255,_1)_inset] [box-shadow-width:1px] ">
                <iframe
                  width="100%"
                  height="500"
                  src="https://www.youtube.com/embed/kMpVnarl424?controls=1"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  className="rounded-[15px] lg:w-[240px] lg:h-[426px] h-[330px] w-[220px]"
                ></iframe>
              </div>
            </div>
            <div className="mx-4 z-10">
              <div className="relative p-4 rounded-[20px] backdrop-blur-lg [box-shadow:0px_0px_0px_1px_rgba(219,_200,_255,_1)_inset] [box-shadow-width:1px] ">
                <iframe
                  width="100%"
                  height="500"
                  src="https://www.youtube.com/embed/B6ibCjl1XX8?controls=1"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  className="rounded-[15px] lg:w-[240px] lg:h-[426px] h-[330px] w-[220px]"
                ></iframe>
              </div>
            </div>
          </div>
          <div className="absolute w-full h-[280px] z-0 bottom-0 bg-gradient-to-bl from-[#92FFD7] to-[#AE90FF]"></div>
        </div>
        <div className="md:hidden block mx-auto py-4">
          <div className="relative z-10 mx-auto">
            <Slider {...settings} ref={sliderRef}>
              <div className="mx-auto z-10">
                <iframe
                  width="100%"
                  height="500"
                  src="https://www.youtube.com/embed/70nsXsFUr70?controls=1"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  className="rounded-[15px] h-[390px] w-[250px]"
                ></iframe>
              </div>
              <div className="mx-auto z-10">
                <iframe
                  width="100%"
                  height="500"
                  src="https://www.youtube.com/embed/kMpVnarl424?controls=1"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  className="rounded-[15px] h-[390px] w-[250px]"
                ></iframe>
              </div>
              <div className="mx-auto z-10">
                <iframe
                  width="100%"
                  height="500"
                  src="https://www.youtube.com/embed/B6ibCjl1XX8?controls=1"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  className="rounded-[15px] h-[390px] w-[250px]"
                ></iframe>
              </div>
            </Slider>
          </div>
          <div className="md:hidden flex justify-center items-center mx-3 py-4 z-10">
            <button
              className="rounded-full lg:p-2 border lg:mx-6 mx-3 p-1 border-1 border-[#4FE6AF] z-10 bg-white"
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
              className="rounded-full lg:p-2 lg:mx-6 border mx-3 p-1 border-1 border-[#4FE6AF] z-10 bg-white"
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
          <div className="absolute w-full h-[160px] z-0 bottom-0 bg-gradient-to-bl from-[#92FFD7] to-[#AE90FF]"></div>
        </div>
      </div>
    </section>
  );
}
