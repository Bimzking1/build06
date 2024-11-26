/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
'use-client';

import { standartCurrency } from '@/helpers/currency';
import { type ChartProportion } from '@/utils/interfaces/tournament.interface';
import { useTranslation } from 'react-i18next';
import { Cell, Pie, PieChart } from 'recharts';

interface EntryType {
  asset_ticker: string;
}

interface Props {
  chartProportion: ChartProportion[];
  currency: string;
  ballance: number;
}

const TournamentPortfolioChart: React.FC<Props> = ({
  chartProportion,
  currency,
  ballance
}) => {
  const { t } = useTranslation();

  const data = [
    { asset_ticker: 'TSL', percentage: 100 },
    { asset_ticker: 'ETH', percentage: 90 },
    { asset_ticker: 'BNB', percentage: 80 },
    { asset_ticker: 'SHB', percentage: 45 },
    { asset_ticker: 'BTC', percentage: 30 },
    { asset_ticker: 'CTK', percentage: 80 },
    { asset_ticker: 'PRO', percentage: 45 },
    { asset_ticker: 'TKO', percentage: 30 }
  ];

  const COLORS = [
    '#F44336',
    '#E81E63',
    '#9C27B0',
    '#673AB7',
    '#3F51B5',
    '#2196F3',
    '#03A9F4',
    '#00BCD4',
    '#009688',
    '#4CAF50',
    '#8BC34A',
    '#CDDC39',
    '#FFEB3B',
    '#FFC107',
    '#FF9800',
    '#FF5722',
    '#795548',
    '#9E9E9E',
    '#607D8B',
    '#000000'
  ];

  const renderLabel = (entry: EntryType): string => {
    return entry.asset_ticker;
  };

  return (
    <>
      <div className="md:hidden w-full mt-4 flex justify-center items-center relative">
        <PieChart width={300} height={300}>
          <Pie
            data={chartProportion ?? data}
            cx={145}
            cy={145}
            innerRadius={100}
            outerRadius={140}
            fill="#8884d8"
            paddingAngle={0}
            dataKey="percentage"
          >
            {chartProportion?.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
        <div className="mt-4 flex flex-col justify-center items-center absolute top-[110px] font-poppins">
          <div className="text-[#BDBDBD] text-md">
            {t('tournament.assets.portfolio')}
          </div>
          <div className="font-semibold text-md">
            {currency !== undefined ? currency : 'IDR'}
            {standartCurrency(ballance).replace('Rp', '')}
          </div>
        </div>
      </div>
      <div className="hidden md:flex w-full mt-0 justify-center items-center relative">
        <PieChart width={600} height={400}>
          <Pie
            data={chartProportion ?? data}
            cx={295}
            cy={200}
            innerRadius={100}
            outerRadius={140}
            fill="#8884d8"
            paddingAngle={0}
            dataKey="percentage"
            labelLine={true}
            label={renderLabel}
          >
            {chartProportion?.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
        <div className="mt-4 flex flex-col justify-center items-center absolute top-[160px] font-poppins">
          <div className="text-[#BDBDBD] text-md">
            {t('tournament.assets.portfolio')}
          </div>
          <div className="font-semibold text-md">
            {currency !== undefined ? currency : 'IDR'}
            {standartCurrency(ballance).replace('Rp', '')}
          </div>
        </div>
      </div>
      <div className="w-full xl:w-[80%] mt-4 md:mt-0 mb-4 flex flex-wrap gap-4 justify-center items-center">
        {chartProportion?.map((datas, index) => (
          <div key={index} className="flex gap-2">
            <div
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
              className="w-[20px] h-[20px] rounded-md"
            />
            <div className="font-semibold">{datas?.asset_ticker}</div>
            <div className="text-seeds-button-green">{`${datas?.percentage}%`}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TournamentPortfolioChart;
