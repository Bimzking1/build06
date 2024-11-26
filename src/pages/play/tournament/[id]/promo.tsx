import PromoCode from '@/containers/promo-code';
import withAuth from '@/helpers/withAuth';

const PromoCodeTournament: React.FC = () => {
  return (
    <div>
      <PromoCode spotType={'Paid Tournament'} />
    </div>
  );
};

export default withAuth(PromoCodeTournament);
