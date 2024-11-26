/* eslint-disable @typescript-eslint/restrict-template-expressions */
'use client';
// import { useAppSelector } from '@/store/redux/store';
import { getUserInfo } from '@/repository/profile.repository';
import { Radio } from '@material-tailwind/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { type Payment } from './PaymentList';

interface IPaymentOption {
  option: Payment;
  onChange: (paymentOption: Payment) => void;
  currentValue: Current | undefined;
}

interface UserData {
  name: string;
  seedsTag: string;
  email: string;
  pin: string;
  avatar: string;
  bio: string;
  birthDate: string;
  phone: string;
  _pin: string;
  preferredCurrency: string;
}

interface Current {
  id: string;
  payment_method: string;
  logo_url: string;
  payment_type: string;
  admin_fee: number;
  is_promo_available: boolean;
  promo_price: number;
  service_fee: number;
  payment_gateway?: string;
}

const PaymentOption = ({
  option,
  onChange,
  currentValue
}: IPaymentOption): JSX.Element => {
  const [userInfo, setUserInfo] = useState<UserData | null>(null);

  const fetchData = async (): Promise<void> => {
    try {
      const response = await getUserInfo();
      setUserInfo(response);
    } catch (error) {
      toast(`ERROR fetch user info ${error as string}`);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);
  return (
    <>
      {option?.payment_type === 'va' ? (
        option?.payment_method === 'BCA_VA' && (
          <label
            htmlFor={option?.id}
            className="flex justify-between rounded-xl border items-center p-2 pl-4"
          >
            <div>
              <Image
                src={option?.logo_url}
                width={200}
                height={200}
                className="w-auto h-[20px] object-contain object-[center_center]"
                alt={option?.payment_method}
              />
              <div className="text-[#27A590] text-xs mt-1">
                {`Admin fee ${userInfo?.preferredCurrency.toUpperCase()} ${
                  option?.admin_fee
                }`}
              </div>
            </div>
            <Radio
              id={option?.id}
              value={option?.id}
              name="paymentOption"
              className="rounded-xl border"
              color="teal"
              checked={option?.id === currentValue?.id}
              onChange={() => {
                onChange(option);
              }}
            />
          </label>
        )
      ) : (
        <label
          htmlFor={option?.id}
          className="flex justify-between rounded-xl border items-center p-2 pl-4"
        >
          <div>
            <Image
              src={option?.logo_url}
              width={200}
              height={200}
              className="w-auto h-[20px] object-contain object-[center_center]"
              alt={option?.payment_method}
            />
            <div className="text-[#27A590] text-xs mt-1">
              {`Admin fee ${userInfo?.preferredCurrency.toUpperCase()} ${
                option?.admin_fee
              }`}
            </div>
          </div>
          <Radio
            id={option?.id}
            value={option?.id}
            name="paymentOption"
            className="rounded-xl border"
            color="teal"
            checked={option?.id === currentValue?.id}
            onChange={() => {
              onChange(option);
            }}
          />
        </label>
      )}
    </>
  );
};

export default PaymentOption;
