/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
'use-client';

import DetailEventSkeleton from '@/components/homepage/event/skeleton/detailEventSkeleton';
import Loading from '@/components/popup/Loading';
import ModalShowCertificate from '@/components/popup/ModalShowCertificate';
import ModalShowEventTicket from '@/components/popup/ModalShowEventTicket';
import { standartCurrency } from '@/helpers/currency';
import {
  getEventClock,
  getEventDate,
  getEventDetailsDate
} from '@/helpers/dateFormat';
import withAuth from '@/helpers/withAuth';
import { getCertificateById, getEventById, getEventTicketById } from '@/repository/discover.repository';
import { getUserInfo } from '@/repository/profile.repository';
import LanguageContext from '@/store/language/language-context';
import { type CertificateI, type EventList, type TicketData } from '@/utils/interfaces/event.interface';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  ArrowBackwardIcon,
  EventCalendar,
  EventClock,
  EventLocation,
  EventTicket
} from 'public/assets/vector';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export const initialTicketData: TicketData = {
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
}

export const initialCertificate: CertificateI = {
  event_ticket_id: '',
  serial_number: '',
  user_name: '',
  event_name: '',
  pdf_data: '',
  created_at: '',
  updated_at: ''
};

const SeedsEventDetail: React.FC = () => {
  const router = useRouter();
  const id = router.query.id;
  const { t } = useTranslation();
  const languageCtx = useContext(LanguageContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [eventData, setEventData] = useState<EventList>();
  const [ticketData, setTicketData] = useState<TicketData>();
  const [certificateData, setCertificateData] = useState<CertificateI>();
  const [isShowTicket, setIsShowTicket] = useState<boolean>(false);
  const [isShowCertificate, setIsShowCertificate] = useState<boolean>(false);

  useEffect(() => {
    fetchData()
      .then()
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (
      !isEventEnded() &&
      (eventData?.event_status === 'OFFLINE') &&
      (ticketData?.status === 'CHECKED_IN')
    ) {
      toast.success('Check In Successful!');
      router.push(`/homepage/event/${eventData?.id}/check-in-out`);
    }
  }, [eventData, ticketData]);

  useEffect(() => {
    if (id !== null && userInfo !== undefined) {
      void fetchEventById(id as string);
    }
  }, [id, userInfo]);

  useEffect(() => {
    if (eventData?.is_joined !== undefined && eventData?.is_joined) {
      void fetchEventTicketById(id as string);
    }
  }, [eventData]);

  useEffect(() => {
    if ((isEventEnded()) && (ticketData !== undefined)) {
      void fetchCertificateById(ticketData?.id)
    }
  }, [ticketData]);

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

  const fetchCertificateById = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      const response = await getCertificateById(id);
      setCertificateData(response)
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

  const isPastEvent = (): boolean => {
    const endDateObject = new Date(eventData?.ended_at ?? '');
    const endDateTimestamp = endDateObject.getTime();

    const currentDateObject = new Date();
    const currentDateTimestamp = currentDateObject.getTime();

    const twoHoursAfterEnd = endDateTimestamp + 2 * 60 * 60 * 1000;

    return twoHoursAfterEnd < currentDateTimestamp;
  };

  const isEventEnded = (): boolean => {
    const endDateObject = new Date(eventData?.ended_at ?? '');
    const endDateTimestamp = endDateObject.getTime();

    const currentDateObject = new Date();
    const currentDateTimestamp = currentDateObject.getTime();

    return endDateTimestamp < currentDateTimestamp;
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

    return currentDateTimestamp >= oneHourBeforeStart && currentDateTimestamp <= twoHoursAfterEnd;
  };

  const base64ToBlob = (base64: string, type: string = 'application/pdf'): Blob => {
    const binary = atob(base64.replace(/\s/g, ''));
    const len = binary.length;
    const buffer = new ArrayBuffer(len);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < len; i++) {
      view[i] = binary.charCodeAt(i);
    }
    return new Blob([view], { type });
  };

  return (
    <>
      {loading && <Loading />}
      {isShowTicket && (
        <ModalShowEventTicket
          onClose={() => {
            setIsShowTicket(prev => !prev);
          }}
          ticketData={ticketData ?? initialTicketData}
          eventData={eventData ?? initialEventData}
          isCheckAble={isCheckAble()}
          isEventEnded={isEventEnded()}
        />
      )}
      {isShowCertificate && (
        <ModalShowCertificate
          onClose={() => {
            setIsShowCertificate(prev => !prev);
          }}
          eventData={eventData ?? initialEventData}
          certificateData={certificateData ?? initialCertificate}
          file={URL.createObjectURL(base64ToBlob(certificateData?.pdf_data ?? ''))}
        />
      )}
      <div className="bg-white flex flex-col justify-center items-center rounded-xl font-poppins p-5">
        <div className="flex justify-center w-full gap-2 relative">
          <Typography className="text-lg font-semibold">
            {t('seedsEvent.eventDetails')}
          </Typography>
          <div
            onClick={async () => await router.push('/homepage/event')}
            className="absolute left-0 top-[-3px] w-[35px] h-[35px] flex justify-center items-center cursor-pointer"
          >
            <Image
              src={ArrowBackwardIcon}
              alt={'ArrowBackwardIcon'}
              width={30}
              height={30}
            />
          </div>
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
        {eventData ? (
          <div className="w-full mt-4 flex flex-col justify-start items-start">
            <Typography className="text-lg font-semibold font-poppins mt-4 mb-6">
              {eventData?.name ?? 'Seeds Event'}
            </Typography>
            <div className="flex gap-2 justify-center items-center">
              <div className="w-[35px] h-[35px] flex justify-center items-center">
                <Image
                  src={EventCalendar}
                  alt={'EventCalendar'}
                  width={20}
                  height={20}
                />
              </div>
              <Typography className="font-poppins">
                {languageCtx.language === 'ID'
                  ? getEventDetailsDate(
                      new Date(eventData?.event_date ?? '2024-12-31T23:59:00Z'),
                      'id-ID'
                    )
                  : getEventDetailsDate(
                      new Date(eventData?.event_date ?? '2024-12-31T23:59:00Z'),
                      'en-US'
                    )}
              </Typography>
            </div>
            <div className="flex gap-2 justify-center items-center">
              <div className="w-[35px] h-[35px] flex justify-center items-center">
                <Image
                  src={EventClock}
                  alt={'EventClock'}
                  width={25}
                  height={25}
                />
              </div>
              <Typography className="font-poppins">
                {getEventClock(
                  new Date(eventData?.event_date ?? '2024-12-31T23:59:00Z'),
                  new Date(eventData?.ended_at ?? '2024-12-31T23:59:00Z')
                )}
              </Typography>
            </div>
            <div className="flex gap-2 justify-center items-center">
              <div className="w-[35px] h-[35px] flex justify-center items-center">
                <Image
                  src={EventLocation}
                  alt={'EventLocation'}
                  width={25}
                  height={25}
                />
              </div>
              {eventData?.event_status === 'OFFLINE' ? (
                <a
                  href={`${eventData?.external_url}`}
                  target="_blank"
                  className="underline"
                >
                  <Typography className="font-poppins">
                    {eventData?.location_name}
                  </Typography>
                </a>
              ) : eventData?.is_joined ? (
                <a
                  href={`${eventData?.external_url}`}
                  target="_blank"
                  className="underline"
                >
                  <Typography className="font-poppins">
                    {eventData?.location_name}
                  </Typography>
                </a>
              ) : (
                <Typography className="font-poppins">
                  {eventData?.location_name}
                </Typography>
              )}
            </div>
            <div
              className="text-xs sm:text-sm text-[#7C7C7C] font-normal py-2 px-4 font-poppins mt-6"
              dangerouslySetInnerHTML={{
                __html: eventData?.description
                  ?.replace(/\n/g, '<br />')
                  .replace(/\*(.*?)\*/g, '<b>$1</b>') ?? '-'
              }}
            />
          </div>
        ) : (
          <DetailEventSkeleton />
        )}
        {eventData?.is_joined && (
          <div className="bg-[#F9F9F9] w-full mt-4 rounded-lg py-4 px-2 md:px-4 flex flex-col gap-2">
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
            {ticketData?.check_in_time !== '0001-01-01T00:00:00Z' && (
              <>
                <hr className="my-2" />
                <div className="w-full flex justify-between items-center">
                  <Typography className="text-[10px] md:text-base text-[#7C7C7C] font-poppins">
                    {t('seedsEvent.ticket.checkIn')}
                  </Typography>
                  <Typography className="text-[10px] md:text-base font-poppins font-semibold">
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
                </div>
              </>
            )}
            {ticketData?.check_out_time !== '0001-01-01T00:00:00Z' && (
              <>
                <div className="w-full flex justify-between items-center">
                  <Typography className="text-[10px] md:text-base text-[#7C7C7C] font-poppins">
                    {t('seedsEvent.ticket.checkOut')}
                  </Typography>
                  <Typography className="text-[10px] md:text-base font-poppins font-semibold">
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
                </div>
              </>
            )}
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
        )}
      </div>
      {
        (eventData?.is_joined === false) ?
          <div className="mt-4 flex flex-col justify-center items-center rounded-xl font-poppins p-5 bg-white">
            <div className='w-full flex flex-col justify-start items-start'>
              <Typography className='text-sm font-poppins'>
                {t('seedsEvent.entranceFee')}
              </Typography>
              <Typography className='text-lg font-semibold font-poppins mb-4'>
                {
                  (eventData?.event_price ?? 0) > 0 ?
                    `${userInfo?.preferredCurrency ?? 'IDR'} ${standartCurrency(eventData?.event_price ?? 0).replace('Rp', '')}`
                    :
                    t('seedsEvent.free')
                }
              </Typography>
            </div>
            <button
              disabled={isPastEvent()}
              onClick={async () => await router.push(`/homepage/event/${id as string}/booking-details`)}
              className={`${isPastEvent() ? 'bg-[#BDBDBD]' : 'bg-[#3AC4A0] cursor-pointer'} flex justify-center items-center w-full text-white py-2 rounded-xl`}
            >
              {t('seedsEvent.booking.bookNow')}
            </button>
          </div>
          : isEventEnded() ?
            eventData?.reward === 'E-CERTIFICATE' &&
              <div className="mt-4 flex flex-col justify-center items-center rounded-xl font-poppins p-5 bg-white">
                <button
                  onClick={async() => {
                    setIsShowCertificate(true)
                  }}
                  className={`bg-[#3AC4A0] cursor-pointer' flex justify-center gap-2 items-center w-full text-white py-2 rounded-full`}
                >
                  <div className='flex justify-center items-center'>
                    <Image
                      src={EventTicket}
                      alt={'EventTicket'}
                      width={20}
                      height={20}
                    />
                  </div>
                  <div className='flex justify-center items-center'>
                    {t('seedsEvent.checkCertificate')}
                  </div>
                </button>
              </div>
            :
            ticketData?.check_out_time === '0001-01-01T00:00:00Z' &&
              <div className="mt-4 flex flex-col justify-center items-center rounded-xl font-poppins p-5 bg-white">
                <button
                  onClick={async() => {
                    ((eventData?.event_status === 'OFFLINE') && (ticketData?.status === 'CHECKED_IN'))
                    ? await router.push(`/homepage/event/${id as string}/check-in-out`)
                    : setIsShowTicket(true);
                  }}
                  className={`bg-[#3AC4A0] cursor-pointer' flex justify-center gap-2 items-center w-full text-white py-2 rounded-full`}
                >
                  <div className='flex justify-center items-center'>
                    <Image
                      src={EventTicket}
                      alt={'EventTicket'}
                      width={20}
                      height={20}
                    />
                  </div>
                  <div className='flex justify-center items-center'>
                    {
                      eventData?.event_status === 'OFFLINE'
                        ? t('seedsEvent.seeYourTicket')
                        : t('seedsEvent.seeEventLink')
                    }
                  </div>
                </button>
              </div>
      }
    </>
  );
};

export default withAuth(SeedsEventDetail);
