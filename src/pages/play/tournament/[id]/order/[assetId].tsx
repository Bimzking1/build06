import close from '@/assets/more-option/close.svg';
import BannerCircle from '@/assets/play/tournament/homeBannerCircle.svg';
import CCard from '@/components/CCard';
import Loading from '@/components/popup/Loading';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import CardLimitOrder from '@/containers/tournament/order/CardLimitOrder';
import CardPrice from '@/containers/tournament/order/CardPrice';
import CardSwitch from '@/containers/tournament/order/CardSwitch';
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
import moment from 'moment';
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
// import { type Ballance } from '../play-assets';

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
  const number = '0123456789.';
  const router = useRouter();
  const { assetId } = router.query;
  const { id } = router.query;
  const { detailTournament } = useGetDetailTournament(id as string);
  const { t } = useTranslation();
  const height = useWindowInnerHeight();
  const { dataUser } = useAppSelector(state => state.user);
  const prefCurrency = dataUser?.preferredCurrency.toLowerCase() ?? 'usd';
  const [data, setData] = useState<AssetI>();
  const [ballance, setBallance] = useState<Ballance>({
    balance: 0,
    portfolio: 0,
    total_sell: 0,
    total_buy: 0,
    currency: 'IDR'
  });
  const lastPrice = useGetLastPrice(data?.seedsTicker);

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
  const [buyPercent, setBuyPercent] = useState<number>(0);
  const [isDisable, setIsDisable] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingAsset, setIsLoadingAsset] = useState<boolean>(true);
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
  const [lotSell, setLotSell] = useState<string>('0');
  const lastPriceAsset = data?.lastPrice.close;
  useEffect(() => {
    if (router?.query?.transaction === 'sell') {
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
        setLotSell(`${(portfolio?.total_lot * sellPercent) / 100}`);
      }
    } else {
      if (buyPercent !== 0) {
        setAmount(`${(ballance?.balance * buyPercent) / 100}`);
        setAssetsAmount(
          (
            (ballance?.balance * buyPercent) /
            100 /
            (lastPrice[prefCurrency as PreferredCurrencyI] !== 0
              ? lastPrice[prefCurrency as PreferredCurrencyI]
              : lastPriceAsset ?? 0)
          ).toFixed(1)
        );
      }
    }
  }, [sellPercent, buyPercent]);

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

  const fetchPlayBallance = async (currency: string): Promise<void> => {
    try {
      const response = await getPlayBallance(id as string, { currency });

      setBallance(response);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleLotSellChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const parsedValue = parseFloat(newValue);
    if (!isNaN(parsedValue) && parsedValue >= 0) {
      setLotSell(newValue);
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

  useEffect(() => {
    if (
      id !== undefined &&
      router.query?.transaction !== 'sell' &&
      userInfo !== undefined
    ) {
      void fetchPlayBallance(userInfo.preferredCurrency);
    }
    if (id !== undefined && router.query?.transaction !== 'buy') {
      void fetchPlayPortfolio();
      setLotSell(portfolio?.total_lot.toString());
    }
  }, [id, userInfo]);

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
      parseFloat(assetAmount) > portfolio?.total_lot &&
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
      setIsLoadingAsset(true);
      if (typeof assetId === 'string') {
        const response = await getDetailAsset(assetId, { ...params, currency });

        setData(response.marketAsset);
      }
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      setIsLoadingAsset(false);
    }
  };

  useEffect(() => {
    if (assetId !== null && userInfo !== undefined) {
      void fetchDetailAsset(userInfo?.preferredCurrency);
    }
  }, [assetId, userInfo]);

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
    setVal: { (value: SetStateAction<string>): void; (arg0: string): void }
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
        router.push(`/homepage/assets/${assetId as string}`).catch(err => {
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
        {router.query.transaction === 'buy' && (
          <div className="relative flex flex-col bg-gradient-to-r from-[#3AC4A0] from-50% to-[#9CFFE5] rounded-[12px] p-[24px] overflow-hidden">
            <Image
              alt=""
              src={BannerCircle}
              className="absolute top-0 right-0 z-0"
            />
            <Typography className="z-10 text-base font-poppins font-normal text-[#FFFFFF]">
              {router.query?.transaction === 'buy' && t('buyAsset.text5')}
            </Typography>
            <Typography className="z-10 text-3xl font-poppins font-semibold  text-[#FFFFFF]">
              {prefCurrency}
              {` ${formatAssetPrice(
                router.query?.transaction === 'buy'
                  ? ballance?.balance ?? 0
                  : (portfolio?.total_lot ?? 0) *
                      (lastPrice[prefCurrency as PreferredCurrencyI] !== 0
                        ? lastPrice[prefCurrency as PreferredCurrencyI]
                        : lastPriceAsset ?? 0)
              )}`}{' '}
            </Typography>
          </div>
        )}
        <div className="relative bg-white mb-[-2] w-full h-[12px]"></div>
        {data !== undefined && (
          <CardPrice
            data={{
              ...data,
              socketPrice:
                lastPrice[prefCurrency as PreferredCurrencyI] !== 0
                  ? lastPrice[prefCurrency as PreferredCurrencyI]
                  : lastPriceAsset ?? 0
            }}
            loading={isLoadingAsset}
          />
        )}

        <div className="flex flex-col mt-4">
          {router.query.transaction === 'buy' && (
            <div className="mt-4">
              <CardSwitch handleToggle={handleToggle} />
            </div>
          )}
          {orderType === 'pending' && (
            <div className="flex flex-col mt-4 gap-4">
              <Typography className="font-poppins text-base font-semibold text-black">
                {t('buyAsset.text17')}
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
          {isActive && (
            <div className="flex flex-col mt-4">
              <CardLimitOrder setLimitOrder={setLimitOrder} />
            </div>
          )}
          {router.query.transaction === 'buy' && (
            <div className="mt-4 lg:flex block gap-3 mx-2 ">
              <div className="w-full lg:w-1/2 ">
                <Typography className="font-poppins text-base font-semibold text-black">
                  {t('buyAsset.text8')}
                </Typography>
                <div className="flex mt-2">
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
                </div>
                <Typography className="mt-2 flex gap-1 font-poppins text-xs font-normal text-[#3C49D6]">
                  <span>
                    <svg
                      width="13"
                      height="14"
                      viewBox="0 0 13 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.5 13.5C7.78558 13.5 9.04228 13.1188 10.1112 12.4046C11.1801 11.6903 12.0132 10.6752 12.5052 9.48744C12.9972 8.29972 13.1259 6.99279 12.8751 5.73191C12.6243 4.47104 12.0052 3.31285 11.0962 2.40381C10.1871 1.49476 9.02896 0.8757 7.76808 0.624896C6.50721 0.374092 5.20027 0.502813 4.01256 0.994783C2.82484 1.48675 1.80967 2.31987 1.09544 3.38879C0.381215 4.45771 -2.86102e-06 5.71442 -2.86102e-06 7C0.00330067 8.72289 0.689181 10.3743 1.90745 11.5925C3.12572 12.8108 4.77711 13.4967 6.5 13.5ZM7 10C7 10.1326 6.94732 10.2598 6.85355 10.3536C6.75978 10.4473 6.63261 10.5 6.5 10.5C6.36739 10.5 6.24021 10.4473 6.14644 10.3536C6.05268 10.2598 6 10.1326 6 10L6 6.5C6 6.36739 6.05268 6.24021 6.14644 6.14645C6.24021 6.05268 6.36739 6 6.5 6C6.63261 6 6.75978 6.05268 6.85355 6.14645C6.94732 6.24021 7 6.36739 7 6.5L7 10ZM6.5 3.5C6.64833 3.5 6.79334 3.54399 6.91667 3.6264C7.04001 3.70881 7.13614 3.82594 7.19291 3.96299C7.24967 4.10003 7.26452 4.25083 7.23559 4.39632C7.20665 4.5418 7.13522 4.67544 7.03033 4.78033C6.92544 4.88522 6.7918 4.95665 6.64632 4.98559C6.50083 5.01453 6.35003 4.99967 6.21299 4.94291C6.07594 4.88614 5.95881 4.79001 5.8764 4.66668C5.79398 4.54334 5.75 4.39834 5.75 4.25C5.75 4.05109 5.82902 3.86032 5.96967 3.71967C6.11032 3.57902 6.30108 3.5 6.5 3.5Z"
                        fill="#3C49D6"
                      />
                    </svg>
                  </span>
                  {t('buyAsset.text16')}
                </Typography>
              </div>
              <div className="w-full lg:w-1/2 mt-3 lg:mt-0">
                <Typography className="font-poppins text-base font-semibold text-black mb-4">
                  {t('buyAsset.text9')}
                </Typography>
                <div className="flex gap-3 mt-2">
                  {sellPercentArr.map((el, i: number) => {
                    return (
                      <Button
                        key={el.value + i}
                        variant={
                          el.value === buyPercent ? 'filled' : 'outlined'
                        }
                        className={`normal-case rounded-lg p-2 flex ite ${
                          el.value !== buyPercent
                            ? 'border border-[#D9D9D9] text-black'
                            : 'bg-[#3AC4A0] text-white'
                        } font-poppins`}
                        onClick={() => {
                          setBuyPercent(el.value);
                        }}
                      >
                        {el.name}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          {router.query.transaction === 'sell' && (
            <div>
              <div className="flex gap-6 items-center mx-2 lg:justify-center justify-between">
                <Typography className="font-poppins text-base font-semibold text-[#262626]">
                  Lot
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
                    value={parseFloat(lotSell).toFixed(1)}
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
            </div>
          )}
          <div className="flex mx-2 flex-col mt-4 gap-4">
            {router.query.transaction === 'sell' && (
              <div className="">
                <Typography className="font-poppins text-sm font-normal text-[#7C7C7C]">
                  {t('buyAsset.text12')}
                </Typography>
                <div className="flex gap-3 mt-2">
                  {sellPercentArr.map((el, i: number) => {
                    return (
                      <Button
                        key={el.value + i}
                        variant={
                          el.value === sellPercent ? 'filled' : 'outlined'
                        }
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
            <Typography className="mb-2 font-poppins text-base font-semibold text-black">
              {t('buyAsset.text10')}
            </Typography>
            {router.query.transaction === 'buy' && (
              <input
                type="text"
                value={amount}
                onChange={e => {
                  handleChangeNumber(
                    e,
                    amount,
                    setAmount,
                    setAssetsAmount,
                    true
                  );
                }}
                className="w-full border rounded-xl py-3 px-4 border-[#7C7C7C] text-base text-[#7C7C7C] focus:border-seeds-button-green font-poppins outline-none"
                placeholder="Insert nominal"
              />
            )}
            {router.query.transaction === 'sell' && (
              <input
                type="text"
                value={
                  lastPrice[prefCurrency as PreferredCurrencyI] !== undefined
                    ? formatAssetPrice(
                        lastPrice[prefCurrency as PreferredCurrencyI] !== 0
                          ? lastPrice[prefCurrency as PreferredCurrencyI]
                          : lastPriceAsset ?? 0
                      )
                    : 0
                }
                readOnly
                className="w-full border rounded-xl py-3 px-4 border-[#7C7C7C] text-base text-[#262626] focus:border-seeds-button-green font-poppins outline-none"
                placeholder="Insert nominal"
              />
            )}
            {router.query.transaction === 'sell' && (
              <div className="w-full p-3 md:p-5 border-none rounded-xl shadow-none bg-[#E9E9E9] mt-4">
                <div className="justify-between mb-5 flex">
                  <Typography className="font-poppins text-base font-semibold text-[#262626]">
                    {t('buyAsset.text13')}
                  </Typography>
                  <Typography className="text-[#7C7C7C] font-normal text-base">
                    {portfolio?.total_lot}
                  </Typography>
                </div>
                <div className="justify-between mb-5 flex">
                  <Typography className="font-poppins text-base font-semibold text-[#262626]">
                    {t('buyAsset.text14')}
                  </Typography>
                  <Typography className="text-[#7C7C7C] font-normal text-base">
                    {portfolio?.average_price}
                  </Typography>
                </div>
                <div className="justify-between mb-5 flex">
                  <Typography className="font-poppins text-base font-semibold text-[#262626]">
                    P/L
                  </Typography>
                  <Typography className="text-[#7C7C7C] font-normal text-base">
                    {portfolio?.return_percentage}
                  </Typography>
                </div>
              </div>
            )}
            {router.query.transaction === 'sell' && (
              <div className="w-full p-3 md:p-5 border-none rounded-xl shadow-none bg-[#E9E9E9] mt-4">
                <div className="justify-between flex">
                  <Typography className="font-poppins text-xs font-normal text-[#7C7C7C]">
                    {t('buyAsset.text15')}
                  </Typography>
                  <Typography className="text-[#262626] font-bold text-base">
                    `{prefCurrency}{' '}
                    {formatAssetPrice(
                      (lastPrice[prefCurrency as PreferredCurrencyI] !== 0
                        ? lastPrice[prefCurrency as PreferredCurrencyI]
                        : lastPriceAsset ?? 0) * +lotSell
                    )}
                    `
                  </Typography>
                </div>
              </div>
            )}
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
                        router.query.transaction !== 'buy' &&
                        router.query.transaction === undefined
                          ? 'text-[#3AC4A0]'
                          : 'text-[#BB1616]'
                      } font-semibold text-sm`}
                    >
                      {router.query.transaction === undefined &&
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
                      {data?.providerName}
                    </Typography>
                  </div>
                  <div className="flex justify-between mt-4">
                    <Typography className="text-[#7C7C7C] font-normal text-xs">
                      {t('buyAsset.text8')}
                    </Typography>
                    <Typography className="text-[#7555DA] font-normal text-xs">
                      {assetAmount.length === 0 && '0'}
                      {`${
                        assetAmount.length === 0 || assetAmount.includes('.')
                          ? assetAmount
                          : assetAmount + '.0'
                      } ${data?.realTicker as string}`}
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
                              ? `${parseFloat(limitOrder.profit) * 100} `
                              : `${
                                  userInfo?.preferredCurrency as string
                                } ${standartCurrency(limitOrder.profit).replace(
                                  'Rp',
                                  ''
                                )}`}
                          </Typography>
                        </div>
                        <div className="flex justify-between mt-2">
                          <Typography className="text-[#7C7C7C] font-normal text-xs">
                            Stop Loss
                          </Typography>
                          <Typography className="text-[#7555DA] font-normal text-xs">
                            {limitOrder.type === 'percent'
                              ? `${parseFloat(limitOrder.loss) * 100} %`
                              : `${
                                  userInfo?.preferredCurrency as string
                                } ${standartCurrency(limitOrder.loss).replace(
                                  'Rp',
                                  ''
                                )}`}
                          </Typography>
                        </div>
                      </>
                    )}
                  <div className="flex justify-between mt-2">
                    <Typography className="text-[#7C7C7C] font-normal text-xs">
                      {t('buyAsset.text10')}
                    </Typography>
                    <Typography className="text-[#7555DA] font-normal text-xs">
                      {price.length === 0
                        ? formatAssetPrice(
                            lastPrice[prefCurrency as PreferredCurrencyI] !== 0
                              ? lastPrice[prefCurrency as PreferredCurrencyI]
                              : lastPriceAsset ?? 0
                          )
                        : standartCurrency(price).replace('Rp', '')}
                    </Typography>
                  </div>

                  <div className="flex justify-between mt-2">
                    <Typography className="text-[#7C7C7C] font-normal text-xs">
                      {t('buyAsset.text9')}
                    </Typography>
                    <Typography className="text-[#7555DA] font-normal text-xs">
                      {standartCurrency(amount).replace('Rp', '')}
                    </Typography>
                  </div>
                </CCard>
              </div>
            )}
            {router.query.transaction === 'buy' && (
              <Button
                type="button"
                disabled={isDisable}
                variant="filled"
                className={`flex justify-center rounded-full w-full lg:w-[200px] ml-auto justify-items-end items-end py-3 mb-5 ${
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
            )}

            {router.query.transaction === 'sell' && (
              <Button
                type="button"
                variant="filled"
                className={`flex justify-center mb-5 rounded-full w-full ml-auto justify-items-end items-end py-3 bg-[#DD2525]`}
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
                      {orderType === 'pending' && (
                        <div className="flex justify-between mt-4">
                          <Typography className="text-[#7C7C7C] font-normal text-xs">
                            Set Price
                          </Typography>
                          <Typography className="text-[#262626] font-semibold text-xs">
                            {userInfo?.preferredCurrency}
                            {standartCurrency(price).replace('Rp', '')}
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
                              {userInfo?.preferredCurrency}
                              {formatAssetPrice(
                                lastPrice[
                                  prefCurrency as PreferredCurrencyI
                                ] !== 0
                                  ? lastPrice[
                                      prefCurrency as PreferredCurrencyI
                                    ]
                                  : lastPriceAsset ?? 0
                              )}
                            </Typography>
                          </div>
                        )}
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
                            {buyPercent !== 0
                              ? `${buyPercent}%`
                              : `${
                                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                  userInfo?.preferredCurrency
                                }${standartCurrency(amount).replace('Rp', '')}`}
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
                        router.query.transaction === 'buy' &&
                        isActive && (
                          <>
                            <div className="flex justify-between mt-4">
                              <Typography className="text-[#7C7C7C] font-normal text-xs">
                                Take Profit ( % )
                              </Typography>
                              <Typography className="text-[#262626] font-semibold text-xs">
                                {limitOrder.type === 'percent'
                                  ? `${parseFloat(limitOrder.profit)}`
                                  : limitOrder.type === 'nominal'
                                  ? `${parseFloat(limitOrder.profit)}`
                                  : `${
                                      userInfo?.preferredCurrency as string
                                    } ${standartCurrency(
                                      limitOrder.profit
                                    ).replace('Rp', '')}`}
                              </Typography>
                            </div>
                            <div className="flex justify-between mt-4">
                              <Typography className="text-[#7C7C7C] font-normal text-xs">
                                Stop Loss ( % )
                              </Typography>
                              <Typography className="text-[#262626] font-semibold text-xs">
                                {limitOrder.type === 'percent'
                                  ? `${parseFloat(limitOrder.loss)} `
                                  : limitOrder.type === 'nominal'
                                  ? `${parseFloat(limitOrder.loss)} `
                                  : `${
                                      userInfo?.preferredCurrency as string
                                    } ${standartCurrency(
                                      limitOrder.loss
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
                        {router.query.transaction === 'buy' ? (
                          <Typography className="text-[#3AC4A0] font-semibold text-xs">
                            {standartCurrency(amount).replace(
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
                    className="flex justify-center rounded-full min-w-full capitalize font-semibold text-sm bg-[#3AC4A0] text-white font-poppins mt-4 mb-20 md:mb-0"
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
