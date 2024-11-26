/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
'use-client';

import Seedy from '@/assets/event/seedyCheckInOut.svg';
import Loading from '@/components/popup/Loading';
import ModalCheckOption from '@/components/popup/ModalCheckOption';
import ModalShowEventTicket from '@/components/popup/ModalShowEventTicket';
import { getEventDate } from '@/helpers/dateFormat';
import withAuth from '@/helpers/withAuth';
import {
  getEventById,
  getEventTicketById
} from '@/repository/discover.repository';
import { getUserInfo } from '@/repository/profile.repository';
import LanguageContext from '@/store/language/language-context';
import {
  type EventList,
  type TicketData
} from '@/utils/interfaces/event.interface';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ArrowBackwardIcon } from 'public/assets/vector';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const initialTicketData: TicketData = {
  email: '',
  event_id: '',
  id: '',
  name: '',
  notification_type: [],
  phone_number: '',
  seeds_tag: '',
  status: '',
  ticket_code: '',
  user_id: '',
  check_in_time: '',
  check_out_time: ''
};

const initialEventData: EventList = {
  created_at: '',
  description: '',
  ended_at: '',
  event_date: '',
  event_price: 0,
  event_status: '',
  external_url: '',
  id: '',
  image_url: '',
  is_joined: false,
  is_liked: false,
  likes: 0,
  location_name: '',
  name: '',
  updated_at: '',
  reward: ''
};

const SeedsEventCheckInOut: React.FC = () => {
  const router = useRouter();
  const id = router.query.id;
  const { t } = useTranslation();
  const languageCtx = useContext(LanguageContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [ticketData, setTicketData] = useState<TicketData>();
  const [eventData, setEventData] = useState<EventList>();
  const [isShowTicket, setIsShowTicket] = useState<boolean>(false);
  const [isCheckInModal, setIsCheckInModal] = useState<boolean>(false);

  useEffect(() => {
    fetchData()
      .then()
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (
      eventData?.event_status === 'OFFLINE' &&
      ticketData?.status === 'ISSUED'
    ) {
      router.push(`/homepage/event/${eventData?.id}`);
    } else if (
      eventData?.event_status === 'OFFLINE' &&
      ticketData?.status === 'CHECKED_OUT'
    ) {
      toast.success('Check Out Successful!');
    }
  }, [eventData, ticketData]);

  useEffect(() => {
    if (id !== null && userInfo !== undefined) {
      void fetchTicketById(id as string);
      void fetchEventById(id as string);
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

  const fetchTicketById = async (id: string): Promise<void> => {
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

  const isCheckAble = (): boolean => {
    const startDateObject = new Date(eventData?.event_date ?? '');
    const startDateTimestamp = startDateObject.getTime();
    const endDateObject = new Date(eventData?.ended_at ?? '');
    const endDateTimestamp = endDateObject.getTime();

    const currentDateObject = new Date();
    const currentDateTimestamp = currentDateObject.getTime();

    const oneHourBeforeStart = startDateTimestamp - 60 * 60 * 1000;
    const twoHoursAfterEnd = endDateTimestamp + 2 * 60 * 60 * 1000;

    return (
      currentDateTimestamp >= oneHourBeforeStart &&
      currentDateTimestamp <= twoHoursAfterEnd
    );
  };

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
      {isShowTicket && (
        <ModalShowEventTicket
          onClose={() => {
            setIsShowTicket(prev => !prev);
          }}
          ticketData={ticketData ?? initialTicketData}
          eventData={eventData ?? initialEventData}
          isCheckAble={isCheckAble()}
        />
      )}
      {loading && <Loading />}
      <div className="bg-white flex flex-col justify-center items-center rounded-xl font-poppins p-5 mb-16">
        <div className="flex justify-center w-full relative">
          <Typography className="text-lg font-semibold">
            {t('seedsEvent.checkInOut.ticketDetails')}
          </Typography>
          {eventData?.event_status === 'OFFLINE' &&
            ticketData?.status === 'CHECKED_OUT' && (
              <div
                onClick={async () =>
                  await router.push(`/homepage/event/${eventData?.id}`)
                }
                className="absolute left-0 top-[-3px] w-[35px] h-[35px] flex justify-center items-center cursor-pointer"
              >
                <Image
                  src={ArrowBackwardIcon}
                  alt={'ArrowBackwardIcon'}
                  width={30}
                  height={30}
                />
              </div>
            )}
        </div>
        <div className="w-full h-[200px] flex justify-center items-center mt-4">
          <Image
            src={Seedy}
            alt={'Seedy'}
            width={1000}
            height={1000}
            className="w-full h-full"
          />
        </div>
        <Typography className="my-4 font-semibold font-poppins text-seeds-button-green">
          {ticketData?.status === 'CHECKED_IN' ||
          ticketData?.status === 'ISSUED'
            ? t('seedsEvent.checkInOut.checkInSuccessful')
            : t('seedsEvent.checkInOut.checkOutSuccessful')}
        </Typography>
        <div className="bg-[#F9F9F9] border border-[#E9E9E9] w-full mt-8 rounded-lg py-4 px-2 md:px-4 flex flex-col gap-2">
          <div className="w-full flex justify-between items-center">
            <Typography className="text-[12px] md:text-base text-[#7C7C7C] font-poppins">
              {t('seedsEvent.checkInOut.name')}
            </Typography>
            <Typography className="text-[12px] md:text-base font-poppins font-semibold text-right">
              {ticketData?.name}
            </Typography>
          </div>
          <div className="w-full flex justify-between items-center">
            <Typography className="text-[12px] md:text-base text-[#7C7C7C] font-poppins">
              {t('seedsEvent.checkInOut.event')}
            </Typography>
            <Typography className="text-[12px] md:text-base font-poppins font-semibold text-right">
              {eventData?.name}
            </Typography>
          </div>
          <div className="w-full flex justify-between items-center">
            <Typography className="text-[12px] md:text-base text-[#7C7C7C] font-poppins">
              {ticketData?.status === 'CHECKED_IN'
                ? t('seedsEvent.checkInOut.checkIn')
                : t('seedsEvent.checkInOut.checkOut')}
            </Typography>
            <Typography className="text-[12px] md:text-base font-poppins font-semibold text-right">
              {ticketData?.status === 'CHECKED_IN' ? (
                <Typography className="text-[12px] md:text-base font-poppins font-semibold">
                  {languageCtx.language === 'ID'
                    ? getEventDate(
                        new Date(
                          ticketData?.check_in_time ?? '2024-12-31T23:59:00Z'
                        ),
                        'id-ID'
                      )
                    : getEventDate(
                        new Date(
                          ticketData?.check_in_time ?? '2024-12-31T23:59:00Z'
                        ),
                        'en-US'
                      )}
                </Typography>
              ) : (
                <Typography className="text-[12px] md:text-base font-poppins font-semibold">
                  {languageCtx.language === 'ID'
                    ? getEventDate(
                        new Date(
                          ticketData?.check_out_time ?? '2024-12-31T23:59:00Z'
                        ),
                        'id-ID'
                      )
                    : getEventDate(
                        new Date(
                          ticketData?.check_out_time ?? '2024-12-31T23:59:00Z'
                        ),
                        'en-US'
                      )}
                </Typography>
              )}
            </Typography>
          </div>
        </div>
        {ticketData?.status === 'CHECKED_OUT' ? (
          <button
            onClick={async () =>
              await router.push(`/homepage/event/${id as string}`)
            }
            className="w-full bg-seeds-button-green rounded-full py-2 text-white font-semibold mt-4 text-sm cursor-pointer"
          >
            {t('seedsEvent.eventDetails')}
          </button>
        ) : (
          <button
            onClick={() => {
              eventData?.event_status === 'OFFLINE'
                ? setIsShowTicket(true)
                : setIsCheckInModal(true);
            }}
            className="w-full bg-[#7555DA] rounded-full py-2 text-white font-semibold mt-4 text-sm cursor-pointer"
          >
            {t('seedsEvent.checkInOut.checkOut')}
          </button>
        )}
      </div>
    </>
  );
};

export default withAuth(SeedsEventCheckInOut);
