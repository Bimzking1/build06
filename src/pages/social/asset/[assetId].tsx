import { Button, Tab, Tabs, TabsHeader } from '@material-tailwind/react';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';
import { toast } from 'react-toastify';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

import CCard from '@/components/CCard';
import LineChart from '@/components/LineChart';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import Card1 from '@/containers/homepage/asset/Card1';
import KeystatCard from '@/containers/play/asset/Card2';
import KeyStatistic from '@/containers/play/asset/KeyStatistic';
import OverviewItem from '@/containers/play/asset/OverviewItem';
import SocialCard from '@/containers/play/asset/SocialCard';
import Card2Skeleton from '@/containers/play/asset/skeleton/Card2Skeleton';
import useGetLastPrice from '@/hooks/useGetLastPrice';
import useLineChart from '@/hooks/useLineChart';
import { getDetailAsset } from '@/repository/asset.repository';
import { getPostForYou } from '@/repository/circleDetail.repository';
import { getPlayAssets } from '@/repository/play.repository';
import { getUserInfo } from '@/repository/profile.repository';
import {
  type AssetI,
  type ForYouPostI,
  type IPortfolioSummary,
  type IUserData
} from '@/utils/interfaces/play.interface';
import { type PreferredCurrencyI } from '@/utils/interfaces/user.interface';
import Image from 'next/image';
import { ArrowBackwardIcon } from 'public/assets/vector';

const dataTab = [
  { label: '1d', value: 'daily' },
  { label: '1w', value: 'weekly' },
  { label: '1m', value: 'monthly' },
  { label: '1y', value: 'yearly' },
  { label: 'All', value: 'alltime' }
];

const initialPortfolioSummary: IPortfolioSummary = {
  asset_id: '',
  play_id: '',
  user_id: '',
  total_lot: 0,
  average_price: 0,
  current_price: 0,
  total_invested: 0,
  total_value: 0,
  return_value: 0,
  return_percentage: 0,
  currency: ''
};

const AssetDetailPage: React.FC = () => {
  const router = useRouter();
  const { assetId, id } = router.query;
  const { t } = useTranslation();
  const [data, setData] = useState<AssetI>();
  const [params, setParams] = useState({
    tf: 'daily'
  });
  const { chartItem } = useLineChart(data, params.tf);
  const [userInfo, setUserInfo] = useState<IUserData>();
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [portfolio, setPortfolio] = useState<IPortfolioSummary>(
    initialPortfolioSummary
  );
  const [forYouData, setForYouData] = useState<ForYouPostI[]>();
  const [assetType, setAssetType] = useState<string>('');
  const prefCurrency = userInfo?.preferredCurrency.toLowerCase();
  const lastPrice = useGetLastPrice(data?.seedsTicker);
  const fetchPlayPortfolio = async (currency: string): Promise<void> => {
    try {
      const response = await getPlayAssets(id as string, assetId as string);
      if (typeof response === 'object') {
        setPortfolio(response.data);
      }
    } catch (error) {
      toast('Failed to get Portfolio data');
    }
  };

  const fetchForYou = async (): Promise<void> => {
    try {
      const response = await getPostForYou(
        1,
        3,
        userInfo?.preferredCurrency as string
      );
      setForYouData(response.data);
    } catch (error) {
      toast('Failed to get Social data');
    }
  };
  const lastPriceAsset = data?.lastPrice.close;

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 1000,
    cssEase: 'linear',
    variableWidth: true,
    arrows: false
  };

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const dataInfo = await getUserInfo();
      setUserInfo(dataInfo);
    } catch (error: any) {
      toast('Failed to get user info');
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleChangeParams = (value: string): void => {
    setParams(prevState => ({
      ...prevState,
      tf: value
    }));
  };

  const fetchDetailAsset = async (currency: string): Promise<void> => {
    try {
      if (typeof assetId === 'string') {
        const response = await getDetailAsset(assetId, { ...params, currency });
        setData(response.marketAsset);
        setAssetType(response.marketAsset.assetType);
      }
    } catch (error) {
      toast('Failed to fetch asset');
    }
  };

  useEffect(() => {
    if (assetId !== null && userInfo !== undefined) {
      void fetchDetailAsset(userInfo.preferredCurrency);
      void fetchPlayPortfolio(userInfo.preferredCurrency);
      void fetchForYou();
    }
  }, [assetId, userInfo, params]);

  const menu = ['Overview'];
  const tabsComponents = [<OverviewItem key={1} />];

  if (data?.assetType === 'ID_STOCK') {
    menu.push('Key statistic');
    tabsComponents.push(<KeyStatistic key={2} />);
  }

  return (
    <PageGradient defaultGradient className="w-full">
      <CCard className="flex flex-row justify-between p-4 mt-5 md:rounded-lg border-none rounded-none">
        <Image
          src={ArrowBackwardIcon}
          alt="Back"
          width={30}
          height={30}
          className="cursor-pointer"
          onClick={() => {
            router.back();
          }}
        />
        <p className="font-bold text-black text-lg">Overview</p>
        <div></div>
      </CCard>
      <div className="flex flex-col md:flex-row gap-5">
        {data !== undefined ? (
          <Card1
            data={{
              ...data,
              socketPrice:
                typeof prefCurrency === 'string'
                  ? lastPrice[prefCurrency as PreferredCurrencyI] !== 0
                    ? lastPrice[prefCurrency as PreferredCurrencyI]
                    : lastPriceAsset ?? 0
                  : 0
            }}
            currency={userInfo?.preferredCurrency as string}
            playId={id as string}
            assetId={assetId as string}
            playSimulation={false}
            playTeamBattle={false}
          />
        ) : (
          <Card2Skeleton />
        )}
        {data !== undefined ? (
          <KeystatCard
            data={data}
            currency={userInfo?.preferredCurrency as string}
          />
        ) : (
          <Card2Skeleton />
        )}
      </div>

      <CCard className="flex p-2 mt-5 md:rounded-lg border-none rounded-none">
        <div className="h-[35rem] mb-5">
          <LineChart data={chartItem} />
        </div>

        <Tabs value={'daily'}>
          <TabsHeader
            className="bg-transparent rounded-xl"
            indicatorProps={{
              className: 'bg-gray-900/10 rounded-xl shadow-none !text-gray-900'
            }}
          >
            {dataTab.map(({ label, value }) => (
              <Tab
                key={value}
                value={value}
                onClick={() => {
                  handleChangeParams(value);
                }}
                className={`${
                  params.tf === value
                    ? 'bg-[#3AC4A0] text-white rounded-xl'
                    : 'bg-[#F9F9F9] text-[#7C7C7C]'
                } text-base z-0 py-2 font-semibold`}
              >
                {label}
              </Tab>
            ))}
          </TabsHeader>
        </Tabs>
      </CCard>
      <div className="flex flex-col lg:flex-row gap-4">
        <CCard className="flex flex-col gap-4 w-full md:w-7/12 p-4 md:mt-5 md:rounded-lg border-none rounded-none">
          <div className="flex w-full justify-between gap-2">
            {menu.map((data, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedTab(index);
                }}
                className={
                  selectedTab === index
                    ? 'bg-[#3AC4A0] rounded-md p-2 text-white font-semibold grow'
                    : 'border border-[#BDBDBD] rounded-md p-2 text-[#BDBDBD] font-semibold grow'
                }
              >
                {data}
              </button>
            ))}
          </div>
          {tabsComponents[selectedTab]}
        </CCard>
        <div className="flex flex-col w-full md:w-5/12">
          <CCard className="flex w-full p-4 md:mt-5 md:rounded-lg border-none rounded-none">
            <p className="font-bold text-black text-lg">Your Portfolio</p>
            <div className="border border-[#E9E9E9] rounded-md flex justify-between gap-2 p-2">
              <div className="flex flex-col">
                <p className="text-[#7C7C7C]">Total Value</p>
                <p className="font-bold text-black text-lg">
                  {userInfo?.preferredCurrency}{' '}
                  {portfolio?.total_value !== undefined
                    ? new Intl.NumberFormat().format(portfolio?.total_value)
                    : '0'}
                </p>
                <p
                  className={
                    portfolio?.return_value < 0
                      ? 'font-thin text-[#DD2525] text-sm'
                      : 'font-thin text-[#3AC4A0] text-sm'
                  }
                >
                  {userInfo?.preferredCurrency}{' '}
                  {portfolio?.total_value !== undefined
                    ? new Intl.NumberFormat().format(portfolio?.return_value)
                    : '0'}{' '}
                  ({portfolio?.return_percentage}%)
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-[#7C7C7C]">Lot</p>
                <p className="font-bold text-black text-lg">
                  {portfolio?.total_value !== undefined
                    ? portfolio?.total_lot
                    : '0'}{' '}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-[#7C7C7C]">Price Avg</p>
                <p className="font-bold text-black text-lg">
                  {userInfo?.preferredCurrency}{' '}
                  {portfolio?.total_value !== undefined
                    ? new Intl.NumberFormat().format(portfolio?.average_price)
                    : '-'}
                </p>
              </div>
            </div>
          </CCard>
          <CCard className="flex w-full px-4 py-8  md:mt-5 md:rounded-lg border-none rounded-none">
            <p className="font-bold text-black text-lg">Social For You</p>
            <div className="slider-container">
              <Slider {...settings}>
                {forYouData?.map((data, index) => {
                  return <SocialCard key={index} item={data} />;
                })}
              </Slider>
            </div>
            {/* <div className="flex w-full overflow-x-scroll gap-2"></div> */}
          </CCard>
        </div>
      </div>
      {id !== undefined && (
        <CCard className="flex p-2 mt-5 md:rounded-lg border-none rounded-none">
          <div className="flex justify-between gap-2">
            <Button
              variant="filled"
              disabled={portfolio?.total_value === undefined}
              className="normal-case rounded-full w-full py-2 bg-[#DD2525] text-white font-poppins"
              onClick={() => {
                if (assetType === 'CRYPTO') {
                  void router.push(
                    `/play/tournament/${id as string}/order/crypto/${
                      assetId as string
                    }?transaction=sell`
                  );
                } else if (assetType === 'COMMODITIES') {
                  void router.push(
                    `/play/tournament/${id as string}/order/comodities/${
                      assetId as string
                    }?transaction=sell`
                  );
                } else {
                  void router.push(
                    `/play/tournament/${id as string}/order/${
                      assetId as string
                    }?transaction=sell`
                  );
                }
              }}
            >
              {t('playSimulation.sell')}
            </Button>
            <Button
              variant="filled"
              className="normal-case rounded-full w-full py-2 bg-[#3AC4A0] text-white font-poppins"
              onClick={() => {
                if (assetType === 'CRYPTO') {
                  void router.push(
                    `/play/tournament/${id as string}/order/crypto/${
                      assetId as string
                    }?transaction=buy`
                  );
                } else if (assetType === 'COMMODITIES') {
                  void router.push(
                    `/play/tournament/${id as string}/order/comodities/${
                      assetId as string
                    }?transaction=buy`
                  );
                } else {
                  void router.push(
                    `/play/tournament/${id as string}/order/${
                      assetId as string
                    }?transaction=buy`
                  );
                }
              }}
            >
              {t('playSimulation.buy')}
            </Button>
          </div>
        </CCard>
      )}
    </PageGradient>
  );
};

export default AssetDetailPage;
