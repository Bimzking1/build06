import CCard from '@/components/CCard';
import LineChart from '@/components/LineChart';
import Loading from '@/components/popup/Loading';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import Card1 from '@/containers/homepage/asset/Card1';
import Card2 from '@/containers/homepage/asset/Card2';
import Card1Skeleton from '@/containers/homepage/asset/skeleton/Card1Skeleton';
import Card2Skeleton from '@/containers/homepage/asset/skeleton/Card2Skeleton';
import useGetLastPrice from '@/hooks/useGetLastPrice';
import useLineChart from '@/hooks/useLineChart';
import { getDetailAsset } from '@/repository/asset.repository';
import { getPlayPortfolio } from '@/repository/play.repository';
import { useAppSelector } from '@/store/redux/store';
import { type AssetI, type Assets } from '@/utils/interfaces/play.interface';
import { type PreferredCurrencyI } from '@/utils/interfaces/user.interface';
import { Button, Tab, Tabs, TabsHeader } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ArrowBackwardIcon } from 'public/assets/vector';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const dataTab = [
  { label: '1d', value: 'daily' },
  { label: '1w', value: 'weekly' },
  { label: '1m', value: 'monthly' },
  { label: '1y', value: 'yearly' },
  { label: 'All', value: 'alltime' }
];

const AssetDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { playId } = router.query;
  const { t } = useTranslation();
  const [data, setData] = useState<AssetI>();
  const [params, setParams] = useState({
    tf: 'daily'
  });
  const { chartItem } = useLineChart(data, params.tf);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [assets, setAssets] = useState<Assets[]>([]);
  const { dataUser } = useAppSelector(state => state.user);
  const prefCurrency = dataUser?.preferredCurrency?.toLowerCase();
  const lastPrice = useGetLastPrice(data?.seedsTicker);
  const handleChangeParams = (value: string): void => {
    setParams(prevState => ({
      ...prevState,
      tf: value
    }));
  };

  const fetchDetailAsset = async (currency: string): Promise<void> => {
    try {
      if (typeof id === 'string') {
        const response = await getDetailAsset(id, { ...params, currency });
        setData(response.marketAsset);
      }
    } catch (error) {
      toast.error(`${error as string}`);
    }
  };

  useEffect(() => {
    if (id !== undefined && dataUser !== undefined) {
      void fetchPlayPortfolio(playId as string, dataUser.preferredCurrency);
    }
  }, [id, dataUser]);

  useEffect(() => {
    if (id !== null && dataUser !== undefined) {
      void fetchDetailAsset(dataUser.preferredCurrency);
    }
  }, [id, dataUser, params]);

  const fetchPlayPortfolio = async (
    id: string,
    currency: string
  ): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await getPlayPortfolio(id, currency);
      setAssets(response?.pie?.assets);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  const findById = (): boolean => {
    const foundAsset = assets?.find(asset => asset?.id === id);
    if (foundAsset !== undefined) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <>
      {isLoading ? <Loading /> : ''}
      <PageGradient defaultGradient className="w-full">
        <CCard className="flex flex-row justify-between p-4 mt-5 md:rounded-lg border-none rounded-none">
          <Image
            src={ArrowBackwardIcon}
            alt="Back"
            width={30}
            height={30}
            className="cursor-pointer"
            onClick={async () => {
              await router.push(`/homepage/play/${playId as string}`);
            }}
          />
          <p className="font-bold text-black text-lg">
            {t('playSimulation.assetDetail')}
          </p>
          <div></div>
        </CCard>
        <div className="flex flex-col md:flex-row gap-5">
          {data !== undefined ? (
            <Card1
              data={{
                ...data,
                socketPrice:
                  typeof prefCurrency === 'string'
                    ? lastPrice[
                        prefCurrency.toLowerCase() as PreferredCurrencyI
                      ]
                    : 0
              }}
              currency={dataUser?.preferredCurrency}
              playId={playId as string}
              assetId={id as string}
              playSimulation={true}
              playTeamBattle={false}
            />
          ) : (
            <Card1Skeleton />
          )}
          {data !== undefined ? (
            <Card2 data={data} currency={dataUser?.preferredCurrency} />
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
                className:
                  'bg-gray-900/10 rounded-xl shadow-none !text-gray-900'
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
        {playId !== undefined && (
          <CCard className="flex p-2 mt-5 md:rounded-lg border-none rounded-none">
            <div className="flex justify-between gap-2">
              <Button
                variant="outlined"
                disabled={findById()}
                className="normal-case border rounded-full w-full py-2 border-[#3AC4A0] text-[#3AC4A0] font-poppins"
                onClick={() => {
                  router
                    .push(
                      `/homepage/order/${
                        id as string
                      }?transaction=sell&playId=${playId as string}`
                    )
                    .catch(err => {
                      toast.error(`${err as string}`);
                    });
                }}
              >
                {t('playSimulation.sell')}
              </Button>
              <Button
                variant="filled"
                className="normal-case rounded-full w-full py-2 bg-[#3AC4A0] text-white font-poppins"
                onClick={() => {
                  router
                    .push(
                      `/homepage/order/${id as string}?transaction=buy&playId=${
                        playId as string
                      }`
                    )
                    .catch(err => {
                      toast.error(`${err as string}`);
                    });
                }}
              >
                {t('playSimulation.buy')}
              </Button>
            </div>
          </CCard>
        )}
      </PageGradient>
    </>
  );
};

export default AssetDetailPage;
