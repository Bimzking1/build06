import PromoCode from '@/containers/promo-code';
import withAuth from '@/helpers/withAuth';

const PromoCodeContent: React.FC = () => {
  return (
    <div>
      <PromoCode spotType={'Premium Content'} />
    </div>
  );
};

export default withAuth(PromoCodeContent);
