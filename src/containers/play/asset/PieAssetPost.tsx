import CCard from '@/components/CCard';
import DoughnutChart from '@/components/DoughnutChart';
import { Copy } from '@/constants/assets/icons';
import CopyPie from '@/containers/circle/[id]/CopyPie';
import { type ForYouPostI, type Pie } from '@/utils/interfaces/play.interface';
import { Avatar, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useState } from 'react';
import { type ChartData } from './SocialCard';
interface props {
  data: ForYouPostI;
  chartData: ChartData;
}
const PieAssetPost: React.FC<props> = ({ data, chartData }): JSX.Element => {
  const [modalCopyPie, setModalCopyPie] = useState<boolean>(false);

  const sumValueAsset = (assets: Pie[]): string => {
    const sumAsset = assets.reduce(
      (acc: number, current: Pie) => acc + current.allocation,
      0
    );

    return sumAsset.toString();
  };

  return (
    <CCard className="w-full p-5 bg-[#F7FBFA]">
      <CopyPie
        isOpen={modalCopyPie}
        handleOpen={() => {
          setModalCopyPie(!modalCopyPie);
        }}
        chartData={chartData}
        form={data}
      />
      <div className="flex justify-between ">
        <div className="flex flex-col gap-3">
          <Typography className="mt-4  aspect-auto">
            {data.pie_title}
          </Typography>
          <div className="flex gap-1">
            {data.pie.map((data: Pie, idx: number) => (
              <Avatar
                key={idx}
                src={data.logo}
                alt={data.name}
                width={30}
                height={30}
                className="mr-1"
              />
            ))}
          </div>
          <Typography variant="paragraph" className="font-bold">
            Rp.{new Intl.NumberFormat().format(data.pie_amount)}
          </Typography>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-[100px] lg:w-[130px] aspect-auto">
            <DoughnutChart
              data={chartData}
              centerText={'+' + sumValueAsset(data.pie) + '%'}
            />
          </div>
          <div className="flex justify-end">
            <div
              className="bg-[#5E44FF] flex gap-1 justify-center items-center w-fit aspect-auto rounded-full px-3 py-2"
              onClick={() => {
                setModalCopyPie(!modalCopyPie);
              }}
            >
              <Image src={Copy.src} alt={Copy.alt} width={15} height={15} />
              <Typography className="text-white text-sm hidden md:flex">
                Copy Pie
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </CCard>
  );
};

export default PieAssetPost;
