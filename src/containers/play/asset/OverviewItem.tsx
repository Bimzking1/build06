import { getAssetOverview } from '@/repository/market.repository';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface OverviewData {
  id: string;
  previous_close_price: number;
  open_price: number;
  volume: number;
  average_price: number;
  per: number;
  pbvr: number;
  market_cap: number;
}

const OverviewItem: React.FC = () => {
  // const { t } = useTranslation();
  const router = useRouter();
  const { assetId } = router.query;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<OverviewData>();

  const fetchOverview = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await getAssetOverview(assetId as string);
      setData(response?.data);
    } catch (error: any) {
      toast(error, { type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchOverview();
  }, [assetId]);

  if (isLoading) {
    return <></>;
  }
  return (
    <div className="py-4 flex flex-col gap-2 rounded-md p-4">
      <div className="flex w-full justify-between">
        <p className="font-bold text-black">Previous Close</p>
        <p className="font-bold text-[#3AC4A0]">{data?.previous_close_price}</p>
      </div>
      <hr className="w-fukk border border-b border-[#BDBDBD]" />
      <div className="flex w-full justify-between">
        <p className="font-bold text-black">Open</p>
        <p className="font-bold text-[#D89918]">{data?.open_price}</p>
      </div>
      <hr className="w-fukk border border-b border-[#BDBDBD]" />
      <div className="flex w-full justify-between">
        <p className="font-bold text-black">Volume (Shares)</p>
        <p className="font-bold text-[#7555DA]">{data?.volume}</p>
      </div>
      <hr className="w-fukk border border-b border-[#BDBDBD]" />
      <div className="flex w-full justify-between">
        <p className="font-bold text-black">Average Price</p>
        <p className="font-bold text-[#3AC4A0]">{data?.average_price}</p>
      </div>
      <hr className="w-fukk border border-b border-[#BDBDBD]" />
      <div className="flex w-full justify-between">
        <p className="font-bold text-black">PER</p>
        <p className="font-bold text-[#3AC4A0]">{data?.per}</p>
      </div>
      <hr className="w-fukk border border-b border-[#BDBDBD]" />
      <div className="flex w-full justify-between">
        <p className="font-bold text-black">PBVR</p>
        <p className="font-bold text-[#3AC4A0]">{data?.pbvr}</p>
      </div>
      <hr className="w-fukk border border-b border-[#BDBDBD]" />
      <div className="flex w-full justify-between">
        <p className="font-bold text-black">Market Cap</p>
        <p className="font-bold text-[#262626]">{data?.market_cap}</p>
      </div>
      <hr className="w-fukk border border-b border-[#BDBDBD]" />
    </div>
  );
};

export default OverviewItem;
