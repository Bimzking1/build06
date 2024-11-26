/* eslint-disable @typescript-eslint/explicit-function-return-type */
import PaymentList from '@/containers/homepage/event/[id]/payment/PaymentList';
import withAuth from '@/helpers/withAuth';

export interface PaymentData {
  payment: Payment;
  tournament: Tournament;
}

export interface Payment {
  play_id: string;
  currency: string;
  payment_gateway: string;
  payment_method: string;
  phone_number: string;
  promo_code: string;
  invitation_code: string;
  is_use_coins: boolean;
}

export interface Tournament {
  fee: number;
  admission_fee: number;
}

const PaymentPage = () => {
  return <PaymentList />;
};

export default withAuth(PaymentPage);
