import NoData from '@/assets/play/tournament/assetNoData.svg';
import AssetPagination from '@/components/AssetPagination';
import CCard from '@/components/CCard';
import PieChart from '@/components/PieChart';
import Loading from '@/components/popup/Loading';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import AssetOrderCard from '@/containers/homepage/trending/AssetsOrderCard';
import AssetTrendingCardSkeleton from '@/containers/homepage/trending/skeleton/AssetsCardSkeleton';
import { standartCurrency } from '@/helpers/currency';
import withAuth from '@/helpers/withAuth';
import {
  getHistoryTransaction,
  getPlayBallance
} from '@/repository/play.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { type Ballance } from '../index';

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string[];
  }>;
}

interface Params {
  page: number;
  limit: number;
}

export interface HistoryTransactionDTO {
  id: string;
  play_id: string;
  user_id: string;
  asset: {
    asset_id: string;
    asset_name: string;
    asset_icon: string;
    asset_ticker: string;
    asset_exchange: string;
    asset_type: string;
  };
  type: 'BUY' | 'SELL';
  lot: number;
  bid_price: number;
  stop_loss: number;
  pnl: number;
  created_at: string;
  updated_at: string;
}

interface Metadata {
  currentPage: number;
  limit: number;
  totalPage: number;
  totalRow: number;
}

const initialChartData = {
  labels: ['dummy'],
  datasets: [
    {
      label: 'dummy',
      data: [100],
      backgroundColor: ['#9F9F9F']
    }
  ]
};

const CashBalancePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation();
  const [chartData, setChartData] = useState<ChartData>(initialChartData);
  const [ballance, setBallance] = useState<Ballance>({
    balance: 0,
    portfolio: 0,
    total_sell: 0,
    total_buy: 0,
    currency: 'IDR'
  });
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [metadata, setMetadata] = useState<Metadata>();
  const [transaction, setTransaction] = useState<HistoryTransactionDTO[]>([]);
  const [params, setParams] = useState<Params>({
    page: 1,
    limit: 10
  });

  useEffect(() => {
    if (ballance !== undefined) {
      handleSetChartData();
    }
  }, [ballance]);

  useEffect(() => {
    fetchData()
      .then()
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (id !== undefined && userInfo !== undefined) {
      void fetchPlayBallance(userInfo.preferredCurrency);
    }
  }, [id, userInfo]);

  useEffect(() => {
    if (userInfo !== undefined) {
      void fetchHistorytransaction(userInfo.preferredCurrency);
    }
  }, [id, userInfo, params.page]);

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
      const response = await getPlayBallance(id as string, { currency });
      setBallance(response);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  const fetchHistorytransaction = async (currency: string): Promise<void> => {
    try {
      setIsLoading(true);
      getHistoryTransaction(id as string, { ...params, currency })
        .then(res => {
          setMetadata(res?.metadata);
          setTransaction(res?.playOrders);
        })
        .then(() => {
          setIsLoading(false);
        })
        .catch(err => {
          toast.error(`${err as string}`);
        });
    } catch (error) {
      toast.error(`${error as string}`);
      setIsLoading(false);
    }
  };

  const convertToPercent = (num1: number, num2: number): number[] => {
    const total = num1 + num2;
    const percentNum1 = (num1 / total) * 100;
    const percentNum2 = (num2 / total) * 100;
    return [Math.round(percentNum1), Math.round(percentNum2)];
  };

  const handleSetChartData = (): void => {
    const convertedData: ChartData = {
      labels: [t('playSimulation.cashAvailable'), t('playSimulation.cashUsed')],
      datasets: [
        {
          label: ' Percentage',
          data: convertToPercent(
            ballance?.balance ?? 0,
            ballance?.portfolio ?? 0
          ),
          backgroundColor: ['#3AC4A0', '#DD2525']
        }
      ]
    };

    setChartData(convertedData);
  };

  return (
    <PageGradient defaultGradient className="w-full">
      {isLoading && <Loading />}
      <CCard className="flex flex-col w-full p-5 border-none rounded-xl">
        <div className="flex z-10 flex-col lg:flex-row justify-between pb-4">
          <div className="flex flex-col">
            <div className="sm:text-3xl text-lg font-semibold bg-clip-text text-black font-poppins">
              {t('playSimulation.cashBalance')}
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <div className="w-[200px] shadow-lg rounded-full">
            {ballance !== null && <PieChart data={chartData} />}
          </div>
        </div>
        <div className="flex flex-col pt-4">
          <div className="flex justify-between border-b border-[#E9E9E9] p-3">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
              >
                <circle cx="14" cy="14" r="14" fill="#27A590" />
                <path
                  d="M20.7196 7.56055H7.27961C6.35561 7.56055 5.59961 8.31655 5.59961 9.24055V18.7605C5.59961 19.6845 6.35561 20.4405 7.27961 20.4405H20.7196C21.6436 20.4405 22.3996 19.6845 22.3996 18.7605V9.24055C22.3996 8.31655 21.6436 7.56055 20.7196 7.56055ZM19.3196 15.1205C19.3196 15.3725 19.0396 15.4845 18.8436 15.3165L17.5556 14.0285L14.5876 16.5765C14.2516 16.9125 13.7196 16.9125 13.4116 16.5765L11.6196 14.5325L8.42761 17.3325C8.31561 17.4445 8.14761 17.4445 8.03561 17.3325L7.89561 17.1925C7.78361 17.0805 7.78361 16.9125 7.89561 16.8005L11.0316 12.5165C11.3676 12.1805 11.8996 12.1805 12.2076 12.5165L13.9996 14.3085L15.8196 12.2085L14.6436 11.1445C14.4756 10.9765 14.5876 10.6405 14.8396 10.6405H18.7596C19.0676 10.6405 19.2916 10.9205 19.2916 11.2285V15.1205H19.3196Z"
                  fill="white"
                />
              </svg>
              <Typography className="text-[#27A590] font-poppins font-semibold">
                {t('playSimulation.cashAvailable')}
              </Typography>
            </div>
            <div className="flex gap-4 items-center">
              <Typography className="text-[#27A590] font-poppins text-base font-semibold">
                {`${ballance?.currency ?? 'IDR'} ${standartCurrency(
                  ballance?.balance ?? 0
                ).replace('Rp', '')}`}
              </Typography>
            </div>
          </div>
          <div className="flex justify-between border-b border-[#E9E9E9] p-3">
            <div className="flex items-center gap-2">
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="14" cy="14" r="14" fill="#27A590" />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M21.7039 11.3348C21.659 11.332 21.6101 11.332 21.5595 11.332L21.5469 11.332H19.561C17.9241 11.332 16.5234 12.6205 16.5234 14.3008C16.5234 15.981 17.9241 17.2695 19.561 17.2695H21.5469H21.5595C21.6101 17.2695 21.659 17.2696 21.7039 17.2668C22.3688 17.2247 22.9568 16.7044 23.0062 15.9777C23.0095 15.93 23.0094 15.8787 23.0094 15.8311V15.8182V12.7834V12.7705C23.0094 12.7229 23.0095 12.6715 23.0062 12.6239C22.9568 11.8971 22.3688 11.3768 21.7039 11.3348ZM19.3849 15.0925C19.8063 15.0925 20.1479 14.738 20.1479 14.3008C20.1479 13.8635 19.8063 13.5091 19.3849 13.5091C18.9635 13.5091 18.6218 13.8635 18.6218 14.3008C18.6218 14.738 18.9635 15.0925 19.3849 15.0925Z"
                  fill="white"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M21.5607 18.4583C21.6787 18.4552 21.7681 18.5646 21.736 18.6783C21.5771 19.2422 21.3248 19.723 20.9201 20.1278C20.3276 20.7202 19.5763 20.9831 18.6482 21.108C17.7463 21.2292 16.594 21.2292 15.1391 21.2292H13.4664C12.0115 21.2292 10.8591 21.2292 9.95726 21.108C9.02909 20.9831 8.27784 20.7202 7.68538 20.1278C7.09293 19.5353 6.83 18.784 6.70522 17.8559C6.58396 16.954 6.58397 15.8017 6.58398 14.3467V14.2574C6.58397 12.8025 6.58396 11.6502 6.70522 10.7483C6.83 9.82011 7.09293 9.06886 7.68538 8.4764C8.27784 7.88395 9.02909 7.62102 9.95726 7.49624C10.8591 7.37498 12.0115 7.37498 13.4664 7.375H15.1391C16.594 7.37498 17.7463 7.37498 18.6482 7.49624C19.5763 7.62102 20.3276 7.88395 20.9201 8.4764C21.3248 8.88116 21.577 9.36188 21.736 9.92589C21.7681 10.0396 21.6787 10.1489 21.5607 10.1458L19.5626 10.1458C17.3169 10.1458 15.3375 11.9199 15.3375 14.3021C15.3375 16.6843 17.3169 18.4583 19.5626 18.4583H21.5607ZM10.5423 17.2708C10.2144 17.2708 9.94857 17.005 9.94857 16.6771V11.9271C9.94857 11.5992 10.2144 11.3333 10.5423 11.3333C10.8702 11.3333 11.1361 11.5992 11.1361 11.9271V16.6771C11.1361 17.005 10.8702 17.2708 10.5423 17.2708Z"
                  fill="white"
                />
              </svg>
              <Typography className="text-[#DD2525] font-poppins font-semibold">
                {t('playSimulation.cashUsed')}
              </Typography>
            </div>
            <div className="flex gap-4 items-center">
              <Typography className="text-[#DD2525] font-poppins text-base font-semibold">
                {`${ballance?.currency ?? 'IDR'} ${standartCurrency(
                  ballance?.portfolio ?? 0
                ).replace('Rp', '')}`}
              </Typography>
            </div>
          </div>
          <Typography className="text-black font-poppins text-base sm:text-lg font-semibold my-4">
            {t('playSimulation.historyTransaction')}
          </Typography>
          <div className="flex flex-col gap-3">
            {!isLoading ? (
              transaction?.length !== 0 ? (
                <>
                  {transaction?.map(
                    (data: HistoryTransactionDTO, idx: number) => {
                      return (
                        <div key={idx} className="w-full">
                          <AssetOrderCard
                            currency={userInfo?.preferredCurrency ?? 'IDR'}
                            data={data}
                            isClick={true}
                            playId={id as string}
                          />
                        </div>
                      );
                    }
                  )}
                  <div className="flex justify-center mx-auto my-8">
                    <AssetPagination
                      currentPage={params.page}
                      totalPages={metadata?.totalPage ?? 0}
                      onPageChange={page => {
                        setParams({ ...params, page });
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className="bg-white flex flex-col justify-center items-center text-center lg:px-0 my-8">
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
              )
            ) : (
              Array.from({ length: 10 }, (_, idx) => (
                <AssetTrendingCardSkeleton key={idx} />
              ))
            )}
          </div>
        </div>
      </CCard>
    </PageGradient>
  );
};

export default withAuth(CashBalancePage);
