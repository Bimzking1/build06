'use client';

import { Arrow } from '@/constants/assets/icons';
import {
  Sadling,
  Sapling,
  Seeds,
  Sprout,
  Tree
} from '@/constants/assets/images';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';

interface Reward {
  name: string;
  description: string;
}

interface Tier {
  image: string;
  name: string;
  rewards: Reward[];
  exp: number;
}

interface XpData {
  currentExp: number;
  nextExp: number;
  expExpiration: string;
  tierList: Tier[];
}

interface XpComponentProps {
  data: XpData;
  profileData?: any;
  id?: any;
  referralHistory?: any;
}

const ExpInfo: React.FC<XpComponentProps> = ({
  data,
  profileData,
  id,
  referralHistory
}) => {
  const width = useWindowInnerWidth();
  return (
    <>
      <div
        className={`${
          referralHistory === 'true' ? 'hidden' : 'flex'
        } items-center w-full md:w-[334px] gap-4`}
      >
        {data !== undefined && (
          <>
            <div className="flex flex-col justify-center items-center gap-2">
              <Image
                src={
                  data.currentExp >= 1000
                    ? Tree.src
                    : data.currentExp >= 500
                    ? Sapling.src
                    : data.currentExp >= 300
                    ? Sadling.src
                    : data.currentExp >= 200
                    ? Sprout.src
                    : Seeds.src
                }
                alt={'plant'}
                width={31}
                height={31}
              />
              <Typography className="text-[#201B1C] text-xs font-semibold font-poppins">
                {data.currentExp >= 1000
                  ? 'Tree'
                  : data.currentExp >= 500
                  ? 'Sapling'
                  : data.currentExp >= 300
                  ? 'Seedling'
                  : data.currentExp >= 200
                  ? 'Sprout'
                  : 'Seeds'}
              </Typography>
            </div>
            <div className="flex flex-col gap-2 w-full mr-2.5">
              <Typography className="leading-4 text-[#262626] text-[10px] font-bold font-poppins">
                {id != null ? profileData?.name : 'You'} have {data.currentExp}{' '}
                XP
              </Typography>
              <div className="relative">
                <div className="flex justify-between items-center">
                  <div
                    className={`rounded-full w-[15px] h-[15px] z-10 border-[2.75px] border-[#E9E9E9] ${
                      data.currentExp > 0 ? 'bg-[#3AC4A0]' : 'bg-[#E9E9E9]'
                    }`}
                  ></div>
                  <div
                    className={`rounded-full w-[15px] h-[15px] z-10 border-[2.75px] border-[#E9E9E9] ${
                      data.currentExp >= 200 ? 'bg-[#3AC4A0]' : 'bg-[#E9E9E9]'
                    }`}
                  ></div>
                  <div
                    className={`rounded-full w-[15px] h-[15px] z-10 border-[2.75px] border-[#E9E9E9] ${
                      data.currentExp >= 300 ? 'bg-[#3AC4A0]' : 'bg-[#E9E9E9]'
                    }`}
                  ></div>
                  <div
                    className={`rounded-full w-[15px] h-[15px] z-10 border-[2.75px] border-[#E9E9E9] ${
                      data.currentExp >= 500 ? 'bg-[#3AC4A0]' : 'bg-[#E9E9E9]'
                    }`}
                  ></div>
                  <div
                    className={`rounded-full w-[15px] h-[15px] z-10 border-[2.75px] border-[#E9E9E9] ${
                      data.currentExp >= 1000 ? 'bg-[#3AC4A0]' : 'bg-[#E9E9E9]'
                    }`}
                  ></div>
                  <div className="w-full rounded-full absolute bg-[#E9E9E9] h-[3px]"></div>
                  <div
                    className={`${
                      data.currentExp >= 1000
                        ? 'w-[100%]'
                        : data.currentExp >= 500
                        ? 'w-[75%]'
                        : data.currentExp >= 300
                        ? 'w-[50%]'
                        : data.currentExp >= 200
                        ? 'w-[25%]'
                        : ''
                    } ${
                      data.currentExp >= 0 && data.currentExp < 200
                        ? 'hidden'
                        : ''
                    } absolute rounded-full bg-[#3AC4A0] h-[3px]`}
                  ></div>
                </div>
              </div>
              <Typography className="leading-4 text-[10px] text-[#262626] font-poppins font-normal">
                {data.nextExp} XP to your next level!
              </Typography>
            </div>
            <Image src={Arrow.src} alt={Arrow.alt} height={24} width={24} />
          </>
        )}
      </div>
      {/* TODO: FOR REFERRAL HISTORY */}
      <div
        className={`${
          referralHistory === 'true' ? 'flex' : 'hidden'
        } items-center w-full gap-4`}
      >
        {data !== undefined && (
          <>
            <div className="flex flex-col justify-center items-center gap-2">
              <Image
                src={
                  data.currentExp >= 1000
                    ? Tree.src
                    : data.currentExp >= 500
                    ? Sapling.src
                    : data.currentExp >= 300
                    ? Sadling.src
                    : data.currentExp >= 200
                    ? Sprout.src
                    : Seeds.src
                }
                alt={'plant'}
                width={width !== undefined ? (width >= 1024 ? 42 : 31) : 31}
                height={width !== undefined ? (width >= 1024 ? 42 : 31) : 31}
              />
              <Typography className="text-[#201B1C] text-xs lg:text-base font-semibold font-poppins">
                {data.currentExp >= 1000
                  ? 'Tree'
                  : data.currentExp >= 500
                  ? 'Sapling'
                  : data.currentExp >= 300
                  ? 'Seedling'
                  : data.currentExp >= 200
                  ? 'Sprout'
                  : 'Seeds'}
              </Typography>
            </div>
            <div className="flex flex-col gap-2 w-full mr-2.5">
              <Typography className="text-[#262626] text-[10px] leading-4 lg:text-xl font-bold lg:font-semibold font-poppins">
                {id != null ? profileData?.name : 'You'} have {data.currentExp}{' '}
                XP
              </Typography>
              <div className="relative">
                <div className="flex justify-between items-center">
                  <div
                    className={`rounded-full w-[15px] lg:w-8 h-[15px] lg:h-8 z-10 border-[2.75px] lg:border-[6px] border-[#E9E9E9] ${
                      data.currentExp > 0 ? 'bg-[#3AC4A0]' : 'bg-[#E9E9E9]'
                    }`}
                  ></div>
                  <div
                    className={`rounded-full w-[15px] lg:w-8 h-[15px] lg:h-8 z-10 border-[2.75px] lg:border-[6px] border-[#E9E9E9] ${
                      data.currentExp >= 200 ? 'bg-[#3AC4A0]' : 'bg-[#E9E9E9]'
                    }`}
                  ></div>
                  <div
                    className={`rounded-full w-[15px] lg:w-8 h-[15px] lg:h-8 z-10 border-[2.75px] lg:border-[6px] border-[#E9E9E9] ${
                      data.currentExp >= 300 ? 'bg-[#3AC4A0]' : 'bg-[#E9E9E9]'
                    }`}
                  ></div>
                  <div
                    className={`rounded-full w-[15px] lg:w-8 h-[15px] lg:h-8 z-10 border-[2.75px] lg:border-[6px] border-[#E9E9E9] ${
                      data.currentExp >= 500 ? 'bg-[#3AC4A0]' : 'bg-[#E9E9E9]'
                    }`}
                  ></div>
                  <div
                    className={`rounded-full w-[15px] lg:w-8 h-[15px] lg:h-8 z-10 border-[2.75px] lg:border-[6px] border-[#E9E9E9] ${
                      data.currentExp >= 1000 ? 'bg-[#3AC4A0]' : 'bg-[#E9E9E9]'
                    }`}
                  ></div>
                  <div className="w-full rounded-full absolute bg-[#E9E9E9] h-[3px] lg:h-2"></div>
                  <div
                    className={`${
                      data.currentExp >= 1000
                        ? 'w-[100%]'
                        : data.currentExp >= 500
                        ? 'w-[75%]'
                        : data.currentExp >= 300
                        ? 'w-[50%]'
                        : data.currentExp >= 200
                        ? 'w-[25%]'
                        : ''
                    } ${
                      data.currentExp >= 0 && data.currentExp < 200
                        ? 'hidden'
                        : ''
                    } absolute rounded-full bg-[#3AC4A0] h-[3px]`}
                  ></div>
                </div>
              </div>
              <Typography className="leading-4 text-[10px] lg:text-base text-[#262626] font-poppins font-normal">
                {data.nextExp} XP to your next level!
              </Typography>
            </div>
            <Image
              src={Arrow.src}
              alt={Arrow.alt}
              height={width !== undefined ? (width >= 1024 ? 42 : 24) : 24}
              width={width !== undefined ? (width >= 1024 ? 42 : 24) : 24}
            />
          </>
        )}
      </div>
    </>
  );
};

export default ExpInfo;
