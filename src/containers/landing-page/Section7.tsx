import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useEffect, useState, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Johnny from '../../assets/landing-page/Johnny.jpg';
import Willy from '../../assets/landing-page/Willy.jpg';
import arvin from '../../assets/landing-page/arvin.jpg';
import Syanne from '../../assets/landing-page/syanne.jpg';

interface badges {
  name: string;
  desc: string;
}
export default function Section6(): React.ReactElement {
  const { t } = useTranslation();

  const [isBottom, setBottom] = useState(0);
  const measurement = 900;

  const { ref, inView, entry } = useInView({
    threshold: 0.2
  });
  useEffect(() => {
    const bottom = entry?.boundingClientRect.bottom ?? 0;
    setBottom(bottom);
    return () => {};
  }, [entry]);

  const persons = [
    {
      image: Johnny,
      name: 'Johnny',
      desc: 'CEO of Ringan, Seeds Strategic Advisor'
    },
    {
      image: Willy,
      name: 'Willy',
      desc: 'CEO'
    },
    {
      image: arvin,
      name: 'Arvin',
      desc: 'Investment Journalist'
    },
    {
      image: Syanne,
      name: 'Syanne',
      desc: 'Investment Analyst & Journalist TBA'
    }
  ];

  const autoplaySwiper = {
    delay: 1500
  };

  const breakpointsSwiper = {
    320: { slidesPerView: 1 },
    480: { slidesPerView: 2 },
    640: { slidesPerView: 3 },
    840: { slidesPerView: 3 }
  };

  const BadgesBottom = ({ name, desc }: badges): ReactElement => {
    return (
      <div className="flex rounded-b-[25px] p-8 h-24 bg-gradient-to-tr from-[#9A76FE] to-[#4FE6AF] py-3 px-2">
        <div className="flex flex-col items-start justify-center text-start py-3 px-2">
          <Typography className="font-poppins text-white font-bold">
            {name}
          </Typography>
          <Typography className="font-poppins text-white font-bold">
            {desc}
          </Typography>
        </div>
      </div>
    );
  };

  return (
    <section
      ref={ref}
      className="h-auto min-w-full cursor-default relative font-poppins text-center"
    >
      <div
        className={`h-auto min-w-full mt-20 font-poppins cursor-default text-center ${
          inView && isBottom >= measurement
            ? 'animate-fade-in-slide'
            : isBottom >= measurement
            ? 'animate-fade-out-slide'
            : ''
        }`}
      >
        <div className="justify-center items-center text-center">
          <div className=" w-full z-10 mt-5">
            <h1 className="font-poppins font-semibold text-3xl lg:text-5xl mt-5 bg-clip-text text-transparent bg-gradient-to-r from-[#9A76FE] to-[#4FE6AF]">
              {t('landingV2.section7.text1')}
            </h1>
            <h1 className="lg:text-2xl text-base font-normal mt-5 font-poppins text-[#262626]">
              {t('landingV2.section7.text2')}
            </h1>
          </div>
        </div>

        <div className="lg:flex-col lg:flex lg:justify-evenly lg:items-center mb-20 md:mt-16 max-w-full">
          <Swiper
            modules={[Autoplay, Pagination]}
            pagination={{ dynamicBullets: true }}
            autoplay={autoplaySwiper}
            loop={true}
            slidesPerView={3}
            spaceBetween={25}
            breakpoints={breakpointsSwiper}
            className="max-w-[1000px]"
            centeredSlides={true}
          >
            {persons?.length !== 0
              ? persons?.map((data, idx) => (
                  <SwiperSlide
                    key={idx}
                    className="lg:!flex-col lg:!items-center lg:!justify-center"
                  >
                    <div className="flex flex-col justify-center items-center">
                      <Image
                        src={data.image}
                        alt={`Event`}
                        width={300}
                        height={300}
                        className="w-[300px] h-[300px] lg:mx-8"
                      />
                    </div>
                    <BadgesBottom name={data.name} desc={data.desc} />
                  </SwiperSlide>
                ))
              : null}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
