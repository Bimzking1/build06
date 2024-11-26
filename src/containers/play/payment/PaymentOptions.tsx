'use client';
import { Typography } from '@material-tailwind/react';
import { type Payment } from './PaymentList';
import PaymentOption from './PaymentOption';

interface IPaymentOptions {
  currentValue: any;
  label: string;
  options: Payment[];
  onChange: (paymentOption: Payment) => void;
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
