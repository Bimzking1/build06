import { Carousel, IconButton } from '@material-tailwind/react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
const CarouselProfileMobile: React.FC = () => {
  const [profileData, setProfileData] = useState<any[]>([]);
  const prevArrowRef = useRef<HTMLButtonElement | null>(null);
  const nextArrowRef = useRef<HTMLButtonElement | null>(null);

  const handlePrevClick = (): void => {
    prevArrowRef?.current?.click();
  };

  const handleNextClick = (): void => {
    nextArrowRef?.current?.click();
  };

  const devUrl = process?.env?.NEXT_PUBLIC_URL ?? '';
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const url: string = devUrl ?? '';
      if (url === '') {
        console.error('devUrl is an empty string.');
      } else {
        try {
          const response = await fetch(`${devUrl}/user/v1/verified`);
          if (response.ok) {
            const data = await response.json();
            setProfileData(data.data);
          } else {
            console.error('Error fetching data:', response.status);
          }
          return undefined;
        } catch (error) {
          console.error('Error fetching data:', error);
          return undefined;
        }
      }
      return undefined;
    };

    if (typeof devUrl === 'string' && devUrl !== '') {
      fetchData().catch(error => {
        console.error('Error fetching data:', error);
      });
    } else {
      console.error('devUrl is not a valid string or is an empty string.');
    }
  }, [devUrl, setProfileData]);
  function Icon(): JSX.Element {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <g clip-path="url(#clip0_38_10585)">
          <path
            d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z"
            fill="#5E44FF"
          />
          <path
            d="M4 8.00004L6.66667 10.6667L12 5.33337"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_38_10585">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  }

  return (
    <>
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
                onClick={() => {
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
            ref={prevArrowRef}
            className="!absolute top-2/4 -left-4 translate-y-3/4 hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="bg-white rounded-[100px] w-[51px] h-[51px] cursor-pointer shadow-lg self-center p-[10px]"
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
            ref={nextArrowRef}
            className="!absolute top-2/4 !right-4 -translate-y-2/4 hidden"
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
        <div className="flex xl:flex-row-reverse flex-col">
          <div className="flex selected justify-center self-center rounded-full mx-auto my-7 border-r-4 border-[#7555DA]">
            <Image
              src={profileData[0]?.avatar}
              alt="image"
              width={200}
              height={200}
              className="self-center rounded-full"
            />
          </div>
          <div className="flex flex-col gap-5 xl:w-[30%] xl:ml-5 xl:mt-7">
            <div className="flex flex-row items-center gap-3">
              <h1 className="bg-clip-text text-transparent bg-gradient-to-b from-[#7555DA] to-[#4FE6AF] text-xl font-semibold">
                {profileData[0]?.name}
              </h1>
              <Icon />
            </div>
            <p className="text-[#7555DA] text-sm font-normal">
              {profileData[0]?.label}
            </p>
            <p className="text-[#7C7C7C] text-base font-normal">
              Influencer, social-preneur, and 30 under 30 Forbes 2023 One of the
              greatest minds in the current Indonesian finance world focused on
              self-development, financial advice, leadership and even UX design.
            </p>
          </div>
        </div>
        <div className="flex xl:flex-row-reverse flex-col">
          <div className="flex selected justify-center self-center rounded-full mx-auto my-7 border-r-4 border-[#7555DA]">
            <Image
              src={profileData[1]?.avatar}
              alt="image"
              width={200}
              height={200}
              className="self-center rounded-full"
            />
          </div>
          <div className="flex flex-col gap-5 xl:w-[30%] xl:ml-5 xl:mt-7">
            <div className="flex flex-row items-center gap-3">
              <h1 className="bg-clip-text text-transparent bg-gradient-to-b from-[#7555DA] to-[#4FE6AF] text-xl font-semibold">
                {profileData[1]?.name}
              </h1>
              <Icon />
            </div>
            <p className="text-[#7555DA] text-sm font-normal">
              {profileData[1]?.label}
            </p>
            <p className="text-[#7C7C7C] text-base font-normal">
              Influencer, social-preneur, and 30 under 30 Forbes 2023 One of the
              greatest minds in the current Indonesian finance world focused on
              self-development, financial advice, leadership and even UX design.
            </p>
          </div>
        </div>
        <div className="flex xl:flex-row-reverse flex-col">
          <div className="flex selected justify-center self-center rounded-full mx-auto my-7 border-r-4 border-[#7555DA]">
            <Image
              src={profileData[2]?.avatar}
              alt="image"
              width={200}
              height={200}
              className="self-center rounded-full"
            />
          </div>
          <div className="flex flex-col gap-5 xl:w-[30%] xl:ml-5 xl:mt-7">
            <div className="flex flex-row items-center gap-3">
              <h1 className="bg-clip-text text-transparent bg-gradient-to-b from-[#7555DA] to-[#4FE6AF] text-xl font-semibold">
                {profileData[2]?.name}
              </h1>
              <Icon />
            </div>
            <p className="text-[#7555DA] text-sm font-normal">
              {profileData[2]?.label}
            </p>
            <p className="text-[#7C7C7C] text-base font-normal">
              Influencer, social-preneur, and 30 under 30 Forbes 2023 One of the
              greatest minds in the current Indonesian finance world focused on
              self-development, financial advice, leadership and even UX design.
            </p>
          </div>
        </div>
      </Carousel>
      <div className="flex flex-row float-right gap-4 mt-3">
        <div
          onClick={handlePrevClick}
          className="bg-white rounded-[100px] w-[30px] h-[30px] cursor-pointer shadow-lg self-center p-[7px]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M10.0033 11.1863C9.77597 11.4136 9.40737 11.4136 9.18002 11.1863L5.68706 7.69334C5.45971 7.466 5.45971 7.09739 5.68706 6.87004L9.18002 3.37709C9.40737 3.14974 9.77597 3.14974 10.0033 3.37709C10.2307 3.60443 10.2307 3.97304 10.0033 4.20038L6.92201 7.28169L10.0033 10.363C10.2307 10.5904 10.2307 10.959 10.0033 11.1863Z"
              fill="url(#paint0_linear_38_14408)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_38_14408"
                x1="5.51655"
                y1="11.3568"
                x2="11.543"
                y2="4.39118"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#7555DA" />
                <stop offset="1" stop-color="#4FE6AF" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div
          onClick={handleNextClick}
          className=" bg-gradient-to-b from-[#7555DA] to-[#4FE6AF] rounded-[100px] w-[30px] h-[30px] cursor-pointer shadow-lg self-center p-[8px]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.99668 3.8137C5.22403 3.58635 5.59263 3.58635 5.81998 3.8137L9.31294 7.30666C9.54029 7.534 9.54029 7.90261 9.31294 8.12996L5.81998 11.6229C5.59263 11.8503 5.22403 11.8503 4.99668 11.6229C4.76933 11.3956 4.76933 11.027 4.99668 10.7996L8.07799 7.71831L4.99668 4.637C4.76933 4.40965 4.76933 4.04105 4.99668 3.8137Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export default CarouselProfileMobile;
