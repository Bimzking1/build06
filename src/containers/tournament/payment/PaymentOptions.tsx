'use client';
import { Typography } from '@material-tailwind/react';
import { type Payment } from './PaymentList';
import PaymentOption from './PaymentOption';

interface IPaymentOptions {
  currentValue: Current | undefined;
  label: string;
  options: Payment[];
  onChange: (paymentOption: Payment) => void;
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

const PaymentOptions = ({
  currentValue,
  label,
  options,
  onChange
}: IPaymentOptions): JSX.Element => (
  <div className="w-full mb-6">
    <Typography className="text-[#7C7C7C] text-sm font-semibold text-left mb-4">
      {label}
    </Typography>
    <div className="flex flex-col gap-4">
      {options?.map(option => (
        <PaymentOption
          key={option?.id}
          option={option}
          onChange={onChange}
          currentValue={currentValue}
        />
      ))}
    </div>
  </div>
);

export default PaymentOptions;
