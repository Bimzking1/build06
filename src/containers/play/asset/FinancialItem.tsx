import { getAssetFinancial } from '@/repository/market.repository';
import { Option, Select } from '@material-tailwind/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export interface FinancialData {
  id: string;
  parent_id: string;
  title: string;
  sort_no: number;
  values: number[];
}

const initialFinancialData: FinancialData = {
  id: '',
  parent_id: '',
  title: '',
  sort_no: 0,
  values: []
};

const FinancialItem: React.FC = () => {
  // const { t } = useTranslation();
  const router = useRouter();
  const { assetId } = router.query;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>('annual');
  const [data, setData] = useState<FinancialData[]>([initialFinancialData]);

  const getYearList = (): number[] => {
    const currentYear = new Date().getFullYear();
    const yearList = [];

    for (let i = 1; i <= 3; i++) {
      yearList.push(currentYear - i);
    }

    return yearList;
  };
  const yearList = getYearList();
  const fetchFinancial = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await getAssetFinancial(
        assetId as string,
        'LABA_RUGI',
        yearList.join(),
        sortBy
      );
      setData(response.data);
    } catch (error: any) {
      toast(error, { type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortBy = (event: string | undefined): void => {
    setSortBy(event as string);
  };

  useEffect(() => {
    void fetchFinancial();
  }, [assetId, sortBy]);

  if (isLoading) {
    return <></>;
  }
  return (
    <div className="w-full flex flex-col">
      <div className="self-end flex gap-2 items-center">
        <p className="text-[#7C7C7C]">Sort By</p>
        <Select
          variant="standard"
          onChange={handleSortBy}
          name="method"
          value={sortBy}
          className="border-none"
          containerProps={{ className: '!min-w-[100px] !w-[100px] !-mt-2' }}
        >
          <Option value="annual">
            <p className="text-[#262626] font-semibold">Annual</p>
          </Option>
          <Option value="q1">
            <p className="text-[#262626] font-semibold">Q1</p>
          </Option>
          <Option value="q2">
            <p className="text-[#262626] font-semibold">Q2</p>
          </Option>
          <Option value="q3">
            <p className="text-[#262626] font-semibold">Q3</p>
          </Option>
          <Option value="q4">
            <p className="text-[#262626] font-semibold">Q4</p>
          </Option>
        </Select>
      </div>
      <table className="table-auto">
        <thead className="border-b-2 broder-[#B9B7B7]">
          <tr>
            <th className="first:text-left text-right even:bg-[#E0E0E0]">
              Breakdown
            </th>
            <th className="first:text-left text-right even:bg-[#E0E0E0] px-2">
              {yearList[2]}
            </th>
            <th className="first:text-left text-right even:bg-[#E0E0E0] px-2">
              {yearList[1]}
            </th>
            <th className="first:text-left text-right even:bg-[#E0E0E0] px-2">
              {yearList[0]}
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => {
            return (
              <tr
                key={index}
                className={
                  item.parent_id === '' ? 'border-b-2 broder-[#B9B7B7]' : ''
                }
              >
                <td className="first:text-left text-right even:bg-[#E0E0E0]">
                  {item?.title}
                </td>
                <td className="first:text-left text-right even:bg-[#E0E0E0] px-2">
                  {item?.values[0]}
                </td>
                <td className="first:text-left text-right even:bg-[#E0E0E0] px-2">
                  {item?.values[1]}
                </td>
                <td className="first:text-left text-right even:bg-[#E0E0E0] px-2">
                  {item?.values[2]}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FinancialItem;
