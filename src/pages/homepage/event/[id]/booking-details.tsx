/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
'use-client';

import Loading from '@/components/popup/Loading';
import { standartCurrency } from '@/helpers/currency';
import withAuth from '@/helpers/withAuth';
import { bookEvent, getEventById } from '@/repository/discover.repository';
import { getUserInfo } from '@/repository/profile.repository';
import {
  setUserEmail,
  setUserName,
  setUserPhone
} from '@/store/event/bookingSlice';
import {
  type BookEvent,
  type EventList
} from '@/utils/interfaces/event.interface';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { EventBookInfo } from 'public/assets/vector';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const SeedsEventBookingDetail: React.FC = () => {
  const router = useRouter();
  const id = router.query.id;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [eventData, setEventData] = useState<EventList>();

  useEffect(() => {
    fetchData()
      .then()
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (id !== null && userInfo !== undefined) {
      void fetchEventById(id as string);
    }
  }, [id, userInfo]);

  const fetchData = async (): Promise<void> => {
    try {
      const dataInfo = await getUserInfo();
      setUserInfo(dataInfo);
      dispatch(setUserName(dataInfo?.name));
      dispatch(setUserPhone(dataInfo?.phoneNumber));
      dispatch(setUserEmail(dataInfo?.email));
      setForm({
        ...form,
        name: dataInfo?.name,
        phone_number: dataInfo?.phoneNumber,
        email: dataInfo?.email
      });
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

  const [form, setForm] = useState<BookEvent>({
    event_id: id as string,
    name: '',
    phone_number: '',
    email: ''
  });

  const handleInputUserName = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = event.target.value.replace(/[^a-zA-Z\s]/g, '');
    dispatch(setUserName(value));
    setForm({ ...form, name: value });
  };

  const handleInputUserPhone = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = event.target.value;
    const numericValue = value.replace(/\D/g, '');
    dispatch(setUserPhone(numericValue));
    setForm({ ...form, phone_number: numericValue });
  };

  const handleInputUserEmail = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = event.target.value;
    dispatch(setUserEmail(value));
    setForm({ ...form, email: value });
  };

  const emailValidation = async (): Promise<boolean> => {
    const validRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (validRegex.test(form.email)) {
      return true;
    } else {
      return false;
    }
  };

  const handleBookEvent = async (): Promise<void> => {
    try {
      if (await emailValidation()) {
        const response = await bookEvent(form);
        router.push(
          `/homepage/event/${id as string}/${
            response?.id as string
          }/booking-success-details`
        );
      } else {
        toast.error('Invalid email format !');
      }
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  const handleBookPaidEvent = async (): Promise<void> => {
    if (await emailValidation()) {
      router.push(`/homepage/event/${id as string}/payment`);
    } else {
      toast.error('Invalid email format !');
    }
  };

  return (
    <>
      {loading && <Loading />}
      <div className="bg-white flex flex-col justify-center items-center rounded-xl font-poppins p-5">
        <div className="flex justify-center w-full gap-2">
          <Typography className="text-lg font-semibold">
            {t('seedsEvent.booking.bookingDetails')}
          </Typography>
        </div>
        <div className="w-full mt-4">
          <div className="mb-4">
            <Typography className="font-semibold font-poppins text-sm">
              {t('seedsEvent.booking.name')}
            </Typography>
            <input
              id="search"
              type="text"
              name="search"
              value={form.name}
              onChange={e => {
                handleInputUserName(e);
              }}
              placeholder={`${t('seedsEvent.booking.inputName')}`}
              className="border-b border-[#CCCCCC] block w-full text-[#262626] h-11 leading-4 placeholder:text-[#BDBDBD] focus:outline-0 disabled:bg-[#E9E9E9]"
            />
          </div>
          <div className="mb-4">
            <Typography className="font-semibold font-poppins text-sm">
              {t('seedsEvent.booking.phone')}
            </Typography>
            <input
              id="search"
              type="text"
              name="search"
              value={form.phone_number}
              onChange={e => {
                handleInputUserPhone(e);
              }}
              placeholder={`${t('seedsEvent.booking.inputPhone')}`}
              className="border-b border-[#CCCCCC] block w-full text-[#262626] h-11 leading-4 placeholder:text-[#BDBDBD] focus:outline-0 disabled:bg-[#E9E9E9]"
            />
          </div>
          <div className="mb-4">
            <Typography className="font-semibold font-poppins text-sm">
              {t('seedsEvent.booking.email')}
            </Typography>
            <input
              id="search"
              type="email"
              name="search"
              value={form.email}
              onChange={e => {
                handleInputUserEmail(e);
              }}
              placeholder={`${t('seedsEvent.booking.inputEmail')}`}
              className="border-b border-[#CCCCCC] block w-full text-[#262626] h-11 leading-4 placeholder:text-[#BDBDBD] focus:outline-0 disabled:bg-[#E9E9E9]"
            />
          </div>
        </div>
        <div className="flex gap-2 w-full justify-start items-center">
          <div className="w-[16px] h-[16px] flex justify-center items-center">
            <Image
              src={EventBookInfo}
              alt={'EventBookInfo'}
              width={20}
              height={20}
            />
          </div>
          <Typography className="font-poppins text-sm text-[#3C49D6]">
            {t('seedsEvent.booking.bookInfo')}
          </Typography>
        </div>
      </div>
      <div className="mt-4 flex flex-col justify-center items-center rounded-xl font-poppins p-5 bg-white">
        <div className="w-full flex flex-col justify-start items-start">
          <Typography className="text-sm font-poppins">
            {t('seedsEvent.entranceFee')}
          </Typography>
          <Typography className="text-lg font-semibold font-poppins mb-4">
            {(eventData?.event_price ?? 0) > 0
              ? `${userInfo?.preferredCurrency ?? 'IDR'} ${standartCurrency(
                  eventData?.event_price ?? 0
                ).replace('Rp', '')}`
              : t('seedsEvent.free')}
          </Typography>
        </div>
        <button
          onClick={async () => {
            eventData?.event_price === 0
              ? await handleBookEvent()
              : await handleBookPaidEvent();
          }}
          disabled={
            form.name === '' || form.phone_number === '' || form.email === ''
          }
          className={`${
            form.name === '' || form.phone_number === '' || form.email === ''
              ? 'bg-[#BDBDBD]'
              : 'bg-[#3AC4A0]'
          } flex justify-center items-center w-full text-white py-2 rounded-xl cursor-pointer`}
        >
          {t('seedsEvent.booking.continue')}
        </button>
      </div>
    </>
  );
};

export default withAuth(SeedsEventBookingDetail);
