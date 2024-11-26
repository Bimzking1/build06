'use client';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { XIcon } from 'public/assets/vector';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/modal/Modal';

interface Props {
  onClose: () => void;
  onMute: (type: string) => Promise<void>;
}

const MutePopUp: React.FC<Props> = ({ onClose, onMute }) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState<number | null>(7);

  const handleMuteClick = (): void => {
    if (selectedOption === 7) {
      void onMute('eight_hours');
    }
    if (selectedOption === 14) {
      void onMute('one_week');
    }
    if (selectedOption === 30) {
      void onMute('');
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="flex justify-between mb-3">
        <div>
          <h1 className="text-lg text-left font-semibold font--poppins text-[#262626]">
            {t('chat.muteNotificationTitle')}
          </h1>
          <h1 className="text-sm text-left text-[#7C7C7C] font-poppins font-normal">
            {t('chat.muteNotificationSubtitle')}
          </h1>
        </div>
        <Image
          src={XIcon}
          alt="X"
          width={30}
          height={30}
          onClick={onClose}
          className="hover:scale-110 transition ease-out cursor-pointer"
        />
      </div>
      <hr></hr>
      <div className="">
        <label className="flex items-center justify-between p-2 ">
          8 hours
          <input
            type="radio"
            name="muteDuration"
            value={7}
            checked={selectedOption === 7}
            onChange={() => {
              setSelectedOption(7);
            }}
            className="mr-2"
          />
        </label>
        <label className="flex items-center justify-between p-2 ">
          1 Week
          <input
            type="radio"
            name="muteDuration"
            value={14}
            checked={selectedOption === 14}
            onChange={() => {
              setSelectedOption(14);
            }}
            className="mr-2"
          />
        </label>
        <label className="flex items-center justify-between p-2">
          Always
          <input
            type="radio"
            name="muteDuration"
            value={30}
            checked={selectedOption === 30}
            onChange={() => {
              setSelectedOption(30);
            }}
            className="mr-2"
          />
        </label>
      </div>
      <hr></hr>
      <div className="flex flex-col gap-4">
        <div
          onClick={handleMuteClick}
          className="bg-[#3AC4A0] mt-5 w-full hover:bg-[#3AC4A0] rounded-full hover:scale-105 transition ease-out"
        >
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

export default MutePopUp;
