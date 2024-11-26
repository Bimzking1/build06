'use client';
import SubmitButton from '@/components/SubmitButton';
import { type EventList } from '@/utils/interfaces/event.interface';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type Payment } from './PaymentList';
import Divider from './components/Divider';
import InlineText from './components/InlineText';

interface VirtualAccountGuideProps {
  payment: Payment;
  dataPost: EventList;
  handlePay: (
    type: string,
    paymentGateway: string,
    paymentMethod: string,
    totalAmount: number,
    phoneNumber?: string | undefined
  ) => Promise<void>;
  numberMonth: number;
  paymentStatus: PaymentStatus | undefined;
  user_name: string | undefined;
}

export interface PaymentStatus {
  orderId: string;
  transactionId: string;
  fraudStatus: string;
  transactionStatus: string;
  currency: string;
  merchantId: string;
  paymentGateway: string;
  itemName: string;
  itemId: string;
  quantity: number;
  grossAmount: number;
  paymentMethod: string;
  vaNumber: string;
  howToPayApi: string;
}

const VirtualAccountGuide = ({
  payment,
  dataPost,
  handlePay,
  numberMonth,
  paymentStatus,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  user_name
}: VirtualAccountGuideProps): JSX.Element => {
  const { t } = useTranslation();
  const admissionFee = dataPost?.event_price * numberMonth;
  const adminFee = payment?.admin_fee;
  const serviceFee = payment?.service_fee;
  const promoPrice = payment?.promo_price;

  const translationsId = 'seedsEvent.payment.VirtualAccountGuide';
  const translationId = 'seedsEvent.payment.WalletForm';
  const bankName = payment?.payment_method?.split('_')[0];

  const [totalFee, setTotalFee] = useState<number>(0);

  useEffect(() => {
    const totalFee = parseInt(
      `${
        (admissionFee ?? 0) +
        ((adminFee ?? 0) +
          (serviceFee ?? 0) -
          (payment?.is_promo_available ? promoPrice ?? 0 : 0))
      }`
    );
    setTotalFee(totalFee);
  }, []);

  return (
    <div className="max-h-[70vh]">
      <div className="flex items-center">
        <Image
          src={payment?.logo_url}
          width={200}
          height={200}
          className="h-[20px] w-auto mr-2 object-contain"
          alt={payment?.payment_method}
        />
        <Typography className="text-[#201B1C] font-normal text-md">
          {t(`${translationsId}.bankName`, { bank: bankName })}
        </Typography>
      </div>
      <Divider />
      <InlineText
        label={t('seedsEvent.payment.eventFee')}
        value={`IDR ${admissionFee}`}
        className="mb-2"
      />
      <InlineText
        label={t(`${translationId}.serviceFeeLabel`)}
        value={`IDR ${serviceFee}`}
        className="mb-2"
      />
      <InlineText
        label={t(`${translationsId}.adminFeeLabel`)}
        value={`IDR ${adminFee}`}
        className="mb-2"
      />
      {payment.is_promo_available ? (
        <InlineText
          label={t(`${translationId}.adminFeeDiscountLabel`)}
          value={`- IDR ${promoPrice}`}
          className="mb-2"
        />
      ) : null}
      <Divider />
      <Typography className="text-3xl text-[#3AC4A0] font-semibold text-right">
        {`IDR ${totalFee}`}
      </Typography>
      <Divider />
      <Typography className="text-[#3C49D6] font-semibold mb-2 text-sm">
        {t(`${translationsId}.instructionMessage`)}
      </Typography>
      <Typography className="text-[#DD2525] font-normal text-sm mb-6">
        {t(`${translationsId}.note`)}
      </Typography>
      <Divider />
      <SubmitButton
        onClick={async () => {
          await handlePay(
            payment?.payment_type,
            payment?.payment_gateway ?? 'DOKU',
            payment?.payment_method,
            totalFee
          );
        }}
      >
        {t(`${translationsId}.continue`)}
      </SubmitButton>
      <Divider />
    </div>
  );
};

export default VirtualAccountGuide;
