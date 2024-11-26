/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable-next-line @typescript-eslint/restrict-plus-operands */
'use client';
import SubmitButton from '@/components/SubmitButton';
import { getTransactionSummary } from '@/repository/seedscoin.repository';
import { selectPromoCodeValidationResult } from '@/store/redux/features/promo-code';
import { Input, Typography } from '@material-tailwind/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  type DetailTournament,
  type Payment,
  type UserData
} from './PaymentList';
import InlineText from './components/InlineText';

interface WalletFormProps {
  payment: Payment;
  handlePay: (
    type: string,
    paymentGateway: string,
    paymentMethod: string,
    totalAmount: number,
    phoneNumber?: string | undefined
  ) => Promise<void>;
  dataPost: DetailTournament;
  numberMonth?: number;
  userInfo: UserData;
  newPromoCodeDiscount: number;
}

const WalletForm = ({
  payment,
  handlePay,
  dataPost,
  numberMonth,
  userInfo,
  newPromoCodeDiscount
}: WalletFormProps): JSX.Element => {
  const translationId = 'PlayPayment.WalletForm';
  const { t } = useTranslation();
  const [phone, setPhone] = useState('');
  const [admissionFee, setAdmissionFee] = useState(0);
  const [adminFee, setAdminFee] = useState(0);
  const [totalFee, setTotalFee] = useState(0);
  const [coinsDiscount, setCoinsDiscount] = useState(0);
  const router = useRouter();
  const [showOtherFees, setShowOtherFees] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
  const promoCodeValidationResult = useSelector(
    selectPromoCodeValidationResult
  );

  const handleGetCoinsUser = async (): Promise<void> => {
    const useCoins = router.query.useCoins;
    if (useCoins === 'true') {
      const resCoins = await getTransactionSummary();
      setCoinsDiscount(resCoins?.data?.total_available_coins || 0);
    }
  };

  useEffect(() => {
    void handleGetCoinsUser();
  }, []);

  useEffect(() => {
    if (dataPost) {
      if (dataPost.admission_fee - newPromoCodeDiscount === 0) {
        setShowOtherFees(false);
      } else {
        setShowOtherFees(true);
      }
    }
  }, [dataPost, newPromoCodeDiscount]);

  useEffect(() => {
    let _admissionFee = 0;
    let _adminFee = 0;
    let _totalFee = 0;
    let _discount = 0;

    _discount = payment.is_promo_available
      ? (showOtherFees ? payment.promo_price : 0) +
        (coinsDiscount > 0 ? coinsDiscount : 0)
      : coinsDiscount > 0
      ? coinsDiscount
      : 0;
    if (promoCodeValidationResult) {
      _discount += newPromoCodeDiscount;
    }

    if (dataPost) {
      _admissionFee = dataPost?.admission_fee;
      _adminFee = payment?.admin_fee;
      _totalFee = parseFloat(
        `${(
          Number(_admissionFee) -
          Number(_discount) +
          (showOtherFees ? Number(_adminFee) : 0) +
          (showOtherFees ? Number(payment.service_fee) : 0)
        ).toFixed(2)}`
      );
    }

    if (coinsDiscount > 0) {
      setCoinsDiscount(Math.min(coinsDiscount, _admissionFee));
    } else {
      setCoinsDiscount(0);
    }

    setAdmissionFee(_admissionFee);
    setAdminFee(_adminFee);
    setTotalFee(_totalFee);
  }, [
    dataPost,
    numberMonth,
    payment,
    coinsDiscount,
    promoCodeValidationResult,
    newPromoCodeDiscount,
    showOtherFees
  ]);

  const renderPhoneInput = (): JSX.Element => (
    <div className="mb-2">
      <Typography className="mb-2 text-[#B9B7B7] font-semibold">
        {t(`${translationId}.phoneLabel`, { wallet: payment?.payment_method })}
      </Typography>
      <div className="flex mb-2 border-[#E0E0E0] border rounded-xl">
        <Typography className="font-normal text-[#B9B7B7] flex h-10 items-center pr-0 pl-3">
          +62
        </Typography>
        <Input
          type="tel"
          placeholder={t(`${translationId}.phonePlaceholder`) ?? ''}
          className="!border-0 font-normal"
          labelProps={{
            className: 'before:content-none after:content-none'
          }}
          containerProps={{
            className: 'min-w-0'
          }}
          value={phone}
          onChange={e => {
            let inputValue = e.target.value;
            inputValue = inputValue.replace(/[^0-9]/g, '');
            if (inputValue.charAt(0) === '0') {
              inputValue = '8' + inputValue.slice(1);
            }
            setPhone(inputValue);
          }}
          onPaste={e => {
            e.preventDefault();
            return false;
          }}
          maxLength={13}
        />
      </div>
    </div>
  );

  return (
    <div className="">
      {renderPhoneInput()}
      <InlineText
        label={'Join Tournament'}
        value={`${userInfo?.preferredCurrency} ${admissionFee}`}
        className="mb-2"
      />
      {showOtherFees && (
        <>
          <InlineText
            label={t(`${translationId}.serviceFeeLabel`)}
            value={`${userInfo?.preferredCurrency} ${payment.service_fee}`}
            className="mb-2"
          />
          <InlineText
            label={t(`${translationId}.adminFeeLabel`)}
            value={`${userInfo?.preferredCurrency} ${adminFee}`}
            className="mb-2"
          />
          {payment.is_promo_available ? (
            <InlineText
              label={t(`${translationId}.adminFeeDiscountLabel`)}
              value={`- ${userInfo?.preferredCurrency} ${payment.promo_price}`}
              className="mb-2"
            />
          ) : null}
        </>
      )}
      {promoCodeValidationResult ? (
        <InlineText
          label={t(`${translationId}.promoCodeDiscountLabel`)}
          value={`- ${userInfo?.preferredCurrency} ${newPromoCodeDiscount}`}
          className="mb-2"
        />
      ) : null}
      {coinsDiscount > 0 && (
        <InlineText
          label={t(`${translationId}.seedsCoin`)}
          value={`- ${userInfo?.preferredCurrency} ${coinsDiscount}`}
          className="mb-2"
        />
      )}
      <hr />
      <Typography className="text-3xl text-[#3AC4A0] font-semibold text-right my-6">
        {`${userInfo?.preferredCurrency} ${totalFee}`}
      </Typography>
      <hr />
      <SubmitButton
        className="my-4"
        disabled={phone.length < 1}
        onClick={async () => {
          await handlePay(
            payment?.payment_type,
            payment?.payment_gateway ?? '',
            payment?.payment_method,
            totalFee,
            phone
          );
        }}
      >
        {t(`${translationId}.button`)}
      </SubmitButton>
    </div>
  );
};

export default WalletForm;
