/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
'use-client';

import { standartCurrency } from '@/helpers/currency';
import { useTranslation } from 'react-i18next';
import { Cell, Pie, PieChart } from 'recharts';

interface EntryType {
  name: string;
}

interface Props {
  currency: string;
  portfolio: number;
  balance: number;
}

const VirtualBalanceChart: React.FC<Props> = ({
  currency,
  balance,
  portfolio
}) => {
  const { t } = useTranslation();

  const data = [
    { name: t('tournament.assets.cashUsed'), currency, value: portfolio },
    { name: t('tournament.assets.cashAvailable'), currency, value: balance }
  ];

  const COLORS = ['#DD2525', '#3AC4A0'];

  const renderLabel = (entry: EntryType): string => {
    return entry.name;
  };

  return (
    <>
      <div className="md:hidden w-full mt-4 flex justify-center items-center relative">
        <PieChart width={300} height={300}>
          <Pie
            data={data}
            cx={145}
            cy={145}
            innerRadius={100}
            outerRadius={140}
            fill="#8884d8"
            paddingAngle={0}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
        <div className="mt-4 flex flex-col justify-center items-center absolute top-[110px] font-poppins">
          <div className="text-[#BDBDBD] text-sm">
            {t('tournament.assets.totalCash')}
          </div>
          <div className="font-semibold text-sm">
            {currency !== undefined ? currency : 'IDR'}
            {standartCurrency((balance ?? 0) + (portfolio ?? 0)).replace(
              'Rp',
              ''
            )}
          </div>
        </div>
      </div>
      <div className="hidden md:flex w-full mt-4 justify-center items-center relative">
        <PieChart width={600} height={350}>
          <Pie
            data={data}
            cx={295}
            cy={170}
            innerRadius={100}
            outerRadius={140}
            fill="#8884d8"
            paddingAngle={0}
            dataKey="value"
            labelLine={true}
            label={renderLabel}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
        <div className="flex flex-col justify-center items-center absolute top-[150px] font-poppins">
          <div className="text-[#BDBDBD]">
            {t('tournament.assets.totalCash')}
          </div>
          <div className="font-semibold md:text-sm lg:text-base">
            {currency !== undefined ? currency : 'IDR'}
            {standartCurrency((balance ?? 0) + (portfolio ?? 0)).replace(
              'Rp',
              ''
            )}
          </div>
        </div>
      </div>
      <div className="w-full xl:w-[80%] md:mt-4 mb-4 flex flex-col gap-4 justify-center items-center">
        {data.map((datas, index) => (
          <div key={index} className="flex gap-2 justify-center items-center">
            <div
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
              className="w-[20px] h-[20px] rounded-md"
            />
            <div className="text-[#7C7C7C] text-sm md:text-base">
              {datas.name}
            </div>
            <div className="font-semibold text-sm md:text-base">
              {currency !== undefined ? currency : 'IDR'}
              {standartCurrency(datas?.value ?? 0).replace('Rp', '')}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default VirtualBalanceChart;
