'use client';
// import chat from '@/assets/landing-page/chat-us.png';
import Community from '@/assets/landing-page/community.svg';
import Event from '@/assets/landing-page/event.svg';
import learn from '@/assets/landing-page/learn.png';
import play from '@/assets/landing-page/play.png';
import Register from '@/assets/landing-page/register.svg';
import earth from '@/assets/landing-page/s2-earth.png';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import { webCounter } from '@/repository/web.repository';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';

export default function Section2(): React.ReactElement {
  const { t } = useTranslation();
  const width = useWindowInnerWidth();
  const [isBottom, setBottom] = useState(0);
  const measurement = 900;
  const [totalEvent, setTotalEvent] = useState<number>(0);
  const [totalRegister, setTotalRegister] = useState<number>(0);
  const [totalCircle, setTotalCircle] = useState<number>(0);

  const { ref, inView, entry } = useInView({
    threshold: 0.2
  });
  useEffect(() => {
    const bottom = entry?.boundingClientRect.bottom ?? 0;
    setBottom(bottom);
  }, [entry]);

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
    <div
      ref={ref}
      className=" bg-white items-center justify-center px-4 w-full relative overflow-hidden"
    >
      <div
        className={`h-auto min-w-full mt-8 cursor-default font-poppins ${
          inView && isBottom >= measurement
            ? 'animate-fade-in-slide'
            : isBottom >= measurement
            ? 'animate-fade-out-slide'
            : ''
        }`}
      >
        <div className="hidden lg:block absolute bg-[#BAFBD0] blur-[150px] w-[580px] h-[580px] left-[-28rem] top-[20rem] rounded-full z-0"></div>
        <div className="hidden lg:block absolute bg-[#BAFBD0] blur-[150px] w-[580px] h-[489px] right-[-25rem] top-[40rem] rounded-full z-0"></div>

        <div className="flex flex-col w-full items-center justify-center font-poppins p-5 md:flex-row">
          <div className="flex flex-row items-center w-full justify-start mb-5">
            <div className="bg-[#DCFCE4] rounded-full p-2 md:p-5">
              <Image
                src={Community}
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
                src={Register}
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
            <div className="bg-[#DCFCE4] rounded-full p-2 md:p-5">
              <Image
                src={Event}
                alt="trophy"
                className="w-[40px] h-[40px] md:w-[66px] md:h-[66px]"
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
        <div className="flex relative flex-col lg:p-5 items-center justify-center">
          <div className="flex flex-row w-full items-center justify-center md:mb-8 lg:mb-6 xl:mb-4 mb-5 sm:mb-20 font-poppins">
            <span className="xl:text-[72px] text-[30px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#9A76FE] to-[#4FE6AF] mr-2 md:text-5xl lg:text-7xl xl:pb-4">
              {t('landing.section2.text1a')}
            </span>
            <span className="xl:text-[72px] text-[30px] font-poppins font-semibold text-[#262626] mr-2 md:text-5xl lg:text-7xl xl:pb-4">
              {t('landing.section2.text1b')}
            </span>
            <span className="xl:text-[72px] text-[30px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#9A76FE] to-[#4FE6AF] md:text-5xl lg:text-7xl xl:pb-4">
              {t('landing.section2.text1c')}
            </span>
          </div>

          <div
            className={`w-full flex flex-col items-center justify-center ${
              width !== undefined && width >= 1690 ? '2xl:mt-2' : ''
            }`}
          >
            <Image
              alt="img"
              className="absolute w-[128px] top-10 lg:top-[10%] translate-x-3/4 2xl:top-1/2 xl:right-52 xl:w-[240px]"
              src={earth}
            />
            <div className="flex flex-col xl:flex-row gap-16 mx-auto mt-[15vh]">
              <section className="bg-[#FFF] border-[#DADADA] border-2 px-[33px] pb-[76px] xl:mt-5 w-[331px] h-[356px] text-center font-poppins rounded-[45px] shadow-lg shadow-[#5e44ff66]">
                <Image
                  alt="image"
                  src={play}
                  width={200}
                  className="absolute translate-x-[15%] -translate-y-[52%]"
                />
                <h1 className="text-[#182430] text-4xl font-semibold mt-[100px]">
                  {t('landing.section2.text3a')}
                </h1>
                <p className="text-[#182430] leading-[30px] text-base font-normal mt-6">
                  {t('landing.section2.text3b')}
                </p>
              </section>
              <section className="bg-[#FFF] border-[#DADADA] border-2 px-[33px] pb-[76px] w-[331px] h-[356px] text-center font-poppins rounded-[45px] xl:mt-5 mt-20 shadow-lg shadow-[#5e44ff66]">
                <Image
                  alt="image"
                  src={learn}
                  width={200}
                  className="absolute translate-x-[15%] -translate-y-[52%]"
                />
                <h1 className="text-[#182430] text-4xl font-semibold  mt-[100px]">
                  {t('landingV2.section2.text1')}
                </h1>
                <p className="text-[#182430] leading-[30px] text-base font-normal mt-6">
                  {t('landingV2.section2.text2')}
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
