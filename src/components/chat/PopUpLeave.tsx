'use client';
import { Textarea, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { leaveGroup } from 'public/assets/chat';
import { XIcon } from 'public/assets/vector';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/modal/Modal';

interface Props {
  onClose: () => void;
  onClick: (message: string) => Promise<void>;
}

const LeaveCommunityPopUp: React.FC<Props> = ({ onClose, onClick }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<number>(1);
  const [problemValue, setProblemValue] = useState<string>('');

  return (
    <Modal onClose={onClose}>
      {step === 1 ? (
        <>
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
              src={leaveGroup.src}
              alt="Leave Group"
              width={225}
              height={200}
              className="w-auto h-auto aspect-auto"
            />
            <Typography className="font-bold text-lg text-black">
              {t('chat.popUpLeave.Title')}
            </Typography>
            <Typography className="text-lg text-gray-500">
              {t('chat.popUpLeave.Description')}
            </Typography>
          </div>
          <div className="flex flex-col gap-4">
            <div
              onClick={() => {
                setStep(2);
              }}
              className="bg-[#DD2525] mt-5 w-full hover:bg-red-700 rounded-full hover:scale-105 transition ease-out"
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
        </>
      ) : (
        <>
          <div className="flex justify-between">
            <Typography className="font-bold text-lg text-black">
              {t('chat.popUpLeave.helpUs')}
            </Typography>
            <Image
              src={XIcon}
              alt="X"
              width={30}
              height={30}
              onClick={() => {
                onClose();
                setStep(1);
              }}
              className="hover:scale-110 transition ease-out cursor-pointer"
            />
          </div>
          <div className="w-full border-b border-[#E9E9E9] my-4" />
          <Textarea
            value={problemValue}
            onChange={e => {
              setProblemValue(e.target.value);
            }}
            variant="outlined"
            color="gray"
            label={t('chat.elaborate') ?? ''}
          />
          <div
            onClick={() => {
              void onClick(problemValue);
              setStep(1);
            }}
            className="bg-[#DD2525] mt-5 w-full hover:bg-red-700 rounded-full hover:scale-105 transition ease-out"
          >
            <Typography className="text-white text-lg font-bold text-center p-2">
              {t('chat.popUpLeave.continue')}
            </Typography>
          </div>
        </>
      )}
    </Modal>
  );
};

export default LeaveCommunityPopUp;
