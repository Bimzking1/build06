import { getPlaySimulation } from '@/repository/play.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import rank1Medal from '../../../public/assets/images/rank1Medal.svg';
import rank2Medal from '../../../public/assets/images/rank2Medal.svg';
import rank3Medal from '../../../public/assets/images/rank3Medal.svg';

interface DataPlayer {
  name: string;
  avatar_url: string;
  asset: number;
  gain: number;
  rank: number;
  medal: string;
  prize: number;
  seeds_tag: string;
}

interface LeaderData {
  name: string;
  avatar_url: string;
  seeds_tag: string;
  verified: true;
  asset: number;
  gain: number;
  rank: number;
  medal: string;
  prize: number;
  return: number;
}

const CurrentPage = (): React.ReactElement => {
  const { t } = useTranslation();
  const [playerData, setPlayerData] = useState<DataPlayer | null>(null);
  const [leaderBoard, setLeaderBoard] = useState<LeaderData[]>([]);

  const [userInfo, setUserInfo] = useState<UserInfo>();
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const dataInfo = await getUserInfo();
        setUserInfo(dataInfo);
      } catch (error) {
        toast.error(`Error fetching data: ${error as string}`);
      }
    };

    fetchData()
      .then()
      .catch(() => {});
  }, []);

  const fetchPlaySimulation = async (currency: string): Promise<void> => {
    try {
      const currentDate = new Date();

      const formattedDate = `${currentDate.getFullYear()}-${(
        currentDate.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}-${currentDate
        .getDate()
        .toString()
        .padStart(2, '0')}`;

      const res = await getPlaySimulation(formattedDate, currency);
      setPlayerData(res.user_rank);
      setLeaderBoard(res.leaderboard);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };
  useEffect(() => {
    if (userInfo !== undefined) {
      void fetchPlaySimulation(userInfo?.preferredCurrency);
    }
  }, [userInfo]);

  return (
    <>
      <div className="w-full h-auto z-20 bg-white cursor-default">
        <div
          className={'border-2 rounded-xl border-[#3AC4A0] w-full p-3 mb-2 '}
        >
          <div className="flex justify-between">
            <div className="flex w-full items-center gap-2 md:gap-4">
              <div className="flex flex-col justify-center items-center">
                <p className="font-semibold text-[22px] font-poppins">
                  {playerData?.rank}
                </p>
                <svg
                  width="17"
                  height="18"
                  viewBox="0 0 17 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M13.1243 11.5579C12.8551 11.8271 12.4186 11.8271 12.1494 11.5579L8.5008 7.90927L4.85221 11.5579C4.58301 11.8271 4.14654 11.8271 3.87734 11.5579C3.60814 11.2887 3.60814 10.8522 3.87734 10.583L8.01337 6.44696C8.28257 6.17776 8.71904 6.17776 8.98824 6.44696L13.1243 10.583C13.3935 10.8522 13.3935 11.2887 13.1243 11.5579Z"
                    fill="#3AC4A0"
                  />
                </svg>
              </div>
              <img
                src={playerData?.avatar_url}
                alt={playerData?.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-bold text-md md:text-xl">
                  {playerData?.name}
                </p>
                <p className="text-sm md:text-[16px] my-1">
                  @{playerData?.seeds_tag}
                </p>
                <p className="text-[#3AC4A0] text-sm md:text-md">
                  {t('homepage.section2.text2')} ({playerData?.gain}%)
                </p>
              </div>
            </div>
          </div>
        </div>
        {leaderBoard.map((leader, index) => (
          <div
            key={index}
            className={`w-full p-3 mb-2 ${
              leader.rank === 1 || leader.rank === 2 || leader.rank === 3
                ? 'rounded-xl border border-[#E9E9E9]'
                : ''
            }`}
          >
            <div className="flex justify-between">
              <div className="flex w-full items-center gap-2 md:gap-4">
                {leader.rank === 1 && (
                  <Image src={rank1Medal} alt="Next" width={32} height={32} />
                )}
                {leader.rank === 2 && (
                  <Image src={rank2Medal} alt="Next" width={32} height={32} />
                )}
                {leader.rank === 3 && (
                  <Image src={rank3Medal} alt="Next" width={32} height={32} />
                )}
                {leader.rank !== 1 && leader.rank !== 2 && leader.rank !== 3 ? (
                  <p>{leader.rank}.</p>
                ) : null}
                <img
                  src={leader.avatar_url}
                  alt={leader.name}
                  className="w-10 h-10 rounded-full shadow"
                />
                <div>
                  <div className="flex">
                    <p className="font-bold me-2 text-md md:text-xl">
                      {leader.name}
                    </p>
                  </div>
                  <p className="text-sm md:text-[16px] my-1">
                    @{leader.seeds_tag}
                  </p>
                  {leader.rank !== 1 &&
                  leader.rank !== 2 &&
                  leader.rank !== 3 ? (
                    <div className="text-[#3AC4A0] flex text-xs font-semibold">
                      <p className="me-2"> {t('homepage.section2.text2')}</p>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0.729436 9.36062C0.614332 9.36062 0.480034 9.32228 0.384114 9.22641C0.192274 9.03469 0.192274 8.72793 0.384114 8.55537L3.99072 4.95093C4.18256 4.7592 4.4895 4.7592 4.66216 4.95093L6.71484 7.00239L10.9353 2.78442C11.1272 2.59269 11.4341 2.59269 11.6068 2.78442C11.7986 2.97615 11.7986 3.28291 11.6068 3.45546L7.04098 8.01854C6.84914 8.21027 6.54219 8.21027 6.36954 8.01854L4.31683 5.96707L1.05555 9.22641C0.978818 9.32228 0.863724 9.36062 0.729436 9.36062Z"
                          fill="#3AC4A0"
                        />
                        <path
                          d="M11.281 6.48491C11.0125 6.48491 10.8014 6.27401 10.8014 6.0056V3.60902H8.40343C8.13485 3.60902 7.92383 3.39812 7.92383 3.12971C7.92383 2.86129 8.13485 2.65039 8.40343 2.65039H11.281C11.5496 2.65039 11.7606 2.86129 11.7606 3.12971V6.0056C11.7606 6.27401 11.5496 6.48491 11.281 6.48491Z"
                          fill="#3AC4A0"
                        />
                      </svg>
                      <p className="text-[#7C7C7C] ms-2 text-xs font-normal">
                        ({leader.gain}%)
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
              {leader.rank === 1 || leader.rank === 2 || leader.rank === 3 ? (
                <div className="my-auto">
                  <button className="hidden lg:flex  text-[#3AC4A0] text-xs font-semibold px-3 py-2 border rounded-xl border-[#3AC4A0]">
                    <p className="me-2"> {t('homepage.section2.text2')}</p>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.729436 9.36062C0.614332 9.36062 0.480034 9.32228 0.384114 9.22641C0.192274 9.03469 0.192274 8.72793 0.384114 8.55537L3.99072 4.95093C4.18256 4.7592 4.4895 4.7592 4.66216 4.95093L6.71484 7.00239L10.9353 2.78442C11.1272 2.59269 11.4341 2.59269 11.6068 2.78442C11.7986 2.97615 11.7986 3.28291 11.6068 3.45546L7.04098 8.01854C6.84914 8.21027 6.54219 8.21027 6.36954 8.01854L4.31683 5.96707L1.05555 9.22641C0.978818 9.32228 0.863724 9.36062 0.729436 9.36062Z"
                        fill="#3AC4A0"
                      />
                      <path
                        d="M11.281 6.48491C11.0125 6.48491 10.8014 6.27401 10.8014 6.0056V3.60902H8.40343C8.13485 3.60902 7.92383 3.39812 7.92383 3.12971C7.92383 2.86129 8.13485 2.65039 8.40343 2.65039H11.281C11.5496 2.65039 11.7606 2.86129 11.7606 3.12971V6.0056C11.7606 6.27401 11.5496 6.48491 11.281 6.48491Z"
                        fill="#3AC4A0"
                      />
                    </svg>
                    <p className="text-[#7C7C7C] ms-2 text-xs font-normal">
                      ({leader.gain}%)
                    </p>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CurrentPage;
