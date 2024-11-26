'use client';

import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { QuizWinnerAlert, XIcon } from 'public/assets/vector';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/modal/Modal';

interface Props {
  onClose: () => void;
  quizName: string;
  winningPosition: number;
  ordinalName: string;
  language: string;
  winningLink: string;
}

const ModalQuizWinnerAlert: React.FC<Props> = ({
  onClose,
  quizName,
  winningPosition,
  ordinalName,
  language,
  winningLink
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      onClose={onClose}
      topPlacement="top-[40%]"
      backdropClasses="z-40 fixed top-0 left-0 w-full h-screen bg-black/50 flex justify-start items-start"
    >
      <div className="w-full flex justify-end items-end">
        <Image
          src={XIcon}
          alt="X"
          width={30}
          height={30}
          onClick={onClose}
          className="hover:scale-110 transition ease-out cursor-pointer"
        />
      </div>

      <div className="flex flex-col justify-center px-2 lg:px-8 items-center text-center">
        <Typography className="text-2xl text-black font-bold">
          {t('quiz.winnerAlertMessage1')}
        </Typography>
        <div className="w-[200px] h-auto">
          <Image
            src={QuizWinnerAlert}
            alt="X"
            width={100}
            height={100}
            onClick={onClose}
            className="w-full h-auto"
          />
        </div>

        <Typography className="text-md text-black mt-2">
          {t('quiz.winnerAlertMessage2')}
        </Typography>
        <div className="flex justify-center items-center gap-1">
          <Typography className="font-bold text-md text-black">
            {t('quiz.winnerAlertMessage3')}
          </Typography>
          <Typography className="font-bold text-md text-black">
            {winningPosition}
            {language === 'EN' ? ordinalName : ''}
          </Typography>
          <Typography className="text-md text-black">
            {t('quiz.winnerAlertMessage4')}
          </Typography>
        </div>
        <Typography className="font-bold text-lg text-black italic">
          {quizName}
        </Typography>
        <a
          href={winningLink}
          target="_blank"
          className="bg-seeds-button-green text-white rounded-full cursor-pointer py-2 px-4 mt-4 mb-2 hover:opacity-80 hover:scale-110 duration-300"
        >
          {t('quiz.winnerAlertMessage6')}
        </a>
        <Typography className="text-sm text-black mt-4">
          {t('quiz.winnerAlertMessage5')}
        </Typography>
      </div>
    </Modal>
  );
};

export default ModalQuizWinnerAlert;
