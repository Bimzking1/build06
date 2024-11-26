import Image from 'next/image';
import React, { useEffect, useState } from 'react';
const CarouselProfileDesktop: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [profileData, setProfileData] = useState<any[]>([]);
  const totalElements = 3;

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

  const handleLeftClick = (): void => {
    setSelectedIndex(
      prevIndex => (prevIndex - 1 + totalElements) % totalElements
    );
  };

  const handleRightClick = (): void => {
    setSelectedIndex(prevIndex => (prevIndex + 1) % totalElements);
  };

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
    <div className="flex xl:flex-row-reverse flex-col">
      <div
        onClick={handleLeftClick}
        className="bg-white rounded-[100px] w-[51px] h-[51px] cursor-pointer shadow-lg self-center p-[10px]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="33"
          viewBox="0 0 32 33"
          fill="none"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M11.057 7.55727C11.5777 7.03657 12.4219 7.03657 12.9426 7.55727L20.9426 15.5573C21.4633 16.078 21.4633 16.9222 20.9426 17.4429L12.9426 25.4429C12.4219 25.9636 11.5777 25.9636 11.057 25.4429C10.5363 24.9222 10.5363 24.078 11.057 23.5573L18.1142 16.5001L11.057 9.44289C10.5363 8.92219 10.5363 8.07797 11.057 7.55727Z"
            fill="url(#paint0_linear_15_3497)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_15_3497"
              x1="21.3332"
              y1="7.16675"
              x2="7.53058"
              y2="23.1203"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#7555DA" />
              <stop offset="1" stop-color="#4FE6AF" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div
        className={`${
          selectedIndex === 0 ? 'selected' : 'not-selected'
        } xl:flex hidden justify-center self-center rounded-full mx-auto my-7 border-r-4 border-[#7555DA]`}
      >
        <Image
          src={profileData[0]?.avatar}
          alt="image"
          width={200}
          height={200}
          className="self-center rounded-full"
        />
      </div>
      <div
        className={`${
          selectedIndex === 1 ? 'selected' : 'not-selected'
        } flex justify-center self-center rounded-full mx-auto my-7 border-r-4 border-[#7555DA]`}
      >
        <Image
          src={profileData[1]?.avatar}
          alt="image"
          width={200}
          height={200}
          className="self-center rounded-full"
        />
      </div>
      <div
        className={`${
          selectedIndex === 2 ? 'selected' : 'not-selected'
        } flex justify-center self-center rounded-full mx-auto my-7 border-r-4 border-[#7555DA]`}
      >
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
            {profileData[selectedIndex]?.name}
          </h1>
          <Icon />
        </div>
        <p className="text-[#7555DA] text-sm font-normal">
          {profileData[selectedIndex]?.label}
        </p>
        <p className="text-[#7C7C7C] text-base font-normal">
          {selectedIndex === 1
            ? 'Influencer, social-preneur, and 30 under 30 Forbes 2023 One of the greatest minds in the current Indonesian finance world focused on self-development, financial advice, leadership and even UX design.'
            : selectedIndex === 0
            ? 'Prominent Investor, Resolute CEO, and Forbes 30 Under 30 Honoree for 2023. Revered as a leading luminary in the Indonesian finance arena, with an unwavering commitment to shaping groundbreaking investment paradigms. Renowned for providing invaluable financial counsel, empowering leadership, and driving visionary growth within the realm of investment.'
            : 'Eminent Investor and Forbes 30 Under 30 Awardee in 2023. Celebrated as a driving force in the Indonesian finance landscape, specializing in astute investment strategies and financial acumen. Known for guiding individuals and organizations towards profitable investment decisions and achieving financial success.'}
        </p>
      </div>
      <div
        onClick={handleRightClick}
        className="bg-white rounded-[100px] w-[51px] h-[51px] cursor-pointer shadow-lg self-center p-[10px]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="33"
          viewBox="0 0 32 33"
          fill="none"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M20.9428 25.4427C20.4222 25.9634 19.5779 25.9634 19.0572 25.4427L11.0572 17.4427C10.5365 16.922 10.5365 16.0778 11.0572 15.5571L19.0572 7.55711C19.5779 7.03641 20.4222 7.03641 20.9428 7.55711C21.4635 8.07781 21.4635 8.92203 20.9428 9.44273L13.8857 16.4999L20.9428 23.5571C21.4635 24.0778 21.4635 24.922 20.9428 25.4427Z"
            fill="url(#paint0_linear_15_3473)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_15_3473"
              x1="10.6667"
              y1="25.8333"
              x2="24.4693"
              y2="9.8797"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#7555DA" />
              <stop offset="1" stop-color="#4FE6AF" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default CarouselProfileDesktop;
