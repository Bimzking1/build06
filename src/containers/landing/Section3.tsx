'use client';
import about from '@/assets/landing-page/about.png';
import gradient from '@/assets/landing-page/gradient-testi.png';
import shape from '@/assets/landing-page/shape.png';
import trophy from '@/assets/landing-page/trophy.png';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import { eventHighlightLandingPage } from '@/utils/_static/dummy';
import { Button } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import type { Settings } from 'react-slick';
import Slider from 'react-slick';
import Section2Card from './Section2Card';

export default function Section3(): React.ReactElement {
  const { t } = useTranslation();

  const router = useRouter();
  const width = useWindowInnerWidth();

  const settings: Settings = {
    centerMode: true,
    slidesToShow: 3,
    speed: 500,
    slidesToScroll: 1,
    dots: true,
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
          slidesToShow: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          dots: true,
          slidesToShow: 1
        }
      }
    ]
  };

  return (
    <div>
      <div className="mb-10 min-w-full cursor-default font-poppins">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 md:mt-20 xl:mt-[250px] mt-[100px] 2xl:mt-[25rem]">
            <div className="w-full justify-center p-5 lg:w-full md:ml-10 px-10">
              <div className="text-xl font-bold tracking-wider mb-3 md:text-3xl 2xl:text-6xl">
                <span className="mr-1 text-3xl font-semibold xl:text-[64px] bg-clip-text text-transparent bg-gradient-to-r from-[#9A76FE] to-[#4FE6AF] xl:font-bold z-30">
                  {t('landing.section3.text1')}
                </span>
              </div>
              <p className="text-2xl font-normal text-[#262626] xl:w-full">
                {t('landing.section3.text2')}
              </p>
              <Button
                className="text-xs px-12 mt-8 font-semibold capitalize text-md bg-seeds-purple rounded-full"
                onClick={() => {
                  void router.push('/auth/register');
                }}
              >
                {t('button.joinNow')}
              </Button>
            </div>
          </div>

          <div className="w-full cursor-default md:w-1/2">
            {/* <Image
              alt="img"
              className="absolute right-[440px] w-[25px] h-[25px] top-[625px] z-10 border-seeds-green border-2 rounded-full"
              src={user2}
            /> */}
            {/* <Image
              alt="img"
              className="absolute right-[340px] w-[25px] h-[25px] top-[165px] z-10"
              src={user2}
            /> */}
          </div>
          {/* <Image alt="img" 
                className="absolute right-0 translate-y-[17rem] w-[300px] h-[420px] md:translate-y-0" 
                src={line2} /> */}

          <Image
            alt="img"
            className={`absolute right-0 xl:translate-y-[200px] lg:translate-y-[200px] translate-y-[35rem] w-[250px]
              md:w-[300px] md:-translate-y-5 
              lg:w-[400px] 
              xl:w-[500px] ${width !== undefined && width >= 1690 ? '' : ''}`}
            src={shape}
          />
          <Image
            alt="img"
            className={`absolute right-0 xl:translate-y-[300px] lg:translate-y-[300px] lg:-translate-x-[100px] xl:-translate-x-[100px] translate-y-[35rem] w-[500px]
              md:w-[300px]  md:-translate-y-5 
              lg:w-[400px]
              xl:w-[540px] ${width !== undefined && width >= 1690 ? '' : ''}`}
            src={about}
          />
        </div>
      </div>
      <div className="flex flex-col-reverse xl:flex-row gap-[80px] items-center mx-auto w-[80%] xl:mt-[200px] mt-[400px]">
        <Image src={trophy} alt="trophy" className="w-[250px] h-[250px]" />
        <p className="text-2xl font-normal text-[#262626]">
          {t('landing.section3.text3')}
        </p>
      </div>
      <div className="flex flex-col xl:flex-row xl:gap-[80px] items-center justify-center mx-auto xl:px-[100px] px-6 mt-10 xl:mt-[100px]">
        <h1 className="text-5xl bg-clip-text text-transparent bg-gradient-to-r from-[#9A76FE] to-[#4FE6AF] font-bold">
          {t('landing.section3.text4')}
        </h1>
        <p className="text-2xl font-normal text-[#262626] xl:mt-0 mt-5 xl:w-[90%]">
          {t('landing.section3.text5')}
        </p>
        <Image
          src={gradient}
          alt="gradient"
          className="absolute translate-y-[200px]"
        />
      </div>
      <div className="w-full h-full mb-16 mt-10 mx-3 md:mx-20 lg:mx-6">
        <Slider {...settings}>
          {eventHighlightLandingPage.map((data, key) => (
            <Section2Card key={key} data={data} />
          ))}
        </Slider>
      </div>
    </div>
  );
}
