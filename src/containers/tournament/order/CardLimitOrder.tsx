import {
  Nominal,
  NominalActive,
  Percent,
  PercentActive
} from '@/assets/order-page';
import { type typeLimitOrder } from '@/pages/homepage/order/[id]';
import { Button, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import {
  useEffect,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction
} from 'react';
import { useTranslation } from 'react-i18next';

interface props {
  setLimitOrder: Dispatch<SetStateAction<typeLimitOrder>>;
}
const CardLimitOrder: React.FC<props> = ({ setLimitOrder }) => {
  const number = '0123456789.';
  const [activeTab, setActiveTab] = useState<string>('nominal');
  const [loss, setLoss] = useState<string>('0');
  const [profit, setProfit] = useState<string>('0');
  const { t } = useTranslation();

  useEffect(() => {
    if (activeTab === 'percent') {
      setLoss('0');
      setProfit('0');
    } else {
      setLoss('0');
      setProfit('0');
    }
  }, [activeTab]);

  useEffect(() => {
    setLimitOrder({
      type: activeTab,
      profit,
      loss
    });
  }, [activeTab, profit, loss]);

  const handleActiveTab = (value: string): void => {
    setActiveTab(value);
  };

  const handleChangeNumber = (
    e: ChangeEvent<HTMLInputElement>,
    val: string,
    setVal: {
      (value: SetStateAction<string>): void;
      (value: SetStateAction<string>): void;
      (arg0: string): void;
    }
  ): void => {
    const target = e.target;
    const value = target.value;

    for (let index = 0; index < number.length; index++) {
      const element = number[index];
      if (value[value.length - 1] === element) {
        if (
          val === '0' &&
          value[value.length - 1] !== '0' &&
          value[value.length - 1] !== '.'
        ) {
          setVal(value[1]);
        } else {
          setVal(value);
        }
      } else if (value.length === 0) {
        setVal('0');
      }
    }
  };

  return (
    <div className="flex flex-col mx-2">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outlined"
          className={`flex px-2 py-1 normal-case rounded-lg items-center gap-1 w-fit border ${
            activeTab === 'nominal' ? 'border-[#9A76FE]' : 'border-[#7C7C7C]'
          }`}
          onClick={() => {
            handleActiveTab('nominal');
          }}
        >
          <Image
            src={activeTab === 'nominal' ? NominalActive : Nominal}
            alt="percent"
            width={20}
            height={20}
          />
          <Typography
            className={`${
              activeTab === 'nominal' ? 'text-[#9A76FE]' : 'text-[#7C7C7C]'
            } font-poppins text-xs font-semibold`}
          >
            Nominal
          </Typography>
        </Button>
        <Button
          type="button"
          variant="outlined"
          className={`flex px-2 py-1 normal-case rounded-lg items-center gap-1 w-fit border ${
            activeTab === 'percent' ? 'border-[#9A76FE]' : 'border-[#7C7C7C]'
          }`}
          onClick={() => {
            handleActiveTab('percent');
          }}
        >
          <Image
            src={activeTab === 'percent' ? PercentActive : Percent}
            alt="percent"
            width={20}
            height={20}
          />
          <Typography
            className={`${
              activeTab === 'percent' ? 'text-[#9A76FE]' : 'text-[#7C7C7C]'
            } font-poppins text-xs font-semibold`}
          >
            Percent
          </Typography>
        </Button>
      </div>
      <div className="mt-4 md:flex block gap-3">
        <div className="flex flex-col py-3 w-full lg:w-1/2">
          <div className="flex">
            <Typography className="me-1 font-poppins text-sm font-medium text-black">
              Stop Loss
            </Typography>
            <svg
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.5 1.5C7.21442 1.5 5.95772 1.88122 4.8888 2.59545C3.81988 3.30968 2.98676 4.32484 2.49479 5.51256C2.00282 6.70028 1.87409 8.00721 2.1249 9.26809C2.3757 10.529 2.99477 11.6872 3.90381 12.5962C4.81285 13.5052 5.97104 14.1243 7.23192 14.3751C8.49279 14.6259 9.79973 14.4972 10.9874 14.0052C12.1752 13.5132 13.1903 12.6801 13.9046 11.6112C14.6188 10.5423 15 9.28558 15 8C14.9982 6.27665 14.3128 4.62441 13.0942 3.40582C11.8756 2.18722 10.2234 1.50182 8.5 1.5ZM8.5 13.5C7.41221 13.5 6.34884 13.1774 5.44437 12.5731C4.5399 11.9687 3.83495 11.1098 3.41867 10.1048C3.00238 9.09977 2.89347 7.9939 3.10568 6.927C3.3179 5.86011 3.84173 4.8801 4.61092 4.11091C5.3801 3.34172 6.36011 2.8179 7.42701 2.60568C8.4939 2.39346 9.59977 2.50238 10.6048 2.91866C11.6098 3.33494 12.4687 4.03989 13.0731 4.94436C13.6774 5.84883 14 6.9122 14 8C13.9983 9.45818 13.4184 10.8562 12.3873 11.8873C11.3562 12.9184 9.95819 13.4983 8.5 13.5ZM9.5 11C9.5 11.1326 9.44732 11.2598 9.35356 11.3536C9.25979 11.4473 9.13261 11.5 9 11.5C8.73479 11.5 8.48043 11.3946 8.2929 11.2071C8.10536 11.0196 8 10.7652 8 10.5V8C7.86739 8 7.74022 7.94732 7.64645 7.85355C7.55268 7.75979 7.5 7.63261 7.5 7.5C7.5 7.36739 7.55268 7.24021 7.64645 7.14645C7.74022 7.05268 7.86739 7 8 7C8.26522 7 8.51957 7.10536 8.70711 7.29289C8.89465 7.48043 9 7.73478 9 8V10.5C9.13261 10.5 9.25979 10.5527 9.35356 10.6464C9.44732 10.7402 9.5 10.8674 9.5 11ZM7.5 5.25C7.5 5.10166 7.54399 4.95666 7.6264 4.83332C7.70881 4.70999 7.82595 4.61386 7.96299 4.55709C8.10003 4.50032 8.25083 4.48547 8.39632 4.51441C8.54181 4.54335 8.67544 4.61478 8.78033 4.71967C8.88522 4.82456 8.95665 4.9582 8.98559 5.10368C9.01453 5.24917 8.99968 5.39997 8.94291 5.53701C8.88615 5.67406 8.79002 5.79119 8.66668 5.8736C8.54334 5.95601 8.39834 6 8.25 6C8.05109 6 7.86032 5.92098 7.71967 5.78033C7.57902 5.63968 7.5 5.44891 7.5 5.25Z"
                fill="#5263F9"
              />
            </svg>
          </div>
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-[#3AC4A0]"
            />
            <Typography className="font-poppins text-sm ml-2 text-black">
              {t('buyAsset.text21')}
            </Typography>
          </div>
          <div className="flex gap-12 w-full border-1 mt-2 mx-full justify-center rounded-[6px] border py-4">
            <Button
              type="button"
              variant="filled"
              className="flex justify-center p-1 normal-case h-5 rounded-full items-center w-5 bg-[#3AC4A0]"
              onClick={() => {
                if (activeTab === 'percent') {
                  setLoss(`${(parseFloat(loss) - 0.01).toFixed(2)}`);
                } else {
                  setLoss(`${(parseFloat(loss) - 0.01).toFixed(2)}`);
                }
              }}
            >
              <div className="bg-white h-[1px] w-[8px]"></div>
            </Button>
            <input
              type="text"
              value={loss}
              className="focus:border-none focus:outline-none text-center min-w-[50px] max-w-[90px] text-[#BB1616] font-semibold caret-black"
              onChange={e => {
                handleChangeNumber(e, loss, setLoss);
              }}
            />
            <Button
              type="button"
              variant="filled"
              className="flex justify-center p-1 normal-case h-5 rounded-full items-center w-5 bg-[#3AC4A0]"
              onClick={() => {
                if (activeTab === 'percent') {
                  setLoss(`${(parseFloat(loss) + 0.01).toFixed(2)}`);
                } else {
                  setLoss(`${(parseFloat(loss) + 0.01).toFixed(2)}`);
                }
              }}
            >
              <div className="bg-white h-[1px] w-[8px]"></div>
              <div className="bg-white h-[8px] w-[1px] absolute"></div>
            </Button>
          </div>
          <Typography className="mt-2 font-poppins text-sm font-normal text-[#7C7C7C]">
            {t('buyAsset.text18')}
          </Typography>
        </div>
        <div className="flex flex-col py-3 w-full lg:w-1/2">
          <div className="flex">
            <Typography className="me-1 font-poppins text-sm font-medium text-black">
              Take Profit
            </Typography>
            <svg
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.5 1.5C7.21442 1.5 5.95772 1.88122 4.8888 2.59545C3.81988 3.30968 2.98676 4.32484 2.49479 5.51256C2.00282 6.70028 1.87409 8.00721 2.1249 9.26809C2.3757 10.529 2.99477 11.6872 3.90381 12.5962C4.81285 13.5052 5.97104 14.1243 7.23192 14.3751C8.49279 14.6259 9.79973 14.4972 10.9874 14.0052C12.1752 13.5132 13.1903 12.6801 13.9046 11.6112C14.6188 10.5423 15 9.28558 15 8C14.9982 6.27665 14.3128 4.62441 13.0942 3.40582C11.8756 2.18722 10.2234 1.50182 8.5 1.5ZM8.5 13.5C7.41221 13.5 6.34884 13.1774 5.44437 12.5731C4.5399 11.9687 3.83495 11.1098 3.41867 10.1048C3.00238 9.09977 2.89347 7.9939 3.10568 6.927C3.3179 5.86011 3.84173 4.8801 4.61092 4.11091C5.3801 3.34172 6.36011 2.8179 7.42701 2.60568C8.4939 2.39346 9.59977 2.50238 10.6048 2.91866C11.6098 3.33494 12.4687 4.03989 13.0731 4.94436C13.6774 5.84883 14 6.9122 14 8C13.9983 9.45818 13.4184 10.8562 12.3873 11.8873C11.3562 12.9184 9.95819 13.4983 8.5 13.5ZM9.5 11C9.5 11.1326 9.44732 11.2598 9.35356 11.3536C9.25979 11.4473 9.13261 11.5 9 11.5C8.73479 11.5 8.48043 11.3946 8.2929 11.2071C8.10536 11.0196 8 10.7652 8 10.5V8C7.86739 8 7.74022 7.94732 7.64645 7.85355C7.55268 7.75979 7.5 7.63261 7.5 7.5C7.5 7.36739 7.55268 7.24021 7.64645 7.14645C7.74022 7.05268 7.86739 7 8 7C8.26522 7 8.51957 7.10536 8.70711 7.29289C8.89465 7.48043 9 7.73478 9 8V10.5C9.13261 10.5 9.25979 10.5527 9.35356 10.6464C9.44732 10.7402 9.5 10.8674 9.5 11ZM7.5 5.25C7.5 5.10166 7.54399 4.95666 7.6264 4.83332C7.70881 4.70999 7.82595 4.61386 7.96299 4.55709C8.10003 4.50032 8.25083 4.48547 8.39632 4.51441C8.54181 4.54335 8.67544 4.61478 8.78033 4.71967C8.88522 4.82456 8.95665 4.9582 8.98559 5.10368C9.01453 5.24917 8.99968 5.39997 8.94291 5.53701C8.88615 5.67406 8.79002 5.79119 8.66668 5.8736C8.54334 5.95601 8.39834 6 8.25 6C8.05109 6 7.86032 5.92098 7.71967 5.78033C7.57902 5.63968 7.5 5.44891 7.5 5.25Z"
                fill="#5263F9"
              />
            </svg>
          </div>
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-[#3AC4A0]"
            />
            <Typography className="font-poppins text-sm ml-2 text-black">
              {t('buyAsset.text22')}
            </Typography>
          </div>
          <div className="flex gap-12 w-full border-1 mt-2 mx-full justify-center rounded-[6px] border py-4">
            <Button
              type="button"
              variant="filled"
              className="flex justify-center p-1 normal-case h-5 rounded-full items-center w-5 bg-[#3AC4A0]"
              onClick={() => {
                if (activeTab === 'percent') {
                  setProfit(`${(parseFloat(profit) - 0.01).toFixed(2)}`);
                } else {
                  setProfit(`${(parseFloat(profit) - 0.01).toFixed(2)}`);
                }
              }}
            >
              <div className="bg-white h-[1px] w-[8px]"></div>
            </Button>
            <input
              type="text"
              value={profit}
              className="focus:border-none focus:outline-none text-center min-w-[50px] max-w-[90px] text-[#347904] font-semibold caret-black"
              onChange={e => {
                handleChangeNumber(e, profit, setProfit);
              }}
            />
            <Button
              type="button"
              variant="filled"
              className="flex justify-center p-1 normal-case h-5 rounded-full items-center w-5 bg-[#3AC4A0]"
              onClick={() => {
                if (activeTab === 'percent') {
                  setProfit(`${(parseFloat(profit) + 0.01).toFixed(2)}`);
                } else {
                  setProfit(`${(parseFloat(profit) + 0.01).toFixed(2)}`);
                }
              }}
            >
              <div className="bg-white h-[1px] w-[8px]"></div>
              <div className="bg-white h-[8px] w-[1px] absolute"></div>
            </Button>
          </div>
          <Typography className="mt-2 font-poppins text-sm font-normal text-[#7C7C7C]">
            {t('buyAsset.text19')}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default CardLimitOrder;
