/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { getAssetAnalysis } from '@/repository/market.repository';
import { type AnalysisData } from '@/utils/interfaces/play.interface';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const AnalysisItem: React.FC = () => {
  // const { t } = useTranslation();
  const router = useRouter();
  const { assetId } = router.query;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<AnalysisData>();

  const fetchAnalysis = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await getAssetAnalysis(assetId as string);
      setData(response?.data);
    } catch (error: any) {
      toast(error, { type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const getColor = (): string[] => {
    if (data != null) {
      if (
        data?.buy_point >= data?.hold_point &&
        data?.buy_point >= data?.sell_point
      ) {
        return ['#3AC4A0', 'BUY'];
      } else if (
        data?.hold_point >= data?.buy_point &&
        data?.hold_point >= data?.sell_point
      ) {
        return ['#3AC4A0', 'HOLD'];
      } else {
        return ['#3AC4A0', 'SELL'];
      }
    } else {
      return ['#3AC4A0', 'BUY'];
    }
  };
  const [color, label] = getColor();
  useEffect(() => {
    void fetchAnalysis();
  }, [assetId]);

  if (isLoading) {
    return <></>;
  }
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="py-4 flex flex-col gap-2 bg-[#F9FAFD] rounded-md p-4">
        <p className="font-bold text-black text-lg">Analysis Asset</p>
        <div className="flex gap-4 w-full items-center">
          <div
            className={`w-[69px] h-[69px] bg-[${color}] rounded-full flex justify-center items-center`}
          >
            <p className="font-bold text-lg text-white">{label}</p>
          </div>
          <div className="flex flex-col justify-between grow">
            <div className="relative flex gap-2 items-center">
              <div className="bg-[#E9E9E9] h-[9px] grow"></div>
              <div
                className={`absolute bg-[#3AC4A0] h-[9px] w-[${data?.buy_point}%]`}
              ></div>
              <p className="text-lg text-[#3AC4A0]">Buy {data?.buy_point}</p>
            </div>
            <div className="relative flex gap-2 items-center">
              <div className="bg-[#E9E9E9] h-[9px] grow"></div>
              <div
                className={`absolute bg-[#7C7C7C] h-[9px] w-[${data?.buy_point}%]`}
              ></div>
              <p className="text-lg text-[#7C7C7C]">Hold {data?.hold_point}</p>
            </div>
            <div className="relative flex gap-2 items-center">
              <div className="bg-[#E9E9E9] h-[9px] grow"></div>
              <div
                className={`absolute bg-[#DD2525] h-[9px] w-[${data?.buy_point}%]`}
              ></div>
              <p className="text-lg text-[#DD2525]">Sell {data?.sell_point}</p>
            </div>
          </div>
          <div className="flex flex-col justify-between"></div>
        </div>
      </div>
      <div className="py-4 flex flex-col gap-2 bg-[#F9FAFD] rounded-md p-4">
        <p className="font-bold text-black text-lg">Average Target Price</p>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <p className="text-lg text-[#7C7C7C]">Buy</p>
            <p className="font-bold text-black">{data?.buy_price}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-lg text-[#7C7C7C]">Hold</p>
            <p className="font-bold text-black">{data?.hold_price}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-lg text-[#7C7C7C]">Sell</p>
            <p className="font-bold text-black">{data?.sell_price}</p>
          </div>
        </div>
      </div>
      <div className="py-4 flex flex-col gap-2 bg-[#F9FAFD] rounded-md p-4">
        <p className="font-bold text-black text-lg">Price Performance</p>
        <div className="flex flex-col gap-4">
          <div className="relative flex justify-between items-center gap-2">
            <p className="text-lg text-[#7C7C7C]">1D</p>
            <div className="bg-[#E9E9E9] h-[9px] grow"></div>
            <div
              className={`absolute bg-[#3AC4A0] h-[9px] w-[${data?.performance_1d}%]`}
            ></div>
            <p className="font-bold text-black">{data?.buy_price}</p>
          </div>
          <div className="relative flex justify-between items-center gap-2">
            <p className="text-lg text-[#7C7C7C]">1W</p>
            <div className="bg-[#E9E9E9] h-[9px] grow"></div>
            <div
              className={`absolute bg-[#3AC4A0] h-[9px] w-[${data?.performance_1w}%]`}
            ></div>
            <p className="font-bold text-black">{data?.hold_price}</p>
          </div>
          <div className="relative flex justify-between items-center gap-2">
            <p className="text-lg text-[#7C7C7C]">1M</p>
            <div className="bg-[#E9E9E9] h-[9px] grow"></div>
            <div
              className={`absolute bg-[#3AC4A0] h-[9px] w-[${data?.performance_1m}%]`}
            ></div>
            <p className="font-bold text-black">{data?.sell_price}</p>
          </div>
          <div className="relative flex justify-between items-center gap-2">
            <p className="text-lg text-[#7C7C7C]">3M</p>
            <div className="bg-[#E9E9E9] h-[9px] grow"></div>
            <div
              className={`absolute bg-[#3AC4A0] h-[9px] w-[${data?.performance_3m}%]`}
            ></div>
            <p className="font-bold text-black">{data?.sell_price}</p>
          </div>
          <div className="relative flex justify-between items-center gap-2">
            <p className="text-lg text-[#7C7C7C]">6M</p>
            <div className="bg-[#E9E9E9] h-[9px] grow"></div>
            <div
              className={`absolute bg-[#3AC4A0] h-[9px] w-[${data?.performance_6m}%]`}
            ></div>
            <p className="font-bold text-black">{data?.sell_price}</p>
          </div>
          <div className="relative flex justify-between items-center gap-2">
            <p className="text-lg text-[#7C7C7C]">YTD</p>
            <div className="bg-[#E9E9E9] h-[9px] grow"></div>
            <div
              className={`absolute bg-[#3AC4A0] h-[9px] w-[${data?.performance_ytd}%]`}
            ></div>
            <p className="font-bold text-black">{data?.sell_price}</p>
          </div>
          <div className="relative flex justify-between items-center gap-2">
            <p className="text-lg text-[#7C7C7C]">1Y</p>
            <div className="bg-[#E9E9E9] h-[9px] grow"></div>
            <div
              className={`absolute bg-[#3AC4A0] h-[9px] w-[${data?.performance_1y}%]`}
            ></div>
            <p className="font-bold text-black">{data?.sell_price}</p>
          </div>
          <div className="relative flex justify-between items-center gap-2">
            <p className="text-lg text-[#7C7C7C]">3Y</p>
            <div className="bg-[#E9E9E9] h-[9px] grow"></div>
            <div
              className={`absolute bg-[#3AC4A0] h-[9px] w-[${data?.performance_2y}%]`}
            ></div>
            <p className="font-bold text-black">{data?.sell_price}</p>
          </div>
          <div className="relative flex justify-between items-center gap-2">
            <p className="text-lg text-[#7C7C7C]">5Y</p>
            <div className="bg-[#E9E9E9] h-[9px] grow"></div>
            <div
              className={`absolute bg-[#3AC4A0] h-[9px] w-[${data?.performance_5y}%]`}
            ></div>
            <p className="font-bold text-black">{data?.sell_price}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisItem;
