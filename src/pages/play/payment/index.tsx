import PaymentList from '@/containers/play/payment/PaymentList';
import withAuth from '@/helpers/withAuth';

const PlayPayment = (): JSX.Element => {
  return <PaymentList />;
};

export default withAuth(PlayPayment);
