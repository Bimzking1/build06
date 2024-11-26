import BallanceImage from '@/assets/ballanceCardBackground.png';
import {
  Overview,
  OverviewActive,
  Stock,
  StockActive
} from '@/assets/order-page';
import CCard from '@/components/CCard';
import ImageBackground from '@/components/ImageBackground';
import PortfolioChart from '@/components/PortfolioChart';
import Loading from '@/components/popup/Loading';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import AssetPortfolioCard from '@/containers/homepage/trending/AssetsPortfolioCard';
import AssetTrendingCardSkeleton from '@/containers/homepage/trending/skeleton/AssetsCardSkeleton';
import { standartCurrency } from '@/helpers/currency';
import { generateRandomColor } from '@/helpers/generateRandomColor';
import withAuth from '@/helpers/withAuth';
import {
  getPlayBallance,
  getPlayPortfolio
} from '@/repository/play.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Button, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { type Ballance } from '..';

interface ChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    backgroundColor: string[];
  }>;
}

interface isUptrendType {
  summary: boolean;
  id_stock: boolean;
  us_stock: boolean;
  crypto: boolean;
  commodity: boolean;
}
interface itemPortfolioSummaryType {
  value: number;
  gnl: number;
  gnl_percentage: number;
  currency: string;
}

interface IPortfolioSummary {
  summary: itemPortfolioSummaryType;
  id_stock: itemPortfolioSummaryType;
  us_stock: itemPortfolioSummaryType;
  crypto: itemPortfolioSummaryType;
  commodity: itemPortfolioSummaryType;
  pie: {
    assets: PieAssets[];
    cash_balance: number;
    total_portfolio: number;
  };
}

interface PieAssets {
  exchange: string;
  id: string;
  logo: string;
  percentage: number;
  ticker: string;
}

const initialChartData = {
  labels: ['dummy'],
  datasets: [
    {
      data: [100],
      backgroundColor: ['#9F9F9F']
    }
  ]
};

const PortfolioPage: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = router.query;
  const [chartData, setChartData] = useState<ChartData>(initialChartData);
  const [ballance, setBallance] = useState<Ballance>({
    balance: 0,
    portfolio: 0,
    total_sell: 0,
    total_buy: 0,
    currency: 'IDR'
  });
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [portfolio, setPortfolio] = useState<IPortfolioSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const tabData = [
    {
      name: t('social.pieSection.overview'),
      value: 'overview',
      svg: Overview,
      svgActive: OverviewActive
    },
    {
      name: t('social.pieSection.stocks'),
      value: 'STOCK',
      svg: Stock,
      svgActive: StockActive
    },
    {
      name: t('social.pieSection.crypto'),
      value: 'CRYPTO',
      svg: Stock,
      svgActive: StockActive
    }
  ];

  useEffect(() => {
    if (portfolio?.pie !== undefined) {
      handleSetChartData();
    }
  }, [portfolio]);

  useEffect(() => {
    fetchData()
      .then()
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (id !== undefined && userInfo !== undefined) {
      void fetchPlayBallance(userInfo.preferredCurrency);
      void fetchPlayPortfolio(userInfo.preferredCurrency);
    }
  }, [id, userInfo]);

  const fetchData = async (): Promise<void> => {
    try {
      const dataInfo = await getUserInfo();
      setUserInfo(dataInfo);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  const fetchPlayBallance = async (currency: string): Promise<void> => {
    try {
      setIsLoadingBalance(true);
      const response = await getPlayBallance(id as string, { currency });
      setBallance(response);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const fetchPlayPortfolio = async (currency: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await getPlayPortfolio(id as string, currency);
      setPortfolio(response);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActiveTab = (val: string): void => {
    setActiveTab(val);
  };

  const filterAssetsList = useCallback((): any[] => {
    const newData = portfolio?.pie.assets.filter(el => {
      if (activeTab === 'STOCK') {
        if (el.exchange !== 'STOCK' && el.exchange !== 'CRYPTO') {
          return el;
        }
      } else if (activeTab === 'overview') {
        return el;
      } else {
        if (el.exchange === activeTab) {
          return el;
        }
      }
      return undefined;
    });
    return newData as any[];
  }, [activeTab, portfolio]);

  const isUptrend: isUptrendType = {
    summary: (portfolio?.summary?.gnl_percentage as number) >= 0,
    id_stock: (portfolio?.id_stock?.gnl_percentage as number) >= 0,
    us_stock: (portfolio?.us_stock?.gnl_percentage as number) >= 0,
    crypto: (portfolio?.crypto?.gnl_percentage as number) >= 0,
    commodity: (portfolio?.commodity?.gnl_percentage as number) >= 0
  };

  const handleSetChartData = (): void => {
    const convertedData: ChartData = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: []
        }
      ]
    };

    portfolio?.pie.assets.forEach((item: any) => {
      convertedData.labels.push(item.ticker);
      convertedData.datasets[0].data.push(item.percentage);
      convertedData.datasets[0].backgroundColor.push(generateRandomColor());
    });

    setChartData(convertedData);
  };

  return (
    <PageGradient defaultGradient className="w-full">
      {(isLoading || isLoadingBalance) && <Loading />}
      <CCard className="flex flex-col w-full p-5 border-none rounded-xl">
        <div className="flex z-10 flex-col lg:flex-row justify-between pb-4">
          <div className="flex flex-col">
            <div className="sm:text-3xl text-2xl font-semibold bg-clip-text text-black font-poppins">
              {t('playSimulation.portfolio')}
            </div>
          </div>
        </div>
        <ImageBackground className="rounded-2xl" imageUrl={BallanceImage.src}>
          <div className="p-5">
            <Typography className="text-white font-poppins mb-2">
              {t('playSimulation.investmentValue')}
            </Typography>
            <Typography className="text-white font-poppins text-xl font-semibold mb-2">
              {`${ballance?.currency} ${standartCurrency(
                portfolio?.summary?.value ?? 0
              ).replace('Rp', '')}`}
            </Typography>
            <div className="flex gap-2">
              <Typography
                className={`${
                  isUptrend.summary ? 'text-[#B7EE79]' : 'text-[#DD2525]'
                } font-poppins text-xs md:text-sm font-light`}
              >
                {`${ballance?.currency} ${standartCurrency(
                  portfolio?.summary?.gnl ?? 0
                ).replace('Rp', '')}`}
              </Typography>
              <Typography
                className={`${
                  isUptrend.summary ? 'text-[#B7EE79]' : 'text-[#DD2525]'
                } font-poppins text-xs md:text-sm font-light`}
              >
                {`(${isUptrend.summary ? '+' : ''} ${(
                  portfolio?.summary?.gnl_percentage ?? 0
                ).toFixed(2)} %)`}{' '}
                <span className="text-white">{t('playSimulation.today')}</span>
              </Typography>
            </div>
          </div>
        </ImageBackground>
        <div className="flex justify-center mt-4">
          <div className="w-[200px]">
            {portfolio !== null && (
              <PortfolioChart
                data={chartData}
                centerText={`${ballance?.currency ?? 'IDR'} ${standartCurrency(
                  portfolio?.summary?.value ?? 0
                ).replace('Rp', '')}`}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="mt-4">
            <Typography className="text-black font-poppins mb-1 text-lg font-semibold bg-clip-text">
              {t('playSimulation.portfolio')}
            </Typography>
            <Typography className="text-black font-poppins text-base font-light bg-clip-text">
              {t('playSimulation.yourAssetsPortfolio')}
            </Typography>
          </div>
          <div className="my-4 w-full">
            <div className="flex gap-2 overflow-auto w-ful no-scroll">
              {tabData.map((el, i: number) => {
                return (
                  <Button
                    key={i}
                    variant={el.value === activeTab ? 'filled' : 'outlined'}
                    className={`normal-case text-xs md:text-sm min-w-fit rounded-lg p-2 md:px-4 gap-2 flex items-center font-semibold ${
                      el.value !== activeTab
                        ? 'border border-[#3AC4A0] text-[#3AC4A0]'
                        : 'bg-[#3AC4A0] text-white'
                    } font-poppins`}
                    onClick={() => {
                      handleActiveTab(el.value);
                    }}
                  >
                    <Image
                      src={el.value === activeTab ? el.svg : el.svgActive}
                      alt="svg"
                      width={20}
                      height={20}
                    />
                    {el.name}
                  </Button>
                );
              })}
            </div>
          </div>
          {isLoading || userInfo === undefined ? (
            <AssetTrendingCardSkeleton />
          ) : (
            filterAssetsList()?.map((el: any) => {
              return (
                <AssetPortfolioCard
                  id={el.id}
                  userInfo={userInfo}
                  key={el.id}
                  isClick
                  playId={id as string}
                />
              );
            })
          )}
        </div>
      </CCard>
    </PageGradient>
  );
};

export default withAuth(PortfolioPage);
