'use client';
import {
  Bitcoin,
  Copy,
  Dogecoin,
  Ethereum,
  EyePurple
} from '@/constants/assets/icons';
import { Sprout } from '@/constants/assets/images';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import CCard from './CCard';
import DoughnutChart from './DoughnutChart';

const PostPie = (): JSX.Element => {
  const chartData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green'], // Adjust the labels array to match the length of the data array
    datasets: [
      {
        label: '',
        data: [10, 19, 32, 10],
        backgroundColor: ['red', 'blue', 'yellow', 'green'] // Adjust the backgroundColor array to match the length of the data array
      }
    ]
  };
  return (
    <CCard className="md:w-3/5 p-5 bg-[#F7FBFA]">
      <div className="flex gap-5 items-center">
        <Image
          src={''}
          alt="avatar"
          width={55}
          height={55}
          className="outline outline-[#5E44FF] rounded-full"
        />
        <div>
          <div className="flex gap-2 w-full">
            <Typography className="text-black sm:text-xs md:text-lg">
              Krisna Alifandi
            </Typography>
            <Image src={Sprout.src} alt={Sprout.alt} height={22} width={22} />
          </div>
          {/* <div className="flex items-center gap-2">
              <Typography>@ismael</Typography>
              <Image src={Dot.src} alt={Dot.alt} width={8} height={8} />
              <Typography>09/03/2023</Typography>
              <Image src={Dot.src} alt={Dot.alt} width={8} height={8} />
              <Typography>12.39 PM</Typography>
            </div> */}
        </div>
      </div>
      <div className="flex justify-between ">
        <div className="flex flex-col gap-3">
          <Typography className="mt-4  aspect-auto">Metaverse Receh</Typography>
          <div className="flex gap-1">
            <Image
              src={Ethereum.src}
              alt={Ethereum.alt}
              width={30}
              height={30}
            />
            <Image src={Bitcoin.src} alt={Bitcoin.alt} width={30} height={30} />
            <Image
              src={Dogecoin.src}
              alt={Dogecoin.alt}
              width={30}
              height={30}
            />
          </div>
          <Typography variant="paragraph" className="font-bold">
            Rp.63.100.120
          </Typography>
        </div>
        <div className="flex flex-col gap-3">
          <div className="w-[120px] lg:w-[180px] aspect-auto">
            <DoughnutChart data={chartData} centerText="+43%" />
          </div>
          <div className="flex justify-end">
            <div className="bg-[#5E44FF] flex gap-1 justify-center items-center mt-2 w-3/5 aspect-auto rounded-full p-2 ">
              <Image src={Copy.src} alt={Copy.alt} width={20} height={20} />
              <Typography className="text-white hidden md:flex">
                Copy Pie
              </Typography>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-2 w-full">
        <div className="flex gap-1 md:gap-3 items-center w-1/2">
          <Image
            src={EyePurple.src}
            alt={EyePurple.alt}
            height={25}
            width={25}
            className="aspect-auto"
          />
          <Typography className="text-sm">Friends Only</Typography>
        </div>
        <div>
          <Typography className="font-light text-sm text-gray-400">
            1/04/2022,19.05.50 WIB
          </Typography>
        </div>
      </div>
    </CCard>
  );
};

export default PostPie;
