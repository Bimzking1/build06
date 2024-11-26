import { standartCurrency } from '@/helpers/currency';
import { capitalizeFirstLetter } from '@/helpers/text';
import { type HistoryTransactionDTO } from '@/pages/homepage/play/[id]/virtual-balance';
import LanguageContext from '@/store/language/language-context';
import { Avatar, Card, CardBody, Typography } from '@material-tailwind/react';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';

interface props {
  data: HistoryTransactionDTO;
  currency: string;
  handleSelectedAsset?: any;
  isDefaultChecked?: any;
  isClick?: boolean;
  playId?: string;
}

const AssetOrderCard: React.FC<props> = ({
  data,
  isClick = false,
  playId,
  currency
}) => {
  const languageCtx = useContext(LanguageContext);
  const router = useRouter();

  return (
    <Card
      shadow={false}
      className={`w-full bg-[#F9F9F9] ${isClick ? 'cursor-pointer' : ''}`}
      onClick={
        isClick
          ? () => {
              router
                .push(
                  `${
                    playId !== undefined
                      ? `/homepage/assets/${data.asset.asset_id}?playId=${playId}`
                      : `/homepage/assets/${data.asset.asset_id}`
                  }`
                )
                .catch(error => {
                  toast.error(`Error fetching data: ${error as string}`);
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
            src={data.asset.asset_icon}
            alt="logo"
          />

          <div className="flex ml-5 w-1/2 flex-col gap-0.5">
            <Typography className="font-semibold text-sm text-[#262626]">
              {data?.asset?.asset_ticker ?? 'Loading...'}
            </Typography>
            <Typography className="font-light text-xs text-[#7C7C7C]">
              {(data?.asset?.asset_type ?? 'Loading...').includes('_')
                ? `${
                    (data?.asset?.asset_type ?? 'Loading...')
                      .replace('_', ' ')
                      .split(' ')[0]
                  } 
              ${capitalizeFirstLetter(
                (data?.asset?.asset_type ?? 'Loading...')
                  .replace('_', ' ')
                  .split(' ')[1]
                  .toLowerCase()
              )}`
                : capitalizeFirstLetter(
                    (data?.asset?.asset_type ?? 'Loading...').toLowerCase()
                  )}
            </Typography>
            <Typography
              className={`font-normal text-xs ${
                data.type === 'BUY' ? 'text-[#4DA81C]' : 'text-[#FF4A2B]'
              } `}
            >
              {capitalizeFirstLetter((data?.type ?? 'BUY').toLowerCase())}
            </Typography>
          </div>

          <div className="ml-auto flex flex-col gap-0.5">
            <div className="flex justify-end">
              <Typography className="font-semibold text-sm text-[#262626]">
                {currency}{' '}
                {`${standartCurrency(
                  (data?.bid_price ?? 0) * (data?.lot ?? 0)
                ).replace('Rp', '')}`}
              </Typography>
            </div>
            <div className="flex justify-end">
              <Typography className="font-semibold text-xs text-[#5E44FF]">
                {data?.lot ?? 0}{' '}
                {languageCtx.language === 'EN' && (data?.lot ?? 0) > 1
                  ? 'Lots'
                  : 'Lot'}
              </Typography>
            </div>
            <div className="flex justify-end">
              <Typography className="font-light text-[10px] font-montserrat text-[#262626]">
                {moment(data?.updated_at ?? '2024-12-31T00:00:00.000Z').format(
                  'DD/MM/YYYY, HH:mm:ss'
                )}
              </Typography>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default AssetOrderCard;
