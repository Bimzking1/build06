import { type Banner } from '@/utils/interfaces/play.interface';
import Image from 'next/image';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface OpenAccountProps {
  data: Banner;
  onClick: () => void;
}

const OpenAccountCard: React.FC<OpenAccountProps> = ({ data, onClick }) => {
  const { t } = useTranslation();
  return (
    <div
      onClick={onClick}
      className="w-[300px] border border-[#E9E9E9] rounded-lg overflow-hidden flex flex-col shadow-md cursor-pointer"
    >
      <Image
        alt="Open Account"
        src={data.image_url}
        width={290}
        height={141}
        className="w-full h-[140px]"
      />
      <div className="p-4 font-poppins flex flex-col gap-1">
        <p className="font-semibold">{data.title}</p>
        <p className="text-sm text-[#BDBDBD]">{t('openAccount.register')}</p>
      </div>
    </div>
  );
};

export default OpenAccountCard;
