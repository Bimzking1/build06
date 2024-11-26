import Loading from '@/components/popup/Loading';
import LeaderboardNotFound from '@/components/team-battle/leaderboard-not-found';
import withAuth from '@/helpers/withAuth';
import {
  getBattleLeaderboard,
  getMyRankBattle
} from '@/repository/team-battle.repository';
import { useAppSelector } from '@/store/redux/store';
import {
  type LeaderboardBattle,
  type Metadata,
  type MyRankBattleI
} from '@/utils/interfaces/team-battle.interface';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaMinus } from 'react-icons/fa';
import { IoArrowBack } from 'react-icons/io5';
import { MdOutlineTrendingDown, MdOutlineTrendingUp } from 'react-icons/md';
import { toast } from 'react-toastify';
interface GainIconI {
  className: string;
  gain: number;
}

const GainIcon: React.FC<GainIconI> = ({ gain, className }) => {
  return (
    <>
      {gain > 0 ? (
        <div className="flex items-center gap-1 justify-center">
          <MdOutlineTrendingUp size={15} className="text-[#5fa9ac]" />
          <span className={className}>{`(${gain?.toFixed(2)}%)`}</span>
        </div>
      ) : gain < 0 ? (
        <div className="flex items-center gap-1 justify-center">
          <MdOutlineTrendingDown size={15} className="text-[#FF4A2B]" />
          <span className={className}>{`(${gain?.toFixed(2)}%)`}</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 justify-center">
          <FaMinus size={10} className="text-[#FFA500]" />
          <span className={className}>{`(${gain?.toFixed(2)}%)`}</span>
        </div>
      )}
    </>
  );
};

const LeaderboardBattlePage: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { stage, id } = router.query;
  const [myRank, setMyRank] = useState<MyRankBattleI | null>(null);
  const [params, setParams] = useState({
    page: 1,
    limit: 9999
  });
  const { dataUser } = useAppSelector(state => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [leaderboardList, setLeaderboardList] = useState<
    LeaderboardBattle[] | null
  >(null);
  const [leaderboardMeta, setLeaderboardMeta] = useState<Metadata>({
    total: 10,
    current_page: 1,
    limit: 10,
    total_page: 1
  });
  const leaderboardRef = useRef<HTMLDivElement | null>(null);
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && leaderboardMeta.total_page > params.page) {
      setParams(prev => ({ ...prev, page: prev.page + 1 }));
    }
  }, []);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (leaderboardRef.current !== null)
      observer.observe(leaderboardRef.current);
  }, [handleObserver]);

  const firstRank = leaderboardList?.find(
    (item: LeaderboardBattle) => item?.rank === 1
  );
  const secondRank = leaderboardList?.find(
    (item: LeaderboardBattle) => item?.rank === 2
  );
  const thirdRank = leaderboardList?.find(
    (item: LeaderboardBattle) => item?.rank === 3
  );
  const remainingRanks = leaderboardList?.filter(
    (item: LeaderboardBattle) => item?.rank > 3
  );
  const myRankFromList = leaderboardList?.find(
    (item: LeaderboardBattle) => item?.user_id === dataUser.id
  );

  const FetchLeaderboardList = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await getBattleLeaderboard(
        id as string,
        stage as string,
        params
      );
      if (params.page === 1) {
        setLeaderboardList(response?.data !== null ? response?.data : null);
        if (response?.data !== null) {
          const responseMyRank = await getMyRankBattle(id as string, {
            stage: (stage as string)?.toUpperCase()
          });
          setMyRank(responseMyRank);
        }
      } else {
        setLeaderboardList(prev => {
          if (Array.isArray(prev)) {
            return [...prev, ...response?.data] as LeaderboardBattle[];
          } else {
            return prev;
          }
        });
      }
      setLeaderboardMeta(response?.metadata);
    } catch (error) {
      toast.error(
        `Error fetching Team Battle Leaderboard List: ${error as string}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void FetchLeaderboardList();
  }, [params]);

  return (
    <>
      <div className="px-2 my-5 font-poppins">
        <div className="text-xl text-white grid grid-cols-3">
          <div
            className="flex justify-start items-center transform scale-100 hover:scale-110 transition-transform duration-300 cursor-pointer"
            onClick={async () => {
              await router.push(`/play/team-battle/${id as string}/stage`);
            }}
          >
            <IoArrowBack size={30} />
          </div>
          <div className="lg:text-center font-semibold text-lg sm:text-xl lg:text-2xl col-span-1 font-poppins text-center">
            {t('teamBattle.battleCompetition')}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-9 gap-4 my-10">
          <div className="col-span-1 lg:col-span-4 lg:border-2 border-white rounded-2xl p-3 lg:bg-white/30 flex flex-col justiy-center items-center">
            <div className="font-semibold text-xl text-[#0F1577] text-center">
              {t('teamBattle.theWinner')}
            </div>
            <div className="grid grid-cols-3 w-full mt-5">
              <div />
              {firstRank !== undefined && (
                <div className="flex flex-col justify-center items-center w-full">
                  <div className="relative flex justify-center">
                    <Image
                      src={firstRank.avatar}
                      alt="first-rank"
                      width={300}
                      height={300}
                      className="w-20"
                    />
                    <div className="rounded-full w-8 h-8 p-2 border-2 border-white bg-[#FAB801] flex justify-center items-center font-semibold text-white absolute -bottom-3">
                      {firstRank.rank}
                    </div>
                  </div>
                  <div className="mt-3 text-sm font-semibold text-white text-center truncate w-full">
                    {firstRank.name}
                  </div>
                  <div className="text-xs text-center text-[#2934B2]">
                    {firstRank.group_name}
                  </div>
                  <div className="flex flex-row flex-wrap justify-center w-full gap-2">
                    <span className="text-sm font-semibold text-[#2934B2] truncate">
                      {t('teamBattle.return')}
                    </span>
                    <GainIcon
                      gain={firstRank.gain}
                      className="font-light text-white text-sm"
                    />
                  </div>
                </div>
              )}
              <div />
              {secondRank !== undefined && (
                <div className="flex flex-col justify-center items-center w-full">
                  <div className="relative flex justify-center">
                    <Image
                      src={secondRank.avatar}
                      alt="other-rank"
                      width={300}
                      height={300}
                      className="w-20"
                    />
                    <div className="rounded-full w-8 h-8 p-2 border-2 border-white bg-[#9EA8B1] flex justify-center items-center font-semibold text-white absolute -bottom-3">
                      {secondRank.rank}
                    </div>
                  </div>
                  <div className="mt-3 text-sm font-semibold text-white text-center truncate w-full">
                    {secondRank.name}
                  </div>
                  <div className="text-xs text-center text-[#2934B2]">
                    {secondRank.group_name}
                  </div>
                  <div className="flex flex-row flex-wrap justify-center w-full gap-2">
                    <span className="text-sm font-semibold text-[#2934B2] truncate">
                      {t('teamBattle.return')}
                    </span>
                    <GainIcon
                      gain={secondRank.gain}
                      className="font-light text-white text-sm"
                    />
                  </div>
                </div>
              )}
              <div />
              {thirdRank !== undefined && (
                <div className="flex flex-col justify-center items-center w-full">
                  <div className="relative flex justify-center">
                    <Image
                      src={thirdRank.avatar}
                      alt="other-rank"
                      width={300}
                      height={300}
                      className="w-20"
                    />
                    <div className="rounded-full w-8 h-8 p-2 border-2 border-white bg-[#D87D5D] flex justify-center items-center font-semibold text-white absolute -bottom-3">
                      {thirdRank.rank}
                    </div>
                  </div>
                  <div className="mt-3 text-sm font-semibold text-white text-center truncate w-full">
                    {thirdRank.name}
                  </div>
                  <div className="text-xs text-center text-[#2934B2]">
                    {thirdRank.group_name}
                  </div>
                  <div className="flex flex-row flex-wrap justify-center w-full gap-2">
                    <span className="text-sm font-semibold text-[#2934B2] truncate">
                      {t('teamBattle.return')}
                    </span>
                    <GainIcon
                      gain={thirdRank.gain}
                      className="font-light text-white text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="w-full mt-20 font-semibold text-xl text-[#2934B2] hidden lg:flex">
              {t('teamBattle.stagePage.yourRank')}
            </div>
            <div className="hidden lg:grid grid-cols-9 gap-3 bg-[#2934B2] p-2 rounded-2xl text-white w-full min-h-20 mt-2">
              <div className="col-span-1 flex justify-start items-center">
                {myRank !== null ? myRank?.rank : myRankFromList?.rank}
              </div>
              <div className="col-span-6 grid grid-cols-4 items-center gap-3">
                <div className="col-span-1">
                  <Image
                    src={
                      myRank?.user_avatar !== undefined
                        ? myRank?.user_avatar
                        : (myRankFromList?.avatar as string)
                    }
                    alt="rank-user"
                    width={200}
                    height={200}
                    className="w-10 h-10 object-cover p-1 rounded bg-[#A1A0DA]"
                  />
                </div>
                <div className="col-span-3 flex flex-col justify-center h-full w-full truncate">
                  <div className="w-full truncate">
                    {myRank?.user_name !== undefined
                      ? myRank.user_name
                      : myRankFromList?.name}
                  </div>
                  <div className="text-sm truncate w-full">
                    {myRank?.group_name !== undefined
                      ? myRank.group_name
                      : myRankFromList?.group_name}
                  </div>
                </div>
              </div>
              <div className="col-span-2 flex w-full justify-end items-center text-xs h-full">
                <div className="border-2 border-white rounded-lg p-1 flex w-fit items-center gap-2">
                  <GainIcon
                    gain={
                      myRank?.gain !== undefined
                        ? myRank.gain
                        : (myRankFromList?.gain as number)
                    }
                    className="font-light text-white text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1 lg:col-span-5 border-2 border-white rounded-2xl p-3 bg-white/30">
            <div className="flex justify-between items-center bg-[#2934B2] text-white font-semibold h-14 rounded-xl">
              <p className="text-center w-fit rounded-s-2xl p-3 text-xs sm:text=sm xl:text-base">
                {t('teamBattle.rank')}
              </p>
              <p className="text-center w-fit p-3 text-xs sm:text=sm xl:text-base">
                {t('teamBattle.nameTeam')}
              </p>
              <p className="text-center w-fit rounded-e-2xl p-3 text-xs sm:text=sm xl:text-base">
                {t('teamBattle.return')}
              </p>
            </div>
            <div
              ref={leaderboardRef}
              className="max-h-[50vh] sm:max-h-[60vh] lg:max-h-[65vh] overflow-auto"
            >
              {(leaderboardList?.length as number) <= 3 ? (
                <LeaderboardNotFound />
              ) : (
                remainingRanks?.map((el: LeaderboardBattle, i) => {
                  return (
                    <div className="flex items-center" key={i}>
                      <p className="text-center p-3 text-xs sm:text-sm xl:text-base">
                        {el.rank}
                      </p>
                      <div className="p-3">
                        <div className="grid grid-cols-6 justify-start items-center gap-2">
                          <div className="col-span-1 flex justify-center items-center">
                            <Image
                              src={el.avatar}
                              alt="rank-user"
                              width={200}
                              height={200}
                              className="min-w-8 min-h-8 object-cover p-1 rounded bg-[#A1A0DA]"
                            />
                          </div>
                          <div className="col-span-5">
                            <p className="p-0 m-0 font-medium text-xs sm:text-sm xl:text-base truncate">
                              {el.name}
                            </p>
                            <p className="p-0 m-0 text-[#0F1577] font-medium text-xs xl:text-sm truncate">
                              {el.group_name}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex justify-center items-center">
                          <div className="h-full flex flex-row items-center justify-center gap-1 p-1 rounded-lg border-2 border-[#2934B2] w-fit text-xs xl:text-sm">
                            <GainIcon
                              gain={el.gain}
                              className="font-light text-black text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            {isLoading && <Loading />}
            <div className="w-full mt-10 font-semibold text-sm sm:text-base lg:text-lg text-[#2934B2] flex lg:hidden">
              {t('teamBattle.stagePage.yourRank')}
            </div>
            <div className="lg:hidden grid grid-cols-9 gap-3 bg-[#2934B2] p-2 rounded-2xl text-white w-full min-h-20 mt-2">
              <div className="col-span-1 flex justify-start items-center text-xs sm:text-sm lg:text-base">
                {myRank !== null ? myRank?.rank : myRankFromList?.rank}
              </div>
              <div className="col-span-6 grid grid-cols-4 items-center gap-3">
                <div className="col-span-1">
                  <Image
                    src={
                      myRank?.user_avatar !== undefined
                        ? myRank.user_avatar
                        : (myRankFromList?.avatar as string)
                    }
                    alt="rank-user"
                    width={200}
                    height={200}
                    className="w-10 h-10 object-cover p-1 rounded bg-[#A1A0DA]"
                  />
                </div>
                <div className="col-span-3 flex flex-col justify-center h-full w-full ">
                  <div className="w-full truncate text-xs sm:text-sm lg:text-base">
                    {myRank?.user_name !== undefined
                      ? myRank.user_name
                      : myRankFromList?.name}
                  </div>
                  <div className="text-xs lg:text-sm truncate w-full">
                    {myRank?.group_name !== undefined
                      ? myRank.group_name
                      : myRankFromList?.group_name}
                  </div>
                </div>
              </div>
              <div className="col-span-2 flex w-full justify-end items-center text-xs h-full">
                <div className="border-2 text-xs sm:text-sm lg:text-base border-white rounded-lg p-1 flex w-fit items-center gap-2">
                  <GainIcon
                    gain={
                      myRank?.gain !== undefined
                        ? myRank.gain
                        : (myRankFromList?.gain as number)
                    }
                    className="font-light text-white text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(LeaderboardBattlePage);
