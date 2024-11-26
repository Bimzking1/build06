import { type PriceBarHistory } from '@/utils/interfaces/play.interface';
import moment from 'moment';
import { useCallback, useMemo } from 'react';

interface IPriceBarHistory {
  close: number;
  high: number;
  low: number;
  open: number;
  timestamp: Date | string;
  volume: number;
  vwap: number;
}

interface IassetsData {
  assetType: string;
  createdAt: Date | string;
  description: string;
  exchange: string;
  exchangeCurrency: string;
  id: string;
  isActive: boolean;
  listedCountry: string;
  logo: string;
  name: string;
  priceBarHistory: IPriceBarHistory[];
  providerName: string;
  providerWebsite: string;
  realTicker: string;
  seedsTicker: string;
  updatedAt: Date | string;
  currentPrice: number;
  currentPoint: number;
  currentPl: number;
  lastUpdated: Date | string;
}

interface IuseChart {
  data: IassetsData;
  selectedTimeFrame: string;
  chartItem: any;
}

const useLineChart = (
  data: any,
  selectedTimeFrame: string,
  fromPortfolio?: boolean
): IuseChart => {
  const priceBarHistory = useMemo(() => data?.priceBarHistory ?? [], [data]);

  const formatDateLabel = useCallback((timeFrame: string, date: string) => {
    if (timeFrame === 'alltime' || timeFrame === 'yearly') {
      return moment(date).format('YYYY');
    }
    if (timeFrame === 'monthly') {
      return moment(date).format('DD MMM YY');
    }
    if (timeFrame === 'weekly') {
      return moment(date).format('DD/MM/YY');
    }
    if (timeFrame === 'daily') {
      return moment(date).format('DD/MM/YY hh:mm A');
    }
    return moment(date).format('hh:mm A');
  }, []);
  
  const chartItem = useMemo(() => {
    const _priceBarHistory = fromPortfolio === true
      ? data.datasets
      : priceBarHistory?.map((i: PriceBarHistory) => i.close);

    // Get the last 6 data points
    const recentData = _priceBarHistory.slice(-6);
    
    if (recentData.length < 6) {
      const padding = Array(6 - recentData.length).fill(0);
      recentData.unshift(...padding);
    }

    const totalGroup = 6;
    const labels = fromPortfolio === true ? data.labels : priceBarHistory;
    const label: string[] = [];

    for (let g = 0; g < totalGroup; g++) {
      const endIdx = priceBarHistory?.length - 6 + (g + 1);
      const currentGroup = (fromPortfolio ?? false)
        ? labels[endIdx - 1] ?? 0
        : labels[endIdx - 1]?.timestamp ?? 0;

      if (currentGroup === 0) {
        label.unshift('');
      } else {
        const formatTime = (fromPortfolio ?? false)
          ? currentGroup
          : formatDateLabel(selectedTimeFrame, currentGroup);
        label.push(formatTime);
      }
    }

    return { x: label, y: recentData };
  }, [data, formatDateLabel, fromPortfolio, priceBarHistory, selectedTimeFrame]);

  return { data, selectedTimeFrame, chartItem };
};

export default useLineChart;
