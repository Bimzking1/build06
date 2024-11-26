/* eslint-disable @typescript-eslint/no-confusing-void-expression */
'use-client';
import Circle from '@/assets/play/tournament/circleleaderboard.svg';
import LeaderBoardIcon from '@/assets/play/tournament/leaderBoardIcon.svg';
import IconNoData from '@/assets/play/tournament/noData.svg';
import TournamentPagination from '@/components/TournmentPagination';
import ModalTutorialTournament from '@/components/popup/ModalTutorialTournament';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import withAuth from '@/helpers/withAuth';
import {
  getAllPlayCenter,
  getEventList,
  getPlayLatestList,
  getUserRank
} from '@/repository/play.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Typography } from '@material-tailwind/react';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';
import { toast } from 'react-toastify';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import PlayButton from '../../../public/assets/arena.svg';
import BattleButton from '../../../public/assets/battle.svg';
import QuizButton from '../../../public/assets/quiz.svg';
interface Banner {
  no: number;
  id: string;
  name: string;
  play_center_type: string;
  ended_at: string;
  banner: string;
  is_joined: boolean;
}

interface DetailPlay {
  id: string;
  name: string;
  category: string;
  play_type: string;
  publish_time: string;
  open_registration_time: string;
  play_time: string;
  end_time: string;
  min_participant: number;
  max_participant: number;
  prize_fix_amount: number;
  admission_fee: number;
  status: string;
  banner: string;
  is_joined: true;
  created_at: string;
  updated_at: string;
  joined_participants: number;
  play_center_type: string;
}
interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

interface Metadata {
  currentPage: number;
  limit: number;
  totalPage: number;
  totalRow: number;
}

const PrevArrow = (props: ArrowProps): React.ReactElement => {
  const { className, onClick } = props;
  return (
    <div
      className={`${className as string} absolute z-10`}
      style={{
        left: 10
      }}
      onClick={onClick}
    />
  );
};
const calculateDaysLeft = (startTime: Date, endTime: Date): number => {
  const daysDiff = moment(endTime).diff(moment(startTime), 'days');
  return daysDiff;
};

const NextArrow = (props: ArrowProps): React.ReactElement => {
  const { className, onClick } = props;
  return (
    <div
      className={className}
      style={{ position: 'absolute', right: 10 }}
      onClick={onClick}
    />
  );
};

const Player = (): React.ReactElement => {
  const { t } = useTranslation();
  const router = useRouter();
  const [bannerAsset, setBannerAsset] = useState<Banner[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [data, setData] = useState<DetailPlay[]>([]);
  const [latestMetadata, setLatestMetadata] = useState<Metadata>();
  const [isTutorialModal, setIsTutorialModal] = useState<boolean>(false);
  const [tournamentParams, setTournamentParams] = useState({
    search: '',
    status: '',
    limit: 6,
    page: 1,
    sort_by: '',
    totalPage: 0
  });
  const [userRank, setUserRank] = useState<number>(0);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [listPlay, setListPlay] = useState<DetailPlay[]>([]);

  useEffect(() => {
    if (search.length === 0) {
      setShowSearchResult(false);
    } else {
      setShowSearchResult(true);
    }
  }, [listPlay?.length, search]);

  const getListTournament = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await getAllPlayCenter(
        1,
        10,
        userInfo?.preferredCurrency ?? '',
        search
      );
      if (response.playList === null) {
        setListPlay([]);
      } else {
        setListPlay(response.playList);
      }
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void getListTournament();
    }, 2000);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchBannerAsset = async (): Promise<void> => {
      try {
        const res = await getEventList();
        setBannerAsset(res.playList);
        const resUserRank = await getUserRank(
          userInfo?.preferredCurrency ?? 'season',
          ''
        );
        setUserRank(resUserRank.current_rank);
      } catch (error) {
        toast(`Error fetching trending assets: ${error as string}`);
      }
    };

    void fetchBannerAsset();
  }, []);

  useEffect(() => {
    fetchData()
      .then()
      .catch(() => {});
  }, []);

  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    arrow: true,
    appendDots: (dots: React.ReactNode) => (
      <div>
        <ul className="mb-5"> {dots} </ul>
      </div>
    ),
    beforeChange: (current: number, next: number) => {
      setActiveSlide(next);
    },
    customPaging: (i: number) => (
      <div
        className={`h-2.5 rounded-full ${
          activeSlide === i ? 'bg-[#3ac4a0] w-[18px]' : 'bg-[#E9E9E9] w-2.5'
        }`}
      ></div>
    )
  };

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

  const getListPlay = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await getPlayLatestList({
        ...tournamentParams,
        search
      });

      if (response?.playList === null) {
        setData([]);
      } else {
        setData(response?.playList);
        setLatestMetadata(response?.metadata);
      }
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo !== undefined) {
      const getData = setTimeout(() => {
        void getListPlay();
      }, 500);

      return () => clearTimeout(getData);
    }
  }, [userInfo, tournamentParams]);

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleEnter = () => {
    setShowSearchResult(true);
    const inputElement = document.getElementById('search') as HTMLInputElement;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (inputElement) {
      setSearch(inputElement.value);
    }
  };

  return (
    <PageGradient defaultGradient className="w-full bg-transparent">
      {isTutorialModal && (
        <ModalTutorialTournament
          onClose={() => {
            setIsTutorialModal(prev => !prev);
          }}
        />
      )}
      <div className="w-full h-auto cursor-default bg-white p-5 rounded-2xl">
        <div className="w-full h-auto font-poppins my-4">
          <div className=" bg-gradient-to-r from-[#3AC4A0] from-50% to-[#9CFFE5] py-[24px] w-full h-auto justify-center text-center font-poppins my-4">
            <Typography className="text-center text-xl font-semibold mb-5 text-white font-poppins">
              Play Center
            </Typography>
            <div className="w-full flex justify-center px-4">
              <input
                id="search"
                type="text"
                value={search}
                onChange={e => {
                  handleSearch(e);
                }}
                name="search"
                placeholder={t('playCenter.text6') ?? ''}
                className="block w-full xl:w-1/3 text-[#262626] h-11 leading-4 placeholder:text-[#BDBDBD] focus:outline-0 disabled:bg-[#E9E9E9] p-3 pl-8 rounded-full border border-[#BDBDBD]"
              />
              <button
                onClick={handleEnter}
                className="text-sm text-white bg-[#3AC4A0] ml-2 rounded-full w-[100px] font-semibold hover:shadow-lg duration-300"
              >
                Enter
              </button>
            </div>
          </div>
          {showSearchResult && (
            <div>
              {loading ? (
                <div className="w-full flex justify-center h-fit mt-8">
                  <div className="h-[60px]">
                    <div className="animate-spinner w-16 h-16 border-8 border-gray-200 border-t-seeds-button-green rounded-full" />
                  </div>
                </div>
              ) : (
                <div>
                  {listPlay?.length !== 0 ? (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-4 xl:mt-8">
                      {listPlay?.map(item => (
                        <div
                          key={item.id}
                          onClick={async () =>
                            await router
                              .push(
                                `${
                                  item?.play_center_type === 'play'
                                    ? item?.is_joined
                                      ? `/play/tournament/${item.id}/home`
                                      : `/play/tournament/${item.id}`
                                    : item?.play_center_type === 'battle'
                                    ? item?.is_joined
                                      ? `/play/team-battle/${item.id}/stage`
                                      : `/play/team-battle/${item.id}`
                                    : item?.is_joined
                                    ? `/play/quiz/${item.id}/done`
                                    : `/play/quiz/${item.id}`
                                }`
                              )
                              .catch(error => {
                                toast.error(error);
                              })
                          }
                          className="flex rounded-xl overflow-hidden shadow hover:shadow-lg duration-300"
                        >
                          <div className="w-full bg-white">
                            <div className="w-full rounded-xl overflow-hidden">
                              <div className="border border-[#E9E9E9] w-full h-[150px] flex justify-center items-center mb-2">
                                <Image
                                  alt=""
                                  src={
                                    item.banner !== undefined &&
                                    item.banner !== ''
                                      ? item.banner
                                      : 'https://dev-assets.seeds.finance/storage/cloud/4868a60b-90e3-4b81-b553-084ad85b1893.png'
                                  }
                                  width={100}
                                  height={100}
                                  className="w-auto h-full"
                                />
                              </div>
                              <div className="pl-2 flex justify-between bg-[#3AC4A0] font-poppins">
                                <div>
                                  <div className="text-sm font-semibold text-white">
                                    {item.name}
                                  </div>
                                  <div className="text-white flex gap-2 text-[10px] mt-2">
                                    <div className="mt-1">
                                      {t('playCenter.text4')}
                                    </div>
                                    <div className="font-normal text-white mt-1">
                                      {calculateDaysLeft(
                                        new Date(item?.play_time),
                                        new Date(item?.end_time)
                                      )}{' '}
                                      {t('playCenter.text5')}
                                    </div>
                                    {item.play_center_type === 'quiz' && (
                                      <div className="border border-1 border-white bg-[#3AC4A0] py-1 px-2 rounded-full text-white text-[8px]">
                                        Quiz
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="my-auto items-center">
                                  {item?.is_joined ? (
                                    <div className="flex justify-center my-auto items-center cursor-pointer text-[10px] font-semibold text-[#3AC4A0] bg-white px-4 mx-2 py-1 rounded-full hover:shadow-lg duration-300">
                                      {t(
                                        'tournament.tournamentCard.openButton'
                                      )}
                                    </div>
                                  ) : (
                                    <div className="flex justify-center my-auto items-center cursor-pointer text-[10px] font-semibold text-[#3AC4A0] bg-white px-4 py-1 mx-2 rounded-full hover:shadow-lg duration-300">
                                      {t(
                                        'tournament.tournamentCard.joinButton'
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
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
              )}
            </div>
          )}

          <div className="w-full my-5 h-auto cursor-pointer">
            <Slider {...sliderSettings}>
              {bannerAsset?.map(asset => (
                <div key={asset.id} className="w-full relative">
                  <Image
                    className="object-cover w-full"
                    src={asset.banner}
                    alt={asset.name}
                    width={1000}
                    height={150}
                    onClick={async () => {
                      asset?.play_center_type === 'quiz'
                        ? await router.push(`/play/quiz/${asset.id}`)
                        : await router.push(`/play/tournament/${asset.id}`);
                    }}
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>

      <div className="w-full h-auto cursor-default bg-white p-5 md:mt-4 rounded-2xl">
        <div className="flex flex-col justify-center items-center rounded-xl">
          <Typography className="text-center mb-5 text-xl font-semibold text-[#262626] font-poppins">
            Seeds Play
          </Typography>
          <div className="flex flex-row justify-between sm:gap-4 w-full sm:w-auto">
            <button
              onClick={() => {
                void router.push('/play/quiz');
              }}
              className="flex flex-col items-center text-center"
            >
              <Image
                alt=""
                src={QuizButton}
                className="mb-2 w-28 h-28 sm:w-32 sm:h-32 object-contain"
              />
              <Typography className="text-base sm:text-xl font-normal text-[#262626] font-poppins">
                Seeds Quiz
              </Typography>
            </button>
            <button
              onClick={() => {
                void router.push('/play/tournament');
              }}
              className="flex flex-col items-center text-center"
            >
              <Image
                alt=""
                src={PlayButton}
                className="mb-2 w-28 h-28 sm:w-32 sm:h-32 object-contain"
              />
              <Typography className="text-base sm:text-xl font-normal text-[#262626] font-poppins">
                Play Arena
              </Typography>
            </button>
            <button
              onClick={() => {
                void router.push('/play/team-battle');
              }}
              className="flex flex-col items-center text-center"
            >
              <Image
                alt=""
                src={BattleButton}
                className="mb-2 w-28 h-28 sm:w-32 sm:h-32 object-contain"
              />
              <Typography className="text-base sm:text-xl font-normal text-[#262626] font-poppins">
                Team Battle
              </Typography>
            </button>
          </div>
        </div>
      </div>

      <div className="w-full h-auto cursor-default bg-white p-5 rounded-2xl md:mt-4">
        <div className="rounded-xl my-3">
          <div
            className="flex justify-between cursor-pointer bg-gradient-to-r from-[#7B51FF] to-[#B7A6EB] p-4 rounded-lg mt-4 relative overflow-hidden"
            onClick={() => {
              void router.push('/play/leaderboard');
            }}
          >
            <div className="flex gap-3">
              <div>
                <Image alt="" src={LeaderBoardIcon} />
              </div>
              <div className="my-auto">
                <p className="text-sm md:text-2xl text-white font-semibold z-50">
                  {t('playCenter.text2')}
                </p>
                <p className="text-sm font-normal md:text-lg text-white my-2 z-50">
                  {t('playCenter.text3')}
                </p>
              </div>
            </div>
            <div className="flex gap-4 ">
              <div className="relative my-auto z-50">
                <p className="text-sm md:text-xl text-white font-semibold z-100">
                  #{userRank ?? '-'}
                </p>
                <p className="text-sm md:text-base text-white font-normal z-100">
                  place
                </p>
              </div>
              <div className="relative z-50 items-center justify-center my-auto">
                <svg
                  width="7"
                  height="12"
                  viewBox="0 0 7 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.310022 0.824249C0.217319 0.916763 0.143771 1.02665 0.0935898 1.14763C0.0434083 1.2686 0.0175781 1.39828 0.0175781 1.52925C0.0175781 1.66022 0.0434083 1.7899 0.0935898 1.91087C0.143771 2.03185 0.217319 2.14174 0.310022 2.23425L4.19002 6.11425L0.310022 9.99425C0.123045 10.1812 0.0180016 10.4348 0.0180016 10.6992C0.0180016 10.9637 0.123045 11.2173 0.310022 11.4043C0.497 11.5912 0.750596 11.6963 1.01502 11.6963C1.27945 11.6963 1.53304 11.5912 1.72002 11.4043L6.31002 6.81425C6.40273 6.72174 6.47627 6.61185 6.52645 6.49087C6.57664 6.3699 6.60247 6.24022 6.60247 6.10925C6.60247 5.97828 6.57664 5.8486 6.52645 5.72762C6.47627 5.60665 6.40273 5.49676 6.31002 5.40425L1.72002 0.814249C1.34002 0.434249 0.700022 0.434249 0.310022 0.824249Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
            <Image
              alt=""
              src={Circle}
              className="hidden md:block absolute right-[-18px] top-[-8px] w-[165px] z-10"
            />
          </div>
          <p className="text-base mt-4 text-[#262626] font-semibold z-50">
            {t('playCenter.text1')}
          </p>
          {!loading ? (
            data?.length !== 0 ? (
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                {data?.map(item => (
                  <div
                    key={item.id}
                    onClick={async () =>
                      await router
                        .push(
                          `${
                            item?.play_center_type === 'play'
                              ? item?.is_joined
                                ? `/play/tournament/${item.id}/home`
                                : `/play/tournament/${item.id}`
                              : item?.play_center_type === 'battle'
                              ? item?.is_joined
                                ? `/play/team-battle/${item.id}/stage`
                                : `/play/team-battle/${item.id}`
                              : item?.is_joined
                              ? `/play/quiz/${item.id}/done`
                              : `/play/quiz/${item.id}`
                          }`
                        )
                        .catch(error => {
                          toast.error(error);
                        })
                    }
                    className="flex rounded-xl overflow-hidden shadow hover:shadow-lg duration-300"
                  >
                    <div className="w-full rounded-xl">
                      <div className="border border-[#E9E9E9] w-full h-[150px] flex justify-center items-center oveflow-hidden cursor-pointer">
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
                      <div className="w-full h-full bg-seeds-button-green">
                        <div className="p-2 gap-2 w-full flex flex-col justify-between font-poppins bg-seeds-button-green">
                          <div className="text-sm font-semibold text-white">
                            {item.name}
                          </div>
                          <div className="w-full flex justify-between items-center">
                            <div className="text-white flex justify-start items-center gap-2 text-[10px]">
                              <div>{t('playCenter.text4')}</div>
                              <div className="font-normal text-white">
                                {calculateDaysLeft(
                                  new Date(item?.play_time),
                                  new Date(item?.end_time)
                                )}{' '}
                                {t('playCenter.text5')}
                              </div>
                              {item.play_center_type === 'quiz' && (
                                <div className="border border-1 border-white bg-[#3AC4A0] py-1 px-2 rounded-full text-white text-[8px]">
                                  Quiz
                                </div>
                              )}
                            </div>
                            <div className="w-[100px] flex justify-end items-end">
                              {item?.play_center_type === 'quiz' && (
                                <button
                                  onClick={() => {
                                    if (item.is_joined) {
                                      // TODO: navigate to quiz score page
                                      router
                                        .push(`/play/quiz/${item.id}/done`)
                                        .catch(error => {
                                          toast.error(`${error as string}`);
                                        });
                                    } else {
                                      router
                                        .push(`/play/quiz/${item.id}`)
                                        .catch(error => {
                                          toast.error(`${error as string}`);
                                        });
                                    }
                                  }}
                                  className="w-full flex justify-center items-center cursor-pointer text-[10px] font-semibold text-[#3AC4A0] bg-white px-4 py-1 rounded-full hover:shadow-lg duration-300"
                                >
                                  {item.is_joined
                                    ? t('quiz.leaderboard')
                                    : t('quiz.play')}
                                </button>
                              )}
                              {item?.play_center_type === 'play' && (
                                <div>
                                  <div className="w-full flex justify-center items-center cursor-pointer text-[10px] font-semibold text-[#3AC4A0] bg-white px-4 py-1 rounded-full hover:shadow-lg duration-300">
                                    {item?.is_joined
                                      ? t(
                                          'tournament.tournamentCard.openButton'
                                        )
                                      : t(
                                          'tournament.tournamentCard.joinButton'
                                        )}
                                  </div>
                                </div>
                              )}
                              {item?.play_center_type === 'battle' && (
                                <div>
                                  <div className="w-full flex justify-center items-center cursor-pointer text-[10px] font-semibold text-[#3AC4A0] bg-white px-4 py-1 rounded-full hover:shadow-lg duration-300">
                                    {item?.is_joined
                                      ? t(
                                          'tournament.tournamentCard.openButton'
                                        )
                                      : t(
                                          'tournament.tournamentCard.joinButton'
                                        )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
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
          {data?.length > 6 && (
            <div className="flex justify-center mx-auto my-8">
              <TournamentPagination
                currentPage={tournamentParams.page}
                totalPages={latestMetadata?.totalPage ?? 0}
                onPageChange={page => {
                  setTournamentParams({ ...tournamentParams, page });
                }}
              />
            </div>
          )}
        </div>
      </div>
    </PageGradient>
  );
};

export default withAuth(Player);
