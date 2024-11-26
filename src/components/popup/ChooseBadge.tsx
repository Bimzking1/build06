'use client';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import {
  BronzeMedalIcon,
  GoldMedalIcon,
  SilverMedalIcon,
  XIcon
} from 'public/assets/vector';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/modal/Modal';

interface Props {
  onClose: () => void;
  selectedMedal: string;
  onChangeMedalHandle: (medal: string) => void;
}

const ChooseBadgePopUp: React.FC<Props> = ({
  onClose,
  selectedMedal,
  onChangeMedalHandle
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      onClose={onClose}
      backdropClasses="z-20 fixed top-0 left-0 w-full h-screen bg-black/75 blur-xl"
    >
      <div className="flex justify-between">
        <Typography className="text-lg font-bold text-black">
          {t('ChooseBadge.title')}
        </Typography>
        <Image
          src={XIcon}
          alt="X"
          width={30}
          height={30}
          onClick={onClose}
          className="hover:scale-110 hover:bg-gray-200 rounded-lg transition ease-out cursor-pointer"
        />
      </div>
      <div className="flex flex-col gap-4">
        <Typography className="text-gray-600 text-left">
          {t('ChooseBadge.description')}
        </Typography>

        <div className="flex justify-around p-8">
          <div
            className={`${
              selectedMedal === 'gold'
                ? 'outline outline-seeds-button-green '
                : ''
            } hover:bg-gray-200 rounded-lg hover:scale-110 cursor-pointer transition ease-in-out`}
            onClick={() => {
              onChangeMedalHandle('gold');
              onClose();
            }}
          >
            <Image
              src={GoldMedalIcon}
              alt={'gold-medal'}
              width={20}
              height={20}
              className="w-10 h-10"
            />
          </div>
          <div
            className={`${
              selectedMedal === 'silver'
                ? 'outline outline-seeds-button-green '
                : ''
            } hover:bg-gray-200 rounded-lg hover:scale-110 cursor-pointer transition ease-in-out`}
            onClick={() => {
              onChangeMedalHandle('silver');
              onClose();
            }}
          >
            <Image
              src={SilverMedalIcon}
              alt={'silver-medal'}
              width={20}
              height={20}
              className="w-10 h-10"
            />
          </div>
          <div
            className={`${
              selectedMedal === 'bronze'
                ? 'outline outline-seeds-button-green '
                : ''
            } hover:bg-gray-200 rounded-lg hover:scale-110 cursor-pointer transition ease-in-out`}
            onClick={() => {
              onChangeMedalHandle('bronze');
              onClose();
            }}
          >
            <Image
              src={BronzeMedalIcon}
              alt={'bronze-medal'}
              width={20}
              height={20}
              className="w-10 h-10"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ChooseBadgePopUp;
