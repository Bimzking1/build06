'use client';
import Sapling from '@/assets/landing-page/sapling.svg';
import Seedling from '@/assets/landing-page/seedling.svg';
import Seeds from '@/assets/landing-page/seeds.svg';
import Sprout from '@/assets/landing-page/sprout.svg';
import Tree from '@/assets/landing-page/tree.svg';
import { SectionSixImageOval } from '@/constants/assets/images';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';

export default function Section3(): React.ReactElement {
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

  return (
    <section
      ref={ref}
      className="h-auto min-w-full cursor-default font-poppins text-center relative overflow-hidden"
    >
      <div className="hidden lg:block absolute bg-[#BAFBD0] blur-[150px] w-[580px] h-[489px] right-[-25rem] top-[-10rem] rounded-full z-0"></div>

      <div
        className={`flex flex-col w-full items-center mt-5 lg:mt-20 font-poppins relative ${
          inView && isBottom >= measurement
            ? 'animate-fade-in-slide'
            : isBottom >= measurement
            ? 'animate-fade-out-slide'
            : ''
        }`}
      >
        <p className=" text-2xl lg:text-5xl mt-10 p-5 text-center font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#9A76FE] to-[#4FE6AF] xl:font-bold absolute z-10">
          {t('landingV2.section3.text1')} <br /> {t('landingV2.section3.text2')}
        </p>
        <Image
          src={SectionSixImageOval.src}
          alt={SectionSixImageOval.alt}
          width={400}
          height={100}
          className="w-[375px] h-[157px] top-5 lg:w-[836px] lg:h-[167px] md:top-5 relative z-1"
        />
      </div>
      <div className="lg:flex text-center items-center flex-row gap-5 mx-20 lg:my-12 md:flex md:justify-items-center">
        <div className="w-full justify-center lg:w-1/5 my-auto">
          <Image alt="img" className="mx-auto" src={Seeds} />
          <h1 className="font-poppins font-semibold text-lg mt-5 ">Seeds</h1>
          <h1 className="font-poppins text-base text-[#7C7C7C] mt-5">
            {t('landingV2.section3.text3')}
          </h1>
        </div>
        <div className="w-full justify-center lg:w-1/5 my-auto">
          <Image alt="img" className="mx-auto" src={Sprout} />
          <h1 className="font-poppins font-semibold text-lg mt-5 ">Sprout</h1>
          <h1 className="font-poppins text-base text-[#7C7C7C] mt-5">
            {t('landingV2.section3.text4')}
          </h1>
        </div>
        <div className="w-full justify-center lg:w-1/5 my-auto">
          <Image alt="img" className="mx-auto" src={Seedling} />
          <h1 className="font-poppins font-semibold text-lg mt-5 ">Seedling</h1>
          <h1 className="font-poppins text-base text-[#7C7C7C] mt-5">
            {t('landingV2.section3.text5')}
          </h1>
        </div>
        <div className="w-full justify-center lg:w-1/5 my-auto">
          <Image alt="img" className="mx-auto" src={Sapling} />
          <h1 className="font-poppins font-semibold text-lg mt-5 ">Sapling</h1>
          <h1 className="font-poppins text-base text-[#7C7C7C] mt-5">
            {t('landingV2.section3.text6')}
          </h1>
        </div>
        <div className="w-full justify-center lg:w-1/5 my-auto">
          <Image alt="img" className="mx-auto" src={Tree} />
          <h1 className="font-poppins font-semibold text-lg mt-5 ">Tree</h1>
          <h1 className="font-poppins text-base text-[#7C7C7C] mt-5">
            {t('landingV2.section3.text7')}
          </h1>
        </div>
      </div>
    </section>
  );
}
