import { AboutUsSectionFourBG } from '@/constants/assets/images';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import Slider from 'react-slick';

const Section4: React.FC = () => {
  const measurement = 400;
  const [isBottom, setBottom] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const { ref, inView, entry } = useInView({
    threshold: 0.3
  });
  const sliderRef = useRef<Slider>(null);
  const { t } = useTranslation();

  const youtubeLink = [
    'https://www.youtube.com/embed/A7TaLvtSJtk?si=Sw7NgzPuCzRuyBSB',
    'https://www.youtube.com/embed/7nAPJbLWxWM?si=iAOAIl0JU43dOUhP',
    'https://www.youtube.com/embed/DRcKqdE28Go?si=SJCHLuXM3mKHkrAe',
    'https://www.youtube.com/embed/ZSWst5iQX_8?si=WdnLMAKYM3JIJUdv',
    'https://www.youtube.com/embed/sdjFRKPyj88?si=ixdZoCaZD5Yhv6f_',
    'https://www.youtube.com/embed/bdPIT9Y2THs?si=--kYPTkVbRqVhEwT',
    'https://www.youtube.com/embed/hGrrxq-zDKw?si=THZ9dQzayedFuBkQ',
    'https://www.youtube.com/embed/EalUHOEGq_I?si=n4RWGOehPgiNvrMC',
    'https://www.youtube.com/embed/IfFJdZxpyKA?si=u1OH_0XYyZ27hPTl'
  ];

  useEffect(() => {
    const bottom = entry?.boundingClientRect.bottom ?? 0;
    setBottom(bottom);
  }, [entry]);

  const settings = {
    slidesToShow: 1,
    speed: 1000,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    dots: true,
    beforeChange: (prev: any, next: any) => {
      setActiveSlide(next);
    },
    customPaging: (i: any) => (
      <>
        {activeSlide === i ? (
          <div className="bg-gradient-to-r from-[#4FE6AF] to-[#9A76FE] rounded-2xl p-2"></div>
        ) : (
          <div
            className="bg-gray-400 rounded-2xl p-1"
            onClick={() => {
              handleDotClick(i);
            }}
          ></div>
        )}
      </>
    )
  };

  const handleDotClick = (index: number): void => {
    sliderRef?.current?.slickGoTo(index);
  };

  return (
    <div className="min-w-full font-poppins relative bg-white" ref={ref}>
      <div
        className={`${
          inView && isBottom >= measurement
            ? 'animate-fade-in-slide'
            : isBottom >= measurement
            ? 'animate-fade-out-slide'
            : ''
        }`}
      >
        <Image
          src={AboutUsSectionFourBG.src}
          alt="faq"
          width={100}
          height={100}
          className="absolute right-0 left-0 mx-auto -mt-5 block w-full z-0"
        />

        <div className="flex flex-col w-full font-poppins relative z-1">
          <p className="text-3xl text-center md:text-left md:text-4xl mt-10 font-semibold text-white xl:font-bold md:pl-20">
            #SeedsTalk
          </p>
          <p className="text-base text-center md:text-left md:text-xl font-normal text-[#262626] mt-6 md:px-20">
            {t('aboutUsV3.section4.subtitle')}
          </p>

          <div className="flex-row w-full my-10 md:px-[20%] text-center items-center justify-center">
            <Slider ref={sliderRef} {...settings}>
              {youtubeLink?.length !== 0
                ? youtubeLink?.map((data, idx) => (
                    <iframe
                      key={idx}
                      width="100%"
                      height="500"
                      src={data}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      className="mx-2 py-2 w-full md:w-[70%]"
                      style={{ zIndex: 2 }}
                    ></iframe>
                  ))
                : null}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section4;
