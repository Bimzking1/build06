import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IoCloseSharp } from 'react-icons/io5';

interface PaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  classTitle: string;
  amount?: string;
  isUseCoins?: string | boolean;
}

const PaymentPopup: React.FC<PaymentPopupProps> = ({
  isOpen,
  onClose,
  classTitle,
  amount,
  isUseCoins
}) => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation();

  const handleSubmit = (): void => {
    void router.push(
      `/academy/course/${id as string}/payment?coins=${isUseCoins as string}`
    );
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-end justify-center md:items-center z-50">
        <div className="bg-white rounded-t-2xl md:rounded-2xl overflow-hidden w-full md:w-3/4 lg:w-1/2 border-2">
          <div className="px-4 pt-4 flex justify-between items-center">
            <div className="text-lg font-bold">
              {t('academy.payment.enroll')}
            </div>
            <button onClick={onClose} className="text-2xl md:mt-2">
              <IoCloseSharp />
            </button>
          </div>
          <div className="px-4 text-base text-[#7C7C7C]">{classTitle}</div>
          <div className="px-4 py-4 flex flex-col gap-3">
            <div className="flex justify-center">
              <div className="w-1/2 h-24 rounded-lg bg-[#FDBA22] px-2 pt-7 pb-2">
                <div className="bg-white w-full h-full flex flex-col justify-center items-center">
                  <div className="text-center font-bold text-[#FDBA22]">
                    {amount}
                  </div>
                  <div className="text-center text-xs text-[#FDBA22]">
                    {t('academy.payment.class')}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center text-[#7C7C7C]">
              {t('academy.payment.desc')}
            </div>
            {/* Feature below not developed yet */}
            <div className="flex flex-col gap-1 text-[#D89918] cursor-not-allowed opacity-30">
              <div className="bg-[#FFF7D2] py-3 w-full text-center rounded-lg">
                IDR 75.000 /Month
              </div>
              <div className="bg-[#FFF7D2] py-3 w-full text-center rounded-lg">
                IDR 150.000 /3 Month
              </div>
              <div className="bg-[#FFF7D2] py-3 w-full text-center rounded-lg">
                IDR 250.000 /6 Month
              </div>
              <div className="bg-[#FFF7D2] py-3 w-full text-center rounded-lg">
                IDR 350.000 /12 Month
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-[#3AC4A0] text-white py-2 px-4 rounded-3xl"
            >
              {t('academy.payment.buttonPay')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPopup;
