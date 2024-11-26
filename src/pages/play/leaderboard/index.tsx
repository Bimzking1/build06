import IconClock from '@/assets/play/tournament/clock.svg';
import FollowButton from '@/components/FollowButton';
import { getLeaderGlobal, getUserRank } from '@/repository/play.repository';
import { getUserInfo } from '@/repository/profile.repository';
import {
  Menu,
  MenuHandler,
  MenuList,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import leftLeader from '../../../../public/assets/images/leftLeader.svg';
import rank1Box from '../../../../public/assets/images/rank1Box.svg';
import rank2Box from '../../../../public/assets/images/rank2Box.svg';
import rank3Box from '../../../../public/assets/images/rank3Box.svg';
import rightLeader from '../../../../public/assets/images/rightLeader.svg';

interface LeaderBoardGlobal {
  user_id: string;
  avatar_url: string;
  user_full_name: string;
  user_seeds_tag: string;
  total_play: number;
  total_win: number;
  total_lose: number;
  win_rate: number;
  total_reward: number;
  points: number;
  current_rank: number;
  verified: boolean;
  is_followed: boolean;
  label: string;
}

export interface UserData {
  name: string;
  seedsTag: string;
  email: string;
  pin: string;
  avatar: string;
  bio: string;
  birthDate: string;
  phoneNumber: string;
  _pin: string;
  preferredCurrency: string;
}

interface UserRank {
  user_id: string;
  avatar_url: string;
  user_full_name: string;
  user_seeds_tag: string;
  total_play: number;
  total_win: number;
  total_lose: number;
  win_rate: number;
  total_reward: number;
  points: number;
  current_rank: number;
  verified: boolean;
  is_followed: boolean;
  label: string;
}

interface TimeRemaining {
  d: string;
  h: string;
  m: string;
}

const LeaderBoardGlobalPage = (): React.ReactElement => {
  const router = useRouter();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('season');
  const [leaderBoardGlobal, setLeaderBoardGlobal] = useState<
    LeaderBoardGlobal[]
  >([]);
  const [userRank, setUserRank] = useState<UserRank>({
    user_id: '',
    avatar_url: '',
    user_full_name: '',
    user_seeds_tag: '',
    total_play: 0,
    total_win: 0,
    total_lose: 0,
    win_rate: 0,
    total_reward: 0,
    points: 0,
    current_rank: 0,
    verified: false,
    is_followed: false,
    label: ''
  });
  const [filter, setFilter] = useState<string>('season');
  const [userInfo, setUserInfo] = useState<UserData | null>(null);

  const fetchData = async (): Promise<void> => {
    try {
      const paramsGlobal = {
        page: 1,
        limit: 10,
        currency: ''
      };
      const resGlobal = await getLeaderGlobal(
        paramsGlobal.page,
        paramsGlobal.limit,
        paramsGlobal.currency,
        filter
      );
      const resUserRank = await getUserRank(
        userInfo?.preferredCurrency ?? '',
        filter
      );
      setLeaderBoardGlobal(resGlobal.playCenterLeaderboards);
      setUserRank(resUserRank);
    } catch (error) {
      toast(`Error fetching data: ${error as string}`);
    }
  };

  const fetchDataUser = async (): Promise<void> => {
    try {
      const response = await getUserInfo();
      setUserInfo(response);
    } catch (error) {
      toast(`ERROR fetch user info ${error as string}`);
    }
  };

  useEffect(() => {
    fetchDataUser()
      .then()
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchData()
      .then()
      .catch(() => {});
  }, [filter]);

  const getLeaderboardTimeRemaining = (): TimeRemaining => {
    const now: Date = new Date();
    const startOfYear: Date = new Date(now.getFullYear(), 0, 1);
    const quarter = Math.floor(
      (now.getTime() - startOfYear.getTime()) /
        (24 * 60 * 60 * 1000) /
        (365.25 / 4)
    );
    const nextQuarterStart: Date = new Date(
      now.getFullYear(),
      quarter * 3 + 3,
      1
    );

    if (quarter === 3) {
      nextQuarterStart.setFullYear(nextQuarterStart.getFullYear() + 1);
      nextQuarterStart.setMonth(0);
    }

    const diff: number = nextQuarterStart.getTime() - now.getTime();

    const days: number = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours: number = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes: number = Math.floor((diff / (1000 * 60)) % 60);

    // Convert to strings for formatting
    const daysStr: string = days.toString().padStart(2, '0');
    const hoursStr: string = hours.toString().padStart(2, '0');
    const minutesStr: string = minutes.toString().padStart(2, '0');

    return {
      d: daysStr,
      h: hoursStr,
      m: minutesStr
    };
  };

  const leaderboardTimeRemaining = getLeaderboardTimeRemaining();

  return (
    <>
      <div className="w-full h-auto justify-center cursor-default bg-white font-poppins">
        <div className="relative font-poppins bg-gradient-to-r from-[#10A8AD] to-[#79F0B8] rounded-2xl pt-5">
          <Image
            src={leftLeader}
            alt="Next"
            width={32}
            height={32}
            className="hidden md:block absolute left-[20px] top-[15px] w-[165px] z-10"
          />
          <Image
            src={rightLeader}
            alt="Next"
            width={32}
            height={32}
            className="hidden md:block absolute right-[20px] top-[80px] w-[165px] z-10"
          />
          {activeTab !== 'all' && (
            <div className="hidden md:flex bg-white text-[#3AC4A0] gap-1 text-xs ml-auto mr-2  justify-center text-center items-center border border-1 p-1 border-[#27A590] rounded-full w-[12%]">
              <Image alt="" src={IconClock} className="w-[14px] mr-1 my-auto" />
              {Object.entries(leaderboardTimeRemaining).map(
                ([key, value], index) => (
                  <span key={index}>
                    {value}
                    {key}{' '}
                  </span>
                )
              )}
            </div>
          )}
          <div className="flex justify-center text-center gap-2 lg:mt-[-20px]">
            <h1 className="text-white text-lg font-semibold my-3">
              {t('playCenter.text2')}
            </h1>
            <Menu placement="bottom-start">
              <MenuHandler>
                <button className="flex items-center" type="button">
                  <svg
                    width="21"
                    height="20"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="my-auto"
                  >
                    <path
                      d="M10.5 0.25C8.57164 0.25 6.68657 0.821828 5.08319 1.89317C3.47982 2.96451 2.23013 4.48726 1.49218 6.26884C0.754225 8.05042 0.561142 10.0108 0.937348 11.9021C1.31355 13.7934 2.24215 15.5307 3.60571 16.8943C4.96928 18.2579 6.70656 19.1865 8.59787 19.5627C10.4892 19.9389 12.4496 19.7458 14.2312 19.0078C16.0127 18.2699 17.5355 17.0202 18.6068 15.4168C19.6782 13.8134 20.25 11.9284 20.25 10C20.2473 7.41498 19.2192 4.93661 17.3913 3.10872C15.5634 1.28084 13.085 0.25273 10.5 0.25ZM10.5 18.25C8.86831 18.25 7.27326 17.7661 5.91655 16.8596C4.55984 15.9531 3.50242 14.6646 2.878 13.1571C2.25358 11.6496 2.0902 9.99085 2.40853 8.3905C2.72685 6.79016 3.51259 5.32015 4.66637 4.16637C5.82016 3.01259 7.29017 2.22685 8.89051 1.90852C10.4909 1.59019 12.1497 1.75357 13.6571 2.37799C15.1646 3.00242 16.4531 4.05984 17.3596 5.41655C18.2661 6.77325 18.75 8.3683 18.75 10C18.7475 12.1873 17.8775 14.2843 16.3309 15.8309C14.7843 17.3775 12.6873 18.2475 10.5 18.25ZM12 14.5C12 14.6989 11.921 14.8897 11.7803 15.0303C11.6397 15.171 11.4489 15.25 11.25 15.25C10.8522 15.25 10.4706 15.092 10.1893 14.8107C9.90804 14.5294 9.75 14.1478 9.75 13.75V10C9.55109 10 9.36033 9.92098 9.21967 9.78033C9.07902 9.63968 9 9.44891 9 9.25C9 9.05109 9.07902 8.86032 9.21967 8.71967C9.36033 8.57902 9.55109 8.5 9.75 8.5C10.1478 8.5 10.5294 8.65804 10.8107 8.93934C11.092 9.22064 11.25 9.60218 11.25 10V13.75C11.4489 13.75 11.6397 13.829 11.7803 13.9697C11.921 14.1103 12 14.3011 12 14.5ZM9 5.875C9 5.6525 9.06598 5.43499 9.1896 5.24998C9.31322 5.06498 9.48892 4.92078 9.69449 4.83564C9.90005 4.75049 10.1263 4.72821 10.3445 4.77162C10.5627 4.81502 10.7632 4.92217 10.9205 5.0795C11.0778 5.23684 11.185 5.43729 11.2284 5.65552C11.2718 5.87375 11.2495 6.09995 11.1644 6.30552C11.0792 6.51109 10.935 6.68679 10.75 6.8104C10.565 6.93402 10.3475 7 10.125 7C9.82664 7 9.54049 6.88147 9.32951 6.6705C9.11853 6.45952 9 6.17337 9 5.875Z"
                      fill="white"
                    />
                  </svg>
                </button>
              </MenuHandler>
              <MenuList className="rounded-2xl">
                <div className="flex flex-col p-2 max-w-[200px]">
                  <div className="">
                    <Typography className="font-normal text-[12px] font-poppins text-[#3AC4A0] mt-2">
                      {t('playCenter.text10')}
                    </Typography>
                    <ul>
                      <li>
                        <Typography className="font-normal text-[10px] font-poppins text-[#262626] mt-2">
                          {t('playCenter.text11')}
                        </Typography>
                      </li>
                      <li>
                        <Typography className="font-normal text-[10px] font-poppins text-[#262626] mt-2">
                          {t('playCenter.text12')}
                        </Typography>
                      </li>
                      <li>
                        <Typography className="font-normal text-[10px] font-poppins text-[#262626] mt-2">
                          {t('playCenter.text14')}
                        </Typography>
                      </li>
                      <li>
                        <Typography className="font-normal text-[10px] font-poppins text-[#262626] mt-2">
                          {t('playCenter.text15')}
                        </Typography>
                      </li>
                    </ul>
                  </div>
                </div>
              </MenuList>
            </Menu>
          </div>
          <div className="justify-center text-center mt-2">
            <h1 className="text-base font-normal text-white">
              {activeTab === 'season'
                ? `${t('playCenter.text9')} 01 ${new Date().toLocaleDateString(
                    'id-ID',
                    {
                      month: 'long',
                      year: 'numeric'
                    }
                  )} 00:00`
                : `${t('playCenter.text9')} ${new Date().toLocaleDateString(
                    'id-ID',
                    {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    }
                  )} 00:00`}
            </h1>
          </div>
          <div className="flex flex-row bg-[#2b4740] justify-center mx-5 md:mx-auto text-center w-[300ox] md:w-[235px] rounded-full items-center px-1 gap-1 my-4">
            <button
              className={`md:px-4 px-12 py-2 font-poppins shadow-lg rounded-full text-base font-semibold ${
                activeTab === 'season'
                  ? 'text-[#3AC4A0] bg-[#FFFFFF]'
                  : 'bg-transparent text-[#7C7C7C]'
              }`}
              onClick={() => {
                setFilter('season');
                setActiveTab('season');
              }}
            >
              {t('playCenter.text16')}
            </button>
            <button
              className={`md:px-8 px-12 py-2 font-poppins shadow-lg rounded-full text-base font-semibold ${
                activeTab === 'all'
                  ? 'text-[#3AC4A0] bg-[#FFFFFF]'
                  : 'bg-transparent text-[#7C7C7C]'
              }`}
              onClick={() => {
                setFilter('');
                setActiveTab('all');
              }}
            >
              {t('playCenter.text17')}
            </button>
          </div>
          {activeTab !== 'all' && (
            <div className="md:hidden bg-white text-[#3AC4A0] flex gap-1 text-xs ml-5 border border-1 p-1 border-[#27A590] rounded-full w-[28%]">
              <Image alt="" src={IconClock} className="w-[14px] mr-1 my-auto" />
              {Object.entries(leaderboardTimeRemaining).map(
                ([key, value], index) => (
                  <span key={index}>
                    {value}
                    {key}{' '}
                  </span>
                )
              )}
            </div>
          )}
          <div className="flex justify-center pt-3">
            <div className="justify-center mt-auto items-center text-center">
              <div className="w-full justify-center">
                <Image
                  width={100}
                  height={100}
                  src={leaderBoardGlobal[1]?.avatar_url}
                  alt={leaderBoardGlobal[1]?.user_full_name}
                  className="z-0 w-[64px] h-[64px] mx-auto rounded-xl border-white border-2 "
                />
                <div className="z-10 w-6 h-6  mt-[-10%] relative mx-auto rounded-full bg-[#7555DA] text-sm text-white text-center justify-center items-center">
                  2
                </div>
              </div>
              <div className="text-[12px] mt-3 font-poppins font-semibold text-[#FFFFFF]">
                {leaderBoardGlobal[1]?.user_full_name}
              </div>
              <div className="text-sm mt-3 font-poppins font-normal text-[#FFFFFF]">
                {leaderBoardGlobal[1]?.points}
              </div>
              <div>
                <Image
                  src={rank2Box}
                  alt="Next"
                  width={32}
                  height={32}
                  className="w-[128px] h-[153px] mt-2"
                />
              </div>
            </div>
            <div className="justify-center mt-auto text-center">
              <div className="mx-auto justify-center">
                <svg
                  width="45"
                  height="34"
                  viewBox="0 0 45 34"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto justify-center"
                >
                  <path
                    d="M43.2564 7.78155C42.8274 7.42339 42.3063 7.19305 41.7527 7.1168C41.199 7.04054 40.6351 7.12146 40.1252 7.3503L30.6377 11.5691L25.1252 1.63155C24.8617 1.1676 24.48 0.781762 24.0189 0.513344C23.5578 0.244926 23.0337 0.103516 22.5002 0.103516C21.9667 0.103516 21.4426 0.244926 20.9815 0.513344C20.5204 0.781762 20.1387 1.1676 19.8752 1.63155L14.3627 11.5691L4.8752 7.3503C4.36427 7.12179 3.79961 7.04077 3.24505 7.1164C2.69048 7.19202 2.16813 7.42127 1.73705 7.77823C1.30596 8.1352 0.983325 8.60564 0.805619 9.13638C0.627914 9.66711 0.602223 10.237 0.73145 10.7816L5.49395 31.0878C5.58502 31.4809 5.75495 31.8515 5.99345 32.177C6.23194 32.5025 6.53405 32.7762 6.88145 32.9816C7.35178 33.2631 7.88954 33.4121 8.4377 33.4128C8.70417 33.4123 8.96925 33.3744 9.2252 33.3003C17.9061 30.9002 27.0755 30.9002 35.7564 33.3003C36.5491 33.5087 37.392 33.394 38.1002 32.9816C38.4497 32.7788 38.7535 32.5059 38.9923 32.18C39.2311 31.854 39.3998 31.4822 39.4877 31.0878L44.2689 10.7816C44.3967 10.2368 44.3696 9.66723 44.1907 9.1371C44.0118 8.60697 43.6882 8.13744 43.2564 7.78155ZM36.5627 30.4128C27.3547 27.8628 17.6269 27.8628 8.41895 30.4128L3.65645 10.1066L13.1439 14.3066C13.8247 14.616 14.5974 14.6566 15.3068 14.4201C16.0163 14.1836 16.61 13.6876 16.9689 13.0316L22.5002 3.09405L28.0314 13.0316C28.3904 13.6876 28.9841 14.1836 29.6936 14.4201C30.403 14.6566 31.1757 14.616 31.8564 14.3066L41.3439 10.1066L36.5627 30.4128ZM30.0002 24.4691C29.9589 24.8387 29.7833 25.1804 29.5068 25.4292C29.2304 25.678 28.8722 25.8168 28.5002 25.819H28.3502C24.4601 25.4253 20.5403 25.4253 16.6502 25.819C16.2549 25.8611 15.8591 25.7445 15.5497 25.4949C15.2403 25.2453 15.0427 24.883 15.0002 24.4878C14.9634 24.0906 15.0844 23.6949 15.337 23.3861C15.5896 23.0774 15.9536 22.8804 16.3502 22.8378C20.4389 22.4066 24.5615 22.4066 28.6502 22.8378C29.0433 22.8805 29.4042 23.0748 29.6563 23.3794C29.9084 23.684 30.0318 24.0749 30.0002 24.4691Z"
                    fill="white"
                  />
                </svg>
              </div>
              <div className="w-full justify-center">
                <Image
                  width={100}
                  height={100}
                  src={leaderBoardGlobal[0]?.avatar_url}
                  alt={leaderBoardGlobal[0]?.user_full_name}
                  className="z-0 w-[64px] h-[64px] mx-auto rounded-xl border-white border-2 mt-1"
                />
                <div className="z-10 w-6 h-6  mt-[-10%] relative mx-auto rounded-full bg-white text-sm text-center text-[#27A590] justify-center items-center">
                  1
                </div>
              </div>
              <div className="text-base mt-3 font-poppins font-semibold text-[#FFFFFF]">
                {leaderBoardGlobal[0]?.user_full_name}
              </div>
              <div className="text-sm mt-3 font-poppins font-normal text-[#FFFFFF]">
                {leaderBoardGlobal[0]?.points}
              </div>
              <div>
                <Image
                  src={rank1Box}
                  alt="Next"
                  width={32}
                  height={32}
                  className="w-[128px] h-[185px] mt-2"
                />
              </div>
            </div>
            <div className="justify-center mt-auto text-center">
              <div className="w-full justify-center">
                <Image
                  width={100}
                  height={100}
                  src={leaderBoardGlobal[2]?.avatar_url}
                  alt={leaderBoardGlobal[2]?.user_full_name}
                  className="z-0 w-[64px] h-[64px] mx-auto rounded-xl border-white border-2"
                />
                <div className="z-10 w-6 h-6  mt-[-10%] relative mx-auto rounded-full bg-[#FDBA22] text-sm text-white text-center justify-center items-center">
                  3
                </div>
              </div>
              <div className="text-[12px] mt-3 font-poppins font-semibold text-[#FFFFFF]">
                {leaderBoardGlobal[2]?.user_full_name}
              </div>
              <div className="text-sm mt-3 font-poppins font-normal text-[#FFFFFF]">
                {leaderBoardGlobal[2]?.points}
              </div>
              <div>
                <Image
                  src={rank3Box}
                  alt="Next"
                  width={32}
                  height={32}
                  className="w-[128px] h-[121px] mt-2"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex rounded-xl bg-[#3AC4A0] justify-between w-full my-5 px-5 py-4">
          <h1 className="text-white font-normal text-base font-poppins ">
            {t('playCenter.text10')}
          </h1>
          <h1 className="text-white font-normal text-base font-poppins ">
            #{userRank?.current_rank}
          </h1>
        </div>

        <table className="w-full">
          <tbody>
            {leaderBoardGlobal?.slice(3).map((leader, index) => (
              <tr key={index} className="">
                <td className="pl-2 pr-1 py-5 text-center text-sm md:text-base">
                  {leader?.current_rank}.
                </td>
                <td className="px-2 py-5 text-start flex">
                  <div
                    className="my-auto me-2"
                    onClick={() => {
                      void router.push(`/social/${leader?.user_id}`);
                    }}
                  >
                    <Image
                      src={leader?.avatar_url}
                      alt={leader?.user_full_name}
                      width={100}
                      height={100}
                      className="w-10 h-10 rounded-full"
                    />
                  </div>
                  <div className="mx-1">
                    <div className="flex gap-1">
                      <h1 className="text-sm font-normal font-poppins text-[#262626]">
                        {leader?.user_full_name}
                      </h1>
                      {leader?.verified && (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="mx-3 my-auto"
                        >
                          <g clipPath="url(#clip0_9492_29105)">
                            <path
                              d="M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12Z"
                              fill="#5E44FF"
                            />
                            <path
                              d="M3 6L5 8L9 4"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_9492_29105">
                              <rect width="12" height="12" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      )}
                    </div>
                    <h1 className="text-xs md:text-sm font-normal font-poppins text-[#7C7C7C]">
                      @{leader?.user_seeds_tag}
                    </h1>
                    <FollowButton
                      userId={leader?.user_id}
                      isFollowed={leader?.is_followed}
                      customClass="bg-[#3AC4A0]  my-2 text-white text-[10px] rounded-full px-4 py-1"
                    />
                  </div>
                </td>
                <td className="px-2 py-5 text-center text-sm md:text-base font-normal font-poppins">
                  {leader?.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LeaderBoardGlobalPage;
