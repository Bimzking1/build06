/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
'use-client';

import NoData from '@/assets/play/tournament/assetNoData.svg';
import AssetPagination from '@/components/AssetPagination';
import Loading from '@/components/popup/Loading';
import ModalCancelOrder from '@/components/popup/ModalCancelOrder';
import VirtualBalanceChart from '@/containers/tournament/portfolio-chart/VirtualBalanceChart';
import { standartCurrency } from '@/helpers/currency';
import { getShortDate } from '@/helpers/dateFormat';
import withAuth from '@/helpers/withAuth';
import {
  //   getHistoryTransaction,
  getOperOrderList
} from '@/repository/play.repository';
import { getUserInfo } from '@/repository/profile.repository';
import {
  getBattleArena,
  getBattleBalance,
  getBattleHistoryTransaction
} from '@/repository/team-battle.repository';
import { type BallanceTournament } from '@/utils/interfaces/tournament.interface';
import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface OpenOrderList {
  amount: number;
  asset_icon: string;
  asset_id: string;
  asset_ticker: string;
  created_at: string;
  currency: string;
  exchange: string;
  filled: number;
  id: string;
  order: string;
  price: number;
}

interface HistoryTransaction {
  id: string;
  participant_id: string;
  battle_id: string;
  stage: string;
  asset: AssetHistoryTransaction;
  status: string;
  limit_type: string;
  type: string;
  total_assets: number;
  bid_price: number;
  take_profit: number;
  stop_loss: number;
  time_in_force: string;
  created_at: string;
  updated_at: string;
}

interface AssetHistoryTransaction {
  asset_exchange: string;
  asset_icon: string;
  asset_id: string;
  asset_name: string;
  asset_ticker: string;
  asset_type: string;
}

interface UserInfo {
  preferredCurrency: string;
}

export interface Metadata {
  currentPage: number;
  limit: number;
  totalPage: number;
  totalRow: number;
}

interface BattleOrderResI {
  battle_orders: HistoryTransaction[];
  metadata: Metadata;
}

const BattleVirtualBalance = (): React.ReactElement => {
  const router = useRouter();
  const id = router.query.id;
  const { t } = useTranslation();
  const [loadingBallance, setLoadingBallance] = useState<boolean>(false);
  const [loadingOpenOrder, setLoadingOpenOrder] = useState<boolean>(false);
  const [loadingHistoryTransaction, setLoadingHistoryTransaction] =
    useState<boolean>(false);
  const [activeNavbar, setActiveNavbar] = useState<string>('openOrder');
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>();
  const [ballance, setBallance] = useState<BallanceTournament>({
    balance: 0,
    portfolio: 0,
    total_sell: 0,
    total_buy: 0,
    return_value: 0,
    return_percentage: 0,
    currency: 'IDR'
  });
  const [openOrder, setOpenOrder] = useState<OpenOrderList[]>([]);
  const [historyTransaction, setHistoryTransaction] = useState<
    BattleOrderResI | undefined
  >(undefined);
  const [historyParams, setHistoryParams] = useState({
    limit: 5,
    page: 1
  });
  const [orderParams, setOrderParams] = useState({
    page: 1,
    startIndex: 0,
    endIndex: 4
  });

  useEffect(() => {
    setHistoryParams({ ...historyParams, page: 1 });
  }, [activeNavbar]);

  useEffect(() => {
    fetchData()
      .then()
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (id !== null && userInfo !== undefined) {
      void fetchPlayBallance(userInfo?.preferredCurrency);
    }
  }, [id, userInfo]);

  useEffect(() => {
    if (id !== null && userInfo !== undefined) {
      void fetchOpenOrderList(userInfo?.preferredCurrency);
    }
  }, [id, userInfo, showCancelModal, orderParams]);

  useEffect(() => {
    if (id !== null && userInfo !== undefined) {
      void fetchHistoryTransaction(userInfo?.preferredCurrency);
    }
  }, [id, userInfo, historyParams]);

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
      setLoadingBallance(true);
      const response = await getBattleBalance(id as string, { currency });
      setBallance(response);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      setLoadingBallance(false);
    }
  };

  const fetchOpenOrderList = async (currency: string): Promise<void> => {
    try {
      setLoadingOpenOrder(true);
      const response = await getOperOrderList(id as string, { currency });
      setOpenOrder(response?.data);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      setLoadingOpenOrder(true);
    }
  };

  const fetchHistoryTransaction = async (currency: string): Promise<void> => {
    try {
      setLoadingHistoryTransaction(true);
      const responseStatus = await getBattleArena(id as string);
      if (responseStatus !== undefined) {
        const response = await getBattleHistoryTransaction(id as string, {
          ...historyParams,
          currency,
          stage: responseStatus?.status
        });
        setHistoryTransaction(response);
      }
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      setLoadingHistoryTransaction(true);
    }
  };

  const handleTabChange = (tab: string): void => {
    setActiveNavbar(tab);
  };

  const handleShowModalCancelOrder = (id: string): void => {
    setOrderId(id);
    setShowCancelModal(true);
  };

  return (
    <>
      {loadingBallance && loadingOpenOrder && loadingHistoryTransaction && (
        <Loading />
      )}
      {showCancelModal && (
        <ModalCancelOrder
          onClose={() => {
            setShowCancelModal(prev => !prev);
          }}
          orderId={orderId as string}
          playId={id as string}
        />
      )}
      <div className="w-full flex flex-col justify-center items-center rounded-xl font-poppins p-5 bg-white">
        <div className="flex justify-start w-full">
          <Typography className="text-xl font-semibold">
            {t('tournament.assets.virtualBalance')}
          </Typography>
        </div>

        {/* Circle Chart */}
        <VirtualBalanceChart
          currency={userInfo?.preferredCurrency ?? ''}
          portfolio={ballance?.portfolio ?? 0}
          balance={ballance?.balance ?? 0}
        />

        <div className="w-full mt-4">
          <Typography className="text-xl font-semibold mb-4">
            {t('tournament.assets.transaction')}
          </Typography>
          <div className="gap-2">
            <Tabs value={activeNavbar} className="w-full">
              <TabsHeader
                className="w-full text-center justify-center mx-auto rounded-none bg-transparent p-0"
                indicatorProps={{
                  className: 'shadow-none rounded-none bg-transparent'
                }}
              >
                <Tab
                  value="openOrder"
                  onClick={() => {
                    handleTabChange('openOrder');
                  }}
                  className={`text-center text-sm md:text-base z-0 bg-transparent mt-3 xl:mt-5 ${
                    activeNavbar === 'openOrder'
                      ? 'text-[#4FE6AF] bg-gradient-to-t from-[#e5fcf3] to-white linier font-semibold border-b-2 border-b-[#4FE6AF]'
                      : 'text-[#7C7C7C] font-normal border-b-2 border-b-[#BDBDBD]'
                  }`}
                >
                  {t('tournament.assets.openOrder')}
                </Tab>
                <Tab
                  value="history"
                  onClick={() => {
                    handleTabChange('history');
                  }}
                  className={`text-center text-sm md:text-base z-0 bg-transparent mt-3 xl:mt-5 ${
                    activeNavbar === 'history'
                      ? 'text-[#4FE6AF] bg-gradient-to-t from-[#e5fcf3] to-white linier font-semibold border-b-2 border-b-[#4FE6AF]'
                      : 'text-[#7C7C7C] font-normal border-b-2 border-b-[#BDBDBD]'
                  }`}
                >
                  {t('tournament.assets.historyTransaction')}
                </Tab>
              </TabsHeader>
              <TabsBody className="w-full">
                <TabPanel value="openOrder">
                  {openOrder?.slice(
                    orderParams.startIndex,
                    orderParams.endIndex
                  ).length !== 0 ? (
                    <>
                      {openOrder?.map(data => (
                        <div
                          key={data?.id}
                          className="bg-[#4DA81C] pl-1 rounded-lg shadow-lg text-xs md:text-sm"
                        >
                          <div className="w-full flex justify-between items-center p-2 mt-4 bg-[#F9F9F9] md:bg-white border border-[#E9E9E9] md:border-none rounded-tl-lg">
                            <div className="flex gap-2 md:gap-4 w-full justify-between items-center">
                              <div className="flex justify-center items-center w-[30px] h-[30px] md:w-[40px] md:h-[40px] xl:w-[50px] xl:h-[50px]">
                                <img
                                  alt=""
                                  src={data?.asset_icon}
                                  className="w-auto h-full"
                                />
                              </div>
                              <div className="w-full">
                                <div className="flex gap-1 text-sm md:text-md xl:text-lg w-full">
                                  <div className="font-semibold">
                                    {data?.asset_ticker} / {data?.currency}
                                  </div>
                                </div>
                                <div className="flex justify-between items-center w-full">
                                  <div className="text-[#4DA81C] text-[11px] md:text-sm">
                                    {t('tournament.assets.pending')}
                                  </div>
                                  <div className="text-[#7C7C7C] text-[10px] md:text-sm">
                                    {getShortDate(data?.created_at)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className=" bg-[#E9E9E9] p-2 flex justify-between">
                            <div className="text-[#7C7C7C] ">
                              {t('tournament.assets.amount')}
                            </div>
                            <div className="font-semibold">{data?.amount}</div>
                          </div>
                          <div className=" bg-white p-2 flex justify-between">
                            <div className="text-[#7C7C7C]">
                              {t('tournament.assets.price')}
                            </div>
                            <div className="text-black font-semibold">
                              {userInfo?.preferredCurrency !== undefined
                                ? userInfo?.preferredCurrency
                                : 'IDR'}
                              {standartCurrency(data?.price ?? 0).replace(
                                'Rp',
                                ''
                              )}
                            </div>
                          </div>
                          <div className=" bg-[#E9E9E9] p-2 flex justify-between">
                            <div className="text-[#7C7C7C]">Total</div>
                            <div className="text-black font-semibold">
                              {userInfo?.preferredCurrency !== undefined
                                ? userInfo?.preferredCurrency
                                : 'IDR'}
                              {standartCurrency(
                                (data?.price ?? 0) * (data?.amount ?? 0)
                              ).replace('Rp', '')}
                            </div>
                          </div>
                          <div className="flex justify-center items-center bg-white">
                            <div
                              onClick={() => {
                                handleShowModalCancelOrder(data?.id);
                              }}
                              className="text-[#DD2525] font-semibold border border-[#DD2525] px-4 py-2 my-4 w-[80%] md:w-[300px] rounded-full text-center cursor-pointer hover:shadow-xl duration-300"
                            >
                              {t('tournament.assets.cancel')}
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

                  <div className="flex justify-center mx-auto my-8">
                    <AssetPagination
                      currentPage={orderParams.page}
                      totalPages={10}
                      onPageChange={page => {
                        setOrderParams({
                          page,
                          startIndex: page * 5 - 5,
                          endIndex: page * 5 - 1
                        });
                      }}
                    />
                  </div>
                </TabPanel>
                <TabPanel value="history">
                  {historyTransaction !== undefined ? (
                    <>
                      {historyTransaction?.battle_orders?.map(data => (
                        <div
                          key={data?.id}
                          className="bg-[#4DA81C] pl-1 rounded-lg shadow-lg text-xs md:text-sm"
                        >
                          <div className="w-full flex justify-between items-center p-2 mt-4 bg-[#F9F9F9] md:bg-white border border-[#E9E9E9] md:border-none rounded-tl-lg">
                            <div className="flex gap-2 md:gap-4 w-full justify-between items-center">
                              <div className="flex justify-center items-center w-[30px] h-[30px] md:w-[40px] md:h-[40px] xl:w-[50px] xl:h-[50px]">
                                <img
                                  alt=""
                                  src={data?.asset?.asset_icon}
                                  className="w-auto h-full"
                                />
                              </div>
                              <div className="w-full">
                                <div className="flex gap-1 text-sm md:text-md xl:text-lg w-full">
                                  <div className="font-semibold">
                                    {data?.asset?.asset_name} /{' '}
                                    {data?.asset?.asset_ticker}
                                  </div>
                                </div>
                                <div className="flex justify-between items-center w-full">
                                  <div className="text-[#4DA81C] text-[11px] md:text-sm">
                                    {t('tournament.assets.pending')}
                                  </div>
                                  <div className="text-[#7C7C7C] text-[10px] md:text-sm">
                                    {getShortDate(data?.created_at)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className=" bg-white p-2 flex justify-between">
                            <div className="text-[#7C7C7C] ">Stop Loss</div>
                            <div className="font-semibold">
                              {data?.stop_loss}%
                            </div>
                          </div>
                          <div className=" bg-[#E9E9E9] p-2 flex justify-between">
                            <div className="text-[#7C7C7C] ">
                              {t('tournament.assets.amount')}
                            </div>
                            <div className="font-semibold">
                              {data?.total_assets}
                            </div>
                          </div>
                          <div className="text-[#7C7C7C] bg-white p-2 flex justify-between">
                            <div className="">
                              <div className="text-[#7C7C7C]">
                                {t('tournament.assets.price')}
                              </div>
                              <div className="text-black font-semibold">
                                {userInfo?.preferredCurrency !== undefined
                                  ? userInfo?.preferredCurrency
                                  : 'IDR'}
                                {standartCurrency(data?.bid_price ?? 0).replace(
                                  'Rp',
                                  ''
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col justify-end items-end">
                              <div className="text-[#7C7C7C]">Total</div>
                              <div className="text-black font-semibold">
                                {userInfo?.preferredCurrency !== undefined
                                  ? userInfo?.preferredCurrency
                                  : 'IDR'}
                                {standartCurrency(
                                  (data?.bid_price ?? 0) *
                                    (data?.total_assets ?? 0)
                                ).replace('Rp', '')}
                              </div>
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

                  <div className="flex justify-center mx-auto my-8">
                    <AssetPagination
                      currentPage={historyParams.page}
                      totalPages={
                        historyTransaction?.metadata?.totalPage as number
                      }
                      onPageChange={page => {
                        setHistoryParams({ ...historyParams, page });
                      }}
                    />
                  </div>
                </TabPanel>
              </TabsBody>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(BattleVirtualBalance);
