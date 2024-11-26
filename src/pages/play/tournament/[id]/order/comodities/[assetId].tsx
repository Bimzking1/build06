import close from '@/assets/more-option/close.svg';
import BannerCircle from '@/assets/play/tournament/homeBannerCircle.svg';
import CCard from '@/components/CCard';
import Loading from '@/components/popup/Loading';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import SuccessOrderModal from '@/containers/tournament/order/SuccesPopup';
import { formatAssetPrice, standartCurrency } from '@/helpers/currency';
import { useGetDetailTournament } from '@/helpers/useGetDetailTournament';
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
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  useEffect,
  useState,
  type ChangeEvent,
  type SetStateAction
} from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export interface typeLimitOrder {
  type: string;
  profit: string;
  loss: string;
}

export interface Ballance {
  balance: number;
  portfolio: number;
  total_sell: number;
  total_buy: number;
  currency: string;
}

interface UserData {
  preferredCurrency: string;
}

interface AssetPortfolio {
  asset_id: string;
  play_id: string;
  user_id: string;
  total_lot: number;
  average_price: number;
  return_percentage: number;
}

const BuyPage: React.FC = () => {
  const router = useRouter();
  const { assetId } = router.query;
  const { id } = router.query;
  const { detailTournament } = useGetDetailTournament(id as string);
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
    total_lot: 0,
    average_price: 0,
    return_percentage: 0
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
  const [assetAmount, setAssetsAmount] = useState<string>('0');
  const [amount, setAmount] = useState<string>('0');
  const [orderType] = useState<string>('market');
  const [modalConfirmation, setModalConfirmation] = useState<boolean>(false);
  const [modalSuccess, setModalSuccess] = useState<boolean>(false);
  const [lotSell, setLotSell] = useState<string>('0');
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const lastPriceAsset = data?.lastPrice.close;
  useEffect(() => {
    if (sellPercent !== 0) {
      setAmount(
        `${
          (portfolio?.total_lot *
            (lastPrice[prefCurrency as PreferredCurrencyI] !== 0
              ? lastPrice[prefCurrency as PreferredCurrencyI]
              : lastPriceAsset ?? 0) *
            sellPercent) /
          100
        }`
      );
      setAssetsAmount(`${(portfolio?.total_lot * sellPercent) / 100}`);
    }
  }, [sellPercent]);

  useEffect(() => {
    if (
      amount !==
      `${
        (portfolio?.total_lot *
          (lastPrice[prefCurrency as PreferredCurrencyI] !== 0
            ? lastPrice[prefCurrency as PreferredCurrencyI]
            : lastPriceAsset ?? 0) *
          sellPercent) /
        100
      }`
    ) {
      setSellPercent(0);
    }
    if (assetAmount !== `${(portfolio?.total_lot * sellPercent) / 100}`) {
      setSellPercent(0);
    }
  }, [amount, assetAmount]);
  const { dataUser } = useAppSelector(state => state.user);
  const prefCurrency = dataUser?.preferredCurrency.toLowerCase() ?? 'usd';
  const lastPrice = useGetLastPrice(data?.seedsTicker);

  const [userInfo, setUserInfo] = useState<UserData>();
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

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleLotSellChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const parsedValue = parseFloat(newValue);
    if (!isNaN(parsedValue) && parsedValue >= 0) {
      setLotSell(newValue);
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleLotBuyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const parsedValue = parseFloat(newValue);
    if (!isNaN(parsedValue) && parsedValue >= 0) {
      setAssetsAmount(newValue);
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

  const fetchPlayPortfolio = async (): Promise<void> => {
    try {
      const response = await getPlayAssets(id as string, assetId as string);
      setPortfolio(response.data);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  const handleChangeNumber = (
    e: ChangeEvent<HTMLInputElement>,
    val: string,
    setVal: {
      (value: SetStateAction<string>): void;
      (value: SetStateAction<string>): void;
      (arg0: string): void;
    },
    setNewVal: {
      (value: SetStateAction<string>): void;
      (value: SetStateAction<string>): void;
      (arg0: string): void;
    },
    isDevide: boolean
  ): void => {
    const target = e.target;
    const value = target.value;
    setVal(value);
    if (debounceTimer !== null) clearTimeout(debounceTimer);
    setDebounceTimer(
      setTimeout((): void => {
        if (value.length > 0) {
          if (isDevide) {
            setNewVal(
              `${
                parseInt(value) /
                (lastPrice[prefCurrency as PreferredCurrencyI] !== 0
                  ? lastPrice[prefCurrency as PreferredCurrencyI]
                  : lastPriceAsset ?? 0)
              }`
            );
          } else {
            setNewVal(
              `${
                parseFloat(value) *
                (lastPrice[prefCurrency as PreferredCurrencyI] !== 0
                  ? lastPrice[prefCurrency as PreferredCurrencyI]
                  : lastPriceAsset ?? 0)
              }`
            );
          }
        }
      }, 100)
    );
  };

  useEffect(() => {
    if (id !== undefined && userInfo !== undefined) {
      void fetchPlayBallance(userInfo.preferredCurrency);
    }
    if (id !== undefined && router.query?.transaction !== 'buy') {
      void fetchPlayPortfolio();
      setLotSell(portfolio?.total_lot.toString());
    }
  }, [id, userInfo]);

  const handleModal = (): void => {
    setModalConfirmation(!modalConfirmation);
  };

  const handleModalSuccess = (): void => {
    setModalSuccess(!modalSuccess);
  };

  const [params] = useState({
    tf: 'daily'
  });

  useEffect(() => {
    if (amount === '0') {
      setIsDisable(true);
    } else if (
      +amount *
        (lastPrice[prefCurrency as PreferredCurrencyI] !== 0
          ? lastPrice[prefCurrency as PreferredCurrencyI]
          : lastPriceAsset ?? 0) >
        ballance.balance &&
      router.query?.transaction === 'buy'
    ) {
      setIsDisable(true);
    } else if (
      parseFloat(assetAmount) > portfolio?.total_lot &&
      router.query?.transaction === 'sell'
    ) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [assetAmount, amount, ballance.balance]);

  const fetchDetailAsset = async (currency: string): Promise<void> => {
    try {
      if (typeof assetId === 'string') {
        const response = await getDetailAsset(assetId, { ...params, currency });

        setData(response.marketAsset);
      }
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  useEffect(() => {
    if (assetId !== null && userInfo !== undefined) {
      void fetchDetailAsset(userInfo?.preferredCurrency);
    }
  }, [assetId, userInfo]);

  useEffect(() => {
    if (router.query.transaction !== undefined) {
      if (
        router.query?.transaction !== 'buy' &&
        router.query?.transaction !== 'sell'
      ) {
        router
          .push(`/tournament/${id as string}/${assetId as string}`)
          .catch(err => {
            toast.error(`Error fetching data: ${err as string}`);
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
          asset_id: assetId as string,
          amount: parseFloat(assetAmount),
          type: (router.query?.transaction as string).toUpperCase()
        },
        id as string
      );

      setTimeout(() => {
        handleModalSuccess();
      }, 500);
      setSuccessData(response);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  const submitSell = async (): Promise<void> => {
    try {
      setIsLoading(true);
      handleModal();
      const response = await createOrderPlay(
        {
          asset_id: assetId as string,
          amount: parseFloat(lotSell),
          type: (router.query?.transaction as string).toUpperCase()
        },
        id as string
      );

      setTimeout(() => {
        handleModalSuccess();
      }, 500);
      setSuccessData(response);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleRouteChange = async (): Promise<void> => {
      if (data !== undefined && detailTournament !== null && id !== undefined) {
        if (!detailTournament?.all_category?.includes(data?.assetType)) {
          toast.error(t('tournament.assets.assetTypeWarning'));
          await router.push(`/play/tournament/${id as string}/home`);
        }
      }
    };

    void handleRouteChange();
  }, [data, detailTournament, id, router]);

  return (
    <PageGradient defaultGradient className="w-full">
      {isLoading && <Loading />}
      <CCard className="flex flex-col w-full border-none rounded-xl">
        <div className="relative flex flex-col bg-gradient-to-r from-[#3AC4A0] from-50% to-[#9CFFE5] rounded-[12px] p-[24px]">
          <Image
            alt=""
            src={BannerCircle}
            className="absolute top-0 right-0 z-0"
          />
          <Typography className="z-10 text-base font-poppins font-normal text-[#FFFFFF]">
            {t('buyAsset.text5')}
          </Typography>
          <Typography className="z-10 text-3xl font-poppins font-semibold  text-[#FFFFFF]">
            {`${standartCurrency(
              router.query?.transaction === 'buy'
                ? ballance?.balance
                : portfolio?.total_lot *
                    (lastPrice[prefCurrency as PreferredCurrencyI] !== 0
                      ? lastPrice[prefCurrency as PreferredCurrencyI]
                      : lastPriceAsset ?? 0)
            ).replace('Rp', userInfo?.preferredCurrency as string)}`}{' '}
          </Typography>
        </div>
        <div className="relative bg-white mb-[-2] w-full h-[12px]"></div>
        {data !== undefined && (
          <div className="z-10 w-full p-5 border-none rounded-xl shadow-none bg-[#E9E9E9]">
            <p className="text-base md:text-xl font-semibold font-poppins text-black">
              {router.query.transaction === 'buy' ? 'Buy' : 'Sell'}{' '}
              {data?.realTicker}
            </p>
            <p className="text-xs font-normal text-[#7C7C7C] my-2">
              Current cost: {prefCurrency}{' '}
              {formatAssetPrice(
                lastPrice[prefCurrency as PreferredCurrencyI] !== 0
                  ? lastPrice[prefCurrency as PreferredCurrencyI]
                  : lastPriceAsset ?? 0
              )}
              per gram
            </p>
          </div>
        )}
        {router.query.transaction === 'sell' && (
          <div className="border shadow-lg border-1 rounded-[8px] border-[#E9E9E9] p-2 m-2">
            <Typography className="mb-2 font-poppins text-sm font-normal text-[#7C7C7C]">
              {data?.realTicker} Savings
            </Typography>
            <Typography className="mb-2 font-poppins text-xl font-semibold text-[#262626]">
              Rp 0{' '}
              <span className="font-poppins text-sm font-normal text-[#7C7C7C]">
                (0gram)
              </span>
            </Typography>
          </div>
        )}
        <div className="flex flex-col mt-4">
          <div>
            {router.query.transaction === 'sell' && (
              <div className=" mx-2 ">
                <Typography className="font-poppins text-base font-semibold text-[#262626]">
                  Total ( gram )
                </Typography>
                <div className="flex gap-4 lg:gap-12 w-[50%] lg:w-full border-1 mt-2 mx-full justify-center rounded-[6px] border py-4">
                  <Button
                    type="button"
                    variant="filled"
                    className="flex justify-center p-1 normal-case h-5 rounded-full items-center w-5 bg-[#3AC4A0]"
                    onClick={() => {
                      if (parseFloat(lotSell) > 0) {
                        const newLotSell = parseFloat(lotSell) - 0.1;
                        setLotSell(newLotSell.toFixed(1));
                      }
                    }}
                  >
                    <div className="bg-white h-[1px] w-[8px]"></div>
                  </Button>
                  <input
                    type="text"
                    value={lotSell}
                    className="focus:border-none focus:outline-none text-center min-w-[50px] max-w-[90px] text-[#BB1616] font-semibold caret-black"
                    onChange={handleLotSellChange}
                  />
                  <Button
                    type="button"
                    variant="filled"
                    className="flex justify-center p-1 normal-case h-5 rounded-full items-center w-5 bg-[#3AC4A0]"
                    onClick={() => {
                      if (parseFloat(lotSell) < portfolio?.total_lot) {
                        const newLotSell = parseFloat(lotSell) + 0.1;
                        setLotSell(newLotSell.toFixed(1));
                      }
                    }}
                  >
                    <div className="bg-white h-[1px] w-[8px]"></div>
                    <div className="bg-white h-[8px] w-[1px] absolute"></div>
                  </Button>
                </div>
              </div>
            )}
            {router.query.transaction === 'buy' && (
              <div className=" mx-2 ">
                <Typography className="font-poppins text-base font-semibold text-[#262626]">
                  Total ( gram )
                </Typography>
                <div className="flex gap-4 lg:gap-12 w-[50%] lg:w-full border-1 mt-2 mx-full justify-center rounded-[6px] border py-4">
                  <Button
                    type="button"
                    variant="filled"
                    className="flex justify-center p-1 normal-case h-5 rounded-full items-center w-5 bg-[#3AC4A0]"
                    onClick={() => {
                      if (parseFloat(assetAmount) > 0) {
                        const newAmount = parseFloat(assetAmount) - 0.1;
                        setAssetsAmount(newAmount.toFixed(1));
                      }
                    }}
                  >
                    <div className="bg-white h-[1px] w-[8px]"></div>
                  </Button>
                  <input
                    type="text"
                    value={assetAmount}
                    className="focus:border-none focus:outline-none text-center min-w-[50px] max-w-[90px] text-[#BB1616] font-semibold caret-black"
                    onChange={handleLotBuyChange}
                  />
                  <Button
                    type="button"
                    variant="filled"
                    className="flex justify-center p-1 normal-case h-5 rounded-full items-center w-5 bg-[#3AC4A0]"
                    onClick={() => {
                      const newAmount = parseFloat(assetAmount) + 0.1;
                      setAssetsAmount(newAmount.toFixed(1));
                    }}
                  >
                    <div className="bg-white h-[1px] w-[8px]"></div>
                    <div className="bg-white h-[8px] w-[1px] absolute"></div>
                  </Button>
                </div>
              </div>
            )}
            <div className="items-center text-center justify-center mt-3 w-full">
              <svg
                width="29"
                height="26"
                viewBox="0 0 29 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto"
              >
                <path
                  d="M2 9.66602H26L18 1.66602M26.5327 16.3327H2.53267L10.5327 24.3327"
                  stroke="#3AC4A0"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
          <div className="flex mx-2 flex-col mt-4 gap-4">
            {router.query.transaction === 'buy' && (
              <div className="mt-4 mx-2">
                <Typography className="mb-2 font-poppins text-base font-semibold text-black">
                  {t('buyAsset.text8')} ({prefCurrency})
                </Typography>
                {router.query.transaction === 'buy' && (
                  <input
                    type="text"
                    value={
                      (lastPrice[prefCurrency as PreferredCurrencyI] !== 0
                        ? lastPrice[prefCurrency as PreferredCurrencyI]
                        : lastPriceAsset ?? 0) * +assetAmount
                    }
                    onChange={e => {
                      handleChangeNumber(
                        e,
                        amount,
                        setAmount,
                        setAssetsAmount,
                        true
                      );
                    }}
                    className="w-full border rounded-xl py-3 px-4 border-[#BDBDBD] text-base bg-[#E9E9E9] text-[#262626] focus:border-seeds-button-green font-poppins outline-none"
                    placeholder="Insert nominal"
                  />
                )}
              </div>
            )}
            {router.query.transaction === 'sell' && (
              <Typography className="mb-2 font-poppins text-base font-semibold text-black">
                {t('buyAsset.text8')} ({prefCurrency})
              </Typography>
            )}
            {router.query.transaction === 'sell' && (
              <input
                type="text"
                value={formatAssetPrice(
                  (lastPrice[prefCurrency as PreferredCurrencyI] !== 0
                    ? lastPrice[prefCurrency as PreferredCurrencyI]
                    : lastPriceAsset ?? 0) * +lotSell
                )}
                readOnly
                className="w-full border rounded-xl py-3 px-4 border-[#7C7C7C] text-base text-[#262626] focus:border-seeds-button-green font-poppins outline-none"
                placeholder="Insert nominal"
              />
            )}

            {router.query.transaction === 'buy' && (
              <Button
                type="button"
                disabled={isDisable}
                variant="filled"
                className={`flex justify-center rounded-full w-full ml-auto justify-items-end items-end py-3 mb-5 ${
                  isDisable ? 'bg-[#BDBDBD]' : 'bg-[#3AC4A0]'
                }`}
                onClick={() => {
                  handleModal();
                }}
              >
                <Typography
                  className={`flex justify-center font-poppins normal-case font-semibold text-sm ${
                    isDisable ? 'text-[#7C7C7C]' : 'text-white'
                  }`}
                >
                  {t('button.label.confirm')}
                </Typography>
              </Button>
            )}

            {router.query.transaction === 'sell' && (
              <Button
                type="button"
                variant="filled"
                className={`rounded-full w-full ml-auto justify-items-end items-end py-3 mb-5 bg-[#DD2525]`}
                onClick={() => {
                  handleModal();
                }}
              >
                <Typography
                  className={`font-poppins normal-case font-semibold text-sm text-white`}
                >
                  {t('tournament.portfolio.sell')}
                </Typography>
              </Button>
            )}

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
                            `${t('playSimulation.buy')} ${assetAmount} ${
                              data?.realTicker as string
                            }`}
                          {router.query.transaction !== undefined &&
                            router.query.transaction === 'sell' &&
                            `${t('playSimulation.sell')} ${assetAmount} ${
                              data?.realTicker as string
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
                      <div className="flex justify-between mt-4">
                        <Typography className="text-[#7C7C7C] font-normal text-xs">
                          {t('playSimulation.amount')}
                        </Typography>
                        {router.query.transaction === 'buy' ? (
                          <Typography className="text-[#262626] font-semibold text-xs">
                            {`${
                              assetAmount.includes('.')
                                ? assetAmount
                                : assetAmount + '.0'
                            } ${data?.realTicker as string}`}
                          </Typography>
                        ) : (
                          <Typography className="text-[#262626] font-semibold text-xs">
                            {`${
                              assetAmount.includes('.')
                                ? lotSell
                                : lotSell + '.0'
                            } ${data?.realTicker as string}`}
                          </Typography>
                        )}
                      </div>
                      <div className="flex justify-between mt-4">
                        <Typography className="text-[#7C7C7C] font-normal text-xs">
                          {t('playSimulation.cashAmount')}
                        </Typography>
                        {router.query.transaction === 'buy' ? (
                          <Typography className="text-[#262626] font-semibold text-xs">
                            {
                              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                              userInfo?.preferredCurrency
                            }
                            {lastPrice[prefCurrency as PreferredCurrencyI] !==
                            undefined
                              ? standartCurrency(
                                  +assetAmount *
                                    (lastPrice[
                                      prefCurrency as PreferredCurrencyI
                                    ] !== 0
                                      ? lastPrice[
                                          prefCurrency as PreferredCurrencyI
                                        ]
                                      : lastPriceAsset ?? 0)
                                ).replace('Rp', '')
                              : 'No data available'}
                          </Typography>
                        ) : (
                          <Typography className="text-[#262626] font-semibold text-xs">
                            {
                              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                              userInfo?.preferredCurrency
                            }
                            {lastPrice[prefCurrency as PreferredCurrencyI] !==
                            undefined
                              ? formatAssetPrice(
                                  +lotSell *
                                    (lastPrice[
                                      prefCurrency as PreferredCurrencyI
                                    ] !== 0
                                      ? lastPrice[
                                          prefCurrency as PreferredCurrencyI
                                        ]
                                      : lastPriceAsset ?? 0)
                                )
                              : 'No data available'}
                          </Typography>
                        )}
                      </div>
                      {router.query.transaction !== undefined &&
                        router.query.transaction === 'buy' && (
                          <>
                            <div className="flex justify-between mt-4">
                              <Typography className="text-[#7C7C7C] font-normal text-xs">
                                Take Profit ( % )
                              </Typography>
                              <Typography className="text-[#262626] font-semibold text-xs">
                                0
                              </Typography>
                            </div>
                            <div className="flex justify-between mt-4">
                              <Typography className="text-[#7C7C7C] font-normal text-xs">
                                Stop Loss ( % )
                              </Typography>
                              <Typography className="text-[#262626] font-semibold text-xs">
                                0
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
                        {router.query.transaction === 'buy' ? (
                          <Typography className="text-[#3AC4A0] font-semibold text-xs">
                            {standartCurrency(
                              +assetAmount *
                                (lastPrice[
                                  prefCurrency as PreferredCurrencyI
                                ] ?? 0)
                            ).replace(
                              'Rp',
                              userInfo?.preferredCurrency as string
                            )}
                          </Typography>
                        ) : (
                          <Typography className="text-[#3AC4A0] font-semibold text-xs">
                            {standartCurrency(
                              +lotSell *
                                (lastPrice[
                                  prefCurrency as PreferredCurrencyI
                                ] ?? 0)
                            ).replace(
                              'Rp',
                              userInfo?.preferredCurrency as string
                            )}
                          </Typography>
                        )}
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
                          toast.error(`Error fetching data: ${err as string}`);
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
                      if (router.query.transaction === 'buy') {
                        submitOrder().catch(err => {
                          toast.error(`Error buy asset: ${err as string}`);
                        });
                      } else if (router.query.transaction === 'sell') {
                        submitSell().catch(err => {
                          toast.error(`Error sell asset: ${err as string}`);
                        });
                      }
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

export default withAuth(BuyPage);
