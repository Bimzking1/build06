'use client';
import { Trash } from '@/constants/assets/images';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { XIcon } from 'public/assets/vector';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/modal/Modal';

interface Props {
  onClose: () => void;
}

const DeleteAccountPopUp: React.FC<Props> = ({ onClose }) => {
  const { t } = useTranslation();

  return (
    <Modal onClose={onClose}>
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
        <Image
          src={Trash.src}
          alt={Trash.alt}
          width={20}
          height={20}
          className="w-auto h-auto aspect-auto"
        />
        <Typography className="font-bold text-lg text-black">
          {t('DeleteAccount.title')}
        </Typography>
        <Typography className="text-lg text-gray-500">
          {t('DeleteAccount.description')}
        </Typography>
      </div>
      <div className="flex flex-col gap-4">
        <div className="bg-[#DD2525] mt-5 w-full hover:bg-red-700 rounded-full hover:scale-105 transition ease-out">
          <Typography className="text-white text-lg font-bold text-center p-2">
            {t('DeleteAccount.confirmButton')}
          </Typography>
        </div>

        <Typography
          onClick={onClose}
          className="text-center cursor-pointer hover:scale-105 transition ease-out text-[#7555DA] text-lg font-bold"
        >
          {t('DeleteAccount.cancelButton')}
        </Typography>
      </div>
    </Modal>
  );
};

export default DeleteAccountPopUp;
