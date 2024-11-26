import PromoCode from '@/containers/promo-code';
import withAuth from '@/helpers/withAuth';

const PromoCodeCircle: React.FC = () => {
  return (
    <div>
      <PromoCode spotType={'Premium Circle'} />
    </div>
  );
};

export default withAuth(PromoCodeCircle);
