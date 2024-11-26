import TrapezoidIconProduct from '@/assets/product/TrapezoidIconProduct.svg';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';

const NewSection5: React.FC = () => {
  const { t } = useTranslation();
  const measurement = 800;
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
      className="flex flex-col-reverse xl:flex-row gap-10 xl:pt-20 xl:pb-[35px] pt-10 pb-[21.85px] 2xl:items-start items-center justify-start md:bg-[#F9F9F9]"
    >
      <Image
        src={TrapezoidIconProduct}
        alt="TrapezoidIconProduct"
        className=" xl:-mr-[534px] xl:pt-6 -mt-[270px] sm:-mt-[380px] md:-mt-[449px] xl:mt-0 self-start"
      />
      <iframe
        style={{ padding: 0 }}
        src="https://www.youtube.com/embed/bdPIT9Y2THs?si=jbD5c6wSrUqZqYYY"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className={`aspect-video z-10 2xl:z-0 md:px-20  w-full md:w-[686px] ${
          inView && isBottom >= measurement
            ? 'animate-fade-in-slide'
            : isBottom >= measurement
            ? 'animate-fade-out-slide'
            : ''
        }`}
      ></iframe>
      <div
        className={`flex flex-col gap-6 xl:gap-0 2xl:w-[554px] md:w-[686px] px-4 2xl:px-0 2xl:pt-10 ${
          inView && isBottom >= measurement
            ? 'animate-fade-in-slide'
            : isBottom >= measurement
            ? 'animate-fade-out-slide'
            : ''
        }`}
      >
        <Typography className="font-poppins font-semibold lg:font-bold text-3xl lg:text-[64px] text-[#201B1C] lg:leading-[77.45px] text-center 2xl:text-left">
          {`${t('landingPageV2.product.section5.title1')}`} <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-tr to-[#7555DA] from-[#4FE6AF]">
            {`${t('landingPageV2.product.section5.title2')}`}
          </span>
        </Typography>
        <Typography className="font-normal font-poppins text-base lg:text-2xl text-[#262626] 2xl:pr-[45px] xl:text-justify text-center">
          {`${t('landingPageV2.product.section5.title3')}`}
        </Typography>
      </div>
    </section>
  );
};

export default NewSection5;
