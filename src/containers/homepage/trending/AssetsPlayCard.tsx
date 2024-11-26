import { calculatePercentageDifference } from '@/helpers/currency';
import { type AssetItemType } from '@/pages/homepage/play/[id]';
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
import { toast } from 'react-toastify';

interface props {
  data: AssetItemType;
  currency: string;
  handleSelectedAsset?: any;
  isDefaultChecked?: any;
  isClick?: boolean;
  playId?: string;
}

const AssetPlayCard: React.FC<props> = ({
  data,
  currency,
  handleSelectedAsset,
  isDefaultChecked,
  isClick = false,
  playId
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
              router
                .push(
                  `${
                    playId !== undefined
                      ? `/homepage/assets/${data.id}?playId=${playId}`
                      : `/homepage/assets/${data.id}`
                  }`
                )
                .catch(error => {
                  toast.error(`${error as string}`);
                });
            }
          : () => {}
      }
    >
      <CardBody className="p-3 inline-block h-auto">
        <div className="flex flex-row items-center">
          <Avatar size="md" variant="circular" src={data.logo} alt="logo" />

          <div className="flex ml-5 w-1/2 flex-col gap-0.5">
            <div className="flex flex-row">
              <Typography className="font-semibold text-base text-[#262626]">
                {data.seedsTicker} /
              </Typography>
              {data?.assetType !== 'FOREX' ? (
                <Typography className="font-normal ml-1 text-base text-[#262626]">
                  {data?.assetType === 'CRYPTO' && 'B'}
                  {currency}
                </Typography>
              ) : null}
            </div>
            <Typography className="font-normal text-sm text-[#7C7C7C]">
              {data.name}
            </Typography>
          </div>

          <div className="ml-auto flex flex-col gap-0.5">
            <div className="flex justify-end">
              <Typography className="font-semibold text-sm text-[#262626]">
                {currency}{' '}
                {data.priceBar.close > 0.01
                  ? new Intl.NumberFormat().format(data.priceBar.close)
                  : data.priceBar.close}
              </Typography>
            </div>
            <div className="flex justify-end">
              <Typography
                className={`flex font-normal text-sm ${
                  handleArrow(
                    calculatePercentageDifference(
                      data?.priceBar?.open,
                      data?.priceBar?.close
                    ).value
                  )
                    ? 'text-[#3AC4A0]'
                    : 'text-red-500'
                }`}
              >
                {handleArrow(
                  calculatePercentageDifference(
                    data?.priceBar?.open,
                    data?.priceBar?.close
                  ).value
                ) ? (
                  <ArrowTrendingUpIcon
                    height={20}
                    width={20}
                    className="mr-2"
                  />
                ) : (
                  <ArrowTrendingDownIcon
                    height={20}
                    width={20}
                    className="mr-2"
                  />
                )}
                (
                {
                  calculatePercentageDifference(
                    data?.priceBar?.open,
                    data?.priceBar?.close
                  )?.value
                }{' '}
                %)
              </Typography>
            </div>
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

export default AssetPlayCard;
