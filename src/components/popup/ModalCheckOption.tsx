'use client';

import Seedy from '@/assets/event/seedy.svg';
import { checkInOutEvent } from '@/repository/discover.repository';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Modal from '../ui/modal/Modal';

interface Props {
  onClose: () => void;
  ticketId: string;
  ticketStatus: string;
}

const ModalCheckOption: React.FC<Props> = ({
  onClose,
  ticketId,
  ticketStatus
}) => {
  const router = useRouter();
  const id = router.query.id;
  const { t } = useTranslation();
  const [action, setAction] = useState<string>('');

  useEffect(() => {
    if (ticketStatus === 'ISSUED' || ticketStatus === 'CHECKED_OUT') {
      setAction(ticketStatus);
    } else {
      setAction(ticketStatus);
    }
  }, []);

  const handleCheckInOut = async (ticketId: string): Promise<void> => {
    try {
      await checkInOutEvent({ ticket_id: ticketId, action });
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      if (ticketStatus === 'CHECKED_IN' || ticketStatus === 'ISSUED') {
        toast.success(`Check Out Successful`);
        void router
          .replace(`/homepage/event/${id as string}/check-in-out`)
          .then(() => {
            router.reload();
          });
      } else {
        toast.success(`Check In Successful`);
        void router
          .replace(`/homepage/event/${id as string}/check-in-out`)
          .then(() => {
            router.reload();
          });
      }
    }
  };

  return (
    <Modal
      onClose={onClose}
      backdropClasses="z-40 fixed top-0 left-0 w-full h-screen bg-black/50 flex justify-start items-start"
    >
      <div className="w-full h-[150px] flex justify-center items-center">
        <Image
          src={Seedy}
          alt={'Seedy'}
          width={1000}
          height={1000}
          className="w-full h-full"
        />
      </div>
      <Typography className="mt-4 font-poppins font-semibold text-[#262626]">
        {ticketStatus === 'CHECKED_IN'
          ? t('seedsEvent.ticket.checkOutMessage1')
          : t('seedsEvent.ticket.checkInMessage1')}
      </Typography>
      <Typography className="font-poppins text-sm text-[#7C7C7C]">
        {ticketStatus === 'CHECKED_IN'
          ? t('seedsEvent.ticket.checkOutMessage2')
          : t('seedsEvent.ticket.checkInMessage2')}
      </Typography>
      <div className="w-full flex gap-2 justify-center items-center mt-4">
        <button
          onClick={() => {
            onClose();
          }}
          className="w-full bg-[#DD2525] py-2 rounded-full text-white font-poppins font-semibold cursor-pointer"
        >
          {t('seedsEvent.ticket.no')}
        </button>
        <button
          onClick={() => {
            void handleCheckInOut(ticketId);
          }}
          className="w-full bg-[#3AC4A0] py-2 rounded-full text-white font-poppins font-semibold cursor-pointer"
        >
          {t('seedsEvent.ticket.yes')}
        </button>
      </div>
    </Modal>
  );
};

export default ModalCheckOption;
