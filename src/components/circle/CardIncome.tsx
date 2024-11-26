import { Card, Typography } from '@material-tailwind/react';
import Image from 'next/image';

interface props {
  data: Income;
}

interface Income {
  id: string;
  name: string;
  avatar: string;
  income: number;
}

const CardIncome: React.FC<props> = ({ data }) => {
  return (
    <Card className="flex flex-row w-full p-4 mb-5 shadow-none rounded-none bg-[#F9F9F9]">
      <div className="w-1/2 flex flex-row items-center justify-start">
        <div>
          <Image
            src={data.avatar}
            alt={data.name}
            width={100}
            height={100}
            className="w-7 h-7 mr-2 rounded-full"
          />
        </div>
        <div>
          <Typography className="text-sm text-left font-semibold text-[#262626]">
            {data.name}
          </Typography>
          <Typography className="text-xs text-left font-normal text-[#7C7C7C]">
            IDR {data.income}
          </Typography>
        </div>
      </div>
      <div className="w-1/2 items-center justify-center"></div>
    </Card>
  );
};

export default CardIncome;
