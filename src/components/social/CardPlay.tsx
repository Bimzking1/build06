import { generateFormattedDate } from '@/helpers/dateFormat';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import {
  ClockIcon,
  ShareIcon,
  TagIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { Button, Card, Typography } from '@material-tailwind/react';
import moment from 'moment';
import Image from 'next/image';
import React from 'react';

interface props {
  data: IPlay;
}

interface IPlay {
  id: string;
  banner: string;
  play_id: string;
  name: string;
  category: string;
  type: string;
  publish_time: string;
  open_registration_time: string;
  play_time: string;
  end_time: string;
  min_participant: number;
  max_participant: number;
  opening_balance: number;
  admission_fee: number;
  fee_percentage: number;
  winner: string | null;
  winner_percentage: number[];
  prize_fix_amount: number;
  prize_pool_amount: number;
  participants: any[];
  is_joined: boolean;
  created_by_user_id: string;
  created_by_admin_id: string;
  created_at: string;
  updated_at: string;
  updated_by: string;
}

const CardPlay: React.FC<props> = ({ data }) => {
  const width = useWindowInnerWidth();

  const calculateDaysLeft = React.useMemo((): number => {
    const daysDiff = moment(data.end_time).diff(moment(data.play_time), 'days');
    return daysDiff;
  }, [data.play_time, data.end_time]);

  return (
    <div className="flex flex-row">
      <div className="w-[14%] p-4">
        <Typography className="text-black font-normal text-xl">
          {moment(data.play_time).format('MMM')}
        </Typography>
        <Typography className="text-3xl text-black font-semibold">
          {moment(data?.play_time).format('DD')}
        </Typography>
      </div>
      <Card
        shadow={false}
        className="w-full my-3 border border-[#E9E9E9]"
        style={{
          borderTopLeftRadius: width !== undefined ? width * 0.03 : 0,
          borderTopRightRadius: width !== undefined ? width * 0.03 : 0
        }}
      >
        <Image
          src={
            data.banner !== undefined
              ? data.banner
              : 'https://dev-assets.seeds.finance/storage/cloud/4868a60b-90e3-4b81-b553-084ad85b1893.png'
          }
          alt={data.name}
          layout="responsive"
          width={100}
          height={100}
          className="w-full"
          style={{
            borderTopLeftRadius: width !== undefined ? width * 0.03 : 0,
            borderTopRightRadius: width !== undefined ? width * 0.03 : 0
          }}
        />
        <div className="p-4">
          <div className="flex flex-row justify-between">
            <Typography className="font-semibold text-xs text-black">
              {data.name}
            </Typography>
            <Typography className="text-[#553BB8] text-[10px] bg-[#F7F7F7] py-1 px-2">
              {data.type}
            </Typography>
          </div>
          <Typography className="text-[#BDBDBD] font-normal text-xs">
            {`${generateFormattedDate(
              data.play_time,
              false
            )} - ${generateFormattedDate(data.end_time)}`}
          </Typography>
          <div className="bg-[#F7F7F7] rounded-lg mt-1 flex flex-row w-full">
            <div className="flex flex-row items-center py-2 px-1 w-1/3">
              <ClockIcon
                width={20}
                height={20}
                className="mr-2 text-[#3AC4A0]"
              />
              <div className="flex-col">
                <Typography className="text-xs font-normal">
                  Duration
                </Typography>
                <Typography className="text-xs text-black font-semibold">
                  {calculateDaysLeft < 0 ? ' - ' : ` ${calculateDaysLeft} `}{' '}
                  Days
                </Typography>
              </div>
            </div>
            {/* <div className="border-l border-r border-[#3AC4A0] h-6"></div> */}
            <div
              className="flex flex-row items-center p-1 w-1/3"
              style={{
                borderLeftColor: '#3AC4A0',
                borderLeftWidth: 1
              }}
            >
              <UsersIcon
                width={20}
                height={20}
                className="mr-2 text-[#3AC4A0]"
              />
              <div className="flex-col">
                <Typography className="text-xs font-normal">Joined</Typography>
                <Typography className="text-xs text-black font-semibold">
                  {data.participants !== null ? data.participants.length : 0}{' '}
                  Players
                </Typography>
              </div>
            </div>
            <div
              className="flex flex-row items-center p-1 w-1/3"
              style={{
                borderLeftColor: '#3AC4A0',
                borderLeftWidth: 1
              }}
            >
              <TagIcon width={20} height={20} className="mr-2 text-[#3AC4A0]" />
              <div className="flex-col">
                <Typography className="text-xs font-normal">Fee</Typography>
                <Typography className="text-xs text-black font-semibold">
                  IDR. {data.admission_fee}
                </Typography>
              </div>
            </div>
          </div>
          <hr className="border-dashed text-black my-2" />
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center">
              <Typography className="text-[#27A590] text-sm bg-[#DCFCE4] py-2 px-4 rounded-xl">
                {data.category}
              </Typography>
              <div className="flex flex-row mx-2">
                <ShareIcon
                  width={30}
                  height={30}
                  className="mr-2 text-[#3AC4A0] bg-[#DCFCE4] p-1 rounded-full"
                />
                <Typography className="text-black text-xs">Share</Typography>
              </div>
            </div>

            <Button className="bg-[#3AC4A0] font-semibold rounded-2xl text-xs py-2 px-4">
              Open
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CardPlay;
