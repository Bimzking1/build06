import { type typeLimitOrder } from '@/pages/homepage/order/[id]';
import { Button, Typography } from '@material-tailwind/react';
import {
  useEffect,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction
} from 'react';

interface props {
  setLimitOrder: Dispatch<SetStateAction<typeLimitOrder>>;
}
const CardLimitOrder: React.FC<props> = ({ setLimitOrder }) => {
  const number = '0123456789.';
  const [activeTab] = useState<string>('percent');
  const [loss, setLoss] = useState<string>('0');
  const [profit, setProfit] = useState<string>('0');

  useEffect(() => {
    if (activeTab === 'percent') {
      setLoss('0.20');
      setProfit('0.80');
    } else {
      setLoss('1000');
      setProfit('1000');
    }
  }, [activeTab]);

  useEffect(() => {
    setLimitOrder({
      type: activeTab,
      profit: profit,
      loss: loss
    });
  }, [activeTab, profit, loss]);

  // const handleActiveTab = (value: string): void => {
  //   setActiveTab(value);
  // };

  const handleChangeNumber = (
    e: ChangeEvent<HTMLInputElement>,
    val: string,
    setVal: any
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
    <div className="flex flex-col">
      {/* <div className="flex gap-2">
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
      </div> */}
      <div className="mt-4">
        <div className="flex justify-between py-3 px-4">
          <Typography className="font-poppins text-sm font-medium text-black">
            Stop Loss
          </Typography>
          <div className="flex gap-9 items-center">
            <Button
              type="button"
              variant="filled"
              className="flex justify-center p-1 normal-case h-5 rounded-full items-center w-5 bg-[#9A76FE]"
              onClick={() => {
                if (activeTab === 'percent') {
                  setLoss(`${(parseFloat(loss) - 0.01).toFixed(2)}`);
                } else {
                  setLoss(`${(parseFloat(loss) - 1000).toFixed(2)}`);
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
              className="flex justify-center p-1 normal-case h-5 rounded-full items-center w-5 bg-[#9A76FE]"
              onClick={() => {
                if (activeTab === 'percent') {
                  setLoss(`${(parseFloat(loss) + 0.01).toFixed(2)}`);
                } else {
                  setLoss(`${(parseFloat(loss) + 1000).toFixed(2)}`);
                }
              }}
            >
              <div className="bg-white h-[1px] w-[8px]"></div>
              <div className="bg-white h-[8px] w-[1px] absolute"></div>
            </Button>
          </div>
        </div>
        <div className="flex justify-between py-3 px-4">
          <Typography className="font-poppins text-sm font-medium text-black">
            Take Profit
          </Typography>
          <div className="flex gap-9 items-center">
            <Button
              type="button"
              variant="filled"
              className="flex justify-center p-1 normal-case h-5 rounded-full items-center w-5 bg-[#9A76FE]"
              onClick={() => {
                if (activeTab === 'percent') {
                  setProfit(`${(parseFloat(profit) - 0.01).toFixed(2)}`);
                } else {
                  setProfit(`${(parseFloat(profit) - 1000).toFixed(2)}`);
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
              className="flex justify-center p-1 normal-case h-5 rounded-full items-center w-5 bg-[#9A76FE]"
              onClick={() => {
                if (activeTab === 'percent') {
                  setProfit(`${(parseFloat(profit) + 0.01).toFixed(2)}`);
                } else {
                  setProfit(`${(parseFloat(profit) + 1000).toFixed(2)}`);
                }
              }}
            >
              <div className="bg-white h-[1px] w-[8px]"></div>
              <div className="bg-white h-[8px] w-[1px] absolute"></div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardLimitOrder;
