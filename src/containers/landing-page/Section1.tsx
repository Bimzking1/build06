import animationAppsSeedsWeb from '@/constants/animationAppsSeedsWeb.json';
import { downloadOurApp } from '@/utils/_static';
import { Button, Typography } from '@material-tailwind/react';
import Lottie from 'lottie-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function Section1(): React.ReactElement {
  const { t } = useTranslation();
  const router = useRouter();
  const measurement = 400;
  const [isBottom, setBottom] = useState(0);
  const { ref, inView, entry } = useInView({
    threshold: 0
  });
  useEffect(() => {
    const bottom = entry?.boundingClientRect.bottom ?? 0;
    setBottom(bottom);
  }, [entry]);

  const titles = [
    t('landingV2.section1.text7'),
    t('landingV2.section1.text8'),
    t('landingV2.section1.text9')
  ];

  return (
    <section
      ref={ref}
      className="flex md:flex-row w-full justify-end sm:justify-center 2xl:justify-between"
    >
      <div
        className={`w-full lg:m-12 h-auto font-poppins cursor-default ${
          inView && isBottom >= measurement
            ? 'animate-fade-in-slide'
            : isBottom >= measurement
            ? 'animate-fade-out-slide'
            : ''
        }`}
      >
        <div className="hidden lg:block absolute bg-[#BAFBD0] blur-[150px] w-[350px] h-[350px] left-[-10rem] top-[14rem] rounded-full z-0"></div>
        <div className="hidden lg:block absolute bg-[#BAFBD0] blur-[180px] w-[650px] h-[650px] right-[-20rem] top-[-15rem] rounded-full z-0"></div>
        <div className="hidden lg:block absolute bg-[#C5ACFF] blur-[450px] w-[750px] h-[750px] left-[-18rem] top-[-15rem] rounded-full z-0"></div>
        <div className="hidden lg:block absolute bg-[#C5ACFF] blur-[150px] w-[350px] h-[350px] right-[-10rem] top-[14rem] rounded-full z-0"></div>

        <div className="flex flex-col md:flex-row ">
          <div className="lg:hidden  ">
            <div className="lg:flex lg:min-w-full lg:justify-center lg:h-auto flex justify-center w-min-full h-auto">
              <Lottie
                animationData={animationAppsSeedsWeb}
                className="h-[450px]"
              />
            </div>
          </div>

          <div className="lg:justify-start lg:items-start pt-10 flex lg:w-1/2 z-10 w-full justify-center items-center">
            <div className="flex flex-col">
              <div className="lg:text-start lg:justify-start text-center flex justify-center overflow-hidden">
                <h1 className="font-poppins text-3xl lg:text-[48px] font-semibold xl:mb-3 md:mb-8">
                  {t('landingV2.section1.text1')}{' '}
                  <span className="font-poppins text-3xl lg:text-[48px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#9A76FE] to-[#4FE6AF] mr-2 xl:py-3">
                    {t('landingV2.section1.text2')}{' '}
                  </span>{' '}
                  {t('landingV2.section1.text3')} <br></br>
                  <p className="font-poppins text-3xl lg:text-[48px] font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#9A76FE] to-[#4FE6AF] mr-2 xl:py-3">
                    {t('landingV2.section1.text4')}
                  </p>{' '}
                </h1>
              </div>
              <div className="flex flex-col gap-3 lg:items-start justify-end items-center max-w-full">
                <Swiper
                  direction={'vertical'}
                  grabCursor={true}
                  autoplay={{ delay: 1000 }}
                  modules={[Autoplay]}
                  speed={1500}
                  className="lg:flex lg:w-[550px] overflow-hidden lg:text-start lg:h-[85px] h-7 text-center"
                  loop={true}
                >
                  {titles.length !== 0
                    ? titles.map((title, index) => {
                        return (
                          <SwiperSlide key={index} className="">
                            <Typography className="font-poppins md:text-xl text-base lg:w-full w-full lg:text-4xl font-semibold text-[#3AC4A0] break-words whitespace-normal overflow-hidden">
                              {title}
                            </Typography>
                          </SwiperSlide>
                        );
                      })
                    : null}
                </Swiper>
                <Button
                  className="text-xs w-1/2 z-10 font-semibold capitalize text-md bg-[#3AC4A0] rounded-full"
                  onClick={() => {
                    void router.push('/auth');
                  }}
                >
                  <Typography className="w-full">
                    {t('landingV2.section1.text6')}
                  </Typography>
                </Button>
              </div>
              <div className="flex py-5 lg:z-10 justify-around items-center lg:justify-start lg:items-start">
                {downloadOurApp
                  .filter((_, i) => i <= 1)
                  .map((data, key) => (
                    <div
                      key={key}
                      className="flex flex-col items-center md:mr-5"
                    >
                      <Link key={key} href={data.url}>
                        <Image alt="" src={data.icon} />
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="hidden lg:block lg:w-1/2">
            <div className="lg:flex lg:min-w-full lg:justify-center lg:h-auto w-min-full h-auto">
              <Lottie
                animationData={animationAppsSeedsWeb}
                className="h-[450px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
