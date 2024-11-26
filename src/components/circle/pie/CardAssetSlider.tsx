import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import {
  Avatar,
  Card,
  CardBody,
  Slider,
  Switch,
  Typography
} from '@material-tailwind/react';

interface props {
  data: Data;
  changeSlider: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  index: number;
  changeIsLock: (e: React.MouseEvent<HTMLInputElement>, index: number) => void;
  sumAsset: number;
}

interface Data {
  exchangeRate: number;
  exchange_currency: string;
  id: string;
  isLock: boolean;
  logo: string;
  name: string;
  price: number;
  realTicker: string;
  value: number;
}

const CardAssetSlider: React.FC<props> = ({
  data,
  changeSlider,
  index,
  changeIsLock,
  sumAsset
}) => {
  return (
    <Card shadow={false} className="w-full my-3 bg-[#F9F9F9]">
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
                {data.exchange_currency}
              </Typography>
            </div>
            <Typography className="font-normal text-sm text-[#7C7C7C]">
              {data.name}
            </Typography>
          </div>

          <div className="ml-auto flex flex-col gap-0.5">
            {data?.price === undefined ? (
              <>
                <Typography className="font-semibold text-base text-[#262626]">
                  Rp {new Intl.NumberFormat().format(data?.price ?? 0)}
                </Typography>
                <Typography className="flex font-normal text-sm text-[#3AC4A0]">
                  <ArrowTrendingUpIcon
                    height={20}
                    width={20}
                    className="mr-2"
                  />
                  {data.exchangeRate.toString().substring(0, 4)}
                </Typography>
              </>
            ) : (
              <>
                <Typography className="font-semibold text-base text-[#262626]">
                  Rp {new Intl.NumberFormat().format(data?.price ?? 0)}
                </Typography>
                <Typography className="flex font-normal text-sm text-[#3AC4A0]">
                  <ArrowTrendingUpIcon
                    height={20}
                    width={20}
                    className="mr-2"
                  />
                  {data.exchangeRate.toString().substring(0, 4)}
                </Typography>
              </>
            )}
            <div className="bg-white inline-block rounded-full border-gray-300 border px-3 py-1">
              <p className="font-bold text-gray-500 text-center text-sm">
                {data.value} %
              </p>
            </div>
          </div>
        </div>

        <Slider
          color="green"
          className={`text-[#3AC4A0] mt-5 ${
            data.isLock ? 'opacity-50 pointer-events-none' : ''
          }`}
          onChange={e => {
            changeSlider(e, index);
          }}
          min={0}
          max={100}
          defaultValue={data.value}
        />

        <div className="flex items-end justify-end mt-5">
          <Switch
            id={`is-lock-asset-` + index.toString()}
            ripple={false}
            className="h-full w-full checked:bg-[#2ec946]"
            containerProps={{
              className: 'w-11 h-6'
            }}
            circleProps={{
              className: 'before:hidden left-0.5 border-none'
            }}
            onClick={e => {
              changeIsLock(e, index);
            }}
            defaultChecked={data.isLock}
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default CardAssetSlider;
