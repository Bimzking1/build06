import Image from 'next/image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import OnGoingIcon from '../../../public/assets/team-battle/stage-ongoing.svg';

const LeaderboardNotFound: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex flex-col items-center justify-center font-semibold text-sm sm:text-base 2xl:text-lg">
        <Image
          src={OnGoingIcon}
          alt="not-found"
          width={500}
          height={500}
          className="w-60"
        />
        <div className="text-center">{t('teamBattle.leaderboardPopup')}</div>
      </div>
    </>
  );
};

export default LeaderboardNotFound;
