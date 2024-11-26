'use client';
import { Arrow, Ellipse } from '@/constants/assets/icons';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import CCard from './CCard';

const SeedsCoin: React.FC = () => {
  return (
    <CCard className="bg-white outline  outline-[#3AC4A0]">
      <div className="flex gap-2">
        <Image
          src={Ellipse.src}
          alt={Ellipse.alt}
          width={90}
          height={90}
          className="object-cover mt-8 object-[bottom_center] self-end"
        />
        <div className="flex justify-between w-full pr-5">
          <div className="flex flex-col justify-center gap-2">
            <Typography className="lg:text-2xl text-gray-600">
              Seeds Coins
            </Typography>
            <Typography className="lg:text-2xl text-left font-bold text-[#3AC4A0]">
              750.000
            </Typography>
          </div>
          <Image src={Arrow.src} alt={Arrow.alt} width={20} height={20} />
        </div>
      </div>
    </CCard>
  );
};

export default SeedsCoin;
