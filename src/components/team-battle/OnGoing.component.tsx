import Image from 'next/image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import OnGoingIcon from '../../../public/assets/team-battle/stage-ongoing.svg';

interface OnGoingStageProps {
  startDate: string;
  endDate: string;
  stageName: string;
}

const OnGoingStage: React.FC<OnGoingStageProps> = ({
  startDate,
  endDate,
  stageName
}) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex flex-col gap-3 items-center justify-center font-semibold text-sm sm:text-base 2xl:text-lg">
        <Image
          src={OnGoingIcon}
          alt="on-going"
          width={500}
          height={500}
          className="w-60"
        />
        <div className="text-center">
          {t('teamBattle.stagePage.onGoing', { data: stageName })}
        </div>
        <div className="text-center">
          {startDate} - {endDate}
        </div>
      </div>
    </>
  );
};

export default OnGoingStage;
