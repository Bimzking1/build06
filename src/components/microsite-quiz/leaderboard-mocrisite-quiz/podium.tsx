import rank1Box from '@/assets/play/quiz/rank1Box.svg';
import rank2Box from '@/assets/play/quiz/rank2Box.svg';
import rank3Box from '@/assets/play/quiz/rank3Box.svg';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';

export interface LeaderData {
  id: string;
  quiz_id: string;
  user_id: string;
  name: string;
  seeds_tag: string;
  avatar: string;
  verified: boolean;
  score: number;
  rank: number;
  created_at: string;
  updated_at: string;
}

interface Leaderboard {
  leaderboard: LeaderData[];
}

const Podium: React.FC<Leaderboard> = ({ leaderboard }: Leaderboard) => {
  return (
    <div className="flex justify-center items-end pt-3">
      <div className="flex flex-col gap-2">
        <div>
          <div className="flex flex-col justify-center items-center">
            <img
              src={leaderboard?.[1]?.avatar}
              alt={leaderboard?.[1]?.name.split('_')[0]}
              className="z-0 w-16 h-16 rounded-2xl border-white border-2"
            />
            <Typography className="z-10 w-7 h-7 -mt-[10%] rounded-full bg-[#7555DA] text-sm font-normal font-poppins text-white text-center flex justify-center items-center">
              2
            </Typography>
          </div>
          <div className="flex flex-col gap-1">
            <Typography className="text-base text-center font-poppins font-semibold text-[#FFFFFF] max-w-[120px]">
              {leaderboard?.[1]?.name.split('_')[0]}
            </Typography>
            <Typography className="text-sm text-center font-poppins font-normal text-[#FFFFFF]">
              {leaderboard?.[1]?.score}
            </Typography>
          </div>
        </div>
        <Image src={rank2Box} alt="Next" width={128} height={32} />
      </div>
      <div className="flex flex-col gap-2">
        <div>
          <div className="flex flex-col gap-1">
            <svg
              width="45"
              height="34"
              viewBox="0 0 45 34"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto"
            >
              <path
                d="M43.2564 7.78155C42.8274 7.42339 42.3063 7.19305 41.7527 7.1168C41.199 7.04054 40.6351 7.12146 40.1252 7.3503L30.6377 11.5691L25.1252 1.63155C24.8617 1.1676 24.48 0.781762 24.0189 0.513344C23.5578 0.244926 23.0337 0.103516 22.5002 0.103516C21.9667 0.103516 21.4426 0.244926 20.9815 0.513344C20.5204 0.781762 20.1387 1.1676 19.8752 1.63155L14.3627 11.5691L4.8752 7.3503C4.36427 7.12179 3.79961 7.04077 3.24505 7.1164C2.69048 7.19202 2.16813 7.42127 1.73705 7.77823C1.30596 8.1352 0.983325 8.60564 0.805619 9.13638C0.627914 9.66711 0.602223 10.237 0.73145 10.7816L5.49395 31.0878C5.58502 31.4809 5.75495 31.8515 5.99345 32.177C6.23194 32.5025 6.53405 32.7762 6.88145 32.9816C7.35178 33.2631 7.88954 33.4121 8.4377 33.4128C8.70417 33.4123 8.96925 33.3744 9.2252 33.3003C17.9061 30.9002 27.0755 30.9002 35.7564 33.3003C36.5491 33.5087 37.392 33.394 38.1002 32.9816C38.4497 32.7788 38.7535 32.5059 38.9923 32.18C39.2311 31.854 39.3998 31.4822 39.4877 31.0878L44.2689 10.7816C44.3967 10.2368 44.3696 9.66723 44.1907 9.1371C44.0118 8.60697 43.6882 8.13744 43.2564 7.78155ZM36.5627 30.4128C27.3547 27.8628 17.6269 27.8628 8.41895 30.4128L3.65645 10.1066L13.1439 14.3066C13.8247 14.616 14.5974 14.6566 15.3068 14.4201C16.0163 14.1836 16.61 13.6876 16.9689 13.0316L22.5002 3.09405L28.0314 13.0316C28.3904 13.6876 28.9841 14.1836 29.6936 14.4201C30.403 14.6566 31.1757 14.616 31.8564 14.3066L41.3439 10.1066L36.5627 30.4128ZM30.0002 24.4691C29.9589 24.8387 29.7833 25.1804 29.5068 25.4292C29.2304 25.678 28.8722 25.8168 28.5002 25.819H28.3502C24.4601 25.4253 20.5403 25.4253 16.6502 25.819C16.2549 25.8611 15.8591 25.7445 15.5497 25.4949C15.2403 25.2453 15.0427 24.883 15.0002 24.4878C14.9634 24.0906 15.0844 23.6949 15.337 23.3861C15.5896 23.0774 15.9536 22.8804 16.3502 22.8378C20.4389 22.4066 24.5615 22.4066 28.6502 22.8378C29.0433 22.8805 29.4042 23.0748 29.6563 23.3794C29.9084 23.684 30.0318 24.0749 30.0002 24.4691Z"
                fill="white"
              />
            </svg>
            <div className="flex flex-col justify-center items-center">
              <img
                src={leaderboard?.[0]?.avatar}
                alt={leaderboard?.[0]?.name.split('_')[0]}
                className="z-0 w-16 h-16 rounded-2xl border-white border-2"
              />
              <Typography className="z-10 w-7 h-7 -mt-[10%] rounded-full bg-white text-sm font-normal font-poppins text-[#27A590] text-center flex justify-center items-center">
                1
              </Typography>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <Typography className="text-base text-center font-poppins font-semibold text-[#FFFFFF] max-w-[120px]">
              {leaderboard?.[0]?.name.split('_')[0]}
            </Typography>
            <Typography className="text-sm text-center font-poppins font-normal text-[#FFFFFF]">
              {leaderboard?.[0]?.score}
            </Typography>
          </div>
        </div>
        <Image src={rank1Box} alt="Next" width={128} height={32} />
      </div>
      <div className="flex flex-col gap-2">
        <div>
          <div className="flex flex-col justify-center items-center">
            <img
              src={leaderboard?.[2]?.avatar}
              alt={leaderboard?.[2]?.name.split('_')[0]}
              className="z-0 w-16 h-16 rounded-2xl border-white border-2"
            />
            <Typography className="z-10 w-7 h-7 -mt-[10%] rounded-full bg-[#FDBA22] text-sm font-normal font-poppins text-white text-center flex justify-center items-center">
              3
            </Typography>
          </div>
          <div className="flex flex-col gap-1">
            <Typography className="text-base text-center font-poppins font-semibold text-[#FFFFFF] max-w-[120px]">
              {leaderboard?.[2]?.name.split('_')[0]}
            </Typography>
            <Typography className="text-sm text-center font-poppins font-normal text-[#FFFFFF]">
              {leaderboard?.[2]?.score}
            </Typography>
          </div>
        </div>
        <Image src={rank3Box} alt="Next" width={128} height={32} />
      </div>
    </div>
  );
};

export default Podium;
