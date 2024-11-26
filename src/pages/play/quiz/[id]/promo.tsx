import PromoCode from '@/containers/promo-code';
import withAuth from '@/helpers/withAuth';

const PromoCodeQuiz: React.FC = () => {
  return (
    <div>
      <PromoCode spotType={'Paid Quiz'} />
    </div>
  );
};

export default withAuth(PromoCodeQuiz);
