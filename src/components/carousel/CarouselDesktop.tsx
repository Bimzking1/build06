'use client';
import { Carousel, IconButton } from '@material-tailwind/react';
import Image from 'next/image';
interface Banner {
  id: string;
  name: string;
  external_url: string;
  image_url: string;
  type: string;
  title: string;
  description: string;
  tnc: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}
interface props {
  banner: Banner[];
}
const number = ['1', '2', '3', '4', '5', '6', '7'];
const handleItemClick = (link: string): void => {
  window.open(link, '_blank');
};
console.log(number);

const CarouselDesktop: React.FC<props> = ({ banner }) => {
  return (
    <Carousel
      loop={true}
      autoplay={true}
      autoplayDelay={3000}
      className=""
      navigation={({ setActiveIndex, activeIndex, length }) => (
        <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
          {new Array(length).fill('').map((_, i) => (
            <span
              key={i}
              className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                activeIndex === i ? 'w-8 bg-white' : 'w-4 bg-white/50'
              }`}
              onClick={(): void => {
                setActiveIndex(i);
              }}
            />
          ))}
        </div>
      )}
      prevArrow={({ handlePrev }) => (
        <IconButton
          variant="text"
          color="white"
          size="lg"
          onClick={handlePrev}
          className="!absolute top-2/4 left-4 -translate-y-2/4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-8 w-8 bg-[#3AC4A0] rounded-full p-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </IconButton>
      )}
      nextArrow={({ handleNext }) => (
        <IconButton
          variant="text"
          color="white"
          size="lg"
          onClick={handleNext}
          className="!absolute top-2/4 !right-4 -translate-y-2/4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-8 w-8 bg-[#3AC4A0] rounded-full p-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </IconButton>
      )}
    >
      {banner?.map((el: Banner, i: number) => {
        return (
          <Image
            src={el.image_url}
            key={`${el.id}${i}`}
            alt="image carousel"
            width={1430}
            height={900}
            className="mx-auto object-cover cursor-pointer"
            onClick={(): void => {
              handleItemClick(el.external_url);
            }}
          />
        );
      })}
    </Carousel>
  );
};

export default CarouselDesktop;
