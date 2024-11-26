import NoDataSeedy from '@/assets/academy/no-data-category.svg';
import { type CategoryAcademyI } from '@/utils/interfaces/academy.interface';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import React from 'react';

const CategoryCourseCard: React.FC<{ data: CategoryAcademyI }> = ({ data }) => {
  return (
    <div className="flex flex-col justify-center items-center bg-[#DCFCE4] rounded-2xl py-6">
      <Typography className="font-semibold text-sm lg:text-lg">
        {data.title}
      </Typography>
      <Typography className="text-xs lg:text-base text-[#7C7C7C]">
        {data.level.length} levels
      </Typography>
      <Image
        src={data?.banner === '' ? NoDataSeedy : data?.banner}
        alt={data.title}
        width={125}
        height={125}
        className="w-[100px] h-[100px] lg:w-[125px] lg:h-[125px]"
      />
    </div>
  );
};

export default CategoryCourseCard;
