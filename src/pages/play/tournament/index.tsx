/* eslint-disable @typescript-eslint/no-confusing-void-expression */
'use-client';
import IconClock from '@/assets/play/tournament/clock.svg';
import IconFee from '@/assets/play/tournament/fee.svg';
import IconNoData from '@/assets/play/tournament/noData.svg';
import IconShare from '@/assets/play/tournament/share.svg';
import TutorialIcon from '@/assets/play/tournament/tutorialPicture.svg';
import IconUsers from '@/assets/play/tournament/users.svg';
import TournamentPagination from '@/components/TournmentPagination';
import ModalShareTournament from '@/components/popup/ModalShareTournament';
import ModalTutorialTournament from '@/components/popup/ModalTutorialTournament';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import { standartCurrency } from '@/helpers/currency';
import { getTournamentTime } from '@/helpers/dateFormat';
import { isGuest } from '@/helpers/guest';
import withAuth from '@/helpers/withAuth';
import { getPlayAll } from '@/repository/play.repository';
import { getUserInfo } from '@/repository/profile.repository';
import LanguageContext from '@/store/language/language-context';
import {
  TournamentStatus,
  type IDetailTournament,
  type UserInfo
} from '@/utils/interfaces/tournament.interface';
import { Button, Typography } from '@material-tailwind/react';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface StatusTournament {
  id: number;
  status: TournamentStatus;
  title: string;
}

interface Metadata {
  currentPage: number;
  limit: number;
  totalPage: number;
  totalRow: number;
}

const PlayTournament = (): React.ReactElement => {
  const { t } = useTranslation();
  const router = useRouter();
  const [tournamentActiveTab, setTournamentActiveTab] = useState(
    TournamentStatus.ACTIVE
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshSearch, setRefreshSearch] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [data, setData] = useState<IDetailTournament[]>([]);
  const [metadata, setMetadata] = useState<Metadata>();
  const [isTutorialModal, setIsTutorialModal] = useState<boolean>(false);
  const [isShareModal, setIsShareModal] = useState<boolean>(false);
  const [sharedIndex, setSharedIndex] = useState<number>(0);
  const languageCtx = useContext(LanguageContext);

  const [tournamentParams, setTournamentParams] = useState({
    search: '',
    status: '',
    limit: 6,
    page: 1,
    sort_by: '',
    totalPage: 0
  });

  const [userInfo, setUserInfo] = useState<UserInfo>();

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
      toast(`Error fetching data: ${error as string}`);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(event.target.value);
  };

  const calculateDaysLeft = (startTime: Date, endTime: Date): number => {
    const daysDiff = moment(endTime).diff(moment(startTime), 'days');
    return daysDiff;
  };

  const getListPlay = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await getPlayAll({
        ...tournamentParams,
        search,
        status: tournamentActiveTab
      });
      if (response.playList === null) {
        setData([]);
      } else {
        setData(response?.playList);
        setMetadata(response?.metadata);
      }
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTournamentParams({ ...tournamentParams, page: 1 });
  }, [tournamentActiveTab]);

  useEffect(() => {
    if (userInfo !== undefined) {
      const getData = setTimeout(() => {
        void getListPlay();
      }, 2000);

      return () => clearTimeout(getData);
    }
  }, [userInfo, search, refreshSearch, tournamentActiveTab, tournamentParams]);

  const statusTournament: StatusTournament[] = [
    {
      id: 0,
      status: TournamentStatus.MYPLAY,
      title: t('tournament.myPlay')
    },
    {
      id: 1,
      status: TournamentStatus.OPEN,
      title: t('tournament.open')
    },
    {
      id: 2,
      status: TournamentStatus.ACTIVE,
      title: t('tournament.active')
    },
    {
      id: 3,
      status: TournamentStatus.PAST,
      title: t('tournament.ended')
    }
  ];

  const handleRedirectPage = async (
    id: string,
    isJoined: boolean,
    status: string
  ): Promise<void> => {
    if (isJoined) {
      if (status === 'ACTIVE') {
        await router.push(`/play/tournament/${id}/home`).catch(error => {
          toast.error(error);
        });
      } else if (status === 'PAST') {
        await router
          .push(`/play/tournament/${id}/notification`)
          .catch(error => {
            toast.error(error);
          });
      } else if (status === 'OPEN') {
        await router.push(`/play/tournament/${id}`).catch(error => {
          toast.error(error);
        });
      }
    } else if (status === 'ACTIVE' || status === 'OPEN') {
      await router.push(`/play/tournament/${id}`).catch(error => {
        toast.error(error);
      });
    }
  };

  const isDisabled = (isJoined: boolean, status: string): boolean => {
    if (isJoined) {
      if (status === 'ACTIVE') {
        return false;
      } else if (status === 'PAST') {
        return false;
      } else if (status === 'OPEN') {
        return false;
      } else {
        return true;
      }
    } else {
      if (status === 'ACTIVE' || status === 'OPEN') {
        return false;
      } else if (status === 'PAST') {
        return true;
      } else {
        return true;
      }
    }
  };

  return (
    <PageGradient defaultGradient className="w-full">
      {isTutorialModal && (
        <ModalTutorialTournament
          onClose={() => {
            setIsTutorialModal(prev => !prev);
          }}
        />
      )}
      {isShareModal && (
        <ModalShareTournament
          onClose={() => {
            setIsShareModal(prev => !prev);
          }}
          url={data[sharedIndex]?.id ?? ''}
          playId={data[sharedIndex]?.play_id ?? ''}
        />
      )}
      <div className="w-full h-auto cursor-default bg-white p-5 rounded-2xl">
        <div className="bg-white w-full h-auto font-poppins my-4">
          <div className="w-full h-auto justify-center text-center font-poppins my-4">
            <div className="w-full flex justify-center">
              <input
                id="search"
                type="text"
                value={search}
                onChange={e => {
                  handleSearch(e);
                }}
                name="search"
                placeholder={t('playCenter.text6') ?? 'Search'}
                className="block w-full xl:w-1/3 text-[#262626] h-11 leading-4 placeholder:text-[#BDBDBD] focus:outline-0 disabled:bg-[#E9E9E9] p-3 pl-8 rounded-full border border-[#BDBDBD]"
              />
              <button
                onClick={() => setRefreshSearch(!refreshSearch)}
                className="text-sm text-white bg-[#3AC4A0] ml-2 rounded-full w-[100px] font-semibold hover:shadow-lg duration-300"
              >
                Enter
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg p-0 font-poppins">
            {/* Filter Section */}
            <div className="w-full flex items-center justify-center">
              <div className="flex flex-row items-center gap-2 max-w-full overflow-x-auto no-scroll">
                {statusTournament.map(item => (
                  <button
                    className={`border px-4 py-2 font-poppins rounded-lg text-sm text-nowrap ${
                      item.status === tournamentActiveTab
                        ? 'border-seeds-button-green bg-[#DCFCE4] text-seeds-button-green'
                        : 'border-[#BDBDBD] bg-white text-[#BDBDBD]'
                    }`}
                    key={item.id}
                    onClick={() => {
                      setTournamentActiveTab(item.status);
                    }}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Tutorial Banner */}
            <div className="bg-gradient-to-r from-[#7B51FF] to-[#B7A6EB] p-4 rounded-lg mt-4 relative overflow-hidden">
              <p className="text-sm md:text-xl text-white font-semibold z-50">
                {t('tournament.banner1')}
              </p>
              <p className="text-sm md:text-lg text-white my-2 z-50">
                {t('tournament.banner2')}
              </p>
              <p
                onClick={() => {
                  setIsTutorialModal(true);
                }}
                className="text-sm md:text-lg bg-white text-[#7B51FF] w-fit py-2 px-8 md:px-16 rounded-full text-center font-semibold cursor-pointer z-50"
              >
                {t('tournament.banner3')}
              </p>
              <Image
                alt=""
                src={TutorialIcon}
                className="hidden md:block absolute right-[-18px] top-[-18px] w-[165px] z-30"
              />
            </div>

            {!loading ? (
              data?.length !== 0 ? (
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-4 xl:mt-8 font-poppins">
                  {data.map((item, index) => (
                    <div key={item.id} className="flex rounded-xl">
                      <div className="w-[60px] text-black text-center hidden md:block mt-4">
                        <Typography className="text-black font-normal text-[12px]">
                          {moment(item?.play_time).format('MMM')}
                        </Typography>
                        <Typography className="text-[24px] text-black font-semibold">
                          {moment(item?.play_time).format('DD')}
                        </Typography>
                      </div>

                      <div className="w-full bg-white rounded-xl shadow hover:shadow-lg duration-300">
                        <div
                          onClick={async () =>
                            await handleRedirectPage(
                              item?.id,
                              item?.is_joined,
                              item?.status
                            )
                          }
                          className="w-full rounded-xl overflow-hidden cursor-pointer"
                        >
                          <div
                            onClick={async () =>
                              await handleRedirectPage(
                                item?.id,
                                item?.is_joined,
                                item?.status
                              )
                            }
                            className="border border-[#E9E9E9] w-full h-fit max-h-[150px] flex justify-center items-center mb-2 oveflow-hidden cursor-pointer"
                          >
                            <Image
                              alt=""
                              src={
                                item.banner !== undefined && item.banner !== ''
                                  ? item.banner
                                  : 'https://dev-assets.seeds.finance/storage/cloud/4868a60b-90e3-4b81-b553-084ad85b1893.png'
                              }
                              width={1000}
                              height={1000}
                              className="w-full h-auto max-h-[150px] object-cover"
                            />
                          </div>
                          <div className="px-2 flex justify-between">
                            <div className="text-[14px] font-semibold text-[#262626]">
                              {item.name ?? 'Tournament'}
                            </div>
                            <div className="flex justify-center items-start">
                              <div className="mt-1 text-[10px] bg-[#E9E9E9] text-[#553BB8] px-4 flex justify-center items-center rounded-lg">
                                {item.type ?? 'ARENA'}
                              </div>
                            </div>
                          </div>
                          <div className="text-[#BDBDBD] px-2 text-[10px] 2xl:text-[12px]">
                            {languageCtx?.language === 'ID'
                              ? getTournamentTime(
                                  new Date(
                                    item?.play_time ?? '2024-01-01T00:00:00Z'
                                  ),
                                  new Date(
                                    item?.end_time ?? '2024-01-01T00:00:00Z'
                                  ),
                                  'id-ID'
                                )
                              : getTournamentTime(
                                  new Date(
                                    item?.play_time ?? '2024-01-01T00:00:00Z'
                                  ),
                                  new Date(
                                    item?.end_time ?? '2024-12-31T23:59:59Z'
                                  ),
                                  'en-US'
                                )}
                          </div>
                        </div>

                        <div
                          onClick={async () =>
                            await handleRedirectPage(
                              item?.id,
                              item?.is_joined,
                              item?.status
                            )
                          }
                          className="w-full px-2 cursor-pointer"
                        >
                          <div className="w-full pl-2 flex justify-center items-center text-[10px] bg-[#E9E9E9] rounded-lg py-1 mt-1">
                            <div className="w-full flex items-start">
                              <Image
                                alt=""
                                src={IconClock}
                                className="w-[14px] xl:w-[12px] 2xl:w-[14px] mb-2 mr-1"
                              />
                              <div className="flex flex-col xl:text-[8px] 2xl:text-[12px]">
                                <div>
                                  {t('tournament.tournamentCard.duration')}
                                </div>
                                <div className="font-semibold text-black">
                                  {calculateDaysLeft(
                                    new Date(
                                      item?.play_time ?? '2024-01-01T00:00:00Z'
                                    ),
                                    new Date(
                                      item?.end_time ?? '2024-12-31T23:59:59Z'
                                    )
                                  )}{' '}
                                  {(calculateDaysLeft(
                                    new Date(item?.play_time),
                                    new Date(item?.end_time)
                                  ) ?? 0) > 1
                                    ? t('tournament.tournamentCard.days')
                                    : t('tournament.tournamentCard.day')}
                                </div>
                              </div>
                            </div>
                            <div className="w-full flex items-start">
                              <Image
                                alt=""
                                src={IconUsers}
                                className="w-[14px] xl:w-[12px] 2xl:w-[14px] mb-2 mr-1"
                              />
                              <div className="flex flex-col xl:text-[8px] 2xl:text-[12px]">
                                <div>
                                  {t('tournament.tournamentCard.joined')}
                                </div>
                                <div className="font-semibold text-black">
                                  {item?.participants?.length ?? '0'}{' '}
                                  {(item?.participants?.length ?? 0) > 1
                                    ? t('tournament.tournamentCard.players')
                                    : t('tournament.tournamentCard.player')}
                                </div>
                              </div>
                            </div>
                            <div className="w-full flex items-start">
                              <Image
                                alt=""
                                src={IconFee}
                                className="w-[14px] xl:w-[12px] 2xl:w-[14px] mb-2 mr-1"
                              />
                              <div className="flex flex-col xl:text-[8px] 2xl:text-[12px]">
                                <div>{t('tournament.tournamentCard.fee')}</div>
                                <div className="font-semibold text-black">
                                  {item.admission_fee === 0
                                    ? t('quiz.free')
                                    : `${
                                        userInfo?.preferredCurrency !==
                                        undefined
                                          ? userInfo?.preferredCurrency
                                          : 'IDR'
                                      }${standartCurrency(
                                        item.admission_fee ?? 0
                                      ).replace('Rp', '')}`}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between border-t-2 border-dashed mt-2 py-2 px-2">
                          <div className="flex gap-1">
                            <div className="flex justify-center items-center px-4 xl:px-2 2xl:px-4 text-[10px] bg-[#DCFCE4] text-[#27A590] rounded-lg">
                              {item.category ?? 'ALL'}
                            </div>
                            <button
                              onClick={async () => {
                                if (isGuest()) {
                                  await router.push('/auth');
                                } else {
                                  setIsShareModal(true);
                                  setSharedIndex(index);
                                }
                              }}
                            >
                              <div className="h-full flex justify-center items-center gap-1">
                                <div className="w-full h-full flex justify-center items-center">
                                  <Image
                                    alt=""
                                    src={IconShare}
                                    className="w-[20px]"
                                  />
                                </div>
                                <div className="text-[10px] font-semibold">
                                  {t('tournament.tournamentCard.share')}
                                </div>
                              </div>
                            </button>
                          </div>
                          <Button
                            onClick={async () =>
                              await handleRedirectPage(
                                item?.id,
                                item?.is_joined,
                                item?.status
                              )
                            }
                            disabled={isDisabled(item?.is_joined, item?.status)}
                            className="flex justify-center items-center cursor-pointer text-[10px] xl:text-[9px] h-[10px] font-semibold bg-[#3AC4A0] text-white px-4 md:px-4 xl:px-2 2xl:px-4 rounded-full hover:shadow-lg duration-300"
                          >
                            {item?.is_joined
                              ? item?.status === 'ACTIVE'
                                ? t('tournament.tournamentCard.openButton')
                                : item?.status === 'PAST'
                                ? t('tournament.tournamentCard.leaderboard')
                                : item?.status === 'OPEN'
                                ? t('tournament.tournamentCard.joinedWaiting')
                                : t('tournament.tournamentCard.canceled')
                              : item?.status === 'ACTIVE' ||
                                item?.status === 'OPEN'
                              ? t('tournament.tournamentCard.joinButton')
                              : item?.status === 'CANCELED'
                              ? t('tournament.tournamentCard.canceled')
                              : t('tournament.tournamentCard.ended')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white flex flex-col justify-center items-center text-center lg:px-0">
                  <Image alt="" src={IconNoData} className="w-[250px]" />
                  <p className="font-semibold text-black">
                    {t('tournament.blank1')}
                  </p>
                  <p className="text-[#7C7C7C]">{t('tournament.blank2')}</p>
                </div>
              )
            ) : (
              <div className="w-full flex justify-center h-fit mt-8">
                <div className="h-[60px]">
                  <div className="animate-spinner w-16 h-16 border-8 border-gray-200 border-t-seeds-button-green rounded-full" />
                </div>
              </div>
            )}

            <div className="flex justify-center mx-auto my-8">
              <TournamentPagination
                currentPage={tournamentParams.page}
                totalPages={metadata?.totalPage ?? 0}
                onPageChange={page => {
                  setTournamentParams({ ...tournamentParams, page });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </PageGradient>
  );
};

export default withAuth(PlayTournament);
