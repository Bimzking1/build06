'use client';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { XIcon } from 'public/assets/vector';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/modal/Modal';

interface Props {
  onClose: () => void;
  provider: string;
}

const RemoveLinkedAccountPopUp: React.FC<Props> = ({ onClose, provider }) => {
  const { t } = useTranslation();

  return (
    <Modal
      onClose={onClose}
      backdropClasses="z-20 fixed top-0 left-0 w-full h-screen bg-black/75 blur-xl"
    >
      <div className="flex justify-end">
        <Image
          src={XIcon}
          alt="X"
          width={30}
          height={30}
          onClick={onClose}
          className="hover:scale-110 transition ease-out cursor-pointer"
        />
      </div>
      <div className="flex flex-col gap-3 justify-center  px-8 pt-2 items-center text-center">
        <Typography className="font-bold text-xl text-black">
          {t('RemoveLinkedAccount.title', { provider })}
        </Typography>
        <Typography className="text-lg">
          {t('RemoveLinkedAccount.description')}
        </Typography>
      </div>
      <div className="flex flex-col gap-4">
        <div className="bg-[#DD2525] mt-5 w-full hover:bg-red-700 rounded-full hover:scale-105 transition ease-out">
          <Typography className="text-white text-lg font-bold text-center p-2">
            {t('RemoveLinkedAccount.removeButton')}
          </Typography>
        </div>

        <Typography
          onClick={onClose}
          className="text-center cursor-pointer hover:scale-105 transition ease-out text-[#7555DA] text-lg font-bold"
        >
          {t('RemoveLinkedAccount.cancelButton')}
        </Typography>
      </div>
    </Modal>
  );
};

export default RemoveLinkedAccountPopUp;
