import { Button } from '@material-tailwind/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';

export default function Section12(): React.ReactElement {
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

  // const settings: Settings = {
  //   centerMode: true,
  //   slidesToShow: 1,
  //   speed: 15000,
  //   slidesToScroll: 3,
  //   autoplay: true,
  //   autoplaySpeed: 500,
  //   infinite: true,
  //   dots: false,
  //   responsive: [
  //     {
  //       breakpoint: 1024,
  //       settings: {
  //         dots: false,
  //         slidesToShow: 1
  //       }
  //     },
  //     {
  //       breakpoint: 768,
  //       settings: {
  //         dots: false,
  //         slidesToShow: 1
  //       }
  //     },
  //     {
  //       breakpoint: 480,
  //       settings: {
  //         dots: false,
  //         slidesToShow: 1
  //       }
  //     }
  //   ]
  // };

  return (
    <section
      ref={ref}
      className="h-auto min-w-full cursor-default relative font-poppins text-center"
    >
      <div
        className={`min-w-full h-auto cursor-default md:mt-4 text-start xl:text-center lg:mb-10 font-poppins bg-gradient-to-b from-[#EDF2F700]  to-[#E2E8F0] ${
          inView && isBottom >= measurement
            ? 'animate-fade-in-slide'
            : isBottom >= measurement
            ? 'animate-fade-out-slide'
            : ''
        }`}
      >
        <div className="mt-12 flex flex-col bg-white">
          <div className="flex flex-col w-full items-center text-center px-8 justify-center gap-5 lg:gap-4 font-poppins">
            <span className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-tr from-[#9A76FE] from-10% to-[#4FE6AF] to-100% md:text-4xl lg:text-5xl">
              {t('landingV2.section12.text1')}
            </span>
            <p className="text-md w-full lg:w-[70%] lg:text-2xl font-normal text-[#262626]">
              {t('landingV2.section12.text2')}
            </p>
            <Link
              href={
                'https://docs.google.com/forms/d/1-RI9IYyaO-5aPfS4BsTd2umTewQbh_kXVthWbys2Qdk/viewform?edit_requested=true'
              }
              target="_blank"
              className="cursor-pointer"
            >
              <Button
                className="lg:my-4 px-14 lg:px-10 bg-[#7555DA] rounded-full"
                onClick={() => {}}
              >
                <p className="text-lg font-semibold capitalize">
                  {t('landingV2.section12.text3')}
                </p>
              </Button>
            </Link>
          </div>
          <div>
            <div className="w-full hidden lg:block h-full">
              <Marquee direction="right" className="relative z-0">
                <div className="z-10 w-full">
                  <Image
                    src="/assets/images/IlustCommunities.png"
                    alt={`comunity`}
                    width={1440}
                    height={557}
                    className="w-full h-auto lg:block hidden"
                  />
                </div>
                <div className="z-10 w-full">
                  <Image
                    src="/assets/images/IlustCommunities.png"
                    alt={`comunity`}
                    width={1440}
                    height={557}
                    className="w-full h-auto lg:block hidden"
                  />
                </div>
                <div className="z-10 w-full">
                  <Image
                    src="/assets/images/IlustCommunities.png"
                    alt={`comunity`}
                    width={1440}
                    height={557}
                    className="w-full h-auto lg:block hidden"
                  />
                </div>
              </Marquee>
              <div className="absolute z-10 bottom-0 w-full h-[30%] blur-md bg-gradient-to-t from-[#E2E8F0] to-transparent"></div>
            </div>
            <div className="w-full lg:hidden h-full mt-4 bg-white">
              <Marquee direction="right" className="relative z-0">
                <div className="z-10 w-full">
                  <Image
                    src="/assets/images/communities-image-section.png"
                    alt={`comunity`}
                    width={1440}
                    height={400}
                    className="w-[1400px] h-[436px] object-contain"
                  />
                </div>
              </Marquee>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
