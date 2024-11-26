import CCard from '@/components/CCard';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import { Typography } from '@material-tailwind/react';

const Assets: React.FC = () => {
  return (
    <PageGradient defaultGradient className="w-full">
      <CCard className="flex p-2 md:mt-5 md:rounded-lg border-none rounded-none">
        <Typography className="text-center text-black text-2xl font-bold">
          Coming Soon...
        </Typography>
      </CCard>
    </PageGradient>
  );
};

export default Assets;
