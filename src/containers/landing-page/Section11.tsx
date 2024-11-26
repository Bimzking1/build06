import imageMobile from '@/assets/landing-page/section11(2).svg';
import imageDesktop from '@/assets/landing-page/section11.svg';
import { Button } from '@material-tailwind/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';

export default function Section11(): React.ReactElement {
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
      className="h-auto min-w-full relative font-poppins text-center"
    >
      <div
        className={`w-full lg:px-12 lg:py-32 py-12 font-poppins h-auto bg-gradient-to-r from-[#9A76FE29] to-[#4FE6AF29] ${
          inView && isBottom >= measurement
            ? 'animate-fade-in-slide'
            : isBottom >= measurement
            ? 'animate-fade-out-slide'
            : ''
        }`}
      >
        <div className="flex justify-between items-center flex-col lg:flex-row gap-5">
          <div className="hidden lg:block w-1/3">
            <div className="flex justify-center flex-col">
              <Image
                src={imageDesktop}
                alt={`Event`}
                width={300}
                height={300}
                className="w-[350px] h-[350px] mx-auto"
              />
              <div className="w-[300px] h-[20px] mx-auto bg-[#D9D9D9] rounded-full blur-md"></div>
            </div>
          </div>
          <div className="w-full lg:w-2/3 flex flex-col lg:text-left text-center lg:gap-4">
            <h1 className="font-poppins mx-8 lg:mx-0 text-3xl lg:text-5xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#9A76FE] to-[#4FE6AF]">
              {t('landingV2.section11.text1')}
            </h1>
            <h1 className="mt-3 mx-5 lg:mx-0 font-poppins text-2xl lg:text-2xl font-normal text-[#262626]">
              {t('landingV2.section11.text2')}
            </h1>
            <Link
              href={
                'https://linktr.ee/Seedsmarketing?utm_source=linktree_admin_share'
              }
            >
              <Button className="mt-5 px-16 lg:px-20 py-3 capitalize bg-[#3AC4A0] rounded-full">
                <p className="text-xl font-semibold">
                  {t('landingV2.section11.text4')}
                </p>
              </Button>
            </Link>
          </div>
          <div className="lg:hidden w-full">
            <Image
              src={imageMobile}
              alt={`Event`}
              width={300}
              height={300}
              className="w-[350px] h-[350px] mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
