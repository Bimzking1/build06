import { Button, Card, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheck } from 'react-icons/fa';
import { MdOutlinePendingActions } from 'react-icons/md';

interface ReceiptProps {
  amount: number;
  adminFee: number;
  serviceFee: number;
  logoURL: string;
  orderDetail: string;
  orderItem: string;
  currency: string;
  promoAvailable: boolean;
  promoPrice: number;
  isHidden: boolean;
  amountClass: number;
  vaNumber: string;
  howPay: string[];
}

interface HowToPayProps {
  steps: string[];
  vaNumber: string;
}

const HowToPay: React.FC<HowToPayProps> = ({ steps }) => {
  const [isOpen, setIsOpen] = useState(false);

  function parseStrongText(text: string): React.ReactNode[] {
    const regex = /"(.*?)"/g;
    const splitText = text.split(regex);

    return splitText.map((part: string, index: number) => {
      if (index % 2 === 1) {
        return (
          <strong className="font-semibold font-poppins" key={index}>
            {part}
          </strong>
        );
      } else {
        return part;
      }
    });
  }

  const toggleDropdown = (): void => {
    setIsOpen(!isOpen);
  };

  return (
    <Card className="p-5 mt-8 bg-white">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold mb-4">How to Pay</h1>
        <button className="ml-2" onClick={toggleDropdown}>
          {isOpen ? '▲' : '▼'}
        </button>
      </div>
      <div
        className={`overflow-hidden transition-max-height duration-700 ${
          isOpen ? 'max-h-[1000px]' : 'max-h-0'
        }`}
      >
        {steps.map((step: string, index: number) => (
          <div className="flex items-start mb-3 relative" key={index}>
            <div className="flex-shrink-0 w-6 h-6 z-50 rounded-full bg-seeds-purple-2 text-white flex items-center justify-center mr-3">
              {index + 1}
            </div>
            <Typography className="font-poppins text-black">
              {parseStrongText(step)}
            </Typography>
            {index < steps.length - 1 && (
              <div
                className="w-0.5 bg-seeds-purple-2 absolute left-3"
                style={{ height: 'calc(100% + 1.5rem)' }}
              ></div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

const Receipt: React.FC<ReceiptProps> = ({
  amount,
  adminFee,
  serviceFee,
  logoURL,
  orderDetail,
  orderItem,
  currency,
  promoAvailable,
  promoPrice,
  isHidden,
  amountClass,
  vaNumber,
  howPay
}) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div hidden={isHidden}>
      <div className="bg-white py-10 rounded-xl shadow-md flex flex-col gap-5">
        <div className="flex items-center justify-center rounded-xl w-full">
          <Card
            className="py-3 px-10 rounded-3xl shadow-none w-full sm:w-10/12 md:w-10/12 lg:w-8/12 xl:w-6/12 h-full border-2"
            style={{
              backgroundImage: "url('/assets/academy/top-bg-receipt.svg')",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'top'
            }}
          >
            <div className="flex items-center justify-center mb-4 mt-3">
              {orderDetail === 'SETTLEMENT' ? (
                <>
                  <span className="rounded-full bg-[#74d5bc] w-10 h-10 animate-ping relative"></span>
                  <span className="text-2xl rounded-full border p-2 bg-[#efe7fc] absolute">
                    <FaCheck />
                  </span>
                </>
              ) : (
                <>
                  <span className="rounded-full bg-[#74d5bc] w-10 h-10 animate-ping relative"></span>
                  <span className="text-2xl rounded-full border p-2 bg-[#efe7fc] absolute">
                    <MdOutlinePendingActions />
                  </span>
                </>
              )}
            </div>
            <Typography className="text-2xl font-semibold text-white text-center">
              {orderDetail === 'SETTLEMENT'
                ? t('academy.payment.success')
                : t('academy.payment.pending')}
            </Typography>
            <Typography className="text-sm font-normal text-white text-center">
              {orderDetail === 'SETTLEMENT'
                ? t('academy.payment.success1')
                : t('academy.payment.pending1')}
            </Typography>
            <Typography className="text-sm font-normal text-white text-center">
              {orderDetail === 'SETTLEMENT'
                ? t('academy.payment.success2')
                : t('academy.payment.pending2')}
            </Typography>

            <Card className="px-5 py-2 mt-8 bg-white w-full">
              <Typography className="text-sm font-semibold text-[#BDBDBD] text-center">
                {t('academy.payment.method')}
              </Typography>
              <div className="flex items-center justify-center mb-9 mt-3">
                <Image
                  src={logoURL}
                  alt="logo"
                  className="object-cover"
                  width={100}
                  height={100}
                />
              </div>
              <hr className="border-t-2 border-dashed" />
              <div className="flex justify-between relative bottom-3 z-50">
                <div className="bg-[#3AC4A0] h-6 rounded-full w-6 -mx-8 outline-none" />
                <div className="bg-[#38be9b] h-6 rounded-full w-6 -mx-8 outline-none" />
              </div>

              <div className="flex flex-row justify-between my-5">
                <Typography className="text-sm font-semibold text-[#BDBDBD]">
                  {t('academy.payment.costAcademy')}
                </Typography>
                <Typography className="text-sm font-semibold text-[#262626]">
                  {currency} {amountClass}
                </Typography>
              </div>
              <div className="flex flex-row justify-between mb-5">
                <Typography className="text-sm font-semibold text-[#BDBDBD]">
                  {t('academy.payment.adminFee')}
                </Typography>
                <Typography className="text-sm font-semibold text-[#262626]">
                  {currency} {adminFee}
                </Typography>
              </div>
              <div className="flex flex-row justify-between mb-5">
                <Typography className="text-sm font-semibold text-[#BDBDBD]">
                  {t('academy.payment.serviceFee')}
                </Typography>
                <Typography className="text-sm font-semibold text-[#262626]">
                  {currency} {serviceFee}
                </Typography>
              </div>
              <div className="flex flex-row justify-between mb-5">
                <Typography className="text-sm font-semibold text-[#BDBDBD]">
                  Promo
                </Typography>
                <Typography className="text-sm font-semibold text-[#262626]">
                  {currency} {promoAvailable ? promoPrice : 0}
                </Typography>
              </div>
              <div className="flex flex-row justify-between mb-5">
                <Typography className="text-sm font-semibold text-[#BDBDBD]">
                  {t('academy.payment.discountCoins')}
                </Typography>
                <Typography className="text-sm font-semibold text-[#262626]">
                  {currency}{' '}
                  {serviceFee +
                    adminFee -
                    (amount - amountClass) -
                    (promoAvailable ? promoPrice : 0)}
                </Typography>
              </div>
              <hr className="mb-5 border border-t-3" />
              <div className="flex flex-row justify-between mb-5">
                <Typography className="text-sm font-semibold text-[#BDBDBD]">
                  {t('academy.payment.amount')}
                </Typography>
                <Typography className="text-sm font-semibold text-[#262626]">
                  {currency} {amount}
                </Typography>
              </div>
            </Card>

            {vaNumber !== undefined && howPay.length > 0 && (
              <HowToPay steps={howPay} vaNumber={vaNumber} />
            )}

            <div className="w-full flex items-center justify-center">
              <Button
                className="w-full text-sm font-semibold bg-[#3AC4A0] mt-10 rounded-full capitalize"
                onClick={() => {
                  void router.replace(`/academy/course/${orderItem}`);
                }}
              >
                {t('academy.payment.closeReceipt')}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
