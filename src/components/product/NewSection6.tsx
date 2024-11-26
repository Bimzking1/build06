import AppStore from '@/assets/product/AppStore.svg';
import FrameProductPhone from '@/assets/product/FrameProductPhone.svg';
import GooglePlay from '@/assets/product/GooglePlay.svg';
import MockiPhone from '@/assets/product/MockiPhone.png';
import StarRating from '@/assets/product/StarRating.svg';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import SplashProduct from '@/assets/product/SplashProduct.svg';
import SplashProductMobile from '@/assets/product/SplashProductMobile.svg';
import { downloadOurApp } from '@/utils/_static';
import { useTranslation } from 'react-i18next';

const NewSection6: React.FC = () => {
  const { t } = useTranslation();
  const measurement = 900;
  const [isBottom, setBottom] = useState(0);
  const { ref, inView, entry } = useInView({
    threshold: 0.2
  });
  useEffect(() => {
    const bottom = entry?.boundingClientRect.bottom ?? 0;
    setBottom(bottom);
  }, [entry]);
  return (
    <section
      ref={ref}
      className="flex flex-col xl:flex-row justify-between items-center xl:pl-20 py-10 md:bg-[#F9F9F9]"
    >
      <div className={`flex flex-col xl:gap-[60px] gap-6 px-4 xl:px-0`}>
        <Typography
          className={`font-semibold font-poppins text-3xl lg:text-[64px] text-[#262626] lg:leading-[64px] text-center xl:text-left ${
            inView && isBottom >= measurement
              ? 'animate-fade-in-slide'
              : isBottom >= measurement
              ? 'animate-fade-out-slide'
              : ''
          }`}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-tr to-[#7555DA] from-[#4FE6AF]">
            {`${t('landingPageV2.product.section6.title1')}`}
          </span>
          <br />
          {`${t('landingPageV2.product.section6.title2')}`}
        </Typography>
        <Typography
          className={`font-normal font-poppins text-base lg:text-2xl text-[#262626] xl:w-[693px] text-center xl:text-left ${
            inView && isBottom >= measurement
              ? 'animate-fade-in-slide'
              : isBottom >= measurement
              ? 'animate-fade-out-slide'
              : ''
          }`}
        >
          {`${t('landingPageV2.product.section6.title3')}`}
        </Typography>
        <div
          className={`lg:flex hidden gap-8 justify-center xl:justify-start ${
            inView && isBottom >= measurement
              ? 'animate-fade-in-slide'
              : isBottom >= measurement
              ? 'animate-fade-out-slide'
              : ''
          }`}
        >
          <Link
            target="blank"
            href={
              'https://apps.apple.com/id/app/seeds-investing-together/id6443659980'
            }
          >
            <Image src={AppStore} alt="AppStore" />
          </Link>
          <Link
            target="blank"
            href={
              'https://play.google.com/store/apps/details?id=com.seeds.investment'
            }
          >
            <Image src={GooglePlay} alt="GooglePlay" />
          </Link>
        </div>
        <div
          className={`flex lg:hidden gap-6 justify-center ${
            inView && isBottom >= measurement
              ? 'animate-fade-in-slide'
              : isBottom >= measurement
              ? 'animate-fade-out-slide'
              : ''
          }`}
        >
          {downloadOurApp
            .filter((data, i) => i <= 1)
            .map((data, key) => (
              <Link target="_blank" key={key} href={data.url}>
                <Image alt={data.icon} src={data.icon} />
              </Link>
            ))}
        </div>
        <div
          className={`flex lg:gap-[38px] gap-[26.07px] justify-center xl:justify-start ${
            inView && isBottom >= measurement
              ? 'animate-fade-in-slide'
              : isBottom >= measurement
              ? 'animate-fade-out-slide'
              : ''
          }`}
        >
          <div className="flex lg:gap-5 gap-[13.72px]">
            <Typography className="font-semibold font-poppins lg:text-5xl text-[32.93px] leading-[32.93px] text-[#201B1C]">
              4.9
            </Typography>
            <div>
              <Image
                src={StarRating}
                alt="StarRating"
                className="lg:w-[116px] w-[79.57px]"
              />
              <Typography className="font-normal font-poppins lg:text-base text-[10.98px] leading-[16.46px] text-[#262626]">
                328+ reviews
              </Typography>
            </div>
          </div>
          <div className="flex lg:gap-5 gap-[13.72px]">
            <Typography className="font-semibold font-poppins lg:text-5xl text-[32.93px] leading-[32.93px] text-[#201B1C]">
              5.0
            </Typography>
            <div>
              <Image
                src={StarRating}
                alt="StarRating"
                className="lg:w-[116px] w-[79.57px]"
              />
              <Typography className="font-normal font-poppins lg:text-base text-[10.98px] leading-[16.46px] text-[#262626]">
                2k+ reviews
              </Typography>
            </div>
          </div>
        </div>
        <Image
          src={MockiPhone}
          alt="MockiPhone"
          className="self-center flex xl:hidden z-10 w-[235.07px] lg:w-[310px] shadow-2xl  shadow-[#272827] rounded-[48px]"
        />
      </div>
      <div className="relative flex self-end">
        <Image
          src={SplashProduct}
          alt="SplashProduct"
          className="lg:flex hidden -mt-[650px] xl:mt-0 z-0"
        />
        <Image
          src={SplashProductMobile}
          alt="SplashProductMobile"
          className="flex lg:hidden -mt-[528.91px] z-0"
        />
        <Image
          src={FrameProductPhone}
          alt="FrameProductPhone"
          className={`xl:w-2/3 2xl:w-fit absolute hidden xl:flex top-[53px] 2xl:top-[73px] right-[63px] ${
            inView && isBottom >= measurement
              ? 'animate-fade-in-slide'
              : isBottom >= measurement
              ? 'animate-fade-out-slide'
              : ''
          }`}
        />
        <Image
          src={MockiPhone}
          alt="MockiPhone"
          className={`xl:flex hidden w-2/3 2xl:w-[310px] absolute top-[30px] right-[81px] z-10 shadow-2xl  shadow-[#272827] rounded-[48px] ${
            inView && isBottom >= measurement
              ? 'animate-fade-in-slide'
              : isBottom >= measurement
              ? 'animate-fade-out-slide'
              : ''
          }`}
        />
      </div>
    </section>
  );
};

export default NewSection6;
