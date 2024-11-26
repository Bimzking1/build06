import PageGradient from '@/components/ui/page-gradient/PageGradient';
import withAuth from '@/helpers/withAuth';
import { blockOtherUser } from '@/repository/profile.repository';
import { getBlocklist } from '@/repository/user.repository';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import blockImage from '../../../assets/block.svg';

interface DataPlayer {
  avatar: string;
  badge: string;
  bio: string;
  birthDate: string;
  city: string;
  community: string;
  email: string;
  email_verification: boolean;
  followers: number;
  following: number;
  id: string;
  isBlocked: boolean;
  isFollowed: boolean;
  last_login_at: string;
  name: string;
  phoneNumber: string;
  preferredCurrency: string;
  preferredLanguage: string;
  refCode: string;
  role: string;
  seedsTag: string;
  userRole: string;
  verified: boolean;
}

const BlockList: React.FC = () => {
  const [blocklistData, setBlocklistData] = useState<DataPlayer[]>([]);

  const handleBlockUnblock = async (userId: string): Promise<void> => {
    try {
      const response = await blockOtherUser({ user_id: userId });
      return response;
    } catch (error: any) {
      toast(error.message, { type: 'error' });
    } finally {
      await fetchData();
    }
  };

  const fetchData = async (): Promise<void> => {
    try {
      const response = await getBlocklist();
      setBlocklistData(response.data);
    } catch (error: any) {
      toast(error.message, { type: 'error' });
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  return (
    <PageGradient defaultGradient className="w-full">
      <div className="w-full justify-center items-center text-center p-2 bg-[#FFFFFF] rounded-2xl  cursor-default">
        <h1 className="text-center text-lg font-semibold mb-5">Block List</h1>
        <div className="w-full mx-auto lg:w-[70%] bg-white rounded-3xl flex border-black border-[1px] p-[8px] justify-between">
          <input
            type="search"
            className="text-[#7C7C7C] w-full border-none rounded-3xl px-[8px] focus:outline-none "
            placeholder="Search"
            aria-label="Search"
            aria-describedby="button-addon2"
            onChange={e => {}}
          />
          <svg
            className="mt-2 me-3"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.5 11H11.71L11.43 10.73C12.41 9.59 13 8.11 13 6.5C13 2.91 10.09 0 6.5 0C2.91 0 0 2.91 0 6.5C0 10.09 2.91 13 6.5 13C8.11 13 9.59 12.41 10.73 11.43L11 11.71V12.5L16 17.49L17.49 16L12.5 11ZM6.5 11C4.01 11 2 8.99 2 6.5C2 4.01 4.01 2 6.5 2C8.99 2 11 4.01 11 6.5C11 8.99 8.99 11 6.5 11Z"
              fill="#262626"
            />
          </svg>
        </div>
        {blocklistData?.map((data, index) => (
          <div
            key={index}
            className={`w-full p-3 mb-2 bg-[#FFFFFF] mt-2 rounded-2xl border border-1`}
          >
            <div className="flex justify-between">
              <div className="flex w-full">
                <Image
                  src={data.avatar}
                  alt={data.name}
                  width={24}
                  height={24}
                  className="w-10 h-10 rounded-full"
                />
                <div className="">
                  <div className="flex">
                    <h2 className="font-bold ms-5 text-sm font-poppins text-[#262626]">
                      {data.name}
                    </h2>
                    <Image
                      src={blockImage}
                      alt="medal"
                      width={12}
                      height={12}
                      className="w-5 ms-2 h-5 rounded-full"
                    />
                  </div>
                  <h1 className="text-[#7C7C7C] mt-2  text-xs font-light font-poppins">
                    @{data.seedsTag}
                  </h1>
                </div>
              </div>
              <div className="mt-2">
                <button
                  onClick={() => {
                    void handleBlockUnblock(data.id);
                  }}
                  className=" bg-[#3AC4A0] text-white text-xs font-semibold px-4 py-2 border rounded-full border-[#3AC4A0]"
                >
                  Unblock
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageGradient>
  );
};

export default withAuth(BlockList);
