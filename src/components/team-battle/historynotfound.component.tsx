import Image from 'next/image';
import NotFoundImage from 'public/assets/team-battle/notfound.svg';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface HistoryNotFoundProps {
  text: string;
}

const HistoryNotFound: React.FC<HistoryNotFoundProps> = ({ text }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex flex-col items-center justify-center font-semibold text-sm sm:text-base 2xl:text-lg my-14">
        <Image
          src={NotFoundImage}
          alt="not-found"
          width={500}
          height={500}
          className="w-60"
        />
        <div>{t('teamBattle.history.notFound', { data: text })}</div>
      </div>
    </>
  );
};

export default HistoryNotFound;
