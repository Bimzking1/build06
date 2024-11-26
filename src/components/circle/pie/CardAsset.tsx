import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import {
  Avatar,
  Card,
  CardBody,
  Checkbox,
  Typography
} from '@material-tailwind/react';
import { useRouter } from 'next/router';
import React from 'react';

interface IassetsData {
  assetType: string;
  createdAt: Date | string;
  description: string;
  exchange: string;
  exchangeCurrency: string;
  id: string;
  isActive: boolean;
  listedCountry: string;
  logo: string;
  name: string;
  priceBarHistory: any[];
  exchangeRate: number;
  realTicker: string;
  seedsTicker: string;
  updatedAt: Date | string;
  currentPrice: number;
  currentPoint: number;
  currentPl: number;
  lastUpdated: Date | string;
  priceBar: any;
}

interface props {
  data: IassetsData;
  handleSelectedAsset?: any;
  isDefaultChecked?: any;
  isClick?: boolean;
}

const CardAsset: React.FC<props> = ({
  data,
  handleSelectedAsset,
  isDefaultChecked,
  isClick = false
}) => {
  const router = useRouter();
  const handleArrow = (value: number): boolean => {
    if (value > 0) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Card
      shadow={false}
      className={`w-full my-3 bg-[#F9F9F9] ${isClick ? 'cursor-pointer' : ''}`}
      onClick={
        isClick
          ? () => {
              router.push(`/homepage/assets/${data.id}`).catch(error => {
                console.log(error);
              });
            }
          : () => {}
      }
    >
      <CardBody className="p-3 inline-block h-auto">
        <div className="flex flex-row items-center">
          <Avatar
            size="md"
            variant="circular"
            src={data.logo}
            alt="tania andrew"
          />

          <div className="flex ml-5 w-1/2 flex-col gap-0.5">
            <div className="flex flex-row">
              <Typography className="font-semibold text-base text-[#262626]">
                {data.realTicker} /
              </Typography>
              <Typography className="font-normal ml-1 text-base text-[#262626]">
                {data.exchangeCurrency}
              </Typography>
            </div>
            <Typography className="font-normal text-sm text-[#7C7C7C]">
              {data.name}
            </Typography>
          </div>

          <div className="ml-auto flex flex-col gap-0.5">
            <Typography className="font-semibold text-base text-[#262626]">
              Rp {new Intl.NumberFormat().format(data.priceBar?.open)}
            </Typography>
            <Typography
              className={`flex font-normal text-sm ${
                handleArrow(data.exchangeRate)
                  ? 'text-[#3AC4A0]'
                  : 'text-red-500'
              }`}
            >
              {handleArrow(data.exchangeRate) ? (
                <ArrowTrendingUpIcon height={20} width={20} className="mr-2" />
              ) : (
                <ArrowTrendingDownIcon
                  height={20}
                  width={20}
                  className="mr-2"
                />
              )}
              {data.exchangeRate}
            </Typography>
          </div>
          {handleSelectedAsset !== undefined ? (
            <div>
              <Checkbox
                className="border-[#3AC4A0]"
                color="green"
                value={JSON.stringify(data)}
                onClick={handleSelectedAsset}
                defaultChecked={isDefaultChecked(data)}
              />
            </div>
          ) : null}
        </div>
      </CardBody>
    </Card>
  );
};

export default CardAsset;
