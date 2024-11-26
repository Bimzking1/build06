/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable-next-line @typescript-eslint/restrict-plus-operands */
'use client';
import SubmitButton from '@/components/SubmitButton';
import InlineText from '@/containers/play/payment/components/InlineText';
import { standartCurrency } from '@/helpers/currency';
import { selectPromoCodeValidationResult } from '@/store/redux/features/promo-code';
import { type DataPost } from '@/utils/interfaces/social.interfaces';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Input, Typography } from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { type Payment } from './PaymentMethod';

interface WalletFormProps {
  payment: Payment;
  handlePay: (
    type: string,
    paymentGateway: string,
    paymentMethod: string,
    totalAmount: number,
    phoneNumber?: string | undefined
  ) => Promise<void>;
  dataPost: DataPost;
  newPromoCodeDiscount: number;
  userInfo: UserInfo;
}

const ModalEWallet = ({
  payment,
  handlePay,
  dataPost,
  newPromoCodeDiscount,
  userInfo
}: WalletFormProps): JSX.Element => {
  const translationId = 'PlayPayment.WalletForm';
  const { t } = useTranslation();
  const [phone, setPhone] = useState('');
  const [totalFee, setTotalFee] = useState(0);
  const [showOtherFees, setShowOtherFees] = useState(false);

  const promoCodeValidationResult = useSelector(
    selectPromoCodeValidationResult
  );

  useEffect(() => {
    if (dataPost) {
      if (dataPost?.premium_fee - newPromoCodeDiscount === 0) {
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
      ? dataPost?.premium_fee -
          (promoCodeValidationResult?.response?.total_discount ?? 0) ===
        0
        ? 0
        : payment.promo_price
      : 0;

    if (promoCodeValidationResult) {
      _discount += newPromoCodeDiscount;
    }

    if (dataPost) {
      _admissionFee = dataPost?.premium_fee;
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
    setTotalFee(_totalFee);
  }, [
    dataPost,
    payment,
    newPromoCodeDiscount,
    promoCodeValidationResult,
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
            setPhone(e.target.value);
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="">
      {renderPhoneInput()}
      <InlineText
        label={t('social.payment.socialFee')}
        value={`${userInfo?.preferredCurrency ?? 'IDR'}${standartCurrency(dataPost?.premium_fee ?? 0)}`}
        className="mb-2"
      />
      {showOtherFees && (
        <>
          <InlineText
            label={t(`${translationId}.serviceFeeLabel`)}
            value={`${userInfo?.preferredCurrency ?? 'IDR'}${standartCurrency(payment.service_fee ?? 0)}`}
            className="mb-2"
          />
          <InlineText
            label={t(`${translationId}.adminFeeLabel`)}
            value={`${userInfo?.preferredCurrency ?? 'IDR'}${standartCurrency(payment?.admin_fee ?? 0)}`}
            className="mb-2"
          />
          {payment.is_promo_available ? (
            <InlineText
              label={t(`${translationId}.adminFeeDiscountLabel`)}
              value={`- ${userInfo?.preferredCurrency ?? 'IDR'}${standartCurrency(payment.promo_price ?? 0)}`}
              className="mb-2"
            />
          ) : null}
        </>
      )}
      {promoCodeValidationResult ? (
        <>
          <InlineText
            label="Promo Code"
            value={`- ${userInfo?.preferredCurrency ?? 'IDR'}${standartCurrency(
              promoCodeValidationResult?.response?.total_discount
            )}`}
            className="mb-4"
          />
        </>
      ) : null}
      <hr />
      <div className="flex justify-between">
        <Typography className="text-xl text-black font-semibold text-right my-5">
          Total Cost
        </Typography>
        {promoCodeValidationResult?.response?.final_price !== 0 ? (
          <Typography className="text-xl text-[#3AC4A0] font-semibold text-right my-5">
            {userInfo?.preferredCurrency ?? 'IDR'}{' '}
            {standartCurrency(totalFee ?? 0)}
          </Typography>
        ) : (
          <Typography className="text-xl text-[#3AC4A0] font-semibold text-right my-5">
            {userInfo?.preferredCurrency ?? 'IDR'}{' '}
            {standartCurrency(totalFee ?? 0)}
          </Typography>
        )}
      </div>
      <Typography className="text-center text-base font-normal text-[#7C7C7C]">
        This is a risk-free investment because you are using virtual balance for
        the transaction. Please refer to this disclosure for more information
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
            promoCodeValidationResult?.response?.total_discount !== undefined
              ? dataPost?.premium_fee -
                  promoCodeValidationResult?.response?.total_discount
              : dataPost?.premium_fee,
            phone
          );
        }}
      >
        Confirm
      </SubmitButton>
    </div>
  );
};

export default ModalEWallet;
