'use client';
import { Textarea, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { XIcon } from 'public/assets/vector';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/modal/Modal';

interface Props {
  onClose: () => void;
}

const DeleteAccountReasonPopUp: React.FC<Props> = ({ onClose }) => {
  const { t } = useTranslation();

  const [, setSelectedValue] = useState<string>('');

  const [textAreaShown, setTextAreaShown] = useState<boolean>(false);
  const [otherValue, setOtherValue] = useState<string>('');

  const handleRadioChange = (event: any): void => {
    setSelectedValue(event.target.value);
  };

  console.log(otherValue);

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
      {textAreaShown ? (
        <div className="flex flex-col animate-slide-down">
          <Typography className="text-lg font-bold text-left">
            {t('DeleteReasonAccountPopUp.title2')}
          </Typography>
          <Textarea
            value={otherValue}
            onChange={e => {
              setOtherValue(e.target.value);
            }}
            variant="outlined"
            color="gray"
            label="Please write and elaborate your problem"
          />
        </div>
      ) : (
        <>
          <div className="flex justify-center transition-opacity duration-500">
            <Typography className="font-bold text-lg md:px-5">
              {t('DeleteReasonAccountPopUp.title')}
            </Typography>
          </div>
          <div className="flex flex-col mt-2 gap-3">
            <div className="flex justify-between">
              <Typography className="text-lg">
                {t('DeleteReasonAccountPopUp.option1')}
              </Typography>
              <input
                type="radio"
                value={"I don't like the app"}
                onChange={handleRadioChange}
                id="radioButton01"
                name="radioGroup"
                className="appearance-none w-6 h-6 rounded-full border border-gray-500 checked:bg-seeds-green checked:border-white focus:outline-none ring-2 ring-seeds-green"
              />
            </div>
            <div className="flex justify-between">
              <Typography className="text-lg">
                {t('DeleteReasonAccountPopUp.option2')}
              </Typography>
              <input
                type="radio"
                id="radioButton01"
                value={"There's too many bugs"}
                onChange={handleRadioChange}
                name="radioGroup"
                className="appearance-none w-6 h-6 rounded-full border border-gray-500 checked:bg-seeds-green checked:border-white focus:outline-none ring-2 ring-seeds-green"
              />
            </div>
            <div className="flex justify-between">
              <Typography className="text-lg">
                {t('DeleteReasonAccountPopUp.option3')}
              </Typography>
              <input
                type="radio"
                id="radioButton01"
                name="radioGroup"
                onClick={() => {
                  setTextAreaShown(prev => !prev);
                }}
                className="appearance-none w-6 h-6 rounded-full border border-gray-500 checked:bg-seeds-green checked:border-white focus:outline-none ring-2 ring-seeds-green"
              />
            </div>
          </div>
        </>
      )}

      <div className="w-full rounded-full p-2 mt-5 cursor-pointer bg-seeds-button-green transition ease-in-out hover:bg-green-500">
        <Typography className="font-bold text-white">Continue</Typography>
      </div>
    </Modal>
  );
};

export default DeleteAccountReasonPopUp;
