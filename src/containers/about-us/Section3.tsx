import {
  AboutUsSectionThreeIcon1,
  AboutUsSectionThreeIcon2,
  AboutUsSectionThreeIcon3
} from '@/constants/assets/images';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import { Button } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';

const Section3: React.FC = () => {
  const { t } = useTranslation();
  const width = useWindowInnerWidth();
  const router = useRouter();
  const measurement = 400;
  const [isBottom, setBottom] = useState(0);
  const { ref, inView, entry } = useInView({
    threshold: 0.3
  });

  useEffect(() => {
    const bottom = entry?.boundingClientRect.bottom ?? 0;
    setBottom(bottom);
  }, [entry]);

  return (
    <div
      className="min-w-full font-poppins bg-gradient-to-r from-[#EDF2F700] to-[#E2E8F0] relative p-5"
      ref={ref}
    >
      <div
        className={`flex flex-col w-full items-center font-poppins mt-14 ${
          inView && isBottom >= measurement
            ? 'animate-fade-in-slide'
            : isBottom >= measurement
            ? 'animate-fade-out-slide'
            : ''
        }`}
      >
        <p className="text-3xl md:text-4xl text-center mt-10 font-semibold z-10 bg-clip-text text-transparent bg-gradient-to-r from-[#9A76FE] to-[#4FE6AF] xl:font-bold">
          {t('aboutUsV3.section3.title')}
        </p>

        {width !== undefined ? (
          width > 700 ? (
            <>
              <div className="absolute bg-[#7F64D8] blur-[120px] w-[200px] h-[200px] left-0 bottom-44 rounded-full"></div>
              <div className="absolute bg-[#7F64D8] blur-[170px] w-[200px] h-[200px] right-0 bottom-44 rounded-full"></div>
            </>
          ) : null
        ) : null}

        <div className="flex flex-col w-full items-center justify-center gap-7 font-poppins p-5 md:px-20 md:flex-row">
          <div className="flex flex-col items-center w-full md:w-1/3 mb-14 md:mb-0 p-5 text-center rounded-3xl">
            <Image
              src={AboutUsSectionThreeIcon1.src}
              alt={AboutUsSectionThreeIcon1.alt}
              width={200}
              height={200}
              className="w-[120%] h-[120%] md:w-[60%] md:h-[60%]"
            />
            <p className="font-normal text-xl md:text-3xl text-[#745AD9] text-center">
              {t('aboutUsV3.section3.option1.title')}
            </p>
            <p className="font-normal text-base md:text-lg">
              {t('aboutUsV3.section3.option1.subtitle')}
            </p>
          </div>

          <div className="flex flex-col items-center w-full md:w-1/3 mb-14 md:mb-0 p-5 text-center rounded-3xl">
            <Image
              src={AboutUsSectionThreeIcon2.src}
              alt={AboutUsSectionThreeIcon2.alt}
              width={200}
              height={200}
              className="w-[120%] h-[120%] md:w-[60%] md:h-[60%]"
            />
            <p className="font-normal text-xl md:text-3xl text-[#745AD9] text-center">
              {t('aboutUsV3.section3.option2.title')}
            </p>
            <p className="font-normal text-base md:text-lg">
              {t('aboutUsV3.section3.option2.subtitle')}
            </p>
          </div>

          <div className="flex flex-col items-center w-full md:w-1/3 mb-14 md:mb-0 p-5 text-center rounded-3xl">
            <Image
              src={AboutUsSectionThreeIcon3.src}
              alt={AboutUsSectionThreeIcon3.alt}
              width={200}
              height={200}
              className="w-[120%] h-[120%] md:w-[60%] md:h-[60%]"
            />
            <p className="font-normal text-xl md:text-3xl text-[#745AD9] text-center">
              {t('aboutUsV3.section3.option3.title')}
            </p>
            <p className="font-normal text-base md:text-lg">
              {t('aboutUsV3.section3.option3.subtitle')}
            </p>
          </div>
        </div>
        <Button
          className="text-xs px-12 font-semibold capitalize text-md bg-[#7555DA] rounded-full mb-10"
          onClick={() => {
            void router.push('auth/register');
          }}
        >
          Join Now
        </Button>
      </div>
    </div>
  );
};

export default Section3;
