import close from '@/assets/more-option/close.svg';
import CCard from '@/components/CCard';
import Loading from '@/components/popup/Loading';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import CardLimitOrder from '@/containers/homepage/order/CardLimitOrder';
import CardPrice from '@/containers/homepage/order/CardPrice';
import CardSwitch from '@/containers/homepage/order/CardSwitch';
import SuccessOrderModal from '@/containers/homepage/order/SuccessOrderModal';
import CardPriceSkeleton from '@/containers/homepage/order/skeleton/CardPriceSkeleton';
import { formatAssetPrice, standartCurrency } from '@/helpers/currency';
import withAuth from '@/helpers/withAuth';
import useGetLastPrice from '@/hooks/useGetLastPrice';
import useWindowInnerHeight from '@/hooks/useWindowInnerHeight';
import { getDetailAsset } from '@/repository/asset.repository';
import {
  createOrderPlay,
  getPlayAssets,
  getPlayBallance
} from '@/repository/play.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { useAppSelector } from '@/store/redux/store';
import {
  type AssetI,
  type SuccessOrderData
} from '@/utils/interfaces/play.interface';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { type PreferredCurrencyI } from '@/utils/interfaces/user.interface';
import {
  Avatar,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography
} from '@material-tailwind/react';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { type Ballance } from '../play/[id]';

export interface typeLimitOrder {
  type: string;
  profit: string;
  loss: string;
}

interface AssetPortfolio {
  asset_id: string;
  play_id: string;
  user_id: string;
  total_lot: number;
}

const OrderPage: React.FC = () => {
  const number = '0123456789.';
  const router = useRouter();
  const { id } = router.query;
  const { playId } = router.query;
  const { t } = useTranslation();
  const height = useWindowInnerHeight();
  const [data, setData] = useState<AssetI>();
  const [ballance, setBallance] = useState<Ballance>({
    balance: 0,
    portfolio: 0,
    total_sell: 0,
    total_buy: 0,
    currency: 'IDR'
  });
  const [portfolio, setPortfolio] = useState<AssetPortfolio>({
    asset_id: '',
    play_id: '',
    user_id: '',
    total_lot: 0
  });
  const [succesData, setSuccessData] = useState<SuccessOrderData>({
    id: '',
    play_id: '',
    user_id: '',
    asset: {
      asset_id: '',
      asset_name: '',
      asset_icon: '',
      asset_ticker: '',
      asset_exchange: '',
      asset_type: ''
    },
    type: 'BUY',
    lot: 0,
    bid_price: 0,
    stop_loss: 0,
    pnl: 0,
    created_at: '',
    updated_at: ''
  });
  const [sellPercent, setSellPercent] = useState<number>(0);
  const [isDisable, setIsDisable] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [assetAmount, setAssetsAmount] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [orderType] = useState<string>('market');
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [modalConfirmation, setModalConfirmation] = useState<boolean>(false);
  const [modalSuccess, setModalSuccess] = useState<boolean>(false);
  const [limitOrder, setLimitOrder] = useState<typeLimitOrder>({
    type: '',
    profit: '',
    loss: ''
  });
  const { dataUser } = useAppSelector(state => state.user);
  const prefCurrency = dataUser?.preferredCurrency.toLowerCase() ?? 'usd';
  const lastPrice = useGetLastPrice(data?.seedsTicker);
  useEffect(() => {
    if (sellPercent !== 0) {
      setAmount(
        `${
          ((portfolio?.total_lot ?? 0) *
            (lastPrice[prefCurrency as PreferredCurrencyI] ??
              lastPriceAsset ??
              0) *
            sellPercent) /
          100
        }`
      );
      setAssetsAmount(`${(portfolio.total_lot * sellPercent) / 100}`);
    }
  }, [sellPercent]);

  useEffect(() => {
    if (
      amount !==
      `${
        ((portfolio?.total_lot ?? 0) *
          (lastPrice[prefCurrency as PreferredCurrencyI] ??
            lastPriceAsset ??
            0) *
          sellPercent) /
        100
      }`
    ) {
      setSellPercent(0);
    }
    if (assetAmount !== `${(portfolio.total_lot * sellPercent) / 100}`) {
      setSellPercent(0);
    }
  }, [amount, assetAmount]);
  const lastPriceAsset = data?.lastPrice.close;
  const [userInfo, setUserInfo] = useState<UserInfo>();
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const dataInfo = await getUserInfo();

        setUserInfo(dataInfo);
      } catch (error) {
        toast.error(`Error fetching data: ${error as string}`);
      }
    };

    fetchData()
      .then()
      .catch(() => {});
  }, []);

  const fetchPlayBallance = async (currency: string): Promise<void> => {
    try {
      const response = await getPlayBallance(playId as string, { currency });
      setBallance(response);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  const fetchPlayPortfolio = async (): Promise<void> => {
    try {
      const response = await getPlayAssets(playId as string, id as string);
      setPortfolio(response.data);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  useEffect(() => {
    if (
      playId !== undefined &&
      router.query?.transaction !== 'sell' &&
      userInfo !== undefined
    ) {
      void fetchPlayBallance(userInfo.preferredCurrency);
    }
    if (playId !== undefined && router.query?.transaction !== 'buy') {
      void fetchPlayPortfolio();
    }
  }, [playId, userInfo]);

  const sellPercentArr = [
    {
      value: 25,
      name: '25%'
    },
    {
      value: 50,
      name: '50%'
    },
    {
      value: 75,
      name: '75%'
    },
    {
      value: 100,
      name: '100%'
    }
  ];
  const handleModal = (): void => {
    setModalConfirmation(!modalConfirmation);
  };

  const handleToggle = (): void => {
    setIsActive(!isActive);
  };

  const handleModalSuccess = (): void => {
    setModalSuccess(!modalSuccess);
  };

  const [params] = useState({
    tf: 'daily'
  });

  useEffect(() => {
    if (assetAmount.length === 0 && amount.length === 0) {
      setIsDisable(true);
    } else if (
      parseFloat(amount) > ballance.balance &&
      router.query?.transaction === 'buy'
    ) {
      setIsDisable(true);
    } else if (
      parseFloat(assetAmount) > portfolio.total_lot &&
      router.query?.transaction === 'sell'
    ) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [assetAmount, amount, ballance.balance]);

  useEffect(() => {
    if (!isActive) {
      setLimitOrder({
        type: '',
        profit: '',
        loss: ''
      });
    }
  }, [isActive]);

  const fetchDetailAsset = async (currency: string): Promise<void> => {
    try {
      if (typeof id === 'string') {
        const response = await getDetailAsset(id, { ...params, currency });
        setData(response.marketAsset);
      }
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  useEffect(() => {
    if (id !== null && userInfo !== undefined) {
      void fetchDetailAsset(userInfo.preferredCurrency);
    }
  }, [id, userInfo]);

  const handleChangeNumber = (
    e: ChangeEvent<HTMLInputElement>,
    val: string,
    setVal: any,
    setNewVal: any,
    isDevide: boolean
  ): void => {
    const target = e.target;
    const value = target.value;

    for (let index = 0; index < number.length; index++) {
      const element = number[index];
      if (value[value.length - 1] === element) {
        if (
          val === '0' &&
          value[value.length - 1] !== '0' &&
          value[value.length - 1] !== '.'
        ) {
          setVal(value[1]);
          if (debounceTimer !== null) clearTimeout(debounceTimer);
          setDebounceTimer(
            setTimeout((): void => {
              if (isDevide) {
                setNewVal(
                  `${
                    parseInt(value) /
                    (lastPrice[prefCurrency as PreferredCurrencyI] ??
                      lastPriceAsset ??
                      0)
                  }`
                );
              } else {
                setNewVal(
                  `${
                    parseFloat(value) *
                    (lastPrice[prefCurrency as PreferredCurrencyI] ??
                      lastPriceAsset ??
                      0)
                  }`
                );
              }
            }, 100)
          );
        } else {
          setVal(value);
          if (debounceTimer !== null) clearTimeout(debounceTimer);
          setDebounceTimer(
            setTimeout((): void => {
              if (value.length > 0) {
                if (isDevide) {
                  setNewVal(
                    `${
                      parseInt(value) /
                      (lastPrice[prefCurrency as PreferredCurrencyI] ??
                        lastPriceAsset ??
                        0)
                    }`
                  );
                } else {
                  setNewVal(
                    `${
                      parseFloat(value) *
                      (lastPrice[prefCurrency as PreferredCurrencyI] ??
                        lastPriceAsset ??
                        0)
                    }`
                  );
                }
              }
            }, 100)
          );
        }
      } else if (value.length === 0) {
        setVal('');
        setNewVal('');
      }
    }
  };

  const handleChangePrice = (
    e: ChangeEvent<HTMLInputElement>,
    val: string,
    setVal: any
  ): void => {
    const target = e.target;
    const value = target.value;

    for (let index = 0; index < number.length; index++) {
      const element = number[index];
      if (value[value.length - 1] === element) {
        if (
          val === '0' &&
          value[value.length - 1] !== '0' &&
          value[value.length - 1] !== '.'
        ) {
          setVal(value[1]);
        } else {
          setVal(value);
        }
      } else if (value.length === 0) {
        setVal('');
      }
    }
  };

  useEffect(() => {
    if (router.query.transaction !== undefined) {
      if (
        router.query?.transaction !== 'buy' &&
        router.query?.transaction !== 'sell'
      ) {
        router.push(`/homepage/assets/${id as string}`).catch(err => {
          toast.error(`${err as string}`);
        });
      }
    }
  }, [router.query]);

  const submitOrder = async (): Promise<void> => {
    try {
      setIsLoading(true);
      handleModal();
      const response = await createOrderPlay(
        {
          asset_id: id as string,
          amount: parseFloat(assetAmount),
          type: (router.query?.transaction as string).toUpperCase()
        },
        playId as string
      );

      setTimeout(() => {
        handleModalSuccess();
      }, 500);
      setSuccessData(response);
    } catch (error) {
      toast.error(`${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageGradient defaultGradient className="w-full">
      {isLoading && <Loading />}
      <CCard className="flex flex-col w-full p-5 border-none rounded-xl">
        {data !== undefined ? (
          <CardPrice
            data={{
              ...data,
              socketPrice: lastPrice[prefCurrency as PreferredCurrencyI]
            }}
            currency={userInfo?.preferredCurrency ?? 'IDR'}
          />
        ) : (
          <CardPriceSkeleton />
        )}
        <div className="flex flex-col mt-4">
          <div className="flex flex-col gap-3 pb-3 border-b border-neutral-ultrasoft">
            <Typography className="text-base font-poppins font-semibold text-black">
              {router.query?.transaction === 'buy' &&
                t('playSimulation.balance')}
              {router.query?.transaction === 'sell' &&
                t('playSimulation.portfolio')}
            </Typography>
            <Typography className="text-base font-poppins font-base text-black">
              {prefCurrency}
              {` ${formatAssetPrice(
                router.query?.transaction === 'buy'
                  ? ballance?.balance ?? 0
                  : (portfolio?.total_lot ?? 0) *
                      (lastPrice[prefCurrency as PreferredCurrencyI] ??
                        lastPriceAsset ??
                        0)
              )}`}{' '}
              {router.query?.transaction === 'sell' &&
                `= ${portfolio.total_lot ?? 0} ${data?.realTicker ?? ''}`}
            </Typography>
          </div>
          {orderType === 'pending' && (
            <div className="flex flex-col mt-4 gap-4">
              <Typography className="font-poppins text-base font-semibold text-black">
                Set Price (IDR)
              </Typography>
              <div className="flex">
                <input
                  type="text"
                  value={price}
                  onChange={e => {
                    handleChangePrice(e, price, setPrice);
                  }}
                  className="w-full border rounded-xl py-3 px-4 border-[#7C7C7C] text-base text-[#7C7C7C] focus:border-seeds-button-green font-poppins outline-none pr-16"
                  placeholder={`Insert Nominal`}
                />
              </div>
            </div>
          )}
          {router.query?.transaction === 'buy' && (
            <div className="mt-4">
              <CardSwitch handleToggle={handleToggle} />
            </div>
          )}
          {router.query?.transaction === 'sell' && (
            <div className="mt-4">
              <Typography className="font-poppins text-base font-semibold text-black mb-4">
                {t('playSimulation.sellAssetText1')}
              </Typography>
              <div className="flex gap-2">
                {sellPercentArr?.map((el, i: number) => {
                  return (
                    <Button
                      key={el.value + i}
                      variant={el.value === sellPercent ? 'filled' : 'outlined'}
                      className={`normal-case rounded-lg p-2 flex ite ${
                        el.value !== sellPercent
                          ? 'border border-[#D9D9D9] text-black'
                          : 'bg-[#3AC4A0] text-white'
                      } font-poppins`}
                      onClick={() => {
                        setSellPercent(el.value);
                      }}
                    >
                      {el.name}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
          {isActive && (
            <div className="flex flex-col mt-4">
              <CardLimitOrder setLimitOrder={setLimitOrder} />
            </div>
          )}
          <div className="flex flex-col mt-4 gap-4">
            <Typography className="font-poppins text-base font-semibold text-black">
              {t('playSimulation.amount')}
            </Typography>
            <div className="flex">
              <input
                type="text"
                value={assetAmount}
                onChange={e => {
                  handleChangeNumber(
                    e,
                    assetAmount,
                    setAssetsAmount,
                    setAmount,
                    false
                  );
                }}
                className="w-full border rounded-xl py-3 px-4 border-[#7C7C7C] text-base text-[#7C7C7C] focus:border-seeds-button-green font-poppins outline-none pr-16"
                placeholder={`Total ${data?.realTicker ?? ''}`}
              />
              {assetAmount?.length > 0 && (
                <Typography
                  className={`absolute text-base text-black py-3 right-10`}
                >
                  {data?.realTicker ?? ''}
                </Typography>
              )}
            </div>

            <Typography className="font-poppins text-base font-semibold text-black">
              {t('playSimulation.cashAmount')}
            </Typography>

            <input
              type="text"
              value={amount}
              onChange={e => {
                handleChangeNumber(e, amount, setAmount, setAssetsAmount, true);
              }}
              className="w-full border rounded-xl py-3 px-4 border-[#7C7C7C] text-base text-[#7C7C7C] focus:border-seeds-button-green font-poppins outline-none"
              placeholder="Insert nominal"
            />

            {/* pending order */}
            {orderType === 'pending' && (
              <div className="flex flex-col mt-4">
                <Typography className="font-poppins text-base font-semibold text-black">
                  Open Order
                </Typography>
                <CCard className="flex w-full p-3 md:p-5 border-none rounded-xl shadow-none bg-[#F9F9F9] mt-4">
                  <div className="flex justify-between mt-4">
                    <Typography
                      className={`${
                        router.query.transaction !== undefined &&
                        router.query.transaction === 'buy'
                          ? 'text-[#3AC4A0]'
                          : 'text-[#BB1616]'
                      } font-semibold text-sm`}
                    >
                      {router.query.transaction !== undefined &&
                        router.query.transaction === 'buy' &&
                        `${
                          orderType === 'pending'
                            ? 'Pending Order - Buy Limit'
                            : 'Buy - Market Order'
                        }`}
                      {router.query.transaction !== undefined &&
                        router.query.transaction === 'sell' &&
                        `${
                          orderType === 'pending'
                            ? 'Pending Order - Sell Limit'
                            : 'Sell - Market Order'
                        }`}
                    </Typography>
                    <Typography className="text-[#7C7C7C] font-normal text-sm">
                      {`${moment(new Date()).format('MMMM - Do - YYYY')}`}
                    </Typography>
                  </div>
                  <div className="flex justify-between mt-4">
                    <Typography className="text-[#262626] font-semibold text-sm">
                      {data?.providerName ?? ''}
                    </Typography>
                  </div>
                  <div className="flex justify-between mt-4">
                    <Typography className="text-[#7C7C7C] font-normal text-xs">
                      Amount
                    </Typography>
                    <Typography className="text-[#7555DA] font-normal text-xs">
                      {assetAmount.length === 0 && '0'}
                      {`${
                        assetAmount?.length === 0 || assetAmount?.includes('.')
                          ? assetAmount
                          : assetAmount + '.0'
                      } ${data?.realTicker ?? ''}`}
                    </Typography>
                  </div>
                  {router.query.transaction !== undefined &&
                    router.query.transaction === 'buy' &&
                    isActive && (
                      <>
                        <div className="flex justify-between mt-2">
                          <Typography className="text-[#7C7C7C] font-normal text-xs">
                            Take Profit
                          </Typography>
                          <Typography className="text-[#7555DA] font-normal text-xs">
                            {limitOrder.type === 'percent'
                              ? `${parseFloat(limitOrder?.profit ?? 1) * 100} %`
                              : `${
                                  userInfo?.preferredCurrency as string
                                } ${standartCurrency(
                                  limitOrder?.profit ?? 0
                                ).replace('Rp', '')}`}
                          </Typography>
                        </div>
                        <div className="flex justify-between mt-2">
                          <Typography className="text-[#7C7C7C] font-normal text-xs">
                            Stop Loss
                          </Typography>
                          <Typography className="text-[#7555DA] font-normal text-xs">
                            {limitOrder.type === 'percent'
                              ? `${parseFloat(limitOrder?.loss ?? 1) * 100} %`
                              : `${
                                  userInfo?.preferredCurrency as string
                                } ${standartCurrency(
                                  limitOrder.loss ?? 0
                                ).replace('Rp', '')}`}
                          </Typography>
                        </div>
                      </>
                    )}
                  <div className="flex justify-between mt-2">
                    <Typography className="text-[#7C7C7C] font-normal text-xs">
                      Price
                    </Typography>
                    <Typography className="text-[#7555DA] font-normal text-xs">
                      {price.length === 0
                        ? standartCurrency(
                            lastPrice[prefCurrency as PreferredCurrencyI] ?? 0
                          ).replace('Rp', '')
                        : standartCurrency(price ?? 0).replace('Rp', '')}
                    </Typography>
                  </div>

                  <div className="flex justify-between mt-2">
                    <Typography className="text-[#7C7C7C] font-normal text-xs">
                      Cash Amount
                    </Typography>
                    <Typography className="text-[#7555DA] font-normal text-xs">
                      {standartCurrency(amount ?? 0).replace('Rp', '')}
                    </Typography>
                  </div>
                </CCard>
              </div>
            )}
            <Button
              type="button"
              disabled={isDisable}
              variant="filled"
              className={`rounded-full w-full py-2 ${
                isDisable ? 'bg-[#BDBDBD]' : 'bg-[#3AC4A0]'
              }`}
              onClick={() => {
                handleModal();
              }}
            >
              <Typography
                className={`font-poppins normal-case font-semibold text-sm ${
                  isDisable ? 'text-[#7C7C7C]' : 'text-white'
                }`}
              >
                {t('button.label.confirm')}
              </Typography>
            </Button>
            <Dialog
              className="p-4 py-5 md:py-0 md:p-8 m-0 max-w-sm self-end sm:self-center md:self-center lg:self-center rounded-none rounded-t-2xl sm:rounded-2xl md:rounded-2xl lg:rounded-2xl"
              dismiss={{
                outsidePress: false
              }}
              open={modalConfirmation}
              size={'lg'}
              handler={handleModal}
            >
              <DialogHeader className="p-0 font-poppins">
                <div className="min-w-full flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-lg font-semibold text-[#262626]">
                      {t('playSimulation.purchaseConfirmation')}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Image
                      src={close}
                      alt="close"
                      className="cursor-pointer w-5 h-5 md:w-10 md:h-10"
                      onClick={handleModal}
                    />
                  </div>
                </div>
              </DialogHeader>
              <form onSubmit={() => {}}>
                <DialogBody className="p-0 font-poppins">
                  <div
                    className={`flex flex-col md:my-8 my-5 ${
                      height !== undefined && height < 760
                        ? 'max-h-[300px] overflow-auto'
                        : ''
                    }`}
                  >
                    <div className="flex justify-between mb-5 md:mb-0">
                      <div className="flex flex-col">
                        <Typography className="text-[#262626] font-semibold">
                          {data?.name}
                        </Typography>
                        <Typography className="text-[#7C7C7C] font-normal">
                          {router.query.transaction !== undefined &&
                            router.query.transaction === 'buy' &&
                            `${t('playSimulation.buy')} ${assetAmount ?? 0} ${
                              data?.realTicker ?? ''
                            }`}
                          {router.query.transaction !== undefined &&
                            router.query.transaction === 'sell' &&
                            `${t('playSimulation.sell')} ${assetAmount ?? 0} ${
                              data?.realTicker ?? ''
                            }`}
                        </Typography>
                      </div>
                      <div className="flex items-center">
                        <Avatar
                          size="md"
                          variant="circular"
                          src={data?.logo}
                          alt="Avatar"
                          className="mr-5"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col md:my-8 my-0 mb-4">
                      <Typography className="text-[#262626] font-semibold">
                        {t('playSimulation.transactionDetail')}
                      </Typography>
                    </div>
                    <CCard className="flex w-full p-3 md:p-5 border-none rounded-xl shadow-none bg-[#F9F9F9]">
                      <div className="flex justify-between">
                        <Typography className="text-[#7C7C7C] font-normal text-xs">
                          {t('playSimulation.orderType')}
                        </Typography>
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-end">
                            <Typography className="text-[#262626] font-semibold text-xs">
                              {router.query.transaction !== undefined &&
                                router.query.transaction === 'buy' &&
                                `${
                                  orderType === 'pending'
                                    ? 'Pending Order - Buy Limit'
                                    : t('playSimulation.buyMarketOrder')
                                }`}
                              {router.query.transaction !== undefined &&
                                router.query.transaction === 'sell' &&
                                `${
                                  orderType === 'pending'
                                    ? 'Pending Order - Sell Limit'
                                    : t('playSimulation.sellMarketOrder')
                                }`}
                            </Typography>
                          </div>
                          {orderType === 'pending' && (
                            <Typography className="text-[#F41A0C] italic font-normal text-[10px] border border-[#F41A0C] p-1">
                              Purchase price below current asset value
                            </Typography>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between mt-4">
                        <Typography className="text-[#7C7C7C] font-normal text-xs">
                          Order ID
                        </Typography>
                        <Typography className="text-[#262626] font-semibold text-xs text-right">
                          #{data?.id}
                        </Typography>
                      </div>
                      {orderType === 'pending' && (
                        <div className="flex justify-between mt-4">
                          <Typography className="text-[#7C7C7C] font-normal text-xs">
                            Set Price
                          </Typography>
                          <Typography className="text-[#262626] font-semibold text-xs">
                            {userInfo?.preferredCurrency ?? 'IDR'}
                            {standartCurrency(price ?? 0).replace('Rp', '')}
                          </Typography>
                        </div>
                      )}
                      {orderType === 'market' &&
                        limitOrder.loss.length === 0 &&
                        limitOrder.profit.length === 0 && (
                          <div className="flex justify-between mt-4">
                            <Typography className="text-[#7C7C7C] font-normal text-xs">
                              {t('playSimulation.marketPrice')}
                            </Typography>
                            <Typography className="text-[#262626] font-semibold text-xs">
                              {userInfo?.preferredCurrency ?? 'IDR'}
                              {standartCurrency(
                                lastPrice[prefCurrency as PreferredCurrencyI] ??
                                  0
                              ).replace('Rp', '')}
                            </Typography>
                          </div>
                        )}
                      <div className="flex justify-between mt-4">
                        <Typography className="text-[#7C7C7C] font-normal text-xs">
                          {t('playSimulation.amount')}
                        </Typography>
                        <Typography className="text-[#262626] font-semibold text-xs">
                          {`${
                            assetAmount?.includes('.')
                              ? assetAmount
                              : assetAmount + '.0'
                          } ${data?.realTicker ?? ''}`}
                        </Typography>
                      </div>
                      <div className="flex justify-between mt-4">
                        <Typography className="text-[#7C7C7C] font-normal text-xs">
                          {t('playSimulation.cashAmount')}
                        </Typography>
                        <Typography className="text-[#262626] font-semibold text-xs">
                          {userInfo?.preferredCurrency ?? 'IDR'}
                          {standartCurrency(amount ?? 0).replace('Rp', '')}
                        </Typography>
                      </div>
                      {router.query.transaction !== undefined &&
                        router.query.transaction === 'buy' &&
                        isActive && (
                          <>
                            <div className="flex justify-between mt-4">
                              <Typography className="text-[#7C7C7C] font-normal text-xs">
                                Take Profit
                              </Typography>
                              <Typography className="text-[#262626] font-semibold text-xs">
                                {limitOrder.type === 'percent'
                                  ? `${
                                      parseFloat(limitOrder?.profit ?? 1) * 100
                                    } %`
                                  : `${
                                      userInfo?.preferredCurrency ?? 'IDR'
                                    } ${standartCurrency(
                                      limitOrder?.profit ?? 0
                                    ).replace('Rp', '')}`}
                              </Typography>
                            </div>
                            <div className="flex justify-between mt-4">
                              <Typography className="text-[#7C7C7C] font-normal text-xs">
                                Stop Loss
                              </Typography>
                              <Typography className="text-[#262626] font-semibold text-xs">
                                {limitOrder.type === 'percent'
                                  ? `${
                                      parseFloat(limitOrder?.loss ?? 1) * 100
                                    } %`
                                  : `${
                                      userInfo?.preferredCurrency ?? 'IDR'
                                    } ${standartCurrency(
                                      limitOrder?.loss ?? 0
                                    ).replace('Rp', '')}`}
                              </Typography>
                            </div>
                          </>
                        )}
                      <div className="flex justify-between py-4 border-b border-[#BDBDBD]">
                        <Typography className="text-[#7C7C7C] font-normal text-xs">
                          {t('playSimulation.transactionFee')}
                        </Typography>
                        <Typography className="text-[#262626] font-semibold text-xs">
                          0
                        </Typography>
                      </div>
                      <div className="flex justify-between mt-4">
                        <Typography className="text-[#262626] font-semibold text-xs">
                          {t('playSimulation.totalCost')}
                        </Typography>
                        <Typography className="text-[#3AC4A0] font-semibold text-xs">
                          {standartCurrency(amount ?? 0).replace(
                            'Rp',
                            userInfo?.preferredCurrency ?? 'IDR'
                          )}
                        </Typography>
                      </div>
                    </CCard>
                  </div>
                </DialogBody>
                <DialogFooter className="p-0">
                  <Typography className="text-[#7C7C7C] font-poppins text-center text-sm md:text-base">
                    {t('playSimulation.footerOrderDetail1')}{' '}
                    <span
                      className="text-[#3AC4A0] cursor-pointer"
                      onClick={() => {
                        router.push('/faq-submenu/disclosure').catch(err => {
                          toast.error(`${err as string}`);
                        });
                      }}
                    >
                      {t('playSimulation.disclosure')}
                    </span>{' '}
                    {t('playSimulation.footerOrderDetail2')}
                  </Typography>
                  <Button
                    className="rounded-full min-w-full capitalize font-semibold text-sm bg-[#3AC4A0] text-white font-poppins mt-4 mb-20 md:mb-0"
                    onClick={() => {
                      submitOrder().catch(err => {
                        toast.error(`${err as string}`);
                      });
                    }}
                  >
                    {t('button.label.confirm')}
                  </Button>
                </DialogFooter>
              </form>
            </Dialog>
            <SuccessOrderModal
              handleModal={handleModalSuccess}
              open={modalSuccess}
              successData={succesData}
            />
          </div>
        </div>
      </CCard>
    </PageGradient>
  );
};

export default withAuth(OrderPage);
