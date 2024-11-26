import bg from '@/assets/landing-page/bg-howto.png';
import CarouselProfileDesktop from '@/components/carousel/CarouselProfileDesktop';
import CarouselProfileMobile from '@/components/carousel/CarouselProfileMobile';
import Image from 'next/image';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Section3(): React.ReactElement {
  const { t } = useTranslation();

  return (
    <>
      <Image
        src={bg}
        alt="bg"
        className="absolute xl:w-[600px] -z-10 xl:translate-y-[40rem] translate-y-[65rem]"
      />
      <div className="min-w-full cursor-default font-poppins px-[38px]">
        <h1 className="bg-clip-text text-transparent text-center bg-gradient-to-r from-[#7555DA] to-[#4FE6AF] xl:text-[64px] text-3xl xl:py-10 font-semibold">
          {t('landingPageV2.product.section4.title1')}
        </h1>
        <p className="mt-5 text-lg xl:text-2xl font-normal xl:px-[400px] text-center text-[#262626]">
          {t('landingPageV2.product.section4.title2')}
        </p>
        <div className="xl:block hidden">
          <CarouselProfileDesktop />
        </div>
        <div className="xl:hidden block">
          <CarouselProfileMobile />
        </div>
        <div className="mt-20 flex flex-col xl:flex-row-reverse xl:justify-between">
          <div className="flex flex-col xl:flex-col xl:w-[70%] xl:mt-10">
            <h1 className="text-[#201B1C] text-3xl font-semibold xl:font-bold xl:text-[64px] xl:py-5">
              {t('landingPageV2.product.section5.title1')}
            </h1>
            <h1 className="text-3xl font-semibold xl:font-bold xl:py-5 xl:text-[64px] bg-clip-text text-transparent bg-gradient-to-r from-[#7555DA] to-[#4FE6AF]">
              {t('landingPageV2.product.section5.title2')}
            </h1>
            <p className="text-[#262626] xl:text-2xl xl:font-normal text-lg font-normal mt-5">
              {t('landingPageV2.product.section5.title3')}
            </p>
          </div>
          <div className="w-full h-full my-6">
            <iframe
              className="xl:hidden block"
              width="299"
              height="183"
              src="https://www.youtube.com/embed/bdPIT9Y2THs"
            ></iframe>
            <iframe
              className="xl:block hidden"
              width="686"
              height="418"
              src="https://www.youtube.com/embed/bdPIT9Y2THs"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
}
