'use client';

import { sendCertificateToEmail } from '@/repository/discover.repository';
import { Button, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { XIcon } from 'public/assets/vector';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Modal from '../ui/modal/Modal';

interface Props {
  onClose: () => void;
  ticketId: string;
}

const ModalConfirmSendCertificate: React.FC<Props> = ({ onClose, ticketId }) => {
  const { t } = useTranslation();

  const sendCertificate = async (): Promise<void> => {
    try {
      const response = await sendCertificateToEmail(ticketId);
      
      if (response === null) {
        toast.success(t('seedsEvent.emailMessage'))
        onClose()
      }
    } catch (error) {
      toast.error(`Error sending certificate: ${error as string}`);
    }
  };

  return (
    <Modal
      onClose={onClose}
      backdropClasses="z-50 fixed top-0 left-0 w-full h-screen bg-black/50 flex justify-start items-start"
    >
      <div className="flex w-full justify-end items-center">
        <Image
          src={XIcon}
          alt="X"
          width={30}
          height={30}
          onClick={onClose}
          className="hover:scale-110 transition ease-out cursor-pointer"
        />
      </div>

      <Typography className='font-poppins font-semibold lg:text-lg mt-4 mb-8'>
        {t('seedsEvent.sendEmailConfirm')}
      </Typography>

      <div className='flex justify-center items-center my-4'>
        <div className='w-full lg:w-[75%] flex gap-4'>
          <Button
            onClick={async () => { await sendCertificate(); }}
            className='w-full bg-seeds-button-green rounded-full'
          >
            {t('seedsEvent.yes')}
          </Button>
          <Button
            onClick={onClose}
            className='w-full bg-[#BDBDBD] rounded-full'
          >
            {t('seedsEvent.no')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfirmSendCertificate;
