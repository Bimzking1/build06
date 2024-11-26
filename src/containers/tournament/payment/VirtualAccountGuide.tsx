'use client';
import SubmitButton from '@/components/SubmitButton';
import { selectPromoCodeValidationResult } from '@/store/redux/features/promo-code';
import { Button, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { type DetailTournament, type Payment } from './PaymentList';
import Divider from './components/Divider';
import InlineText from './components/InlineText';

interface VirtualAccountGuideProps {
  payment: Payment;
  dataPost: DetailTournament;
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
  newPromoCodeDiscount: number;
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
  newPromoCodeDiscount,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  user_name
}: VirtualAccountGuideProps): JSX.Element => {
  const { t } = useTranslation();
  const accountNumber = paymentStatus != null ? paymentStatus.vaNumber : '';
  const [showOtherFees, setShowOtherFees] = useState<boolean>(false);
  const promoCodeValidationResult = useSelector(
    selectPromoCodeValidationResult
  );
  const accountName = '';
  const userName = user_name;
  const discount =
    promoCodeValidationResult !== 0
      ? promoCodeValidationResult?.response?.total_discount
      : 0;
  const admissionFee = dataPost?.admission_fee * numberMonth;
  const adminFee = payment?.admin_fee;
  const serviceFee = payment?.service_fee;
  const promoPrice = payment?.promo_price;
  const totalFee = parseInt(
    `${
      admissionFee +
      (+(showOtherFees ? adminFee : 0) +
        (showOtherFees ? serviceFee : 0) -
        (payment?.is_promo_available ? promoPrice : 0) -
        discount)
    }`
  );

  const translationsId = 'PlayPayment.VirtualAccountGuide';
  const translationId = 'PlayPayment.WalletForm';
  const bankName = payment?.payment_method?.split('_')[0];

  useEffect(() => {
    if ((dataPost?.admission_fee ?? 0) - newPromoCodeDiscount === 0) {
      setShowOtherFees(false);
    } else {
      setShowOtherFees(true);
    }
  }, [dataPost, newPromoCodeDiscount]);

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
      <Typography className="text-[#201B1C] font-normal">
        {t(`${translationsId}.accountNumberLabel`)}
      </Typography>
      <div className="flex justify-between mb-4">
        <Typography className="text-[#7555DA] font-normal">
          {accountNumber}
        </Typography>
        <Button
          variant="text"
          onClick={() => {}}
          className="text-[#3AC4A0] text-md font-normal p-0 normal-case "
        >
          {t(`${translationsId}.copy`)}
        </Button>
      </div>
      <Typography className="text-[#201B1C] font-normal">
        {t(`${translationsId}.accountNameLabel`)}
      </Typography>
      <Typography className="text-[#7555DA] font-normal">
        {accountName}
      </Typography>
      <Divider />
      <InlineText
        label={
          dataPost !== undefined
            ? 'Circle Membership'
            : t(`${translationsId}.admissionFeeLabel`)
        }
        value={`IDR ${admissionFee}`}
        className="mb-2"
      />
      {showOtherFees && (
        <>
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
        </>
      )}
      {promoCodeValidationResult !== undefined ? (
        <InlineText
          label={t(`${translationId}.promoCodeDiscountLabel`)}
          value={`- IDR ${
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            promoCodeValidationResult?.response?.total_discount ?? 0
          }`}
          className="mb-2"
        />
      ) : null}
      <Divider />
      <Typography className="text-3xl text-[#3AC4A0] font-semibold text-right">
        {`IDR ${totalFee}`}
      </Typography>
      <Divider />
      <Typography className="text-[#DD2525] font-normal text-sm mb-6">
        {t(`${translationsId}.note`)}
      </Typography>
      <Typography className="text-[#262626] font-normal">
        {t(`${translationsId}.instructionLabel`)}
      </Typography>
      <Divider />
      <Typography className="text-[#262626] font-normal mb-4">
        1.
        <a className="text-[#7C7C7C]"> {t(`${translationsId}.step1.1`)} </a>
        {t(`${translationsId}.step1.2`, {
          provider: bankName
        })}
      </Typography>
      <Typography className="text-[#262626] font-normal mb-4">
        2.
        <a className="text-[#7C7C7C]"> {t(`${translationsId}.step2.1`)} </a>
        {t(`${translationsId}.step2.2`)}
        <a className="text-[#7555DA]"> {accountNumber}</a>
        <a className="text-[#7C7C7C]"> {t(`${translationsId}.step2.3`)} </a>
        {t(`${translationsId}.step2.4`)}
      </Typography>
      <Typography className="text-[#262626] font-normal mb-4">
        3.
        <a className="text-[#7C7C7C]"> {t(`${translationsId}.step3.1`)} </a>
        {t(`${translationsId}.step3.2`)}
        <a className="text-[#7C7C7C]"> {t(`${translationsId}.step3.3`)} </a>
        {userName}.
        <a className="text-[#7C7C7C]"> {t(`${translationsId}.step3.4`)} </a>
        {t(`${translationsId}.step3.5`)}
      </Typography>
      <Typography className="text-[#262626] font-normal mb-4">
        4.
        <a className="text-[#7C7C7C]">
          {' '}
          {t(`${translationsId}.step4.1`, { provider: bankName })}{' '}
        </a>
        {t(`${translationsId}.step4.2`)}
      </Typography>
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
        {paymentStatus?.vaNumber !== undefined ? 'Pay' : 'Cek No Rekening'}
      </SubmitButton>
      <Divider />
    </div>
  );
};

export default VirtualAccountGuide;
