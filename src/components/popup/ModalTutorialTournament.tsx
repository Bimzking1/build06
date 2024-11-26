/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
'use client';
import LanguageContext from '@/store/language/language-context';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { XIcon } from 'public/assets/vector';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/modal/Modal';

interface Props {
  onClose: () => void;
}

const ModalTutorialTournament: React.FC<Props> = ({ onClose }) => {
  const { t } = useTranslation();
  const languageCtx = useContext(LanguageContext);

  return (
    <Modal
      onClose={onClose}
      backdropClasses="z-40 fixed top-0 left-0 w-full h-screen bg-black/75 flex justify-start items-start"
      modalClasses="z-50 animate-slide-down fixed top-[35%] left-0 right-0 ml-auto mr-auto mt-[-12.35rem] w-full md:w-fit xl:w-[60%] h-[70vh] p-4 rounded-3xl shadow-[0 2px 8px rgba(0, 0, 0, 0.25)] bg-white"
    >
      <div className="w-full h-full relative">
        <div className="flex justify-between mb-2">
          <Typography className="font-bold text-lg text-[#3AC4A0]">
            {t('tournament.tutorialTournament')}
          </Typography>
        </div>
        <div className="bg-[#E9E9E9] w-[50px] rounded-full absolute bottom-[-80px] p-2 left-0 right-0 ml-auto mr-auto hover:scale-110 transition ease-out cursor-pointer hover:shadow-lg duration-300">
          <Image
            src={XIcon}
            alt="X"
            width={30}
            height={30}
            onClick={onClose}
            className="w-full"
          />
        </div>
        <iframe
          style={{ padding: 0, width: '100%', height: '90%' }}
          src={
            languageCtx.language === 'ID'
              ? 'https://drive.google.com/file/d/18yTyRMPI5BqFRJ3CAjSUNrC8z_QG0fpg/preview'
              : 'https://drive.google.com/file/d/19RbA9LE4MUVlHr1CsAX4LNq4BB-GR2JM/preview'
          }
          title={`${t('tournament.tutorialToournament')}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </Modal>
  );
};

export default ModalTutorialTournament;
