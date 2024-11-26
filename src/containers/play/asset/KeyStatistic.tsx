import { getAssetKeyStat } from '@/repository/market.repository';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export interface KeystatData {
  id: string;
  eps: Array<
    [string, string | number, string | number, string | number, string | number]
  >;
  dividend: Array<[string, number, string, string]>;
  fundamental: Items[];
  earnings: Items[];
  valuation: Items[];
  profitability: Items[];
  liquidity: Items[];
}

export interface Items {
  key: string;
  value: string;
}

const KeyStatistic: React.FC = () => {
  const router = useRouter();
  const { assetId } = router.query;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<KeystatData>();

  const fetchKeyStat = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await getAssetKeyStat(assetId as string);
      setData(response.data);
    } catch (error: any) {
      toast(error, { type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchKeyStat();
  }, [assetId]);

  if (isLoading) {
    return <></>;
  }
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="py-4 flex flex-col gap-2 bg-[#F9FAFD] rounded-md p-4">
        <p className="font-bold text-black text-lg">Earnings Per Share</p>
        <table className="table-auto text-center">
          <thead className="bg-[#E9E9E9]">
            <tr>
              <th className="text-left">{data?.eps[0][0]}</th>
              <th>{data?.eps[0][1]}</th>
              <th>{data?.eps[0][2]}</th>
              <th>{data?.eps[0][3]}</th>
              <th>{data?.eps[0][4]}</th>
            </tr>
          </thead>
          <tbody>
            {data?.eps.slice(1).map((row, index) => (
              <tr key={index}>
                <td className="text-left">{row[0]}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
                <td>{row[3]}</td>
                <td>{row[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="py-4 flex flex-col gap-2 bg-[#F9FAFD] rounded-md p-4">
        <p className="font-bold text-black text-lg">Dividend</p>
        <table className="table-auto text-center">
          <thead>
            <tr>
              <th className="text-left">Year</th>
              <th>IDR</th>
              <th>Ex date</th>
              <th>Pay Date</th>
            </tr>
          </thead>
          <tbody>
            {data?.dividend.map((row, index) => (
              <tr key={index}>
                <td className="text-left">{row[0]}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
                <td>{row[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="py-4 flex flex-col gap-2 bg-[#F9FAFD] rounded-md p-4">
        <p className="font-bold text-black text-lg">Fundamental</p>
        <table className="table-fixed text-left">
          <tbody>
            {data?.fundamental.map((item, index) => {
              return (
                <tr key={index}>
                  <td className="w-2/3">{item.key}</td>
                  <th>:</th>
                  <td>{item.value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="py-4 flex flex-col gap-2 bg-[#F9FAFD] rounded-md p-4">
        <p className="font-bold text-black text-lg">Earnings</p>
        <table className="table-fixed text-left">
          <tbody>
            {data?.earnings.map((item, index) => {
              return (
                <tr key={index}>
                  <td className="w-2/3">{item.key}</td>
                  <th>:</th>
                  <td>{item.value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="py-4 flex flex-col gap-2 bg-[#F9FAFD] rounded-md p-4">
        <p className="font-bold text-black text-lg">Valuation</p>
        <table className="table-fixed text-left">
          <tbody>
            {data?.valuation.map((item, index) => {
              return (
                <tr key={index}>
                  <td className="w-2/3">{item.key}</td>
                  <th>:</th>
                  <td>{item.value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="py-4 flex flex-col gap-2 bg-[#F9FAFD] rounded-md p-4">
        <p className="font-bold text-black text-lg">Profitability</p>
        <table className="table-fixed text-left">
          <tbody>
            {data?.profitability.map((item, index) => {
              return (
                <tr key={index}>
                  <td className="w-2/3">{item.key}</td>
                  <th>:</th>
                  <td>{item.value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KeyStatistic;
