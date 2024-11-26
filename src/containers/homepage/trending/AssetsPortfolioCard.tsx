import { calculatePercentageDifference } from '@/helpers/currency';
import { getDetailAsset } from '@/repository/asset.repository';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
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
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
interface props {
  id: string;
  userInfo: UserInfo;
  handleSelectedAsset?: any;
  isDefaultChecked?: any;
  isClick?: boolean;
  playId?: string;
}

const AssetPortfolioCard: React.FC<props> = ({
  id,
  handleSelectedAsset,
  userInfo,
  isDefaultChecked,
  isClick = false,
  playId
}) => {
  const [data, setData] = useState<any>();

  const router = useRouter();
  const handleArrow = (value: number): boolean => {
    if (value > 0) {
      return true;
    } else {
      return false;
    }
  };
  const [params] = useState({
    tf: 'daily'
  });

  const fetchDetailAsset = async (currency: string): Promise<void> => {
    try {
      if (typeof id === 'string') {
        const response = await getDetailAsset(id, { ...params, currency });
        setData(response.marketAsset);
      }
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  useEffect(() => {
    if (id !== null && userInfo !== undefined) {
      void fetchDetailAsset(userInfo?.preferredCurrency ?? 'IDR');
    }
  }, [id, userInfo]);

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
                      ? `/homepage/assets/${
                          data?.id as string
                        }?playId=${playId}`
                      : `/homepage/assets/${data?.id as string}`
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
          <Avatar
            className="w-[40px] h-[40px] md:w-[50px] md:h-[50px]"
            variant="circular"
            src={data?.logo}
            alt="logo"
          />

          <div className="flex ml-5 w-auto flex-col gap-0.5">
            <div className="flex flex-row">
              <Typography className="font-semibold text-sm md:text-base text-[#262626]">
                {data?.realTicker} /
              </Typography>
              <Typography className="font-normal ml-1 text-sm md:text-base text-[#262626]">
                {data?.assetType === 'CRYPTO' && 'B'}
                {userInfo?.preferredCurrency ?? 'IDR'}
              </Typography>
            </div>
            <Typography className="font-normal text-sm text-[#7C7C7C]">
              {data?.name}
            </Typography>
          </div>

          <div className="ml-auto w-fit flex flex-col gap-0.5">
            <div className="flex justify-end">
              <Typography className="font-semibold text-sm md:text-base text-[#262626]">
                {userInfo?.preferredCurrency ?? 'IDR'}{' '}
                {new Intl.NumberFormat().format(data?.lastPrice?.open ?? 0)}
              </Typography>
            </div>
            <div className="flex justify-end">
              <Typography
                className={`flex font-normal text-xs md:text-sm ${
                  handleArrow(
                    calculatePercentageDifference(
                      data?.lastPrice?.open ?? 0,
                      data?.lastPrice?.close ?? 0
                    )?.value
                  )
                    ? 'text-[#3AC4A0]'
                    : 'text-red-500'
                }`}
              >
                {handleArrow(
                  calculatePercentageDifference(
                    data?.lastPrice?.open ?? 0,
                    data?.lastPrice?.close ?? 0
                  )?.value
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
                    data?.lastPrice?.open ?? 0,
                    data?.lastPrice?.close ?? 0
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

export default AssetPortfolioCard;
