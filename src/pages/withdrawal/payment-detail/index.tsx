/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import PaymentDetail from '@/components/quiz/PaymentDetail';
import withAuth from '@/helpers/withAuth';
import { useRouter } from 'next/router';

const PaymentIndex: React.FC = () => {
  const router = useRouter();
  const { date, ref, withdraw, adminFee, promoPrice, serviceFee, id } =
    router.query;

  return (
    <PaymentDetail
      date={date as string}
      refNumber={ref as string}
      withdraw={withdraw ? parseInt(withdraw as string) : 100000}
      adminFee={parseInt(adminFee as string)}
      promoPrice={parseInt(promoPrice as string)}
      serviceFee={parseInt(serviceFee as string)}
      id={id as string}
    />
  );
};

export default withAuth(PaymentIndex);
