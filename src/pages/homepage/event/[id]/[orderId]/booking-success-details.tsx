/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
'use-client';

import Loading from '@/components/popup/Loading';
import ModalChooseEventNotification from '@/components/popup/ModalChooseEventNotification';
import { standartCurrency } from '@/helpers/currency';
import withAuth from '@/helpers/withAuth';
import {
  getEventById,
  getEventTicketById
} from '@/repository/discover.repository';
import { getUserInfo } from '@/repository/profile.repository';
import {
  type EventList,
  type TicketData
} from '@/utils/interfaces/event.interface';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Typography } from '@material-tailwind/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const SeedsEventBookingSuccessDetail: React.FC = () => {
  const router = useRouter();
  const id = router.query.id;
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [eventData, setEventData] = useState<EventList>();
  const [ticketData, setTicketData] = useState<TicketData>();
  const [showNotificationModal, setShowNotificationModal] =
    useState<boolean>(true);

  useEffect(() => {
    fetchData()
      .then()
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (id !== null && userInfo !== undefined) {
      void fetchEventById(id as string);
      void fetchEventTicketById(id as string);
    }
  }, [id, userInfo]);

  const fetchData = async (): Promise<void> => {
    try {
      const dataInfo = await getUserInfo();
      setUserInfo(dataInfo);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  const fetchEventById = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await getEventById(id);
      setEventData(response);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventTicketById = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await getEventTicketById(id);
      setTicketData(response);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading />}
      {showNotificationModal && (
        <ModalChooseEventNotification
          onClose={() => {
            setShowNotificationModal(prev => !prev);
          }}
          eventId={eventData?.id ?? ''}
        />
      )}
      <div className="bg-white flex flex-col justify-center items-center rounded-xl font-poppins p-5">
        <div className="flex justify-center w-full gap-2">
          <Typography className="text-lg font-semibold font-poppins">
            {t('seedsEvent.eventDetails')}
          </Typography>
        </div>
        <div className="w-full lg:w-2/3 2xl:w-1/2 h-auto rounded-xl mt-4 overflow-hidden">
          {eventData?.image_url !== undefined ? (
            <img
              src={eventData?.image_url}
              className="w-full h-full"
              alt="event image"
            />
          ) : (
            <div className="bg-gray-400 animate-pulse w-full h-[200px]" />
          )}
        </div>
        <div className="bg-[#F9F9F9] w-full mt-8 rounded-lg py-4 px-2 md:px-4 flex flex-col gap-2">
          <div className="w-full flex justify-between items-center">
            <Typography className="text-[10px] md:text-base text-[#7C7C7C] font-poppins">
              {t('seedsEvent.ticket.nameEvent')}
            </Typography>
            <Typography className="text-[10px] md:text-base font-poppins font-semibold">
              {eventData?.name}
            </Typography>
          </div>
          <div className="w-full flex justify-between items-center">
            <Typography className="text-[10px] md:text-base text-[#7C7C7C] font-poppins">
              {t('seedsEvent.ticket.name')}
            </Typography>
            <Typography className="text-[10px] md:text-base font-poppins font-semibold">
              {ticketData?.name}
            </Typography>
          </div>
          <div className="w-full flex justify-between items-center">
            <Typography className="text-[10px] md:text-base text-[#7C7C7C] font-poppins">
              {t('seedsEvent.ticket.phoneNumber')}
            </Typography>
            <Typography className="text-[10px] md:text-base font-poppins font-semibold">
              {ticketData?.phone_number}
            </Typography>
          </div>
          <div className="w-full flex justify-between items-center">
            <Typography className="text-[10px] md:text-base text-[#7C7C7C] font-poppins">
              {t('seedsEvent.ticket.emailAddress')}
            </Typography>
            <Typography className="text-[10px] md:text-base font-poppins font-semibold">
              {ticketData?.email}
            </Typography>
          </div>
          <hr className="my-2" />
          <div className="w-full flex justify-between items-center">
            <Typography className="text-[10px] md:text-base font-semibold font-poppins">
              {t('seedsEvent.ticket.totalPrice')}
            </Typography>
            <Typography className="text-[10px] md:text-base text-seeds-button-green font-semibold font-poppins">
              {(eventData?.event_price ?? 0) > 0
                ? `${userInfo?.preferredCurrency ?? 'IDR'} ${standartCurrency(
                    eventData?.event_price ?? 0
                  ).replace('Rp', '')}`
                : t('seedsEvent.free').toUpperCase()}
            </Typography>
          </div>
        </div>
      </div>
      <div className="bg-white flex flex-col justify-center items-center rounded-xl font-poppins p-5 mt-4">
        <button
          onClick={async () => await router.push('/homepage/event/my-event')}
          className="w-full rounded-full bg-seeds-button-green text-white py-2 text-xs md:text-base cursor-pointer font-semibold"
        >
          {t('seedsEvent.ticket.myEvents')}
        </button>
      </div>
    </>
  );
};

export default withAuth(SeedsEventBookingSuccessDetail);
