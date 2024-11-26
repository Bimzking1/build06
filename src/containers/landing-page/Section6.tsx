import next from '@/assets/landing-page/next.svg';
import prev from '@/assets/landing-page/prev.svg';
import {
  SectionSixImageEvent1,
  SectionSixImageEvent10,
  SectionSixImageEvent2,
  SectionSixImageEvent3,
  SectionSixImageEvent7,
  SectionSixImageEvent8,
  SectionSixImageEvent9,
  SectionSixImageOval
} from '@/constants/assets/images';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
// import { Zoom } from 'react-toastify';
import 'swiper/css/bundle';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';

export default function Section6(): React.ReactElement {
  const SwiperPrevButton: React.FC = () => {
    const swiper = useSwiper();
    return (
      <button
        className="rounded-full lg:p-2 border lg:mx-4 mx-2 p-1 border-1 border-[#4FE6AF] "
        onClick={() => {
          swiper.slidePrev();
        }}
      >
        <Image src={prev} alt="Previous" className="cursor-pointer" />
      </button>
    );
  };

  const SwiperNextButton: React.FC = () => {
    const swiper = useSwiper();
    return (
      <button
        className="rounded-full lg:p-2 lg:mx-4 border mx-2 p-1 border-1 border-[#4FE6AF] "
        onClick={() => {
          swiper.slideNext();
        }}
      >
        <Image src={next} alt="Next" className="cursor-pointer" />
      </button>
    );
  };

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

  const events = [
    { image: SectionSixImageEvent1.src },
    { image: SectionSixImageEvent2.src },
    { image: SectionSixImageEvent3.src },
    // { image: SectionSixImageEvent4.src },
    // { image: SectionSixImageEvent5.src },
    // { image: SectionSixImageEvent6.src },
    { image: SectionSixImageEvent7.src },
    { image: SectionSixImageEvent8.src },
    { image: SectionSixImageEvent9.src },
    { image: SectionSixImageEvent10.src }
  ];

  const autoplaySwiper = {
    delay: 1000
  };

  const modulesSwiper = [Autoplay];

  const breakpointsSwiper = {
    320: { slidesPerView: 1 },
    480: { slidesPerView: 2 },
    620: { slidesPerView: 3 },
    640: { slidesPerView: 3 },
    1024: { slidesPerView: 3 }
  };
  return (
    <section
      ref={ref}
      className="h-auto min-w-full cursor-default relative font-poppins text-center"
    >
      <div
        className={`h-auto min-w-full mt-5 cursor-default relative font-poppins items-center text-center ${
          inView && isBottom >= measurement
            ? 'animate-fade-in-slide'
            : isBottom >= measurement
            ? 'animate-fade-out-slide'
            : ''
        }`}
      >
        <div className="flex flex-col w-full items-center font-poppins relative">
          <p className="text-3xl md:text-[64px] mt-10 p-5 text-center font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#9A76FE] to-[#4FE6AF] xl:font-semibold absolute z-10">
            {t('landingV2.section6.text1')}
          </p>
          <Image
            src={SectionSixImageOval.src}
            alt={SectionSixImageOval.alt}
            width={400}
            height={100}
            className="w-[300px] h-[117px] top-7 md:w-[629px] md:top-7 relative z-1"
          />
        </div>
        <div className="w-full h-full lg:flex-col lg:justify-center mt-6 mb-20 md:mt-16">
          <Swiper
            modules={modulesSwiper}
            slidesPerView={3}
            autoplay={autoplaySwiper}
            spaceBetween={10}
            grabCursor={true}
            centeredSlides={true}
            loop={true}
            breakpoints={breakpointsSwiper}
            allowSlideNext={true}
            className="lg:flex lg:max-w-[1000px] md:max-w-full md:h-auto md:flex sm:max-w-[1000px] flex flex-col gap-6"
          >
            {events?.length !== 0
              ? events?.map((data, idx) => (
                  <SwiperSlide
                    key={idx}
                    className="w-full lg:w-1/3 !flex !justify-center !items-center lg:mb-[25px] md:mb-[25px] sm:mb-[25px] lg:object-contain"
                  >
                    <div className="flex flex-col object-fill">
                      <Image
                        src={data.image}
                        alt={`event banner${idx + 1}`}
                        width={300}
                        height={300}
                        className="lg:max-h-72 md:max-h-60 md:w-80 sm:max-h-48 sm:max-w-1/2 max-h-52 w-80"
                      />
                    </div>
                  </SwiperSlide>
                ))
              : null}
            <div className="lg:items-start md:items-start sm:items-start flex h-20 items-center justify-center">
              <SwiperPrevButton />
              <SwiperNextButton />
            </div>
          </Swiper>
        </div>
      </div>
    </section>
  );
}
