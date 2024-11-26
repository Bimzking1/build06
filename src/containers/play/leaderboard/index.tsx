import { getPlayLeaderboard } from '@/repository/play.repository';
import { getLeaderBoardGlobal } from '@/repository/quiz.repository';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import rank1Box from '../../../../public/assets/images/rank1Box.svg';
import rank2Box from '../../../../public/assets/images/rank2Box.svg';
import rank3Box from '../../../../public/assets/images/rank3Box.svg';

interface LeaderDataQuiz {
  id: string;
  quiz_id: string;
  user_id: string;
  name: string;
  seeds_tag: string;
  bio: string;
  avatar: string;
  verified: boolean;
  is_followed: boolean;
  score: number;
  current_rank: number;
  total_prizes: number;
  created_at: string;
  updated_at: string;
}

interface LeaderDataTournament {
  avatar_url: string;
  current_rank: number;
  is_followed: boolean;
  points: number;
  total_lose: number;
  total_play: number;
  total_reward: number;
  total_win: number;
  user_full_name: string;
  user_id: string;
  user_seeds_tag: string;
  verified: boolean;
  win_rate: number;
}

const LeaderBoardGlobalPage = (): React.ReactElement => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('Quiz');
  const [leaderBoardQuiz, setLeaderBoardQuiz] = useState<LeaderDataQuiz[]>([]);
  const [leaderBoardTournament, setLeaderBoardTournament] = useState<
    LeaderDataTournament[]
  >([]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const params = {
          page: 1,
          limit: 10
        };

        const resTournament = await getPlayLeaderboard();
        const resQuiz = await getLeaderBoardGlobal(params);

        setLeaderBoardTournament(resTournament.playLeaderboards);
        setLeaderBoardQuiz(resQuiz.data);
      } catch (error) {
        toast(`Error fetching data: ${error as string}`);
      }
    };

    fetchData()
      .then()
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="w-full h-auto justify-center cursor-default bg-white">
        <div className="flex flex-row justify-center text-center items-center gap-3 my-4">
          <button
            className={`px-4 py-2 font-poppins shadow-lg rounded-xl text-base font-semibold ${
              activeTab === 'Tournament'
                ? 'bg-[#3AC4A0] text-[#FFFFFF]'
                : 'bg-white text-[#7C7C7C]'
            }`}
            onClick={() => {
              setActiveTab('Tournament');
            }}
          >
            Tournament
          </button>
          <button
            className={`px-8 py-2 font-poppins shadow-lg rounded-xl text-base font-semibold ${
              activeTab === 'Quiz'
                ? 'bg-[#3AC4A0] text-[#FFFFFF]'
                : 'bg-white text-[#7C7C7C]'
            }`}
            onClick={() => {
              setActiveTab('Quiz');
            }}
          >
            Quiz
          </button>
        </div>
        <div className="relative flex justify-center bg-gradient-to-r from-[#10A8AD] to-[#79F0B8] rounded-2xl">
          <div className="flex justify-center pt-3">
            <div className="justify-center mt-auto items-center text-center">
              <div className="w-full justify-center">
                <Image
                  width={100}
                  height={100}
                  src={
                    activeTab === 'Quiz'
                      ? leaderBoardQuiz[1]?.avatar
                      : leaderBoardTournament[1]?.avatar_url
                  }
                  alt={
                    activeTab === 'Quiz'
                      ? leaderBoardQuiz[1]?.name
                      : leaderBoardTournament[1]?.user_full_name
                  }
                  className="z-0 w-[64px] h-[64px] mx-auto rounded-xl border-white border-2 "
                />
                <div className="z-10 w-6 h-6  mt-[-10%] relative mx-auto rounded-full bg-[#7555DA] text-sm text-white text-center justify-center items-center">
                  2
                </div>
              </div>
              <div className="text-base mt-3 font-poppins font-semibold text-[#FFFFFF]">
                {activeTab === 'Quiz'
                  ? leaderBoardQuiz[1]?.name
                  : leaderBoardTournament[1]?.user_full_name}
              </div>
              <div className="text-sm mt-3 font-poppins font-normal text-[#FFFFFF]">
                {activeTab === 'Quiz'
                  ? leaderBoardQuiz[1]?.current_rank
                  : leaderBoardTournament[1]?.current_rank}
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
                  src={
                    activeTab === 'Quiz'
                      ? leaderBoardQuiz[0]?.avatar
                      : leaderBoardTournament[0]?.avatar_url
                  }
                  alt={
                    activeTab === 'Quiz'
                      ? leaderBoardQuiz[0]?.name
                      : leaderBoardTournament[0]?.user_full_name
                  }
                  className="z-0 w-[64px] h-[64px] mx-auto rounded-xl border-white border-2 mt-1"
                />
                <div className="z-10 w-6 h-6  mt-[-10%] relative mx-auto rounded-full bg-white text-sm text-center text-[#27A590] justify-center items-center">
                  2
                </div>
              </div>
              <div className="text-base mt-3 font-poppins font-semibold text-[#FFFFFF]">
                {activeTab === 'Quiz'
                  ? leaderBoardQuiz[0]?.name
                  : leaderBoardTournament[0]?.user_full_name}
              </div>
              <div className="text-sm mt-3 font-poppins font-normal text-[#FFFFFF]">
                {activeTab === 'Quiz'
                  ? leaderBoardQuiz[0]?.current_rank
                  : leaderBoardTournament[0]?.current_rank}
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
                  src={
                    activeTab === 'Quiz'
                      ? leaderBoardQuiz[2]?.avatar
                      : leaderBoardTournament[2]?.avatar_url
                  }
                  alt={
                    activeTab === 'Quiz'
                      ? leaderBoardQuiz[2]?.name
                      : leaderBoardTournament[2]?.user_full_name
                  }
                  className="z-0 w-[64px] h-[64px] mx-auto rounded-xl border-white border-2"
                />
                <div className="z-10 w-6 h-6  mt-[-10%] relative mx-auto rounded-full bg-[#FDBA22] text-sm text-white text-center justify-center items-center">
                  3
                </div>
              </div>
              <div className="text-base mt-3 font-poppins font-semibold text-[#FFFFFF]">
                {activeTab === 'Quiz'
                  ? leaderBoardQuiz[2]?.name
                  : leaderBoardTournament[2]?.user_full_name}
              </div>
              <div className="text-sm mt-3 font-poppins font-normal text-[#FFFFFF]">
                {activeTab === 'Quiz'
                  ? leaderBoardQuiz[2]?.current_rank
                  : leaderBoardTournament[2]?.current_rank}
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

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-2 py-5 text-center text-sm font-semibold font-poppins text-[#7C7C7C]">
                Rank
              </th>
              <th className="px-4 py-5 text-start text-sm font-semibold font-poppins text-[#7C7C7C]">
                {t('tournament.leaderboard.player')}
              </th>
              <th className="px-4 py-5 text-center text-sm font-semibold font-poppins text-[#7C7C7C]">
                {t('tournament.leaderboard.totalPoint')}
              </th>
            </tr>
          </thead>
          {activeTab === 'Quiz' ? (
            <tbody>
              {leaderBoardQuiz?.slice(3).map((leader, index) => (
                <tr key={index} className="border-b">
                  <td className="px-2 py-5 text-center text-sm md:text-base">
                    {leader?.current_rank}.
                  </td>
                  <td className="px-4 py-5 text-start flex">
                    <div className="">
                      <Image
                        src={leader?.avatar}
                        alt={leader?.name}
                        width={100}
                        height={100}
                        className="w-10 h-10 rounded-full"
                      />
                    </div>
                    <div className="mx-3">
                      <h1 className="text-sm md:text-base font-normal font-poppins text-[#262626]">
                        {leader?.name}
                      </h1>
                      <h1 className="text-xs md:text-sm font-normal font-poppins text-[#7C7C7C]">
                        @{leader?.seeds_tag}
                      </h1>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-center text-sm md:text-base font-normal font-poppins">
                    {leader?.total_prizes}
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              {leaderBoardTournament?.slice(3).map((leader, index) => (
                <tr key={index} className="border-b">
                  <td className="px-2 py-5 text-center text-sm md:text-base">
                    {leader?.current_rank}.
                  </td>
                  <td className="px-4 py-5 text-start flex">
                    <div className="">
                      <Image
                        src={leader?.avatar_url}
                        alt={leader?.user_full_name}
                        width={100}
                        height={100}
                        className="w-10 h-10 rounded-full"
                      />
                    </div>
                    <div className="mx-3">
                      <h1 className="text-sm md:text-base font-normal font-poppins text-[#262626]">
                        {leader?.user_full_name}
                      </h1>
                      <h1 className="text-xs md:text-sm font-normal font-poppins text-[#7C7C7C]">
                        @{leader?.user_seeds_tag}
                      </h1>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-center text-sm md:text-base font-normal font-poppins">
                    {leader?.points}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </>
  );
};

export default LeaderBoardGlobalPage;
