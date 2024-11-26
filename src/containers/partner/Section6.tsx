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
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

const Section6: React.FC = () => {
  const { t } = useTranslation();
  const width = useWindowInnerWidth();
  const sliderRef = useRef<Slider>(null);
  const measurement = 400;
  const [isBottom, setBottom] = useState(0);
  const { ref, inView, entry } = useInView({
    threshold: 0.3
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

  const settings = {
    // centerMode: true,
    slidesToShow: 3,
    speed: 2000,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    dots: false,
    // nextArrow: <NextBtn />,
    // prevArrow: <PrevBtn />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
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
    <div className="relative min-w-full font-poppins bg-[#F9F9F9]" ref={ref}>
      <div
        className={`flex flex-col w-full items-center ${
          inView && isBottom >= measurement
            ? 'animate-fade-in-slide'
            : isBottom >= measurement
            ? 'animate-fade-out-slide'
            : ''
        }`}
      >
        <p className="text-3xl md:text-4xl mt-10 p-5 text-center font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#9A76FE] to-[#4FE6AF] xl:font-bold absolute z-10">
          {t('partner.section6.title')}
        </p>
        <Image
          src={SectionSixImageOval.src}
          alt={SectionSixImageOval.alt}
          width={400}
          height={100}
          className="w-[300px] h-[100px] top-7 md:w-[500px] md:top-7 relative z-1"
        />
        {width !== undefined ? (
          width > 700 ? (
            <>
              <div className="absolute bg-[#3AC4A0BF] blur-[150px] w-[300px] h-[300px] left-0 top-[10rem] rounded-full"></div>
              <div className="absolute bg-[#7F64D8] blur-[150px] w-[300px] h-[300px] right-0 top-[10rem] rounded-full"></div>
            </>
          ) : null
        ) : null}

        <div className="w-full mt-6 mb-20 md:mt-16 md:px-20">
          <Slider ref={sliderRef} {...settings}>
            {events?.length !== 0
              ? events?.map((data, idx) => (
                  <div
                    key={idx}
                    className="w-full  mx-5 lg:w-1/3  justify-center items-center "
                  >
                    <Image
                      src={data.image}
                      alt={`Event ${idx + 1}`}
                      width={350}
                      height={350}
                      className="w-[350px] h-[350px]"
                    />
                  </div>
                ))
              : null}
          </Slider>
          <div className="flex justify-end lg:justify-center mt-3 lg:mt-2 mx-3">
            <button
              className="rounded-full lg:p-2 border lg:mx-6 mx-2 p-1 border-1 border-[#4FE6AF]"
              onClick={handlePrevious}
            >
              <Image src={prev} alt="Previous" className="cursor-pointer" />
            </button>
            <button
              className="rounded-full lg:p-2 lg:mx-6 border mx-2 p-1 border-1 border-[#4FE6AF]"
              onClick={handleNext}
            >
              <Image src={next} alt="Next" className="cursor-pointer" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section6;
