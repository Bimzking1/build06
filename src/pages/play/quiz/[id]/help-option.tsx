/* eslint-disable @typescript-eslint/explicit-function-return-type */
import PaymentList from '@/containers/play/payment/PaymentList';
import HelpOption from '@/containers/play/quiz/HelpOption';
import withAuth from '@/helpers/withAuth';
import {
  type LifelinesEnum,
  type LifelinesI
} from '@/utils/interfaces/quiz.interfaces';
import { useRouter } from 'next/router';
import { useState } from 'react';

export interface PaymentData {
  payment: Payment;
  quiz: Quiz;
}

export interface Payment {
  quiz_id: string;
  lifelines: LifelinesEnum[];
  language: string;
  payment_gateway: string;
  payment_method: string;
  phone_number: string;
  promo_code: string;
  invitation_code: string;
  is_use_coins: boolean;
}

export interface Quiz {
  lifelines: LifelinesI[];
  fee: number;
  admission_fee: number;
}

const HelpOptionContainer = () => {
  const [showing, setShowing] = useState<'lifeline' | 'payment'>('lifeline');
  const [paymentData, setPaymentData] = useState<PaymentData>();
  const router = useRouter();
  const invitationCode = router.query.invitationCode ?? '';
  const useCoins = router.query.useCoins === 'true';
  return showing === 'lifeline' ? (
    <HelpOption
      onPay={data => {
        setShowing('payment');
        setPaymentData(data);
      }}
    />
  ) : (
    <PaymentList
      dataPost={paymentData}
      invitationCode={invitationCode as string}
      useCoins={useCoins}
    />
  );
};

export default withAuth(HelpOptionContainer);
