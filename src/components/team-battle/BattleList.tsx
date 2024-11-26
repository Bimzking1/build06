import { getBattleList } from '@/repository/team-battle.repository';
import i18n from '@/utils/common/i18n';
import {
  type CategoryBattleItem,
  type TeamBattleListParams,
  type TeamBattleListRes
} from '@/utils/interfaces/team-battle.interface';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { Button, Typography } from '@material-tailwind/react';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import ArrowBackWhite from 'public/assets/team-battle/arrow-back.svg';
import CategoryAll from 'public/assets/team-battle/category-all.svg';
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { CiSquareChevDown, CiSquareChevUp } from 'react-icons/ci';
import { toast } from 'react-toastify';
import ArtPagination from '../ArtPagination';
import Loading from '../popup/Loading';
import ListNotFound from './listnotfound.component';
import PopupInformation from './popupInformation.component';

interface BattleListI {
  classname: string;
  setShow: Dispatch<SetStateAction<boolean>>;
  activeCategory: CategoryBattleItem | null;
  setActiveCategory: Dispatch<SetStateAction<CategoryBattleItem | null>>;
  categoryBattle: CategoryBattleItem[];
  fetchTrigger: boolean;
  setFetchTrigger: Dispatch<SetStateAction<boolean>>;
}

const BattleList: React.FC<BattleListI> = ({
  classname,
  setShow,
  activeCategory,
  setActiveCategory,
  categoryBattle,
  fetchTrigger,
  setFetchTrigger
}: BattleListI) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listParams, setListParams] = useState<TeamBattleListParams>({
    page: 1,
    limit: 9,
    category: '',
    status: '',
    play_status: 'ACTIVE',
    search: '',
    type: ''
  });
  const [teamBattleList, setTeamBattleList] =
    useState<TeamBattleListRes | null>(null);
  const [selectedBattle, setSelectedBattle] = useState<{
    id: string;
    is_joined: boolean;
    registration_end: string;
  }>({ id: '', is_joined: false, registration_end: '' });
  const [toggleInformation, setToggleInformation] = useState<{
    popup: string;
    dropdown: string;
  }>({
    popup: '',
    dropdown: ''
  });

  const handleToggle = (type: 'popup' | 'dropdown', id: string): void => {
    setToggleInformation(prev => ({
      ...prev,
      [type]: prev[type] === id ? '' : id
    }));
  };

  useEffect(() => {
    const handleResize = (): void => {
      if (window.innerWidth >= 1024) {
        setToggleInformation(prev => ({
          ...prev,
          dropdown: ''
        }));
      } else if (window.innerWidth < 1024) {
        setToggleInformation(prev => ({
          ...prev,
          popup: ''
        }));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleCategoryChange = (direction: 'next' | 'previous'): void => {
    const index =
      activeCategory != null
        ? categoryBattle.findIndex(cat => cat.id === activeCategory.id)
        : -1;
    const newIndex =
      direction === 'next'
        ? (index + 1) % categoryBattle.length
        : (index - 1 + categoryBattle.length) % categoryBattle.length;
    setActiveCategory(categoryBattle[newIndex] ?? categoryBattle[0]);
    setSelectedBattle({ id: '', is_joined: false, registration_end: '' });
    setListParams(prev => ({ ...prev, page: 1 }));
  };

  const FetchBattleList = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await getBattleList({
        ...listParams,
        category: activeCategory?.value ?? ''
      });
      setTeamBattleList(response?.data !== null ? response : null);
    } catch (error) {
      toast.error(`Error fetching Team Battle List: ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  const today = moment();

  useEffect(() => {
    if (fetchTrigger) {
      void FetchBattleList();
    }
  }, [activeCategory, fetchTrigger, listParams]);

  return (
    <div className={`w-full h-full py-2 bg-cover ${classname}`}>
      <div className="flex justify-between items-center py-2 px-6">
        <Image
          className="cursor-pointer lg:w-[50px] lg:h-[50px] w-[24px] h-[24px]"
          src={ArrowBackWhite}
          alt="back-button"
          onClick={() => {
            setShow(prev => !prev);
            setFetchTrigger(!fetchTrigger);
          }}
        />
        <Typography className="lg:hidden block flex-1 text-center text-white font-poppins font-semibold text-lg">
          Team Battle
        </Typography>
      </div>
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="flex justify-center items-center gap-4 mt-4">
          {activeCategory !== null && (
            <div
              className="cursor-pointer p-1 bg-white/50 backdrop-blur-sm rounded-lg hover:bg-white/70 duration-300"
              onClick={() => {
                handleCategoryChange('previous');
              }}
            >
              <ChevronLeftIcon width={16} height={24} className="text-white" />
            </div>
          )}
          <div className="lg:bg-transparent bg-white/10 rounded-2xl">
            <Image
              src={activeCategory?.image ?? CategoryAll}
              alt={activeCategory?.title ?? 'Selected Category'}
              className="lg:w-[240px] lg:h-[240px] w-[100px] h-[100px]"
            />
          </div>
          {activeCategory != null && (
            <div
              className="cursor-pointer p-1 bg-white/50 backdrop-blur-sm rounded-lg hover:bg-white/70 duration-300"
              onClick={() => {
                handleCategoryChange('next');
              }}
            >
              <ChevronRightIcon width={16} height={24} className="text-white" />
            </div>
          )}
        </div>
        <div>
          <Typography className="text-white font-poppins text-[27px] font-semibold">
            {activeCategory?.title ?? 'All Category'}
          </Typography>
        </div>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-5 mt-5 lg:mx-0 mx-4">
          {teamBattleList?.data != null ? (
            teamBattleList?.data.map(teamBattle => (
              <div
                key={teamBattle?.id}
                className={`rounded-t-3xl hover:cursor-pointer ${
                  selectedBattle.id === teamBattle?.id
                    ? 'border-[3px] border-white'
                    : ''
                }`}
                onClick={() => {
                  setSelectedBattle({
                    id: teamBattle?.id,
                    is_joined: teamBattle?.is_joined,
                    registration_end: teamBattle?.registration_end
                  });
                }}
              >
                <div className="w-full max-h-36">
                  <Image
                    src={teamBattle?.banner}
                    alt={teamBattle?.title}
                    width={1000}
                    height={500}
                    className="rounded-t-3xl object-cover h-28"
                  />
                </div>
                <div className="w-full flex justify-center items-center flex-col bg-gradient-to-r from-[#227e7f] to-[#4760a8] py-3 px-2 gap-2">
                  <Typography className="font-bold text-white text-sm w-11/12 truncate text-center font-poppins">
                    {teamBattle.title}
                  </Typography>
                  <div className="text-white font-semibold flex flex-row items-center gap-1">
                    <Typography className="text-[10px] font-poppins font-semibold">
                      {t('teamBattle.history.moreInfo')}
                    </Typography>
                    <CiSquareChevDown
                      size={20}
                      className="lg:block hidden cursor-pointer hover:scale-110 transition-transform duration-300"
                      onClick={() => {
                        handleToggle('popup', teamBattle.id);
                      }}
                    />
                    {toggleInformation?.dropdown === teamBattle.id ? (
                      <CiSquareChevUp
                        size={20}
                        className="cursor-pointer hover:scale-110 transition-transform duration-300"
                        onClick={() => {
                          handleToggle('dropdown', teamBattle.id);
                        }}
                      />
                    ) : (
                      <CiSquareChevDown
                        size={20}
                        className="lg:hidden block cursor-pointer hover:scale-110 transition-transform duration-300"
                        onClick={() => {
                          handleToggle('dropdown', teamBattle.id);
                        }}
                      />
                    )}
                  </div>
                  {toggleInformation?.dropdown === teamBattle.id && (
                    <>
                      <div className="py-2 px-5 border-white border-2 rounded-full text-white text-[10px] font-normal font-poppins">
                        {t('teamBattle.mainPage.period')} :{' '}
                        {moment(teamBattle?.registration_start).format(
                          'DD MMM YYYY'
                        )}{' '}
                        - {moment(teamBattle?.final_end).format('DD MMM YYYY')}
                      </div>
                      <div
                        className="text-sm text-white font-normal py-2 px-4"
                        dangerouslySetInnerHTML={{
                          __html:
                            teamBattle.tnc?.[
                              i18n.language === 'id' ? 'id' : 'en'
                            ]?.replace(/\n/g, '<br />') ?? '-'
                        }}
                      />
                    </>
                  )}
                </div>
                <PopupInformation
                  isOpen={toggleInformation?.popup === teamBattle?.id}
                  onClose={() => {
                    handleToggle('popup', teamBattle?.id);
                  }}
                  infoBattle={teamBattle}
                />
              </div>
            ))
          ) : (
            <div className="col-span-3">
              <ListNotFound />
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col">
        <div className="order-1 md:order-2 relative md:mb-0 mb-20 z-0">
          <ArtPagination
            currentPage={listParams?.page ?? 1}
            totalPages={teamBattleList?.metadata?.total_page ?? 1}
            onPageChange={page => {
              setListParams({ ...listParams, page });
            }}
          />
        </div>
        <div className="order-2 md:order-1 flex justify-center items-center lg:mt-8 lg:relative fixed z-10 left-0 right-0 bottom-0 bg-transparent py-2 lg:py-0 mx-2">
          <Button
            className={`lg:w-[345px] w-full h-[60px] rounded-full border-[2px] border-white text-sm font-semibold font-poppins ${
              selectedBattle.id !== ''
                ? 'text-white bg-[#2934B2]'
                : 'text-[#7C7C7C] bg-[#E9E9E9]'
            }`}
            disabled={selectedBattle.id === ''}
            onClick={async () => {
              await router.push(
                `/play/team-battle/${selectedBattle?.id}/${
                  selectedBattle?.is_joined &&
                  today.isAfter(selectedBattle?.registration_end)
                    ? 'stage'
                    : today.isBefore(selectedBattle?.registration_end)
                    ? 'waiting'
                    : ''
                }`
              );
            }}
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BattleList;
