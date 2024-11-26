import IconClock from '@/assets/play/tournament/clock.svg';
import IconFee from '@/assets/play/tournament/fee.svg';
import IconNoData from '@/assets/play/tournament/noData.svg';
import IconShare from '@/assets/play/tournament/share.svg';
import IconUsers from '@/assets/play/tournament/users.svg';
import ModalShareTournament from '@/components/popup/ModalShareTournament';
import { standartCurrency } from '@/helpers/currency';
import { getTournamentTime } from '@/helpers/dateFormat';
import { useGetDetailTournament } from '@/helpers/useGetDetailTournament';
import { getPlayAll, getPlayResult } from '@/repository/play.repository';
import { getUserInfo } from '@/repository/profile.repository';
import LanguageContext from '@/store/language/language-context';
import { type IDetailTournament } from '@/utils/interfaces/tournament.interface';
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { Button, Typography } from '@material-tailwind/react';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export interface UserInfo {
  preferredCurrency: string;
  seedsTag: string;
  id: string;
  avatar: string;
  name: string;
}
interface PlayResult {
  name: string;
  avatar_url: string;
  asset: number;
  gain: number;
  rank: number;
  medal: string;
  prize: number;
}

const NotificationWinner: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const languageCtx = useContext(LanguageContext);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isShareModal, setIsShareModal] = useState<boolean>(false);
  const [sharedIndex, setSharedIndex] = useState<number>(0);
  const [dataResult, setDataResult] = useState<PlayResult>({
    name: '',
    avatar_url: '',
    asset: 0,
    gain: 0,
    rank: 10,
    medal: '',
    prize: 0
  });
  const [tournamentParams, setTournamentParams] = useState({
    search: '',
    status: '',
    limit: 3,
    page: 1,
    sort_by: '',
    totalPage: 2
  });
  const [data, setData] = useState<IDetailTournament[]>([]);

  const id = router.query.id;
  useGetDetailTournament(id as string);

  const fetchData = async (): Promise<void> => {
    try {
      const dataInfo = await getUserInfo();
      setUserInfo(dataInfo);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  const getListPlay = async (): Promise<void> => {
    try {
      setTournamentParams({
        search: '',
        status: '',
        limit: 3,
        page: 1,
        sort_by: '',
        totalPage: 2
      });
      const response = await getPlayAll({
        ...tournamentParams,
        search: '',
        status: 'ACTIVE'
      });
      if (response.playList === null) {
        setData([]);
      } else {
        setData(response.playList);
      }
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  useEffect(() => {
    void fetchDataResult();
    void fetchData();
    void getListPlay();
  }, [id]);

  const fetchDataResult = async (): Promise<void> => {
    try {
      const result = await getPlayResult(id as string);
      setDataResult(result.data);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  const calculateDaysLeft = (startTime: Date, endTime: Date): number => {
    const daysDiff = moment(endTime).diff(moment(startTime), 'days');
    return daysDiff;
  };

  const handleArrow = (value: number): boolean => {
    if (value > 0) {
      return true;
    } else {
      return false;
    }
  };

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
      }
    } else if (status === 'ACTIVE' || status === 'CREATED') {
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
      } else {
        return true;
      }
    } else {
      if (status === 'ACTIVE' || status === 'CREATED') {
        return false;
      } else if (status === 'PAST') {
        return true;
      } else {
        return true;
      }
    }
  };

  return (
    <>
      {isShareModal && (
        <ModalShareTournament
          onClose={() => {
            setIsShareModal(prev => !prev);
          }}
          url={data[sharedIndex]?.id ?? ''}
          playId={data[sharedIndex]?.play_id ?? ''}
        />
      )}
      <div
        className="pt-32 px-4 h-full md:h-auto w-full md:p-5 flex flex-col items-center md:relative absolute bottom-0 m-0 rounded-b-none md:rounded-2xl min-w-full"
        style={{
          backgroundImage: "url('/assets/quiz/bgwinnertournament.png')",
          backgroundSize: 'cover'
        }}
      >
        <div className="flex flex-col items-center md:gap-5 gap-4 p-0 h-full w-full">
          <div className="flex flex-col items-center h-full w-full">
            <Typography className="font-poppins font-semibold text-2xl text-center text-wrap text-[#262626]">
              {dataResult.prize > 0
                ? 'Congrats you won'
                : 'Aw nice try! You only '}
              <br />
              {dataResult.prize > 0
                ? 'the Tournaments!'
                : `ranked ${dataResult?.rank}th`}
            </Typography>
            <div className="w-full flex flex-col items-center justify-center p-4">
              {dataResult.prize > 0 && (
                <Image
                  width={78}
                  height={78}
                  src="/assets/quiz/crown-duotone.png"
                  alt="crown"
                />
              )}
              <Image
                width={162}
                height={162}
                style={{
                  objectFit: 'contain'
                }}
                src={userInfo?.avatar ?? '/placeholder-avatar.png'}
                className={`rounded-full mb-4 w-[162px] h-[162px] border-4 ${
                  dataResult.prize > 0 ? 'border-[#3AC4A0]' : 'border-[#FDBA22]'
                } `}
                alt="profile"
              />
              <div
                className={`z-10 w-8 h-8 mt-[-3%] relative mx-auto rounded-full flex text-md text-white text-center justify-center items-center ${
                  dataResult?.prize > 0 ? 'bg-[#3AC4A0]' : 'bg-[#FDBA22]'
                }`}
              >
                {dataResult?.rank}
              </div>
              <Typography className="font-poppins font-semibold text-lg text-[#262626]">
                {userInfo?.name ?? '/loading'}
              </Typography>
              <Typography className="font-poppins text-lg text-[#262626] mb-4">
                {userInfo?.preferredCurrency ?? 'IDR'}
                {standartCurrency(dataResult?.asset ?? 0).replace('Rp', '')}
              </Typography>
              <Typography
                className={`flex font-normal text-sm ${
                  handleArrow(dataResult?.gain)
                    ? 'text-[#3AC4A0]'
                    : 'text-red-500'
                }`}
              >
                {handleArrow(dataResult?.gain) ? (
                  <ArrowTrendingUpIcon
                    height={20}
                    width={20}
                    className="mr-2"
                  />
                ) : (
                  <ArrowTrendingDownIcon
                    height={20}
                    width={20}
                    className="mr-2"
                  />
                )}
                {dataResult?.gain}
              </Typography>
            </div>
            {dataResult.prize > 0 && (
              <Typography className="font-poppins font-semibold text-lg text-[#262626] mb-4">
                {t('quiz.earn')} {dataResult?.prize}
              </Typography>
            )}
            <Typography className="font-poppins text-lg text-[#262626] mb-4 text-justify px-8 text-center">
              {dataResult.prize > 0
                ? t('quiz.tax')
                : "Don't give up! Let's boost your investing knowledge from the experts"}
            </Typography>
            <div className="w-3/4 md:w-2/3 gap-4 flex flex-col py-4">
              <button
                onClick={() => {
                  const destination =
                    dataResult.prize > 0
                      ? `/play/tournament/${id as string}/withdrawal`
                      : `/play`;
                  router.push(destination).catch(err => {
                    toast.error(`Error fetching data: ${err as string}`);
                  });
                }}
                className={`bg-[#3AC4A0] relative flex items-center justify-center w-full h-14 rounded-full shadow-sm hover:opacity-90`}
              >
                <div className="z-10 text-center text-xl font-semibold text-white">
                  {dataResult.prize > 0 ? 'Cashout Reward' : 'Go to Play Arena'}
                </div>
              </button>
              <button
                onClick={() => {
                  router
                    .push(`/play/tournament/${id as string}/leaderboard`)
                    .catch(err => {
                      toast.error(`Error ${err as string}`);
                    });
                }}
                className={`bg-white relative flex items-center justify-center border-2 border-[#3AC4A0] w-full h-14 rounded-full shadow-sm shadow-gray-600 drop-shadow-sm hover:opacity-90`}
              >
                <div className="z-10 text-center text-xl font-semibold text-[#3AC4A0]">
                  {t('quiz.leaderboard')}
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-20 md:mt-0">
          <div className="flex justify-between my-4">
            <Typography className="font-poppins text-lg font-semibold text-[#262626] ">
              Suggested Play Arenas
            </Typography>
            <button
              className="text-sm font-poppins font-normal text-[#3AC4A0]"
              onClick={async () => await router.push('/play')}
            >
              See All
            </button>
          </div>
          <Typography className="font-poppins text-sm font-normal text-[#7C7C7C] ">
            Join various play arena to win attractive cash rewards 💰
          </Typography>
          {data?.length !== 0 ? (
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-4 xl:mt-8 mb-4 font-poppins">
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
                      onClick={async () => {
                        await handleRedirectPage(
                          item?.id,
                          item?.is_joined,
                          item?.status
                        );
                      }}
                      className="w-full rounded-xl overflow-hidden cursor-pointer"
                    >
                      <div
                        onClick={async () => {
                          await handleRedirectPage(
                            item?.id,
                            item?.is_joined,
                            item?.status
                          );
                        }}
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
                      onClick={async () => {
                        await handleRedirectPage(
                          item?.id,
                          item?.is_joined,
                          item?.status
                        );
                      }}
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
                            <div>{t('tournament.tournamentCard.duration')}</div>
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
                            <div>{t('tournament.tournamentCard.joined')}</div>
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
                            className="w-[14px] xl:w-[12px] 2xl:text-[14px] mb-2 mr-1"
                          />
                          <div className="flex flex-col xl:text-[8px] 2xl:text-[12px]">
                            <div>{t('tournament.tournamentCard.fee')}</div>
                            <div className="font-semibold text-black">
                              {item.admission_fee === 0
                                ? t('quiz.free')
                                : `${
                                    userInfo?.preferredCurrency !== undefined
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
                            setIsShareModal(true);
                            setSharedIndex(index);
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
                        onClick={async () => {
                          await handleRedirectPage(
                            item?.id,
                            item?.is_joined,
                            item?.status
                          );
                        }}
                        disabled={isDisabled(item?.is_joined, item?.status)}
                        className="flex justify-center items-center cursor-pointer text-[10px] xl:text-[9px] h-[10px] font-semibold bg-[#3AC4A0] text-white px-4 md:px-4 xl:px-2 2xl:px-4 rounded-full hover:shadow-lg duration-300"
                      >
                        {item?.is_joined
                          ? item?.status === 'ACTIVE'
                            ? t('tournament.tournamentCard.openButton')
                            : item?.status === 'PAST'
                            ? t('tournament.tournamentCard.leaderboard')
                            : t('tournament.tournamentCard.canceled')
                          : item?.status === 'ACTIVE' ||
                            item?.status === 'CREATED'
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
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationWinner;
