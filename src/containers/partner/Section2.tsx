import {
  SectionTwoIconCalendar,
  SectionTwoIconCap,
  SectionTwoIconUser,
  SectionTwoImagePartnership
} from '@/constants/assets/images';
import { webCounter } from '@/repository/web.repository';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import type { Settings } from 'react-slick';
import Slider from 'react-slick';

const Section2: React.FC = () => {
  const { t } = useTranslation();
  const [totalEvent, setTotalEvent] = useState<number>(0);
  const [totalRegister, setTotalRegister] = useState<number>(0);
  const [totalCircle, setTotalCircle] = useState<number>(0);
  const measurement = 400;
  const [isBottom, setBottom] = useState(0);
  const { ref, inView, entry } = useInView({
    threshold: 0.3
  });

  useEffect(() => {
    const bottom = entry?.boundingClientRect.bottom ?? 0;
    setBottom(bottom);
  }, [entry]);

  const images = [
    SectionTwoImagePartnership.src,
    SectionTwoImagePartnership.src,
    SectionTwoImagePartnership.src,
    SectionTwoImagePartnership.src
  ];

  const settings: Settings = {
    centerMode: true,
    slidesToShow: 1,
    speed: 25000,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 500,
    infinite: true,
    dots: false
  };

  const fetchCounter = async (): Promise<void> => {
    try {
      const response = await webCounter();
      setTotalEvent(response.total_event);
      setTotalCircle(response.total_circle);
      setTotalRegister(response.total_user);
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    void fetchCounter();
  }, []);

  return (
    <div className="bg-white min-w-full font-poppins" ref={ref}>
      <div
        className={`${
          inView && isBottom >= measurement
            ? 'animate-fade-in-slide'
            : isBottom >= measurement
            ? 'animate-fade-out-slide'
            : ''
        }`}
      >
        <div className="flex flex-col w-full items-center justify-center gap-7 font-poppins p-5 md:p-20 md:flex-row">
          <div className="flex flex-row items-center w-full justify-start mb-5">
            <div className="bg-[#DCFCE4] rounded-full p-2 md:p-5">
              <Image
                src={SectionTwoIconCap.src}
                alt="trophy"
                className="w-[40px] h-[40px] md:w-[66px] md:h-[66px] rounded-full"
                width={100}
                height={100}
              />
            </div>
            <div className="flex flex-col ml-4">
              <p className="text-2xl md:text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#9A76FE] to-[#4FE6AF]">
                <CountUp end={totalCircle} duration={3} />+
              </p>
              <p className="text-base md:text-xl font-normal">
                {t('partner.section2.option1')}
              </p>
            </div>
          </div>

          <div className="flex flex-row items-center w-full md:justify-center mb-5">
            <div className="bg-[#DCFCE4] rounded-full p-2 md:p-5">
              <Image
                src={SectionTwoIconUser.src}
                alt="trophy"
                className="w-[40px] h-[40px] md:w-[66px] md:h-[66px] rounded-full"
                width={100}
                height={100}
              />
            </div>
            <div className="flex flex-col ml-4">
              <p className="text-2xl md:text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#9A76FE] to-[#4FE6AF]">
                <CountUp end={totalRegister} duration={3} />+
              </p>
              <p className="text-base md:text-xl font-normal">
                {t('partner.section2.option2')}
              </p>
            </div>
          </div>

          <div className="flex flex-row items-center w-full md:justify-end mb-5">
            <div className="bg-[#DCFCE4] rounded-full p-3 md:p-5">
              <Image
                src={SectionTwoIconCalendar.src}
                alt="trophy"
                className="w-[40px] h-[40px] md:w-[66px] md:h-[66px] rounded-sm md:rounded-2xl"
                width={100}
                height={100}
              />
            </div>
            <div className="flex flex-col ml-4">
              <p className="text-2xl md:text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#9A76FE] to-[#4FE6AF]">
                <CountUp end={totalEvent} duration={3} />+
              </p>
              <p className="text-base md:text-xl font-normal">
                {t('partner.section2.option3')}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full items-center font-poppins mt-10">
          <p className="text-3xl md:text-4xl text-center font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#9A76FE] to-[#4FE6AF] xl:font-bold">
            Our Partnership
          </p>
          <div className="relative w-full h-[450px] md:h-[270px] lg:h-[350px] xl:h-[420px] overflow-hidden">
            <Slider {...settings}>
              {images?.length !== 0
                ? images?.map((data, idx) => (
                    <div key={idx}>
                      <Image
                        src={data}
                        alt="trophy"
                        width={100}
                        height={100}
                        className="w-full h-[30rem] md:h-full object-cover"
                      />
                    </div>
                  ))
                : null}
            </Slider>
            <div className="absolute bottom-0 w-full h-[25%] bg-gradient-to-t from-white to-transparent"></div>
          </div>
          {/* <div className="relative w-full h-[450px] md:h-[400px] overflow-hidden">
            <div className="w-full h-full object-cover">
              <Image
                src={SectionTwoImagePartnership.src}
                alt="trophy"
                width={100}
                height={100}
                className="absolute w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 w-full h-[25%] bg-gradient-to-t from-white to-transparent"></div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Section2;
