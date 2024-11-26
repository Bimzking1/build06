'use client';
import bgGradient from '@/assets/landing-page/bg-leaderboard.png';
import crown from '@/assets/landing-page/crown.png';
import section1 from '@/assets/landing-page/section-1.png';
import vectorLeft from '@/assets/landing-page/vector-left.png';
import vector from '@/assets/landing-page/vector-product.png';
import vectorRight from '@/assets/landing-page/vector-right.png';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Section1(): React.ReactElement {
  const { t } = useTranslation();
  const [dataLeaderboard, setDataLeaderboard] = useState<leaderboard[]>([]);

  const devUrl =
    process?.env?.NEXT_PUBLIC_URL ?? 'https://seeds-dev-gcp.seeds.finance';
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const url: string = devUrl ?? '';
      if (url === '') {
        console.error('devUrl is an empty string.');
      } else {
        try {
          const response = await fetch(
            `${devUrl}/play/v1/leaderboard?page=1&limit=3`
          );
          if (response.ok) {
            const data = await response.json();
            setDataLeaderboard(data?.playLeaderboards);
          } else {
            console.error('Error fetching data:', response.status);
          }
          return undefined;
        } catch (error) {
          console.error('Error fetching data:', error);
          return undefined;
        }
      }
      return undefined;
    };

    if (typeof devUrl === 'string' && devUrl !== '') {
      fetchData().catch(error => {
        console.error('Error fetching data:', error);
      });
    } else {
      console.error('devUrl is not a valid string or is an empty string.');
    }
  }, []);
  interface leaderboard {
    user_id: string;
    avatar_url: string;
    user_full_name: string;
    user_seeds_tag: string;
    total_play: number;
    total_win: number;
    total_lose: number;
    win_rate: number;
    points: number;
    current_rank: number;
    verified: boolean;
    label: string;
  }
  return (
    <div className="min-w-full cursor-default font-poppins">
      <div className="flex flex-col md:flex-row h-[100vh]">
        <div className="w-full md:w-1/2 flex items-center">
          <Image
            alt="img"
            className="absolute left-0 -z-10 -top-5 xl:block hidden"
            src={vector}
          />
          <div className="w-2/3 justify-center p-5 md:w-full md:ml-5">
            <Typography
              className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#7555DA] to-[#4FE6AF]
                                            md:text-2xl
                                            lg:text-5xl
                                            xl:text-6xl"
            >
              {t('landingPageV2.product.section1.title1')}
            </Typography>
            <Typography
              className="text-xl font-semibold text-black
                                            md:text-2xl
                                            lg:text-5xl
                                            xl:text-6xl"
            >
              {t('landingPageV2.product.section1.title2')}
            </Typography>
            <Typography
              className="text-xs font-light mt-4 text-neutral-soft
                                            md:text-sm
                                            lg:text-lg
                                            xl:text-xl xl:mr-14"
            >
              {t('landingPageV2.product.section1.subtitle')}
            </Typography>
          </div>
        </div>

        <div className="w-full cursor-default md:w-1/2">
          <Image
            alt="img"
            className="xl:block xl:-mt-[100px] -mt-[150px]"
            src={section1}
          />
        </div>
      </div>
      <Image
        alt="img"
        className="absolute left-0 -z-10 mt-[100px] xl:block hidden"
        src={bgGradient}
      />
      <Image
        alt="img"
        className="absolute left-0 -z-10 xl:mt-10 xl:block hidden"
        src={vectorLeft}
      />
      <Image
        alt="img"
        className="absolute right-0 -z-10 xl:mt-10 xl:block hidden"
        src={vectorRight}
      />
      <div className="mt-[200px] xl:mt-[300px] text-3xl font-semibold text-[#222222] justify-center text-center flex flex-col px-5">
        <h1 className="text-3xl xl:text-[64px] xl:mb-10 font-semibold">
          {t('landingPageV2.product.section2.title1')}
        </h1>
        <p className="text-lg font-normal mt-4">
          {t('landingPageV2.product.section2.title2')}
        </p>
        <Image src={crown} alt="crown" className="w-20 mx-auto my-5" />
        <section className="flex flex-col justify-center xl:gap-5 xl:flex-row">
          <section className="xl:hidden block">
            <Image
              src={dataLeaderboard?.[0]?.avatar_url}
              alt={dataLeaderboard?.[0]?.user_id}
              width={289}
              height={289}
              className="z-10 mx-auto rounded-2xl border border-black/10"
            />
            <section className="w-12 h-12 bg-[#FDBA22] mx-auto -mt-6 z-40 relative rounded-full">
              <p className="text-xl font-semibold text-white align-middle justify-center text-center py-2">
                {dataLeaderboard?.[0]?.current_rank}st
              </p>
            </section>
            <h1 className="my-3">{dataLeaderboard?.[0]?.user_full_name}</h1>
            <section className="bg-[#FFF7D280] flex flex-row justify-center text-[#3AC4A0] px-3 py-2 text-xl font-semibold rounded-lg w-[200px] mx-auto mb-6">
              Win Rate
              <span className="flex flex-row items-center text-xs font-semibold ml-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="14"
                  viewBox="0 0 15 14"
                  fill="none"
                >
                  <path
                    d="M1.35101 10.9196C1.21672 10.9196 1.06004 10.8749 0.948133 10.763C0.72432 10.5393 0.72432 10.1814 0.948133 9.98013L5.15584 5.77494C5.37965 5.55126 5.73775 5.55126 5.93918 5.77494L8.33397 8.16832L13.2579 3.24735C13.4817 3.02367 13.8398 3.02367 14.0412 3.24735C14.265 3.47103 14.265 3.82892 14.0412 4.03023L8.71447 9.35383C8.49066 9.57751 8.13256 9.57751 7.93113 9.35383L5.53631 6.96044L1.73148 10.763C1.64195 10.8749 1.50768 10.9196 1.35101 10.9196Z"
                    fill="#3AC4A0"
                  />
                  <path
                    d="M13.6611 7.56467C13.3478 7.56467 13.1016 7.31862 13.1016 7.00547V4.20947H10.3039C9.99058 4.20947 9.74438 3.96342 9.74438 3.65027C9.74438 3.33711 9.99058 3.09106 10.3039 3.09106H13.6611C13.9745 3.09106 14.2207 3.33711 14.2207 3.65027V7.00547C14.2207 7.31862 13.9745 7.56467 13.6611 7.56467Z"
                    fill="#3AC4A0"
                  />
                </svg>
                ({dataLeaderboard?.[0]?.win_rate}%)
              </span>
            </section>
          </section>
          <section className="xl:mt-10">
            <Image
              src={dataLeaderboard?.[1]?.avatar_url}
              alt={dataLeaderboard?.[1]?.user_id}
              width={289}
              height={289}
              className="z-10 mx-auto rounded-2xl border border-black/10"
            />
            <section className="w-12 h-12 bg-[#7555DA] mx-auto -mt-6 z-40 relative rounded-full">
              <p className="text-xl font-semibold text-white align-middle justify-center text-center py-2">
                {dataLeaderboard?.[1]?.current_rank}nd
              </p>
            </section>
            <h1 className="my-3">{dataLeaderboard?.[1]?.user_full_name}</h1>
            <section className="bg-[#7555DA]/10 text-[#3AC4A0] flex flex-row justify-center px-3 py-2 text-xl font-semibold rounded-lg w-[200px] mx-auto mb-6">
              Win Rate
              <span className="flex flex-row items-center text-xs font-semibold ml-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="14"
                  viewBox="0 0 15 14"
                  fill="none"
                >
                  <path
                    d="M1.35101 10.9196C1.21672 10.9196 1.06004 10.8749 0.948133 10.763C0.72432 10.5393 0.72432 10.1814 0.948133 9.98013L5.15584 5.77494C5.37965 5.55126 5.73775 5.55126 5.93918 5.77494L8.33397 8.16832L13.2579 3.24735C13.4817 3.02367 13.8398 3.02367 14.0412 3.24735C14.265 3.47103 14.265 3.82892 14.0412 4.03023L8.71447 9.35383C8.49066 9.57751 8.13256 9.57751 7.93113 9.35383L5.53631 6.96044L1.73148 10.763C1.64195 10.8749 1.50768 10.9196 1.35101 10.9196Z"
                    fill="#3AC4A0"
                  />
                  <path
                    d="M13.6611 7.56467C13.3478 7.56467 13.1016 7.31862 13.1016 7.00547V4.20947H10.3039C9.99058 4.20947 9.74438 3.96342 9.74438 3.65027C9.74438 3.33711 9.99058 3.09106 10.3039 3.09106H13.6611C13.9745 3.09106 14.2207 3.33711 14.2207 3.65027V7.00547C14.2207 7.31862 13.9745 7.56467 13.6611 7.56467Z"
                    fill="#3AC4A0"
                  />
                </svg>
                ({dataLeaderboard?.[1]?.win_rate}%)
              </span>
            </section>
          </section>
          <section className="xl:block hidden">
            <Image
              src={dataLeaderboard?.[0]?.avatar_url}
              alt={dataLeaderboard?.[0]?.user_id}
              width={289}
              height={289}
              className="z-10 mx-auto rounded-2xl border border-black/10"
            />
            <section className="w-12 h-12 bg-[#FDBA22] mx-auto -mt-6 z-40 relative rounded-full">
              <p className="text-xl font-semibold text-white align-middle justify-center text-center py-2">
                {dataLeaderboard?.[0]?.current_rank}st
              </p>
            </section>
            <h1 className="my-3">{dataLeaderboard?.[0]?.user_full_name}</h1>
            <section className="bg-[#FFF7D280] text-[#3AC4A0] flex flex-row justify-center px-3 py-2 text-xl font-semibold rounded-lg w-[200px] mx-auto mb-6">
              Win Rate
              <span className="flex flex-row items-center text-xs font-semibold ml-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="14"
                  viewBox="0 0 15 14"
                  fill="none"
                >
                  <path
                    d="M1.35101 10.9196C1.21672 10.9196 1.06004 10.8749 0.948133 10.763C0.72432 10.5393 0.72432 10.1814 0.948133 9.98013L5.15584 5.77494C5.37965 5.55126 5.73775 5.55126 5.93918 5.77494L8.33397 8.16832L13.2579 3.24735C13.4817 3.02367 13.8398 3.02367 14.0412 3.24735C14.265 3.47103 14.265 3.82892 14.0412 4.03023L8.71447 9.35383C8.49066 9.57751 8.13256 9.57751 7.93113 9.35383L5.53631 6.96044L1.73148 10.763C1.64195 10.8749 1.50768 10.9196 1.35101 10.9196Z"
                    fill="#3AC4A0"
                  />
                  <path
                    d="M13.6611 7.56467C13.3478 7.56467 13.1016 7.31862 13.1016 7.00547V4.20947H10.3039C9.99058 4.20947 9.74438 3.96342 9.74438 3.65027C9.74438 3.33711 9.99058 3.09106 10.3039 3.09106H13.6611C13.9745 3.09106 14.2207 3.33711 14.2207 3.65027V7.00547C14.2207 7.31862 13.9745 7.56467 13.6611 7.56467Z"
                    fill="#3AC4A0"
                  />
                </svg>
                ({dataLeaderboard?.[0]?.win_rate}%)
              </span>
            </section>
          </section>
          <section className="xl:mt-10">
            <Image
              src={dataLeaderboard?.[2]?.avatar_url}
              alt={dataLeaderboard?.[2]?.user_id}
              width={289}
              height={289}
              className="z-10 mx-auto rounded-2xl border border-black/10"
            />
            <section className="w-12 h-12 bg-[#FF8560] mx-auto -mt-6 z-40 relative rounded-full">
              <p className="text-xl font-semibold text-white align-middle justify-center text-center py-2">
                {dataLeaderboard?.[2]?.current_rank}rd
              </p>
            </section>
            <h1 className="my-3">{dataLeaderboard?.[2]?.user_full_name}</h1>
            <section className="bg-[#FF4A2B]/10 flex flex-row justify-center text-[#3AC4A0] px-3 py-2 text-xl font-semibold rounded-lg w-[200px] mx-auto mb-10">
              Win Rate
              <span className="flex flex-row items-center text-xs font-semibold ml-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="14"
                  viewBox="0 0 15 14"
                  fill="none"
                >
                  <path
                    d="M1.35101 10.9196C1.21672 10.9196 1.06004 10.8749 0.948133 10.763C0.72432 10.5393 0.72432 10.1814 0.948133 9.98013L5.15584 5.77494C5.37965 5.55126 5.73775 5.55126 5.93918 5.77494L8.33397 8.16832L13.2579 3.24735C13.4817 3.02367 13.8398 3.02367 14.0412 3.24735C14.265 3.47103 14.265 3.82892 14.0412 4.03023L8.71447 9.35383C8.49066 9.57751 8.13256 9.57751 7.93113 9.35383L5.53631 6.96044L1.73148 10.763C1.64195 10.8749 1.50768 10.9196 1.35101 10.9196Z"
                    fill="#3AC4A0"
                  />
                  <path
                    d="M13.6611 7.56467C13.3478 7.56467 13.1016 7.31862 13.1016 7.00547V4.20947H10.3039C9.99058 4.20947 9.74438 3.96342 9.74438 3.65027C9.74438 3.33711 9.99058 3.09106 10.3039 3.09106H13.6611C13.9745 3.09106 14.2207 3.33711 14.2207 3.65027V7.00547C14.2207 7.31862 13.9745 7.56467 13.6611 7.56467Z"
                    fill="#3AC4A0"
                  />
                </svg>
                ({dataLeaderboard?.[2]?.win_rate}%)
              </span>
            </section>
          </section>
        </section>
      </div>
    </div>
  );
}
