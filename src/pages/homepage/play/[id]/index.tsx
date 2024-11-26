import Bearish from '@/assets/play/tournament/bearish.svg';
import Bullish from '@/assets/play/tournament/bullish.svg';
import CoinLogo from '@/assets/play/tournament/coinLogo.svg';
import IconCopy from '@/assets/play/tournament/copyLink.svg';
import BannerCircle from '@/assets/play/tournament/homeBannerCircle.svg';
import IconFilter from '@/assets/play/tournament/iconFilter.svg';
import IconPortfolio from '@/assets/play/tournament/iconPortfolio.svg';
import IconVirtualBalance from '@/assets/play/tournament/iconVirtualBalance.svg';
import IconWatchlist from '@/assets/play/tournament/iconWatchlist.svg';
import IconWarning from '@/assets/play/tournament/miniWarning2.svg';
import IconNoData from '@/assets/play/tournament/noData.svg';
import PurpleCircle from '@/assets/play/tournament/purpleCircle.svg';
import IconSeeds from '@/assets/play/tournament/seedsBannerLeaderboard.svg';
import AssetPagination from '@/components/AssetPagination';
import FloatingButton from '@/components/homepage/FloatingButton';
import CountdownTimer from '@/components/play/CountdownTimer';
import Loading from '@/components/popup/Loading';
import ModalDetailTournament from '@/components/popup/ModalDetailTournament';
import type { AssetsInterface } from '@/containers/homepage/trending/AssetsPage';
import AssetTrendingCardSkeleton from '@/containers/homepage/trending/skeleton/AssetsCardSkeleton';
import { calculatePercentageChange } from '@/helpers/assetPercentageChange';
import { formatAssetPrice, standartCurrency } from '@/helpers/currency';
import { getMarketList } from '@/repository/market.repository';
import { getPlayBallance, getPlayById } from '@/repository/play.repository';
import { getUserInfo } from '@/repository/profile.repository';
import {
  SortingFilter,
  TypeFilter,
  type BallanceTournament,
  type IDetailTournament,
  type UserInfo
} from '@/utils/interfaces/tournament.interface';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export interface AssetItemType {
  id: string;
  seedsTicker: string;
  realTicker: string;
  logo: string;
  name: string;
  exchange: string;
  exchangeCurrency: string;
  listedCountry: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  assetType: string;
  priceBar: {
    timestamp: Date | string;
    open: number;
    high: number;
    low: number;
    close: number;
    vwap: number;
    volume: number;
  };
}
export interface AssetsListRoot {
  AssetList: AssetsInterface[];
  metadata: Metadata;
}

export interface Ballance {
  balance: number;
  portfolio: number;
  total_sell: number;
  total_buy: number;
  currency: string;
}
interface Metadata {
  current_page: number;
  limit: number;
  totalPage: number;
  totalRow: number;
}

interface Filter {
  search: string;
  limit: number;
  page: number;
  currency: string;
  type: string;
}

const initialFilter: Filter = {
  search: '',
  limit: 10,
  page: 1,
  type: 'ALL',
  currency: ''
};

const initialMetadata: Metadata = {
  current_page: 1,
  limit: 10,
  totalPage: 1,
  totalRow: 10
};

interface FilterSorting {
  id: number;
  title: string;
  status: SortingFilter;
}

export default function PlayAssetsPage(): React.ReactElement {
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = router.query;
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [detailTournament, setDetailTournament] = useState<IDetailTournament>();
  const [assets, setAssets] = useState<AssetItemType[]>([]);
  const [metadata, setMetadata] = useState<Metadata>(initialMetadata);
  const [ballance, setBallance] = useState<BallanceTournament>({
    balance: 0,
    portfolio: 0,
    total_sell: 0,
    total_buy: 0,
    return_value: 0,
    return_percentage: 0,
    currency: 'IDR'
  });
  const [isDetailModal, setIsDetailModal] = useState<boolean>(false);

  const [loadingDetailTournament, setLoadingDetailTournament] =
    useState<boolean>(false);
  const [loadingBalance, setLoadingBalance] = useState<boolean>(false);
  const [loadingAssets, setLoadingAssets] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [filter, setFilter] = useState<Filter>(initialFilter);

  const [assetActiveSort, setAssetActiveSort] = useState(
    SortingFilter.ASCENDING
  );

  const [assetActiveType, setAssetActiveType] = useState(TypeFilter.ALL);

  const filterSorting: FilterSorting[] = [
    {
      id: 0,
      title: 'A-Z',
      status: SortingFilter.ASCENDING
    },
    {
      id: 1,
      title: 'Z-A',
      status: SortingFilter.DESCENDING
    }
  ];

  const filterType = [
    {
      id: 0,
      title: 'All',
      value: TypeFilter.ALL
    },
    {
      id: 1,
      title: 'Stock',
      value: TypeFilter.STOCK
    },
    {
      id: 2,
      title: 'US Stock',
      value: TypeFilter.US_STOCK
    },
    {
      id: 3,
      title: 'ID Stock',
      value: TypeFilter.ID_STOCK
    },
    {
      id: 4,
      title: 'Crypto',
      value: TypeFilter.CRYPTO
    }
  ];

  const handleShowFilters = (): void => {
    setShowFilter(!showFilter);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    fetchData()
      .then()
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (id !== undefined && userInfo !== undefined) {
      void fetchDetailTournament(id as string);
      void fetchPlayBallance(userInfo.preferredCurrency ?? 'IDR');
    }
  }, [id, userInfo]);

  useEffect(() => {
    if (userInfo !== undefined) {
      setFilter(prevState => ({
        ...prevState,
        currency: userInfo?.preferredCurrency ?? 'IDR'
      }));
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo !== undefined && filter.currency !== '') {
      const fetchData = async (): Promise<void> => {
        await fetchDataAssets();
      };

      fetchData().catch(error => {
        toast.error(`Error fetching data: ${error as string}`);
      });
    }
  }, [filter, userInfo, assetActiveSort, assetActiveType, searchQuery]);

  const fetchData = async (): Promise<void> => {
    try {
      const dataInfo = await getUserInfo();
      setUserInfo(dataInfo);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  const fetchDataAssets = async (): Promise<void> => {
    try {
      setLoadingAssets(true);
      const response = await getMarketList({
        ...filter,
        search: searchQuery,
        sort_by: assetActiveSort,
        type: assetActiveType
      });
      if (response.result === null) {
        setAssets([]);
      } else {
        setAssets(response.marketAssetList);
        setMetadata(response.metadata);
      }
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      setLoadingAssets(false);
    }
  };

  const fetchPlayBallance = async (currency: string): Promise<void> => {
    try {
      setLoadingBalance(true);
      const response = await getPlayBallance(id as string, { currency });
      setBallance(response);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      setLoadingBalance(false);
    }
  };

  const fetchDetailTournament = async (id: string): Promise<void> => {
    try {
      setLoadingDetailTournament(true);
      const resp: IDetailTournament = await getPlayById(id);
      setDetailTournament(resp);
    } catch (error) {
      toast(`Error fetch detail tournament ${error as string}`);
    } finally {
      setLoadingDetailTournament(false);
    }
  };

  const handleCopyClick = async (): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const textToCopy = `${detailTournament?.play_id}`;
    await navigator.clipboard.writeText(textToCopy).then(() => {
      toast('Play ID copied!');
    });
  };
  return (
    <>
      {detailTournament === undefined ||
      loadingDetailTournament ||
      loadingAssets ||
      loadingBalance ? (
        <Loading />
      ) : (
        ''
      )}
      {isDetailModal && (
        <ModalDetailTournament
          onClose={() => {
            setIsDetailModal(prev => !prev);
          }}
          playTime={detailTournament?.play_time ?? ''}
          endTime={detailTournament?.end_time ?? ''}
          category={detailTournament?.category ?? ''}
          prize={detailTournament?.prize ?? []}
          tnc={detailTournament?.tnc ?? { en: '', id: '' }}
          length={detailTournament?.total_participants ?? 0}
          userInfoCurrency={userInfo?.preferredCurrency ?? ''}
        />
      )}
      <div className="flex flex-col justify-center items-center rounded-xl font-poppins p-5 bg-white">
        {/* Tournament Details */}
        <div className="flex justify-start w-full gap-2">
          <Typography className="text-xl xl:text-2xl font-semibold">
            {detailTournament?.name ?? 'Play Simulation'}
          </Typography>
          <Image
            onClick={() => {
              setIsDetailModal(true);
            }}
            alt=""
            src={IconWarning}
            className="w-[20px] cursor-pointer"
          />
        </div>

        {/* Tournament ID */}
        <div className="text-[14px] flex justify-start items-center gap-2 py-2 w-full">
          <Typography className="font-poppins">
            Play ID : {detailTournament?.play_id ?? 'Loading...'}
          </Typography>
          <button onClick={handleCopyClick}>
            <Image alt="" src={IconCopy} className="w-[20px]" />
          </button>
        </div>

        {/* Tournament Balance */}
        <div className="w-full p-5 bg-gradient-to-br from-[#50D4B2] from-50% to-[#E2E2E2] rounded-xl h-[250px] relative">
          <div className="flex flex-col justify-start gap-2 md:gap-0">
            <Typography className="text-white font-poppins z-10 text-sm md:text-lg">
              {t('tournament.asset.totalInvestment')}
            </Typography>
            <Typography className="text-white text-[26px] font-semibold font-poppins z-10">
              {userInfo?.preferredCurrency !== undefined
                ? userInfo?.preferredCurrency
                : 'IDR'}
              {standartCurrency(ballance?.portfolio ?? 0).replace('Rp', '')}
            </Typography>
            <Typography className="text-white font-poppins z-10 text-sm md:text-lg">
              {`Total Return: `}
              {userInfo?.preferredCurrency !== undefined
                ? userInfo?.preferredCurrency
                : 'IDR'}{' '}
              {formatAssetPrice(ballance?.return_value ?? 0)}
              {` (${ballance?.return_value < 0 ? '' : '+'}${(
                formatAssetPrice(ballance?.return_percentage ?? 0)
              )}%)`}
            </Typography>
            <Typography className="text-white font-poppins z-10 text-sm md:text-lg">
              {`${t('tournament.assets.virtualBalance')}: `}
              {userInfo?.preferredCurrency !== undefined
                ? userInfo?.preferredCurrency
                : 'IDR'}
              {standartCurrency(ballance?.balance ?? 0).replace('Rp', '')}
            </Typography>
          </div>
          <Image
            alt=""
            src={BannerCircle}
            className="absolute top-0 right-0 z-0"
          />
          <div className="w-full xl:w-3/4 flex justify-center items-center gap-8 bg-white absolute p-4 bottom-[-45px] m-auto left-0 right-0 z-10 rounded-xl shadow-lg">
            <div
              onClick={async () =>
                await router
                  .push(`/homepage/play/${id as string}/portfolio`)
                  .catch(err => {
                    toast.error(`${err as string}`);
                  })
              }
              className="flex flex-col justify-center items-center gap-2 cursor-pointer"
            >
              <Image
                alt=""
                width={100}
                height={100}
                src={IconPortfolio}
                className="w-[30px] md:w-[45px] hover:shadow-xl duration-300 rounded-full"
              />
              <Typography className="text-[#262626] font-poppins text-sm md:text-lg text-center">
                {t('tournament.assets.portfolio')}
              </Typography>
            </div>
            <div
              onClick={async () =>
                await router
                  .push(`/homepage/play/${id as string}/virtual-balance`)
                  .catch(err => {
                    toast.error(`${err as string}`);
                  })
              }
              className="flex flex-col justify-center items-center gap-2 cursor-pointer"
            >
              <Image
                alt=""
                src={IconVirtualBalance}
                width={100}
                height={100}
                className="w-[30px] md:w-[45px] hover:shadow-xl duration-300 rounded-full"
              />
              <Typography className="text-[#262626] font-poppins text-sm md:text-lg text-center">
                {t('tournament.assets.virtualBalance')}
              </Typography>
            </div>
            <div
              onClick={async () =>
                await router.push(`/homepage/play/${id as string}/watchlist`)
              }
              className="flex flex-col justify-center items-center gap-2 cursor-pointer"
            >
              <Image
                alt=""
                src={IconWatchlist}
                width={100}
                height={100}
                className="w-[30px] md:w-[45px] hover:shadow-xl duration-300 rounded-full"
              />
              <Typography className="text-[#262626] font-poppins text-xs md:text-lg text-center">
                {t('tournament.assets.watchList')}
              </Typography>
            </div>
          </div>
        </div>

        {/* Countdown */}
        <div className="mt-16 w-full">
          <div className="flex flex-col w-full justify-center items-center">
            <div className="text-lg font-semibold">
              {t('tournament.detailRemaining')}
            </div>
            {detailTournament?.end_time !== undefined ? (
              <CountdownTimer
                className="text-md text-[#FDBA22] font-semibold mt-2 font-poppins"
                deadline={detailTournament?.end_time.toString()}
              />
            ) : (
              <Typography className="text-lg text-[#FDBA22] mt-2 font-semibold font-poppins">
                Loading...
              </Typography>
            )}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-gradient-to-br from-[#7B51FF] from-30% to-[#B7A6EB] w-full flex justify-between items-center relative mt-4 cursor-pointer rounded-xl p-4 overflow-hidden">
          <Image
            width={100}
            height={100}
            alt=""
            src={IconSeeds}
            className="w-[60px] md:w-[80px] xl:ml-8"
          />
          <div
            onClick={async () =>
              await router.push(`/play/tournament/${id as string}/leaderboard`)
            }
            className="w-full lg:flex lg:justify-between ml-2 z-10"
          >
            <div className="flex flex-col justify-center items-start text-sm lg:text-lg text-white z-10">
              <div className="z-10">{t('tournament.leaderboardBanner1')}</div>
              <div className="flex gap-2 z-10">
                <div>{t('tournament.leaderboardBanner2')}</div>
                <div className="text-[#3AC4A0] font-semibold cursor-pointer z-10">
                  {t('tournament.leaderboardBanner4')}
                </div>
              </div>
            </div>
            <div className="bg-[#3AC4A0] hover:bg-[#2abd96] duration-300 text-white flex justify-center items-center lg:w-[300px] lg:text-lg text-xs rounded-full px-4 py-1 mt-2 xl:mr-8 z-10">
              {t('tournament.leaderboardBanner3')}
            </div>
          </div>
          <div className="absolute bottom-[10px] right-[-30px] w-[100px] h-[100px] flex justify-center items-center z-0">
            <Image
              width={100}
              height={100}
              alt="PurpleCircle"
              src={PurpleCircle}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Market List */}
        <div className="w-full mt-4 relative">
          <FloatingButton id={id as string} />
          <Typography className="text-xl font-semibold text-[#3AC4A0]">
            {t('playSimulation.assetList')}
          </Typography>
          <div className="w-full flex gap-2 mt-4">
            <input
              id="search"
              type="text"
              name="search"
              value={searchQuery}
              onChange={e => {
                handleSearch(e);
              }}
              placeholder="Search"
              className="block w-full text-[#262626] h-11 leading-4 placeholder:text-[#BDBDBD] focus:outline-0 disabled:bg-[#E9E9E9] p-3 pl-8 rounded-xl border border-[#BDBDBD]"
            />
            <Image
              onClick={() => {
                handleShowFilters();
              }}
              alt=""
              src={IconFilter}
              className="w-[30px] cursor-pointer"
            />
          </div>

          {/* Sorting Section */}
          {showFilter && (
            <div className="w-full flex items-center justify-center mt-4 duration-500">
              <div className="w-full flex flex-col md:flex-row justify-between items-center gap-3 max-w-full overflow-x-auto no-scroll">
                {/* Asset Type Filter */}
                <div className="w-full md:w-fit flex gap-2">
                  {filterType.map(item => (
                    <button
                      className={`w-full flex gap-2 border px-4 py-2 font-poppins rounded-lg text-sm text-nowrap ${
                        item.value === assetActiveType
                          ? 'border-seeds-button-green bg-seeds-button-green text-white'
                          : 'border-seeds-button-green bg-white text-seeds-button-green'
                      }`}
                      key={item.id}
                      onClick={() => {
                        setAssetActiveType(item.value);
                      }}
                    >
                      <div>{item.title}</div>
                    </button>
                  ))}
                </div>

                <div className="w-full md:w-fit flex gap-2">
                  {/* Sorting Filter */}
                  {filterSorting.map(item => (
                    <button
                      className={`w-full flex gap-2 border px-4 py-2 font-poppins rounded-lg text-sm text-nowrap ${
                        item.status === assetActiveSort
                          ? 'border-seeds-button-green bg-seeds-button-green text-white'
                          : 'border-seeds-button-green bg-white text-seeds-button-green'
                      }`}
                      key={item.id}
                      onClick={() => {
                        setAssetActiveSort(item.status);
                      }}
                    >
                      <div>{item.title}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Asset Card */}
          {!loadingAssets ? (
            assets !== null ? (
              <>
                {assets?.map((data, index) => (
                  <div
                    key={index}
                    onClick={async () =>
                      await router
                        .push(
                          `${
                            id !== undefined
                              ? `/homepage/assets/${data.id}?playId=${
                                  id as string
                                }`
                              : `/homepage/assets/${data.id}`
                          }`
                        )
                        .catch(error => {
                          toast.error(`${error as string}`);
                        })
                    }
                    className="flex justify-between items-center p-4 mt-4 cursor-pointer bg-[#F9F9F9] hover:bg-[#F2F2F2] duration-300 rounded-lg"
                  >
                    <div className="w-full flex gap-4 text-sm md:text-base">
                      <img
                        alt=""
                        src={data?.logo === '' ? CoinLogo : data?.logo}
                        className="w-[40px] h-[40px] rounded-full"
                      />
                      <div className="flex flex-col justify-center items-start">
                        <div className="flex gap-1">
                          <div className="font-semibold">
                            {data?.seedsTicker}
                          </div>
                          <div>/ {data?.exchangeCurrency}</div>
                        </div>
                        <div className="text-[#7C7C7C] text-xs md:text-sm">
                          {data?.name}
                        </div>
                      </div>
                    </div>
                    <div className="w-[180px] md:w-[250px] lg:w-[300px] flex flex-col justify-end items-end">
                      <div className="font-semibold text-sm md:text-base">
                        {userInfo?.preferredCurrency !== undefined
                          ? userInfo?.preferredCurrency
                          : 'IDR'}
                        {standartCurrency(data?.priceBar?.close ?? 0).replace(
                          'Rp',
                          ''
                        )}
                      </div>
                      <div className="flex justify-center gap-2">
                        <Image
                          alt=""
                          src={
                            (data?.priceBar?.close ?? 0) >=
                            (data?.priceBar?.open ?? 0)
                              ? Bullish
                              : Bearish
                          }
                          className="w-[20px]"
                        />
                        <div
                          className={`${
                            (data?.priceBar?.close ?? 0) >=
                            (data?.priceBar?.open ?? 0)
                              ? 'text-[#3AC4A0]'
                              : 'text-[#DD2525]'
                          } text-sm md:text-base`}
                        >
                          {`(${calculatePercentageChange(
                            data?.priceBar?.open ?? 0,
                            data?.priceBar?.close ?? 0
                          )}%)`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="bg-white flex flex-col justify-center items-center text-center lg:px-0">
                <Image alt="" src={IconNoData} className="w-[250px]" />
                <p className="font-semibold text-black">
                  {`"${searchQuery}" ${t('tournament.assets.text1')}`}
                </p>
                <p className="text-[#7C7C7C]">{t('tournament.assets.text2')}</p>
              </div>
            )
          ) : (
            Array.from(
              { length: metadata.totalRow === 0 ? 1 : metadata.totalRow },
              (_, idx) => <AssetTrendingCardSkeleton key={idx} />
            )
          )}

          {/* Pagination */}
          <div className="flex justify-center mx-auto my-4">
            <AssetPagination
              currentPage={filter.page}
              totalPages={metadata.totalPage}
              onPageChange={page => {
                setFilter({ ...filter, page });
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
