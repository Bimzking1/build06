/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
'use-client';

import Bearish from '@/assets/play/tournament/bearish.svg';
import Bullish from '@/assets/play/tournament/bullish.svg';
import CoinLogo from '@/assets/play/tournament/coinLogo.svg';
import Loading from '@/components/popup/Loading';
import {
  calculatePercentageDifference,
  standartCurrency
} from '@/helpers/currency';
import { getDetailAsset } from '@/repository/asset.repository';
import { getPlayAssets } from '@/repository/play.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Button, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface PlayAsset {
  asset_id: string;
  average_price: number;
  currency: string;
  current_price: number;
  return_percentage: number;
  return_value: number;
  total_invested: number;
  total_lot: number;
  total_value: number;
}

interface MarketAsset {
  assetType: string;
  exchangeCurrency: string;
  logo: string;
  name: string;
  providerName: string;
  seedsTicker: string;
  realTicker: string;
}

interface PriceBarHistory {
  close: number;
  open: number;
  low: number;
  high: number;
  timestamp: string;
}

const DetailPortfolio = (): React.ReactElement => {
  const router = useRouter();
  const id = router.query.id;
  const assetId = router.query.portfolioId;
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [loadingPlayAsset, setLoadingPlayAsset] = useState<boolean>(false);
  const [playAsset, setPlayAsset] = useState<PlayAsset>();
  const [marketAsset, setMarketAsset] = useState<MarketAsset>();
  const [priceBarHistory, setPriceBarHistory] = useState<PriceBarHistory[]>([]);
  const [assetType, setAssetType] = useState<string>('');

  useEffect(() => {
    fetchData()
      .then()
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (id !== null && userInfo !== undefined) {
      void fetchPlayAsset();
      void fetchDetailAsset(userInfo?.preferredCurrency);
    }
  }, [id, userInfo]);

  const fetchData = async (): Promise<void> => {
    try {
      const dataInfo = await getUserInfo();
      setUserInfo(dataInfo);
    } catch (error) {
      toast(`Error fetching data: ${error as string}`);
    }
  };

  const fetchPlayAsset = async (): Promise<void> => {
    try {
      setLoadingPlayAsset(true);
      const response = await getPlayAssets(id as string, assetId as string);
      setPlayAsset(response?.data);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      setLoadingPlayAsset(false);
    }
  };

  const fetchDetailAsset = async (currency: string): Promise<void> => {
    try {
      if (typeof id === 'string') {
        const response = await getDetailAsset(assetId as string, { currency });
        setMarketAsset(response?.marketAsset);
        setPriceBarHistory(response?.marketAsset?.priceBarHistory);
        setAssetType(response.marketAsset.assetType);
      }
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  return (
    <>
      {loadingPlayAsset && <Loading />}
      <div className="w-full flex flex-col justify-center items-center rounded-xl p-5 bg-white">
        <div className="flex justify-start w-full">
          <Typography className="text-xl font-semibold font-poppins">
            {t('tournament.portfolio.detailPortfolio')}
          </Typography>
        </div>
        <div className="w-full flex justify-between items-center p-4 mt-4 bg-[#F9F9F9] border border-[#E9E9E9] md:border-none rounded-lg font-poppins">
          <div
            className="flex gap-2 md:gap-4 cursor-pointer"
            onClick={async () =>
              await router.push(
                `/play/tournament/${id as string}/${assetId as string}`
              )
            }
          >
            <div className='flex justify-center items-center w-[30px] md:w-[40px]'>
              <img
                alt=""
                src={marketAsset?.logo ?? CoinLogo}
                className="w-full h-auto"
              />
            </div>
            <div className="flex flex-col justify-center items-start">
              <div className="flex gap-1">
                <Typography className="text-sm md:text-lg text-black font-poppins font-semibold">
                  {marketAsset?.seedsTicker} /
                </Typography>
                <Typography className="text-sm md:text-lg text-black font-poppins">
                  {marketAsset?.exchangeCurrency}
                </Typography>
              </div>
              <Typography className="text-sm md:text-lg text-[#7C7C7C] font-poppins">
                {marketAsset?.name}
              </Typography>
            </div>
          </div>
          <div className="flex flex-col justify-end items-end gap-2">
            <Typography className="text-sm md:text-lg text-black font-poppins font-semibold">
              {userInfo?.preferredCurrency !== undefined
                ? userInfo?.preferredCurrency
                : 'IDR'}{' '}
              {standartCurrency(playAsset?.current_price ?? 0).replace(
                'Rp',
                ''
              )}
            </Typography>
            <div className="flex justify-center gap-2">
              {priceBarHistory !== undefined &&
                priceBarHistory !== undefined && (
                  <>
                    <Image
                      alt=""
                      src={
                        priceBarHistory[priceBarHistory?.length - 1]?.close <
                        priceBarHistory[priceBarHistory?.length - 1]?.open
                          ? Bearish
                          : Bullish
                      }
                      className="w-[14px] md:w-[20px]"
                    />
                    <Typography
                      className={`${
                        priceBarHistory[priceBarHistory?.length - 1]?.close <
                        priceBarHistory[priceBarHistory?.length - 1]?.open
                          ? 'text-[#DD2525]'
                          : 'text-[#3AC4A0]'
                      } font-poppins text-sm md:text-base`}
                    >
                      (
                      {
                        calculatePercentageDifference(
                          priceBarHistory[priceBarHistory?.length - 1]?.open ??
                            0,
                          priceBarHistory[priceBarHistory?.length - 1]?.close ??
                            0
                        )?.value
                      }
                      %)
                    </Typography>
                  </>
                )}
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col justify-center items-center gap-2 p-4 mt-4 bg-[#F9F9F9] border border-[#E9E9E9] md:border-none rounded-lg">
          <div className="w-full flex justify-between">
            <Typography className="text-sm md:text-lg text-[#7C7C7C] font-poppins">
              {t('tournament.portfolio.totalValue')}
            </Typography>
            <Typography className="text-sm md:text-lg font-semibold text-black font-poppins">
              {userInfo?.preferredCurrency !== undefined
                ? userInfo?.preferredCurrency
                : 'IDR'}{' '}
              {standartCurrency(playAsset?.total_value ?? 0).replace('Rp', '')}
            </Typography>
          </div>
          <div className="w-full flex justify-between">
            <Typography className="text-sm md:text-lg text-[#7C7C7C] font-poppins">
              {t('tournament.portfolio.totalInvested')}
            </Typography>
            <Typography className="text-sm md:text-lg text-black font-poppins">
              {userInfo?.preferredCurrency !== undefined
                ? userInfo?.preferredCurrency
                : 'IDR'}{' '}
              {standartCurrency(playAsset?.total_invested ?? 0).replace(
                'Rp',
                ''
              )}
            </Typography>
          </div>
          {playAsset !== undefined && (
            <>
              <div className="w-full flex justify-between">
                <Typography className="text-sm md:text-lg text-[#7C7C7C] font-poppins">
                  {t('tournament.portfolio.returnValue')}
                </Typography>
                <Typography
                  className={`${
                    playAsset?.return_value < 0
                      ? 'text-[#DA2D1F]'
                      : 'text-[#3AC4A0]'
                  } text-sm md:text-lg font-poppins`}
                >
                  {userInfo?.preferredCurrency !== undefined
                    ? userInfo?.preferredCurrency
                    : 'IDR'}{' '}
                  {standartCurrency(playAsset?.return_value ?? 0).replace(
                    'Rp',
                    ''
                  )}
                </Typography>
              </div>
              <div className="w-full flex justify-between">
                <Typography className="text-sm md:text-lg text-[#7C7C7C] font-poppins">
                  {t('tournament.portfolio.returnPercentage')}
                </Typography>
                <Typography
                  className={`${
                    playAsset?.return_percentage < 0
                      ? 'text-[#DA2D1F]'
                      : 'text-[#3AC4A0]'
                  } text-sm md:text-lg text-[#DA2D1F] font-poppins`}
                >
                  ({playAsset?.return_percentage}%)
                </Typography>
              </div>
            </>
          )}
        </div>
        <div className="w-full flex flex-col justify-center items-center gap-2 p-4 mt-4 bg-[#F9F9F9] border border-[#E9E9E9] md:border-none rounded-lg">
          <div className="w-full flex justify-between">
            <Typography className="text-sm md:text-lg text-[#7C7C7C] font-poppins">
              {t('tournament.portfolio.ownedLot')}
            </Typography>
            <Typography className="text-sm md:text-lg text-black font-poppins">
              {playAsset?.total_lot ?? '0'}
            </Typography>
          </div>
          <div className="w-full flex justify-between">
            <Typography className="text-sm md:text-lg text-[#7C7C7C] font-poppins">
              {t('tournament.portfolio.averagePrice')}
            </Typography>
            <Typography className="text-sm md:text-lg text-black font-poppins">
              {userInfo?.preferredCurrency !== undefined
                ? userInfo?.preferredCurrency
                : 'IDR'}{' '}
              {standartCurrency(playAsset?.average_price ?? 0).replace(
                'Rp',
                ''
              )}
            </Typography>
          </div>
          <div className="w-full flex justify-between">
            <Typography className="text-sm md:text-lg text-[#7C7C7C] font-poppins">
              {t('tournament.portfolio.currentPrice')}
            </Typography>
            <Typography
              className={`${
                playAsset?.return_percentage !== undefined
                  ? playAsset?.return_percentage < 0
                    ? 'text-[#DA2D1F]'
                    : 'text-[#3AC4A0]'
                  : ''
              } text-sm md:text-lg font-poppins`}
            >
              {userInfo?.preferredCurrency !== undefined
                ? userInfo?.preferredCurrency
                : 'IDR'}{' '}
              {standartCurrency(playAsset?.current_price ?? 0).replace(
                'Rp',
                ''
              )}
            </Typography>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center items-center rounded-xl p-5 bg-white gap-4 mt-4">
        <Button
          disabled={
            playAsset?.total_lot !== undefined
              ? playAsset?.total_lot <= 0
              : true
          }
          className="w-full rounded-full bg-[#DD2525] font-poppins"
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
          {t('tournament.portfolio.sell')}
        </Button>
        <Button
          className="w-full rounded-full bg-seeds-button-green font-poppins"
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
          {t('tournament.portfolio.buy')}
        </Button>
      </div>
    </>
  );
};

export default DetailPortfolio;
