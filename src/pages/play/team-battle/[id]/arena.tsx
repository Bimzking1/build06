/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
'use-client';

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
import IconSeeds from '@/assets/play/tournament/seedsBannerLeaderboard.svg';
import CountdownTimer from '@/components/play/CountdownTimer';
import Loading from '@/components/popup/Loading';
import FloatingButtonBattle from '@/components/team-battle/FloatingButtonBattle';
import ModalDetailBattle from '@/components/team-battle/ModalDetailBattle';
import { standartCurrency } from '@/helpers/currency';
import withAuth from '@/helpers/withAuth';
import { type AssetItemType } from '@/pages/homepage/play/[id]';
import { getMarketList } from '@/repository/market.repository';
import { getUserInfo } from '@/repository/profile.repository';
import {
  getBattleArena,
  getBattleBalance,
  getBattlePortfolio
} from '@/repository/team-battle.repository';
import i18n from '@/utils/common/i18n';
import { type ArenaBattleI } from '@/utils/interfaces/team-battle.interface';
import {
  SortingFilter,
  type BallanceTournament,
  type UserInfo
} from '@/utils/interfaces/tournament.interface';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowBack } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { calculatePercentageChange } from '../../../../helpers/assetPercentageChange';

interface itemPortfolioSummaryType {
  value: number;
  gnl: number;
  gnl_percentage: number;
  currency: string;
}

interface IPortfolioSummary {
  summary: itemPortfolioSummaryType;
  id_stock: itemPortfolioSummaryType;
  us_stock: itemPortfolioSummaryType;
  crypto: itemPortfolioSummaryType;
  commodity: itemPortfolioSummaryType;
  pie: {
    assets: PieAssets[];
    cash_balance: number;
    total_portfolio: number;
  };
}

interface PieAssets {
  exchange: string;
  id: string;
  logo: string;
  percentage: number;
  ticker: string;
}

interface FilterSorting {
  id: number;
  title: string;
  status: SortingFilter;
}

const BattleHome: React.FC = () => {
  const router = useRouter();
  const id = router.query.id;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [detailTournament, setDetailTournament] = useState<ArenaBattleI>();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [isDetailModal, setIsDetailModal] = useState<boolean>(false);

  const [assets, setAssets] = useState<AssetItemType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filter, setFilter] = useState({
    search: searchQuery,
    limit: 5,
    page: 1,
    type: 'ALL',
    currency: '',
    sort_by: ''
  });

  const [portfolio, setPortfolio] = useState<IPortfolioSummary | null>(null);
  const [ballance, setBallance] = useState<BallanceTournament>({
    balance: 0,
    portfolio: 0,
    total_sell: 0,
    total_buy: 0,
    return_value: 0,
    return_percentage: 0,
    currency: 'IDR'
  });

  const [showFilter, setShowFilter] = useState(false);
  const [assetActiveSort, setAssetActiveSort] = useState(
    SortingFilter.ASCENDING
  );

  const handleShowFilters = (): void => {
    setShowFilter(!showFilter);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(event.target.value);
  };

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

  useEffect(() => {
    fetchData()
      .then()
      .catch(() => {});
  }, []);

  const fetchData = async (): Promise<void> => {
    try {
      const dataInfo = await getUserInfo();
      setUserInfo(dataInfo);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  const getDetail = useCallback(async () => {
    try {
      setLoading(true);
      const resp: ArenaBattleI = await getBattleArena(id as string);
      setDetailTournament(resp);
    } catch (error) {
      toast(`ERROR fetch tournament ${error as string}`);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id !== null && userInfo !== undefined) {
      getDetail();
      void fetchPlayBallance(userInfo.preferredCurrency);
      void fetchPlayPortfolio(userInfo.preferredCurrency);
    }
  }, [id, userInfo]);

  const handleCopyClick = async (): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const textToCopy = `${detailTournament?.play_id}`;
    await navigator.clipboard.writeText(textToCopy).then(() => {
      toast('Play ID copied!');
    });
  };

  const fetchPlayPortfolio = async (currency: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await getBattlePortfolio(id as string, currency);
      setPortfolio(response);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlayBallance = async (currency: string): Promise<void> => {
    try {
      const response = await getBattleBalance(id as string, { currency });
      setBallance(response);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  const fetchDataAssets = async (): Promise<void> => {
    try {
      setIsLoading(true);

      const response = await getMarketList({
        ...filter,
        search: searchQuery,
        sort_by: assetActiveSort,
        type: detailTournament ? detailTournament?.category : ''
      });
      if (response.result === null) {
        setAssets([]);
      } else {
        setAssets(response.marketAssetList);
      }
      setIsLoading(false);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo !== undefined) {
      setFilter(prevState => ({
        ...prevState,
        currency: userInfo?.preferredCurrency ?? 'IDR'
      }));
    }
  }, [userInfo]);

  useEffect(() => {
    if (detailTournament !== undefined && filter.currency !== '') {
      const fetchData = async (): Promise<void> => {
        await fetchDataAssets();
      };

      fetchData().catch(error => {
        toast.error('Error fetching data:', error);
      });
    }
  }, [filter, assetActiveSort, searchQuery, detailTournament]);

  return (
    <>
      {isDetailModal && (
        <ModalDetailBattle
          onClose={() => {
            setIsDetailModal(prev => !prev);
          }}
          playTime={detailTournament?.play_time ?? ''}
          endTime={detailTournament?.end_time ?? ''}
          category={detailTournament?.category ?? ''}
          length={detailTournament?.total_participants ?? 0}
          userInfoCurrency={userInfo?.preferredCurrency ?? ''}
          fixedPrize={detailTournament?.fixed_prize ?? 0}
          fixedPrizePercentages={detailTournament?.prize ?? []}
          tnc={
            (detailTournament?.tnc?.[
              i18n.language === 'id' ? 'id' : 'en'
            ] as string) ?? ''
          }
        />
      )}
      {detailTournament === undefined &&
        loading &&
        isLoading &&
        assets &&
        portfolio === null && <Loading />}
      <div>
        <div className="grid grid-cols-3 text-white mb-5">
          <div
            className="flex justify-start col-span-1 items-center transform scale-100 hover:scale-110 transition-transform duration-300 cursor-pointer"
            onClick={async() => {
              await router.push(`/play/team-battle/${id as string}/stage`);
            }}
          >
            <IoArrowBack size={30} />
          </div>
          <div className="text-center font-semibold text-lg sm:text-xl lg:text-2xl col-span-1 font-poppins">
            {t('teamBattle.battleCompetition')}
          </div>
          <div className="col-span-1" />
        </div>
        <div className="flex flex-col justify-center items-center rounded-xl font-poppins p-5 bg-white">
          <div className="flex justify-start w-full gap-2">
            {detailTournament !== undefined ? (
              <>
                <Typography className="text-xl font-semibold">
                  {detailTournament?.name ?? 'Tournament'}
                </Typography>
                <Image
                  onClick={() => {
                    setIsDetailModal(true);
                  }}
                  alt=""
                  src={IconWarning}
                  className="w-[20px] cursor-pointer"
                />
              </>
            ) : (
              <div className="bg-gray-300 animate-pulse h-[20px] w-[200px] rounded-full" />
            )}
          </div>
          <div className="text-[14px] flex justify-start items-center gap-2 py-2 w-full">
            {detailTournament !== undefined ? (
              <>
                <Typography className="font-poppins">
                  Play ID : {detailTournament?.play_id ?? '...'}
                </Typography>
                <button onClick={handleCopyClick}>
                  <Image alt="" src={IconCopy} className="w-[20px]" />
                </button>
              </>
            ) : (
              <div className="bg-gray-300 animate-pulse h-[20px] w-[160px] rounded-full" />
            )}
          </div>
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
                {standartCurrency(ballance?.return_value ?? 0).replace(
                  'Rp',
                  ''
                )}
                {` (${ballance?.return_value < 0 ? '' : '+'}${(
                  ballance?.return_percentage ?? 0
                ).toFixed(2)}%)`}
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
            <div className="w-full xl:w-3/4 flex justify-center items-center gap-8 bg-white absolute p-4 bottom-[-45px] m-auto left-0 right-0 rounded-xl shadow-lg">
              <div
                onClick={async () =>
                  await router.push(
                    `/play/team-battle/${id as string}/portfolio`
                  )
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
                  await router.push(
                    `/play/team-battle/${id as string}/virtual-balance`
                  )
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
                  await router.push(
                    `/play/team-battle/${id as string}/watchlist`
                  )
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
          <div className="mt-16 w-full">
            <div className="flex flex-col w-full justify-center items-center">
              <div className="text-lg font-semibold">
                {t('tournament.detailRemaining')}
              </div>
              {detailTournament?.end_time !== undefined ? (
                <CountdownTimer
                  className="text-md text-[#FDBA22] font-semibold mt-2 font-poppins"
                  deadline={
                    detailTournament?.end_time
                      ? detailTournament.end_time.toString()
                      : ''
                  }
                />
              ) : (
                <Typography className="text-lg text-[#FDBA22] mt-2 font-semibold font-poppins">
                  Loading...
                </Typography>
              )}
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#E9E9E9] from-70% to-white w-full flex justify-between items-center relative mt-4 cursor-pointer rounded-xl p-4">
            <Image
              width={100}
              height={100}
              alt=""
              src={IconSeeds}
              className="w-[60px] md:w-[80px] xl:ml-8"
            />
            <div
              onClick={async () =>
                await router.push(
                  `/play/team-battle/${id as string}/leaderboard?stage=${
                    detailTournament?.status as string
                  }`
                )
              }
              className="w-full lg:flex lg:justify-between ml-2"
            >
              <div className="flex flex-col justify-center items-start text-sm lg:text-lg">
                <div>{t('tournament.leaderboardBanner1')}</div>
                <div className="flex gap-2">
                  <div>{t('tournament.leaderboardBanner2')}</div>
                  <div className="text-[#3AC4A0] font-semibold cursor-pointer">
                    {t('tournament.leaderboardBanner4')}
                  </div>
                </div>
              </div>
              <div className="bg-[#3AC4A0] text-white flex justify-center items-center w- lg:w-[300px] lg:text-lg text-xs rounded-full px-4 py-1 mt-2 xl:mr-8">
                {t('tournament.leaderboardBanner3')}
              </div>
            </div>
          </div>

          <div className="w-full mt-4 relative">
            <FloatingButtonBattle id={id as string} />
            <Typography className="text-xl font-semibold text-[#3AC4A0]">
              {t('tournament.asset.tournamentAsset')}
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
                <div className="flex flex-row items-center gap-3 max-w-full overflow-x-auto no-scroll">
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
            )}

            {assets !== null ? (
              <>
                {assets?.map((data, index) => (
                  <div
                    key={index}
                    onClick={async () =>
                      await router.push(
                        `/play/team-battle/${id as string}/${data?.id}`
                      )
                    }
                    className="flex justify-between items-center p-4 mt-4 cursor-pointer bg-white hover:bg-[#F7F7F7] duration-300 rounded-lg"
                  >
                    <div className="flex gap-4 text-sm md:text-base">
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
                        <div className="text-[#7C7C7C] text-xs md:text-base">
                          {data?.name}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-end items-end">
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
                            data?.priceBar?.close >= data?.priceBar?.open
                              ? Bullish
                              : Bearish
                          }
                          className="w-[20px]"
                        />
                        <div
                          className={`${
                            data?.priceBar?.close >= data?.priceBar?.open
                              ? 'text-[#3AC4A0]'
                              : 'text-[#DD2525]'
                          } text-sm md:text-base`}
                        >
                          {`(${calculatePercentageChange(
                            data?.priceBar?.open,
                            data?.priceBar?.close
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
            )}
            <div
              className="w-full flex justify-center items-center mt-4"
              onClick={async () =>
                await router.push(
                  `/play/team-battle/${id as string}/asset-list`
                )
              }
            >
              <div className="bg-seeds-button-green w-[150px] p-2 rounded-full flex justify-center items-center hover:shadow-lg duration-300 cursor-pointer">
                <Typography className="text-lg text-white cursor-pointer">
                  {t('tournament.asset.seeAll')}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(BattleHome);
