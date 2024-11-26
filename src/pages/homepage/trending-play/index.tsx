import { generateFormattedDate } from '@/helpers/dateFormat';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import { getTrendingPlayList } from '@/repository/play.repository';
import {
  ClockIcon,
  ShareIcon,
  TagIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
// import moment from 'moment';
import { Button, Card, Typography } from '@material-tailwind/react';
import Image from 'next/image';

export interface PlayInterface {
  id: string;
  play_id: string;
  name: string;
  banner: string;
  prize_fix_amount: number;
  prize_pool_amount: number;
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
  participants: any[];
  is_joined: boolean;
  created_by_user_id: string;
  created_by_admin_id: string;
  created_at: string;
  updated_at: string;
  updated_by: string;
}

export default function PlayList(): React.ReactElement {
  const [play, setPlay] = useState<PlayInterface[]>([]);

  const width = useWindowInnerWidth();

  async function fetchPlays(): Promise<void> {
    try {
      const response = await getTrendingPlayList();
      console.log(response, 'play');

      setPlay(response.data);
    } catch (error) {
      console.error('Error fetching circles:', error);
    }
  }

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await fetchPlays();
    };

    fetchData().catch(error => {
      console.error('Error in fetchData:', error);
    });
  }, []);

  return (
    <>
      <div className="flex flex-wrap w-full">
        {play.length !== 0 &&
          play.slice(0, 3).map((data, idx) => (
            <div key={idx} className={'flex w-full sm:w-1/2 lg:w-1/3 mb-5'}>
              <div className="mx-2 mt-2">
                <Typography className="text-[10.47px] font-poppins text-[#262626] font-normal">
                  AUG
                </Typography>
                <Typography className="text-[25.42px] font-poppins text-[#262626] font-semibold">
                  18
                </Typography>
              </div>
              <Card
                shadow={false}
                className="w-full my-3 border border-[#E9E9E9]"
                style={{
                  borderTopLeftRadius: width !== undefined ? width * 0.01 : 0,
                  borderTopRightRadius: width !== undefined ? width * 0.01 : 0
                }}
              >
                <Image
                  src={
                    data.banner !== undefined && data.banner !== ''
                      ? data.banner
                      : 'https://dev-assets.seeds.finance/storage/cloud/4868a60b-90e3-4b81-b553-084ad85b1893.png'
                  }
                  alt={data.name}
                  layout="responsive"
                  width={100}
                  height={100}
                  className="w-full  h-[81px]"
                  style={{
                    borderTopLeftRadius: width !== undefined ? width * 0.03 : 0,
                    borderTopRightRadius: width !== undefined ? width * 0.03 : 0
                  }}
                />

                <div className="px-1 py-2">
                  <div className="flex flex-row justify-between mx-1">
                    <Typography className="font-semibold font-poppins text-[10.17px] text-[#262626]">
                      {data.name}
                    </Typography>
                    <Typography className="text-[#553BB8] rounded-lg text-[8.47px] font-poppins bg-[#F7F7F7] py-[1.69px] px-[4.24px]">
                      {data.type}
                    </Typography>
                  </div>
                  <Typography className="mx-1 text-[#BDBDBD] font-poppins text-[8.47px]">
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
                        className="mr-2 w-[12.71px] h-[12.71px] text-[#3AC4A0]"
                      />
                      <div className="flex-col">
                        <Typography className="text-[8.47px] font-poppins text-[#262626]font-normal">
                          Duration
                        </Typography>
                        {/* <Typography className="text-[8.47px] font-poppins text-[#262626] font-semibold">
                          {calculateDaysLeft < 0
                            ? ' - '
                            : ` ${calculateDaysLeft} `}{' '}
                          Days
                        </Typography> */}
                      </div>
                    </div>
                    {/* <div className="border-l border-r border-[#3AC4A0] h-6"></div> */}
                    <div
                      className="flex flex-row items-center p-1 w-1/3"
                      style={{
                        borderLeftColor: '#D9D9D9',
                        borderLeftWidth: 1
                      }}
                    >
                      <UsersIcon
                        width={20}
                        height={20}
                        className="mr-2 w-[12.71px] h-[12.71px] text-[#3AC4A0]"
                      />
                      <div className="flex-col">
                        <Typography className="text-[8.47px] font-poppins text-[#262626] font-normal">
                          Joined
                        </Typography>
                        <Typography className="text-[8.47px] font-poppins text-[#262626] font-semibold">
                          {data.participants !== null
                            ? data.participants.length
                            : 0}{' '}
                          Players
                        </Typography>
                      </div>
                    </div>
                    <div
                      className="flex flex-row items-center p-1 w-1/3"
                      style={{
                        borderLeftColor: '#D9D9D9',
                        borderLeftWidth: 1
                      }}
                    >
                      <TagIcon
                        width={20}
                        height={20}
                        className="mr-2 w-[12.71px] h-[12.71px] text-[#3AC4A0]"
                      />
                      <div className="flex-col">
                        <Typography className="text-[8.47px] font-poppins text-[#262626] font-normal">
                          Fee
                        </Typography>
                        <Typography className="text-[8.47px] font-poppins text-[#262626] font-semibold">
                          IDR. {data.admission_fee}
                        </Typography>
                      </div>
                    </div>
                  </div>
                  <hr className="border-dashed text-black my-2" />
                  <div className="flex mx-1 flex-row items-center justify-between">
                    <div className="flex flex-row items-center">
                      <Typography className="text-[#27A590] bg-[#DCFCE4] text-[8.47px] font-poppins py-[4.24px] px-1 rounded-[6.78px]">
                        {data.category}
                      </Typography>
                      <div className="flex flex-row mx-2">
                        <ShareIcon
                          width={30}
                          height={30}
                          className="mr-2 text-[#3AC4A0] bg-[#DCFCE4] w-[16.95px] h-[16.95px] p-1 rounded-full"
                        />
                        <Typography className="text-[10.17px] font-poppins text-[#262626]">
                          Share
                        </Typography>
                      </div>
                    </div>

                    <Button className="bg-[#3AC4A0] font-semibold rounded-[593.17px] text-[8.47px] font-poppins text-[#FFFFFF] py-[6.78px] px-5">
                      Open
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ))}
      </div>
    </>
  );
}
