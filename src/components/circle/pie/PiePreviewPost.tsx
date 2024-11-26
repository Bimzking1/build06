import CCard from '@/components/CCard';
import DoughnutChart from '@/components/DoughnutChart';
import { Avatar, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { Sprout } from 'public/assets/images';

interface props {
  form: any;
  userData: any;
  data: any;
  chartData: any;
}

const PiePreviewPost: React.FC<props> = ({
  form,
  userData,
  data,
  chartData
}) => {
  const sumValueAsset = (assets: any[]): string => {
    const sumAsset = assets.reduce(
      (acc: number, current: any) => acc + parseInt(current.value),
      0
    );

    return sumAsset.toString();
  };

  return (
    <CCard className="w-2/3 p-5 bg-[#F7FBFA]">
      <div className="flex gap-5 items-center">
        <Image
          src={userData.avatar}
          alt="avatar"
          width={48}
          height={48}
          className="outline outline-[#5E44FF] rounded-full"
        />
        <div>
          <div className="flex gap-2 w-full">
            <Typography className="text-black sm:text-xs md:text-lg">
              {userData.name}
            </Typography>
            <Image src={Sprout.src} alt={Sprout.alt} height={22} width={22} />
          </div>
        </div>
      </div>
      <div className="flex justify-between ">
        <div className="flex flex-col gap-3">
          <Typography className="mt-4  aspect-auto">
            {form.pie_title}
          </Typography>
          <div className="flex gap-1">
            {data.map((data: any, idx: number) => (
              <Avatar key={idx} size="xs" src={data.logo} className="mr-2" />
            ))}
          </div>
          <Typography variant="paragraph" className="font-bold">
            Rp.{form.pie_amount}
          </Typography>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-[100px] lg:w-[130px] aspect-auto">
            <DoughnutChart
              data={chartData}
              centerText={'+' + sumValueAsset(data) + '%'}
            />
          </div>
        </div>
      </div>
    </CCard>
  );
};

export default PiePreviewPost;
