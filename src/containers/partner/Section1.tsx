import { SectionOneImageOne } from '@/constants/assets/images';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import { Button } from '@material-tailwind/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';

const Section1: React.FC = () => {
  const { t } = useTranslation();
  const width = useWindowInnerWidth();
  const measurement = 400;
  const [isBottom, setBottom] = useState(0);
  const { ref, inView, entry } = useInView({
    threshold: 0
  });

  useEffect(() => {
    const bottom = entry?.boundingClientRect.bottom ?? 0;
    setBottom(bottom);
  }, [entry]);

  return (
    <div
      className="md:mb-10 min-w-full font-poppins bg-[#F9F9F9] mt-20"
      ref={ref}
    >
      <div
        className={`flex flex-col md:flex-row w-full items-center font-poppins relative ${
          inView && isBottom >= measurement
            ? 'animate-fade-in-slide'
            : isBottom >= measurement
            ? 'animate-fade-out-slide'
            : ''
        }`}
      >
        <div className="w-full text-center md:text-left md:w-1/2 md:mt-[1rem] p-5 md:p-20 order-2 md:order-1">
          <p className="text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#9A76FE] to-[#4FE6AF] xl:font-bold">
            {t('partner.section1.title')}
          </p>
          <p className="text-base md:text-xl font-normal text-[#262626] mt-6">
            {t('partner.section1.text')}
          </p>
          <Button
            className="invisible text-xs px-12 md:mt-8 font-semibold capitalize text-md bg-[#3AC4A0] rounded-full md:visible"
            onClick={() => {
              window.open(
                'https://linktr.ee/seeds.finance',
                '_blank',
                'noopener noreferrer'
              );
            }}
          >
            {t('partner.section1.button')}
          </Button>
        </div>

        {width !== undefined ? (
          width > 700 ? (
            <>
              <div className="absolute bg-[#3AC4A0BF] blur-[150px] w-[200px] h-[200px] right-0 top-0 rounded-full"></div>
              <div className="absolute bg-[#7F64D8] blur-[150px] w-[200px] h-[200px] left-0 bottom-44 rounded-full"></div>
            </>
          ) : null
        ) : null}

        <div className="w-full p-5 md:w-1/2 mt-0 md:mt-[1rem] order-1 md:order-2 flex items-center justify-center">
          <Image
            src={SectionOneImageOne.src}
            alt="trophy"
            className="w-[450px] h-[450px]"
            width={100}
            height={100}
          />
        </div>
      </div>
    </div>
  );
};

export default Section1;
