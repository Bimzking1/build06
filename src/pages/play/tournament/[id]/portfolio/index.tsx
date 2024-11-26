/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
'use-client';

import NoData from '@/assets/play/tournament/assetNoData.svg';
import Bearish from '@/assets/play/tournament/bearish.svg';
import Bullish from '@/assets/play/tournament/bullish.svg';
import BannerCircle from '@/assets/play/tournament/homeBannerCircle.svg';
import IconPortfolio2 from '@/assets/play/tournament/iconPortfolio2.svg';
import IconStocksActive from '@/assets/play/tournament/iconStocksActive.svg';
import IconStocksInactive from '@/assets/play/tournament/iconStocksInactive.svg';
import TriangleBearish from '@/assets/play/tournament/triangleBearish.svg';
import TriangleBullish from '@/assets/play/tournament/triangleBullish.svg';
import AssetPagination from '@/components/AssetPagination';
import Loading from '@/components/popup/Loading';
import TournamentPortfolioChart from '@/containers/tournament/portfolio-chart/TournamentPortfolioChart';
import { standartCurrency } from '@/helpers/currency';
import { useGetDetailTournament } from '@/helpers/useGetDetailTournament';
import withAuth from '@/helpers/withAuth';
import {
  getActiveAsset,
  getPlayBallance,
  getPlayPortfolio
} from '@/repository/play.repository';
import { getUserInfo } from '@/repository/profile.repository';
import {
  PortfolioFilter,
  type ActiveAsset,
  type BallanceTournament,
  type ChartProportion,
  type Summary,
  type UserInfo
} from '@/utils/interfaces/tournament.interface';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface StatusPortfolio {
  id: number;
  title: string;
  status: PortfolioFilter;
  iconActive: HTMLImageElement;
  iconInactive: HTMLImageElement;
}

const Portfolio = (): React.ReactElement => {
  const router = useRouter();
  const id = router.query.id;
  useGetDetailTournament(id as string);
  const { t } = useTranslation();
  const [loadingBallance, setLoadingBallance] = useState<boolean>(false);
  const [loadingPortfolio, setLoadingPortfolio] = useState<boolean>(false);
  const [loadingActiveAsset, setLoadingActiveAsset] = useState<boolean>(false);
  const [filterChanged, setFilterChanged] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [chartProportion, setChartProportion] = useState<ChartProportion[]>([]);
  const [activeAsset, setActiveAsset] = useState<ActiveAsset[]>([]);
  const [activeAssetLength, setActiveAssetLength] = useState<number>(0);

  const [portfolioActiveTab, setPortfolioActiveTab] = useState(
    PortfolioFilter.OVERVIEW
  );
  const [summary, setSummary] = useState<Summary>();

  const [ballance, setBallance] = useState<BallanceTournament>({
    balance: 0,
    portfolio: 0,
    total_sell: 0,
    total_buy: 0,
    return_value: 0,
    return_percentage: 0,
    currency: 'IDR'
  });

  const [activeAssetParams, setActiveAssetParams] = useState({
    play_id: id as string,
    category: portfolioActiveTab === 'OVERVIEW' ? null : portfolioActiveTab,
    per_page: 5,
    page: 1
  });

  useEffect(() => {
    fetchData()
      .then()
      .catch(() => {});
    setActiveAssetParams({ ...activeAssetParams, page: 1 });
  }, []);

  const fetchData = async (): Promise<void> => {
    try {
      const dataInfo = await getUserInfo();

      setUserInfo(dataInfo);
    } catch (error) {
      toast(`Error fetching data: ${error as string}`);
    }
  };

  useEffect(() => {
    if (id !== null && userInfo !== undefined) {
      void fetchPlayBallance(userInfo?.preferredCurrency);
      void fetchPlayPoftfolio(userInfo?.preferredCurrency);
    }
  }, [id, userInfo]);

  useEffect(() => {
    if (id !== null && userInfo !== undefined) {
      void fetchActiveAsset();
    }
  }, [
    id,
    userInfo,
    activeAssetParams.category,
    activeAssetParams.page,
    filterChanged
  ]);

  const fetchPlayBallance = async (currency: string): Promise<void> => {
    try {
      setLoadingBallance(true);
      const response = await getPlayBallance(id as string, { currency });
      setBallance(response);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      setLoadingBallance(false);
    }
  };

  const fetchPlayPoftfolio = async (currency: string): Promise<void> => {
    try {
      setLoadingPortfolio(true);
      const response = await getPlayPortfolio(id as string, currency);
      setChartProportion(response?.pie?.chart_proportions ?? []);
      setSummary(response?.summary);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      setLoadingPortfolio(false);
    }
  };

  const delay = async (ms: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, ms));
  };

  const fetchActiveAsset = async (retries = 3): Promise<void> => {
    try {
      setLoadingActiveAsset(true);
      const response = await getActiveAsset({
        ...activeAssetParams,
        currency: userInfo?.preferredCurrency as string
      });
      setActiveAsset(response?.data);
      setActiveAssetLength(response?.metadata?.total);
    } catch (error) {
      if (retries > 0) {
        await delay(3000);
        await fetchActiveAsset(retries - 1);
      } else {
        toast.error(`Error fetching data: ${error as string}`);
      }
    } finally {
      setLoadingActiveAsset(false);
    }
  };

  const statusPortfolio: StatusPortfolio[] = [
    {
      id: 0,
      title: 'OVERVIEW',
      status: PortfolioFilter?.OVERVIEW,
      iconActive: IconStocksActive,
      iconInactive: IconStocksInactive
    },
    {
      id: 1,
      title: 'CRYPTO',
      status: PortfolioFilter?.CRYPTO,
      iconActive: IconStocksActive,
      iconInactive: IconStocksInactive
    },
    {
      id: 2,
      title: 'ID STOCK',
      status: PortfolioFilter?.ID_STOCK,
      iconActive: IconStocksActive,
      iconInactive: IconStocksInactive
    },
    {
      id: 3,
      title: 'US STOCK',
      status: PortfolioFilter?.US_STOCK,
      iconActive: IconStocksActive,
      iconInactive: IconStocksInactive
    },
    {
      id: 4,
      title: 'COMMODITIES',
      status: PortfolioFilter?.COMMODITIES,
      iconActive: IconStocksActive,
      iconInactive: IconStocksInactive
    }
  ];

  return (
    <>
      {loadingBallance && loadingPortfolio && loadingActiveAsset && <Loading />}
      <div className="w-full flex flex-col justify-center items-center rounded-xl font-poppins p-5 bg-white">
        <div className="flex justify-start w-full">
          <Typography className="text-xl font-semibold">
            {t('tournament.assets.portfolio')}
          </Typography>
        </div>
        <div className="w-full p-5 bg-gradient-to-br from-[#50D4B2] from-50% to-[#E2E2E2] rounded-xl h-[150px] relative overflow-hidden mt-4">
          <div className="flex flex-col justify-start gap-2 md:gap-0">
            <Typography className="text-white font-poppins z-10 text-sm md:text-lg">
              {t('tournament.portfolio.investmentValue')}
            </Typography>
            <Typography className="text-white text-[26px] font-semibold font-poppins z-10">
              {userInfo?.preferredCurrency !== undefined
                ? userInfo?.preferredCurrency
                : 'IDR'}
              {standartCurrency(ballance?.portfolio ?? 0).replace('Rp', '')}
            </Typography>
            <div className="flex gap-2">
              <Image
                alt=""
                src={
                  ballance?.return_value < 0 ? TriangleBearish : TriangleBullish
                }
                className="w-[20px]"
              />
              <Typography
                className={`${
                  ballance?.return_value < 0 ? 'text-[#DD2525]' : 'text-white'
                } font-poppins z-10 text-sm md:text-lg`}
              >
                {userInfo?.preferredCurrency !== undefined
                  ? userInfo?.preferredCurrency
                  : 'IDR'}{' '}
                {standartCurrency(ballance?.return_value ?? 0).replace(
                  'Rp',
                  ''
                )}
                {` (${ballance?.return_value < 0 ? '' : '+'}${
                  summary?.gnl_percentage?.toFixed(2) as string
                }%)`}
              </Typography>
              <Typography className="text-white font-poppins z-10 text-sm md:text-lg">
                {t('tournament.portfolio.today')}
              </Typography>
            </div>
          </div>
          <Image
            alt=""
            src={BannerCircle}
            className="absolute top-0 right-0 z-0"
          />
        </div>

        {/* Circle Chart */}
        {chartProportion?.length !== 0 && (
          <TournamentPortfolioChart
            chartProportion={chartProportion}
            currency={userInfo?.preferredCurrency ?? ''}
            ballance={ballance?.portfolio ?? 0}
          />
        )}

        <div className="w-full mt-4">
          <div className="flex gap-2">
            <Image alt="" src={IconPortfolio2} className="w-[30px]" />
            <Typography className="text-xl font-semibold">
              {t('tournament.assets.portfolio')}
            </Typography>
          </div>
          <Typography className="text-lg mt-4">
            {t('tournament.portfolio.yourAssetPortfolio')}
          </Typography>

          {/* Filter Section */}
          <div className="w-full flex items-start justify-start mt-4">
            <div className="flex flex-row items-center gap-3 max-w-full overflow-x-auto no-scroll">
              {statusPortfolio.map(item => (
                <button
                  className={`w-full flex gap-2 border px-4 py-2 font-poppins rounded-lg text-sm text-nowrap ${
                    item.status === portfolioActiveTab
                      ? 'border-seeds-button-green bg-seeds-button-green text-white'
                      : 'border-seeds-button-green bg-white text-seeds-button-green'
                  }`}
                  key={item.id}
                  onClick={() => {
                    setFilterChanged(!filterChanged);
                    setPortfolioActiveTab(item.status);
                    setActiveAssetParams({
                      ...activeAssetParams,
                      page: 1,
                      category: item.status === 'OVERVIEW' ? null : item.status
                    });
                  }}
                >
                  <Image
                    alt=""
                    src={
                      item.status === portfolioActiveTab
                        ? item.iconActive
                        : item.iconInactive
                    }
                    className="w-[20px]"
                  />
                  <div className="mr-4">{item.title}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Asset */}
          <div className="flex flex-col">
            {/* Asset Card */}
            {activeAsset?.length !== 0 ? (
              <>
                {activeAsset?.map(data => (
                  <div
                    key={data?.id}
                    onClick={async () =>
                      await router.push(
                        `/play/tournament/${id as string}/portfolio/${
                          data?.asset_id
                        }/detail-portfolio`
                      )
                    }
                    className="flex justify-between items-center p-2 md:p-4 mt-4 bg-[#F9F9F9] md:bg-white border border-[#E9E9E9] md:border-none rounded-lg hover:bg-[#E1E1E1] duration-300 cursor-pointer"
                  >
                    <div className="w-full flex gap-1 md:gap-4 items-center">
                      <div className="h-[30px] md:h-[40px] w-[30px] md:w-[40px] flex justify-center items-center overflow-hidden">
                        <img
                          width={100}
                          height={100}
                          alt=""
                          src={data?.asset_detail?.logo}
                          className="w-full h-full"
                        />
                      </div>
                      <div className="flex flex-col justify-center items-start">
                        <div className="flex gap-1">
                          <div className="font-semibold text-sm md:text-base">
                            {data?.asset_detail?.seeds_ticker ?? 'Coin'} /{' '}
                          </div>
                          <div className="text-sm md:text-base">
                            {data?.asset_detail?.exchange_currency ?? 'IDR'}
                          </div>
                        </div>
                        <div className="text-[#7C7C7C] text-xs md:text-base">
                          {data?.asset_detail?.name ?? 'Asset'}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-end items-end w-[140px] md:w-[200px] lg:w-[300px]">
                      <div className="font-semibold text-xs md:text-base">
                        {userInfo?.preferredCurrency !== undefined
                          ? userInfo?.preferredCurrency
                          : 'IDR'}{' '}
                        {standartCurrency(
                          (data?.average_price ?? 0) * (data?.total_lot ?? 0)
                        ).replace('Rp', '')}
                      </div>
                      <div className="flex justify-center gap-2 text-xs md:text-base">
                        <Image
                          alt=""
                          src={data?.return_percentage < 0 ? Bearish : Bullish}
                          className="w-[14px] md:w-[20px]"
                        />
                        <div
                          className={`${
                            data?.return_percentage < 0
                              ? 'text-[#DD2525]'
                              : 'text-[#3AC4A0]'
                          }`}
                        >{`(${data?.return_percentage ?? 0})%`}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="bg-white flex flex-col justify-center items-center text-center lg:px-0 mt-8">
                <Image
                  alt=""
                  src={NoData}
                  className="w-[250px]"
                  width={100}
                  height={100}
                />
                <p className="font-semibold text-black mt-4">
                  {t('tournament.assets.sorry')}
                </p>
                <p className="text-[#7C7C7C]">
                  {t('tournament.assets.noData')}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-center mx-auto my-8">
            <AssetPagination
              currentPage={activeAssetParams.page}
              totalPages={Math.ceil((activeAssetLength ?? 0) / 5)}
              onPageChange={page => {
                setActiveAssetParams({ ...activeAssetParams, page });
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(Portfolio);
