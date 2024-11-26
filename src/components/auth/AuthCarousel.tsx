import AuthCarousel1 from '@/assets/auth/AuthCarousel1.png';
import AuthCarousel2 from '@/assets/auth/AuthCarousel2.png';
import AuthCarousel3 from '@/assets/auth/AuthCarousel3.png';
import AuthCarousel4 from '@/assets/auth/AuthCarousel4.png';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';

interface IAuthCarousel {
  className: string;
}

const carousel = [
  { name: 'AuthCarousel1', image: AuthCarousel1 },
  { name: 'AuthCarousel2', image: AuthCarousel2 },
  { name: 'AuthCarousel3', image: AuthCarousel3 },
  { name: 'AuthCarousel4', image: AuthCarousel4 }
];

const AuthCarousel: React.FC<IAuthCarousel> = ({
  className
}: IAuthCarousel) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const { t } = useTranslation();

  const settings = {
    dots: true,
    infinite: true,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 3000,
    beforeChange: (current: number, next: number) => {
      setActiveSlide(next);
    },
    customPaging: (i: number) => (
      <div
        className={`h-2.5 rounded-full ${
          activeSlide === i ? 'bg-[#B798FF] w-[18px]' : 'bg-[#E9E9E9] w-2.5'
        }`}
      ></div>
    )
  };

  return (
    <div
      className={`${className} justify-center items-center md:h-full h-fit p-4`}
    >
      <Slider {...settings} className="w-3/4">
        {carousel.map((value, index) => {
          return (
            <div key={index}>
              <div className="flex flex-col items-center md:gap-10 gap-5">
                <div className="flex flex-col gap-3 text-center">
                  <Typography className="font-semibold font-poppins xl:text-4xl text-xl text-white">
                    {t(`authCarousel.title.${index + 1}`)}
                  </Typography>
                  <Typography className="font-normal font-poppins xl:text-xl text-sm text-white">
                    {t(`authCarousel.subtitle.${index + 1}`)}
                  </Typography>
                </div>
                <Image
                  src={value.image}
                  alt={value.name}
                  className="max-w-[200px] md:max-w-[400px]"
                />
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default AuthCarousel;
