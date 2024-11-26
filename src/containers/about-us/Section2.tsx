import {
  AboutUsSectionTwoIcon1,
  AboutUsSectionTwoIcon2,
  AboutUsSectionTwoIcon3,
  AboutUsSectionTwoIcon4,
  SectionSixImageOval
} from '@/constants/assets/images';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';

const Section2: React.FC = () => {
  const { t } = useTranslation();
  const width = useWindowInnerWidth();
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
    <div className="min-w-full font-poppins bg-white relative p-5" ref={ref}>
      <div
        className={`flex flex-col w-full items-center font-poppins relative ${
          inView && isBottom >= measurement
            ? 'animate-fade-in-slide'
            : isBottom >= measurement
            ? 'animate-fade-out-slide'
            : ''
        }`}
      >
        <p className="text-3xl md:text-4xl mt-10 p-5 text-center font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#9A76FE] to-[#4FE6AF] xl:font-bold absolute z-10">
          {t('aboutUsV3.section2.title')}
        </p>
        <Image
          src={SectionSixImageOval.src}
          alt={SectionSixImageOval.alt}
          width={400}
          height={100}
          className="w-[400px] h-[120px] top-5 md:w-[600px] md:top-7 relative z-1"
        />

        {width !== undefined ? (
          width > 700 ? (
            <>
              <div className="absolute bg-[#3AC4A0BF] blur-[150px] w-[200px] h-[200px] left-0 top-[9rem] rounded-full"></div>
              <div className="absolute bg-[#7F64D8] blur-[150px] w-[200px] h-[200px] right-0 top-[28rem] rounded-full"></div>
              <div className="absolute bg-[#3AC4A0BF] blur-[150px] w-[200px] h-[200px] left-0 bottom-[4rem] rounded-full"></div>
            </>
          ) : null
        ) : null}

        <div className="flex flex-col mt-10">
          <div className="flex flex-row w-full items-center md:px-6 mb-5">
            <div className="w-1/3 mr-3 flex justify-center">
              <Image
                src={AboutUsSectionTwoIcon4.src}
                alt={AboutUsSectionTwoIcon4.alt}
                width={200}
                height={200}
                className="w-[120%] h-[120%] md:w-[60%] md:h-[60%]"
              />
            </div>
            <div className="w-2/3 text-left">
              <p className="text-lg text-black md:text-3xl font-semibold mb-2">
                {t('aboutUsV3.section2.option1.title')}
              </p>
              <p className="text-sm text-[#7C7C7C] md:text-xl font-normal">
                {t('aboutUsV3.section2.option1.subtitle')}
              </p>
            </div>
          </div>

          <div className="flex flex-row w-full items-center px-6 mb-5">
            <div className="w-2/3 text-left">
              <p className="text-lg text-black md:text-3xl font-semibold mb-2">
                {t('aboutUsV3.section2.option2.title')}
              </p>
              <p className="text-sm text-[#7C7C7C] md:text-xl font-normal">
                {t('aboutUsV3.section2.option2.subtitle')}
              </p>
            </div>
            <div className="w-1/3 ml-3 flex justify-center">
              <Image
                src={AboutUsSectionTwoIcon3.src}
                alt={AboutUsSectionTwoIcon3.alt}
                width={200}
                height={200}
                className="w-[120%] h-[120%] md:w-[60%] md:h-[60%]"
              />
            </div>
          </div>

          <div className="flex flex-row w-full items-center px-6 mb-5">
            <div className="w-1/3 mr-3 flex justify-center">
              <Image
                src={AboutUsSectionTwoIcon2.src}
                alt={AboutUsSectionTwoIcon2.alt}
                width={200}
                height={200}
                className="w-[120%] h-[120%] md:w-[60%] md:h-[60%]"
              />
            </div>
            <div className="w-2/3 text-left">
              <p className="text-lg text-black md:text-3xl font-semibold mb-2">
                {t('aboutUsV3.section2.option3.title')}
              </p>
              <p className="text-sm text-[#7C7C7C] md:text-xl font-normal">
                {t('aboutUsV3.section2.option3.subtitle')}
              </p>
            </div>
          </div>

          <div className="flex flex-row w-full items-center px-6 mb-5">
            <div className="w-2/3 text-left">
              <p className="text-xl text-black md:text-3xl font-semibold mb-2">
                {t('aboutUsV3.section2.option5.title')}
              </p>
              <p className="text-sm text-[#7C7C7C] md:text-xl font-normal">
                {t('aboutUsV3.section2.option5.subtitle')}
              </p>
            </div>
            <div className="w-1/3 ml-3 flex justify-center">
              <Image
                src={AboutUsSectionTwoIcon1.src}
                alt={AboutUsSectionTwoIcon1.alt}
                width={200}
                height={200}
                className="w-[120%] h-[120%] md:w-[60%] md:h-[60%]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section2;
