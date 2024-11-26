// import Image from 'next/image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IoCloseSharp } from 'react-icons/io5';

interface SummaryPayProps {
  isOpen: boolean;
  onClose: () => void;
  payment: string;
  amount: number;
  adminFee: number;
  serviceFee: number;
  promoAvailable: boolean;
  promoPrice: number;
  currency: string;
  onConfirm: () => void;
  coins: number;
}

const SummaryPay: React.FC<SummaryPayProps> = ({
  isOpen,
  onClose,
  payment,
  amount,
  adminFee,
  serviceFee,
  promoAvailable,
  promoPrice,
  currency,
  onConfirm,
  coins
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const totalCost =
    amount +
    adminFee +
    serviceFee -
    (promoAvailable ? promoPrice : 0) -
    Math.min(0.8 * amount, coins);

  return (
    <>
      <div
        className="fixed inset-0 bg-black opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-end justify-center md:items-center z-50">
        <div className="bg-white rounded-t-2xl md:rounded-2xl overflow-hidden w-full md:w-3/4 lg:w-1/2 border-2">
          <div className="flex justify-center my-3 md:hidden">
            <button
              onClick={onClose}
              className="bg-[#E9E9E9] py-1 px-14 text-xl rounded-3xl"
            ></button>
          </div>
          <div className="px-4 pt-4 flex justify-between items-center">
            <div className="text-lg font-bold">
              {t('academy.payment.summary')}
            </div>
            <button
              onClick={onClose}
              className="text-2xl md:mt-2 hidden md:block"
            >
              <IoCloseSharp />
            </button>
          </div>
          <div className="px-4">
            <div className="grid grid-cols-2">
              <div>
                <div className="mt-4 mb-4">
                  {t('academy.payment.costAcademy')}
                </div>
                <div className="mb-4">{t('academy.payment.adminFee')}</div>
                <div className="mb-4">{t('academy.payment.serviceFee')}</div>
                <div className="mb-4">Promo</div>
                <div className="mb-4">{t('academy.payment.discountCoins')}</div>
              </div>
              <div>
                <div className="text-right mt-4 mb-4">
                  {currency} {amount}
                </div>
                <div className="text-right mb-4">
                  {currency} {adminFee}
                </div>
                <div className="text-right mb-4">
                  {currency} {serviceFee}
                </div>
                <div className="text-right mb-4">
                  {currency} {promoAvailable ? promoPrice : 0}
                </div>
                <div className="text-right mb-4">
                  {currency} {Math.min(0.8 * amount, coins)}
                </div>
              </div>
            </div>
            <hr className="border-t-2" />
            <div className="grid grid-cols-2 my-4">
              <div className="font-bold">{t('academy.payment.totalCost')}</div>
              <div className="text-right font-bold">
                {currency} {totalCost}
              </div>
            </div>
            {/* develop later when feature is ready */}
            {/* <div className="mb-10 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Image
                  src="/assets/academy/promo-icon.svg"
                  alt="promo-icon"
                  width={24}
                  height={24}
                />
              </div>
              <input
                disabled
                type="text"
                className="pl-10 pr-4 py-3 rounded-xl border-2 w-full"
                placeholder="Input Promo Code"
              />
            </div> */}
          </div>
          <div className="px-4 py-4 flex flex-col gap-3">
            <button
              onClick={onConfirm}
              className="w-full bg-[#3AC4A0] text-white py-2 px-4 rounded-3xl"
            >
              {t('academy.payment.payWith')} {payment}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SummaryPay;
