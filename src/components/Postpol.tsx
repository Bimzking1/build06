'use client';
import { Progress, Typography } from '@material-tailwind/react';
import CCard from './CCard';

interface PolProps {
  data?: Record<string, unknown>;
}

const PostPol: React.FC<PolProps> = ({ data }) => {
  return (
    <CCard className="w">
      <div className="flex">
        <div className="flex w-full items-center justify-between px-5 z-20">
          <Typography className="font-bold text-lg text-black">
            Crypto
          </Typography>
          <Typography className="font-bold text-lg text-black">50%</Typography>
        </div>
        <Progress
          value={50}
          color="light-green"
          className="h-8 absolute rounded-full z-10 left-0 right-0 bottom-0"
        />
      </div>
    </CCard>
  );
};

export default PostPol;
