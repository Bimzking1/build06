'use client';

import CopyLink from '@/assets/play/tournament/copyTournamentLink.svg';
import {
  type EventList,
  type TicketData
} from '@/utils/interfaces/event.interface';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-qr-code';
import { toast } from 'react-toastify';
import Modal from '../ui/modal/Modal';
import ModalCheckOption from './ModalCheckOption';

interface Props {
  onClose: () => void;
  ticketData: TicketData;
  eventData: EventList;
  isCheckAble: boolean;
  isEventEnded?: boolean;
}

const ModalShowEventTicket: React.FC<Props> = ({
  onClose,
  ticketData,
  eventData,
  isCheckAble,
  isEventEnded
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const handleCopyClick = async (): Promise<void> => {
    const textToCopy = `${eventData?.external_url}`;
    await navigator.clipboard.writeText(textToCopy).then(() => {
      toast("Event's link copied!");
    });
  };
  const [isCheckInModal, setIsCheckInModal] = useState<boolean>(false);

  return (
    <>
      {isCheckInModal && (
        <ModalCheckOption
          onClose={() => {
            setIsCheckInModal(prev => !prev);
          }}
          ticketId={ticketData?.id ?? ''}
          ticketStatus={ticketData?.status ?? ''}
        />
      )}
      <Modal
        onClose={onClose}
        backdropClasses="z-40 fixed top-0 left-0 w-full h-screen bg-black/50 flex justify-start items-start"
      >
        <div className="flex justify-between">
          <Typography className="w-full font-bold text-xl text-seeds-button-green mt-4">
            {eventData?.name}
          </Typography>
        </div>

        {eventData?.event_status === 'OFFLINE' ? (
          <div className="flex flex-col gap-3 justify-center px-2 lg:px-8 pt-2 items-center text-center my-4">
            <div
              style={{ height: 'auto', margin: '0 auto' }}
              className="w-[80%] md:w-[50%]"
            >
              <QRCode
                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                value={`${ticketData?.ticket_code}`}
                viewBox={`0 0 256 256`}
              />
            </div>

            <Typography className="font-bold text-lg text-black mt-4">
              {ticketData?.ticket_code}
            </Typography>

            <div
              onClick={async () => {
                await router
                  .replace(
                    !(isEventEnded ?? false) && ticketData?.status === 'CHECKED_IN'
                      ? `/homepage/event/${eventData?.id}/check-in-out`
                      : `/homepage/event/${eventData?.id}`
                  )
                  .then(() => {
                    router.reload();
                  });
              }}
              className="bg-seeds-button-green text-white font-poppins py-4 md:py-2 rounded-full w-full cursor-pointer font-semibold mt-4"
            >
              Refresh
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 justify-center px-2 lg:px-4 pt-2 items-center text-center my-4">
            <div className="w-full h-fit flex mb-4 gap-2">
              <input
                id="search"
                type="text"
                name="search"
                placeholder=""
                readOnly={true}
                disabled={false}
                value={`${eventData?.external_url}`}
                className="block w-full text-[#3AC4A0] h-11 leading-4 placeholder:text-[#BDBDBD] focus:outline-0 disabled:bg-[#E9E9E9] p-3 pl-8 rounded-xl border border-[#BDBDBD] font-semibold"
              />
              <div
                onClick={handleCopyClick}
                className="w-[50px] cursor-pointer flex justify-center items-center hover:bg-[#f0f0f0] hover:shadow-md duration-300 rounded-lg"
              >
                <Image alt="" src={CopyLink} className="w-[20px]" />
              </div>
            </div>
            <button
              disabled={!isCheckAble}
              onClick={() => {
                setIsCheckInModal(true);
              }}
              className={`${
                isCheckAble
                  ? 'bg-seeds-button-green cursor-pointer text-white'
                  : 'bg-[#E9E9E9] text-[#262626]'
              } w-full rounded-full font-poppins py-2`}
            >
              {ticketData?.status === 'CHECKED_IN'
                ? t('seedsEvent.checkInOut.checkOut')
                : t('seedsEvent.checkInOut.checkIn')}
            </button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ModalShowEventTicket;