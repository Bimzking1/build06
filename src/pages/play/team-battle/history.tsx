import ArtPagination from '@/components/ArtPagination';
import Loading from '@/components/popup/Loading';
import HistoryNotFound from '@/components/team-battle/historynotfound.component';
import PopupInformation from '@/components/team-battle/popupInformation.component';
import withAuth from '@/helpers/withAuth';
import { getBattleList } from '@/repository/team-battle.repository';
import i18n from '@/utils/common/i18n';
import {
  type TeamBattleDetail,
  type TeamBattleListRes
} from '@/utils/interfaces/team-battle.interface';
import { Button } from '@material-tailwind/react';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CiSquareChevDown, CiSquareChevUp } from 'react-icons/ci';
import { IoArrowBack } from 'react-icons/io5';
import { toast } from 'react-toastify';

const HistoryBattle: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('MY_ACTIVE');
  const [activeBattleId, setActiveBattleId] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );
  const [infoBattle, setInfoBattle] = useState<TeamBattleDetail>();
  const router = useRouter();
  const categoryBattle = [
    { label: t('teamBattle.history.activeBattle'), key: 'MY_ACTIVE' },
    { label: t('teamBattle.history.pastBattle'), key: 'MY_PAST' }
  ];
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBattle, setSelectedBattle] = useState<{
    id: string;
    is_joined: boolean;
  }>({ id: '', is_joined: false });
  const [selectedBattleStartTime, setSelectedBattleStartTime] =
    useState<string>('2024-12-31T17:00:00Z');
  const [isSelectedBattleStarted, setIsSelectedBattleStarted] =
    useState<boolean>(false);

  const [listParams, setListParams] = useState({
    page: 1,
    limit: 9,
    category: '',
    status: '',
    search: '',
    type: '',
    play_status: 'MY_ACTIVE'
  });

  const [teamBattleList, setTeamBattleList] =
    useState<TeamBattleListRes | null>(null);

  const FetchBattleList = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await getBattleList({
        ...listParams,
        category: ''
      });
      setTeamBattleList(response?.data !== null ? response : null);
    } catch (error) {
      toast.error(`Error fetching Team Battle List: ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void FetchBattleList();
  }, [listParams]);

  useEffect(() => {
    const playTime = selectedBattleStartTime ?? '2024-12-31T17:00:00Z';
    const timeStart = new Date(playTime).getTime();
    const timeNow = Date.now();

    setIsSelectedBattleStarted(timeStart < timeNow);
  }, [selectedBattleStartTime]);

  useEffect(() => {
    setListParams(prev => ({ ...prev, play_status: selectedCategory }));
  }, [selectedCategory]);

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const togglePopup = (): void => {
    setIsPopupVisible(!isPopupVisible);
  };

  const handleMoreInfoClick = (id: string): void => {
    if (windowWidth <= 539) {
      setActiveBattleId(activeBattleId === id ? null : id);
    } else {
      togglePopup();
    }
  };

  const handleResize = (): void => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <div className="px-2 my-5">
        <div className="text-xl text-white flex justify-between items-center">
          <div
            className="flex justify-start items-center transform scale-100 hover:scale-110 transition-transform duration-300 cursor-pointer"
            onClick={async () => {
              await router.push(`/play/team-battle`);
            }}
          >
            <IoArrowBack size={30} />
          </div>
          <div className="flex-1 text-center text-lg sm:text-xl lg:text-2xl col-span-2 lg:col-span-1 font-poppins font-semibold">
            {t('teamBattle.history.myBattle')}
          </div>
        </div>
        <div className="w-full flex justify-center items-center">
          <div className="flex flex-row">
            {categoryBattle?.map((item, i) => {
              return (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedBattle({ id: '', is_joined: false });
                    setSelectedCategory(item.key);
                  }}
                  className={`${
                    item.key === selectedCategory
                      ? 'border-b-4 border-[#65d8c3] text-[#2934B2] font-bold'
                      : 'font-semibold text-white'
                  } py-3 px-5 text-base sm:text-lg lg:text-xl xl:text-2xl mt-10 font-poppins`}
                >
                  <p className="transform scale-100 hover:scale-110 transition-transform duration-300 cursor-pointer">
                    {item.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
        {isLoading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-10">
            {teamBattleList?.data.length != null ? (
              teamBattleList?.data.map((teamBattle, i) => {
                return (
                  <div
                    key={i}
                    className={`rounded-t-3xl cursor-pointer bg-red-50 overflow-hidden w-full flex flex-col justify-center items-center h-fit ${
                      selectedBattle.id === teamBattle?.id
                        ? 'border-[3px] border-white'
                        : ''
                    }`}
                    onClick={() => {
                      if (selectedBattle.id === teamBattle.id) {
                        setSelectedBattle({ id: '', is_joined: false });
                      } else {
                        setSelectedBattle({
                          id: teamBattle.id,
                          is_joined: teamBattle.is_joined
                        });
                        setSelectedBattleStartTime(
                          teamBattle?.registration_end
                        );
                      }
                    }}
                  >
                    <div className="relative w-full h-32 overflow-hidden">
                      <Image
                        src={teamBattle?.banner}
                        alt={teamBattle?.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="absolute top-0 left-0"
                      />
                    </div>
                    <div
                      className={`w-full flex justify-center items-center flex-col bg-gradient-to-r from-[#227e7f] to-[#4760a8] py-5 px-2 ${
                        windowWidth <= 539 && activeBattleId === teamBattle.id
                          ? 'h-auto'
                          : 'min-h-24 max-h-28'
                      }`}
                    >
                      <div className="font-bold text-white text-base lg:text-lg xl:text-xl w-11/12 truncate text-center">
                        {teamBattle.title}
                      </div>
                      <div
                        className="text-white font-semibold flex flex-row items-center gap-1 transform scale-100 hover:scale-110 transition-transform duration-300 cursor-pointer"
                        onClick={() => {
                          setInfoBattle(teamBattle);
                          handleMoreInfoClick(teamBattle.id);
                        }}
                      >
                        <span className="text-xs">
                          {t('teamBattle.history.moreInfo')}
                        </span>
                        {windowWidth <= 539 &&
                        activeBattleId === teamBattle.id ? (
                          <CiSquareChevUp size={15} />
                        ) : (
                          <CiSquareChevDown size={15} />
                        )}
                      </div>
                      {windowWidth <= 539 &&
                        activeBattleId === teamBattle.id && (
                          <div className="py-2 px-5 text-white text-xs mt-2">
                            <div className="py-2 px-5 border-white border-2 rounded-3xl text-white text-xs">
                              {t('teamBattle.mainPage.period')} :{' '}
                              {moment(teamBattle?.registration_start).format(
                                'DD MMM YYYY'
                              )}{' '}
                              -{' '}
                              {moment(teamBattle?.final_end).format(
                                'DD MMM YYYY'
                              )}
                            </div>
                            <div
                              className="text-xs sm:text-sm text-white font-normal py-2 px-4"
                              dangerouslySetInnerHTML={{
                                __html:
                                  teamBattle.tnc?.[
                                    i18n.language === 'id' ? 'id' : 'en'
                                  ]?.replace(/\n/g, '<br />') ?? '-'
                              }}
                            />
                          </div>
                        )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-3">
                <HistoryNotFound
                  text={
                    categoryBattle
                      .find(item => item.key === selectedCategory)
                      ?.label.toLowerCase() ?? ''
                  }
                />
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col">
          <div className="order-1 md:order-2 relative z-0 md:mb-0 mb-20">
            <ArtPagination
              currentPage={listParams?.page ?? 1}
              totalPages={teamBattleList?.metadata?.total_page ?? 1}
              onPageChange={page => {
                setListParams({ ...listParams, page });
              }}
            />
          </div>
          <div
            className={`${
              teamBattleList != null
                ? 'order-2 md:order-1 flex justify-center items-center lg:mt-8 lg:relative fixed z-10 left-0 right-0 bottom-0 bg-transparent py-2 lg:py-0 mx-2'
                : 'hidden'
            }`}
          >
            <Button
              className={`lg:w-[345px] w-full h-[60px] rounded-full border-[2px] border-white text-sm font-semibold font-poppins ${
                selectedBattle.id !== ''
                  ? 'text-white bg-[#2934B2]'
                  : 'text-[#7C7C7C] bg-[#E9E9E9]'
              }`}
              disabled={selectedBattle.id === ''}
              onClick={async () => {
                await router.push(
                  selectedBattle.is_joined
                    ? isSelectedBattleStarted
                      ? `/play/team-battle/${selectedBattle.id ?? ''}/stage`
                      : `/play/team-battle/${selectedBattle.id ?? ''}/waiting`
                    : `/play/team-battle/${selectedBattle.id ?? ''}`
                );
              }}
            >
              OK
            </Button>
          </div>
        </div>
      </div>
      <PopupInformation
        onClose={togglePopup}
        isOpen={isPopupVisible}
        infoBattle={infoBattle}
      />
    </>
  );
};

export default withAuth(HistoryBattle);