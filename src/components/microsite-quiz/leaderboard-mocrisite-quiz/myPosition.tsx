import { Card, Typography } from '@material-tailwind/react';
import { type LeaderData } from './podium';

interface Props {
  leaderboard: LeaderData[];
  myRank: number;
}

const MyPosition: React.FC<Props> = ({ leaderboard, myRank }: Props) => {
  return (
    <Card
      className={
        'flex flex-row items-center gap-7 border-2 rounded-xl border-[#3AC4A0] w-full py-4 px-2.5'
      }
    >
      <div>
        <p className="font-semibold text-xl text-[#262626] font-poppins text-center">
          {myRank}
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
      {myRank !== undefined && (
        <div className="flex gap-5 items-center">
          <img
            src={leaderboard[myRank - 1]?.avatar}
            alt={leaderboard[myRank - 1]?.name.split('_')[0]}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex flex-col gap-1.5">
            <Typography className="font-semibold font-poppins text-xs text-[#262626]">
              {leaderboard[myRank - 1]?.name.split('_')[0]}
            </Typography>
            <Typography className="font-semibold font-poppins text-xs text-[#1A857D]">
              {leaderboard[myRank - 1]?.score}
            </Typography>
          </div>
        </div>
      )}
    </Card>
  );
};

export default MyPosition;
