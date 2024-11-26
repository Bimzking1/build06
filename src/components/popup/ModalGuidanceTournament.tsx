/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
'use client';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { XIcon } from 'public/assets/vector';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/modal/Modal';

interface Props {
  onClose: () => void;
}

const ModalGuidanceTournament: React.FC<Props> = ({ onClose }) => {
  const { t } = useTranslation();

  return (
    <Modal
      onClose={onClose}
      backdropClasses="z-40 fixed top-0 left-0 w-full h-screen bg-black/75 flex justify-start items-start"
      modalClasses="z-50 animate-slide-down fixed bottom-0 md:top-[40%] md:left-[10%] md:right-[-10%] xl:left-[25%] xl:right-[-25%] mt-[-12.35rem] w-full md:w-[80%] xl:w-[50%] h-[70vh] xl:h-fit p-4 rounded-3xl shadow-[0 2px 8px rgba(0, 0, 0, 0.25)] bg-white overflow-y-scroll"
    >
      <div className="flex justify-between">
        <Typography className="font-bold text-lg text-[#3AC4A0]">
          {t('tournament.guidance.guidanceTitle')}
        </Typography>
        <Image
          src={XIcon}
          alt="X"
          width={30}
          height={30}
          onClick={onClose}
          className="hover:scale-110 transition ease-out cursor-pointer"
        />
      </div>
      <div className="mt-4">
        <Typography className="font-semibold font-poppins text-[#7C7C7C]">
          {t('tournament.guidance.goals')}
        </Typography>
        <Typography className="font-poppins text-[#7C7C7C] text-sm md:text-base">
          {t('tournament.guidance.goalsDescription')}
        </Typography>
      </div>
      <div className="mt-4">
        <Typography className="font-semibold font-poppins text-[#7C7C7C]">
          {t('tournament.guidance.howToPlay.title')}
        </Typography>
        <Typography className="flex font-poppins text-[#7C7C7C] text-sm md:text-base">
          <p className="mr-2">•</p>
          {t('tournament.guidance.howToPlay.text1')}
        </Typography>
        <Typography className="flex font-poppins text-[#7C7C7C] text-sm md:text-base">
          <p className="mr-2">•</p>
          {t('tournament.guidance.howToPlay.text2')}
        </Typography>
        <Typography className="flex font-poppins text-[#7C7C7C] text-sm md:text-base">
          <p className="mr-2">•</p>
          {t('tournament.guidance.howToPlay.text3')}
        </Typography>
        <Typography className="flex font-poppins text-[#7C7C7C] text-sm md:text-base">
          <p className="mr-2">•</p>
          {t('tournament.guidance.howToPlay.text4')}
        </Typography>
        <Typography className="flex font-poppins text-[#7C7C7C] text-sm md:text-base">
          <p className="mr-2">•</p>
          {t('tournament.guidance.howToPlay.text5')}
        </Typography>
        <Typography className="flex font-poppins text-[#7C7C7C] text-sm md:text-base">
          <p className="mr-2">•</p>
          {t('tournament.guidance.howToPlay.text6')}
        </Typography>
      </div>
      <div className="mt-4">
        <Typography className="font-semibold font-poppins text-[#7C7C7C]">
          {t('tournament.guidance.winner')}
        </Typography>
        <Typography className="font-poppins text-[#7C7C7C] text-sm md:text-base">
          {t('tournament.guidance.winnerDescription')}
        </Typography>
      </div>
      <div className="mt-4">
        <Typography className="font-semibold font-poppins text-[#7C7C7C]">
          {t('tournament.guidance.tips.title')}
        </Typography>
        <Typography className="flex font-poppins text-[#7C7C7C] text-sm md:text-base">
          <p className="mr-2">•</p>
          {t('tournament.guidance.tips.text1')}
        </Typography>
        <Typography className="flex font-poppins text-[#7C7C7C] text-sm md:text-base">
          <p className="mr-2">•</p>
          {t('tournament.guidance.tips.text2')}
        </Typography>
        <Typography className="flex font-poppins text-[#7C7C7C] text-sm md:text-base">
          <p className="mr-2">•</p>
          {t('tournament.guidance.tips.text3')}
        </Typography>
      </div>
    </Modal>
  );
};

export default ModalGuidanceTournament;
