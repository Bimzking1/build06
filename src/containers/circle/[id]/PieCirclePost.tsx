import CCard from '@/components/CCard';
import DoughnutChart from '@/components/DoughnutChart';
import { Copy, EyePurple } from '@/constants/assets/icons';
import { Sprout } from '@/constants/assets/images';
import { generateFullDatetime } from '@/helpers/dateFormat';
import { Avatar, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useState } from 'react';
import CopyPie from './CopyPie';
interface props {
  data: any;
  chartData: any;
}
const PieCirclePost: React.FC<props> = ({ data, chartData }): JSX.Element => {
  const [modalCopyPie, setModalCopyPie] = useState<boolean>(false);

  const sumValueAsset = (assets: any[]): string => {
    const sumAsset = assets.reduce(
      (acc: number, current: any) => acc + parseInt(current.allocation),
      0
    );

    return sumAsset.toString();
  };

  return (
    <CCard className="w-full md:w-2/3 lg:w-1/2 p-5 bg-[#F7FBFA]">
      <CopyPie
        isOpen={modalCopyPie}
        handleOpen={() => {
          setModalCopyPie(!modalCopyPie);
        }}
        chartData={chartData}
        form={data}
      />

      <div className="flex gap-5 items-center">
        <Image
          src={data?.owner.avatar}
          alt="avatar"
          width={48}
          height={48}
          className="outline outline-[#5E44FF] rounded-full"
        />
        <div>
          <div className="flex gap-2 w-full">
            <Typography className="text-black sm:text-xs md:text-lg">
              {data?.owner.name}
            </Typography>
            <Image src={Sprout.src} alt={Sprout.alt} height={22} width={22} />
          </div>
        </div>
      </div>
      <div className="flex justify-between ">
        <div className="flex flex-col gap-3">
          <Typography className="mt-4  aspect-auto">
            {data.pie_title}
          </Typography>
          <div className="flex gap-1">
            {data.pie.map((data: any, idx: number) => (
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
      <div className="flex justify-between mt-2 w-full">
        <div className="flex gap-1 md:gap-3 items-center w-1/2">
          <Image
            src={EyePurple.src}
            alt={EyePurple.alt}
            height={25}
            width={25}
            className="aspect-auto"
          />
          <Typography className="text-sm">{data.privacy}</Typography>
        </div>
        <div>
          <Typography className="font-light text-sm text-gray-400">
            {generateFullDatetime(data.created_at)}
          </Typography>
        </div>
      </div>
    </CCard>
  );
};

export default PieCirclePost;
