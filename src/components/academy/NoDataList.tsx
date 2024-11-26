import NoDataSeedy from '@/assets/academy/no-data-category.svg';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface NoDataListProps {
  title: string;
  description: string;
}

const NoDataList: React.FC<NoDataListProps> = ({ title, description }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col justify-center items-center">
      <Image
        src={NoDataSeedy}
        alt="No Data Categories Yet"
        width={200}
        height={200}
      />
      <Typography className="font-semibold text-base">{t(title)}</Typography>
      <Typography className="text-sm text-[#7C7C7C]">
        {t(description)}
      </Typography>
    </div>
  );
};

export default NoDataList;
