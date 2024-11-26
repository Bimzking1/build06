import CCard from '@/components/CCard';
import FollowButton from '@/components/FollowButton';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import { getUserInfo } from '@/repository/profile.repository';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { getTrendingPeople } from '../../../repository/asset.repository';
export interface PeopleInterface {
  avatar: string;
  followers: number;
  followings: number;
  id: string;
  isFollowed: boolean;
  label: string;
  name: string;
  rank: number;
  seedsTag: string;
  verified: boolean;
}

export default function PeopleList(): React.ReactElement {
  const { t } = useTranslation();
  const router = useRouter();
  const [people, setPeople] = useState<PeopleInterface[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [params, setParams] = useState({
    page: 1,
    limit: 15,
    search: '',
    is_cache_enabled: false
  });
  const [userInfo, setUserInfo] = useState<any>();
  const fetchData = async (): Promise<void> => {
    try {
      const dataInfo = await getUserInfo();
      setUserInfo(dataInfo);
    } catch (error: any) {
      toast('Error fetching user data');
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  async function fetchPeople(): Promise<void> {
    try {
      const response = await getTrendingPeople({
        ...params
      });

      if (response.status === 200) {
        setPeople(response.result);
      } else {
        console.error('Failed to fetch circles:', response);
      }
    } catch (error) {
      toast('Error fetching peoples');
    }
  }

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await fetchPeople();
    };

    fetchData().catch(error => {
      console.error('Error in fetchData:', error);
    });
  }, [params]);

  useEffect(() => {
    setParams(prevParams => ({
      ...prevParams,
      search: searchInput,
      page: 1
    }));
  }, [searchInput]);

  useEffect(() => {
    if (searchInput.length === 0 && userInfo !== undefined) {
      void fetchPeople();
    }
  }, [searchInput.length]);

  return (
    <PageGradient defaultGradient className="w-full">
      <CCard className="flex flex-col w-full p-5 border-none rounded-xl">
        <div className="flex justify-between flex-wrap w-full">
          <div className="flex flex-col">
            <div className="text-3xl font-semibold bg-clip-text text-black">
              {t('homepage.section3.text6')}
            </div>
            <div className=" text-md font-normal text-gray-500">
              {t('homepage.section3.text5')}
            </div>
          </div>
          <div className="lg:flex-col  justify-end mt-4  ">
            <div className="w-full lg:w-[300px] lg:h-[40px] bg-white rounded-3xl flex border-black border-[1px] px-[8px] justify-between ">
              <input
                type="text"
                className=" text-[#7C7C7C] w-full border-none rounded-3xl lg:w-[340px] px-[8px] focus:outline-none lg:h-[38px] "
                placeholder="Search"
                aria-label="Search"
                aria-describedby="button-addon2"
                onChange={e => {
                  setSearchInput(e.target.value);
                }}
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
            <div className="lg:flex  justify-end mt-4 ">
              <div className="hidden lg:block mt-2 font-normal text-base mx-3 text-[#7C7C7C]">
                {t('articleList.text3')}
              </div>
              <select
                className="me-5 bg-transparent mt-1 hidden lg:block text-base font-semibold"
                aria-label="All"
              >
                <option value="option1">All</option>
                <option value="option2">All</option>
              </select>
            </div>
          </div>
          {people.length !== 0 &&
            people?.map((data, idx) => (
              <div
                key={idx}
                className={'w-full p-3 my-2 rounded-xl border border-[#E9E9E9]'}
              >
                <div className="flex justify-between">
                  <div
                    className="flex w-full items-center cursor-pointer"
                    onClick={() => {
                      void router.push(`/social/${data.id}`);
                    }}
                  >
                    <img
                      src={data.avatar}
                      alt={data.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="ml-3">
                      <div className="flex">
                        <h2 className="font-bold me-2">{data.name}</h2>
                        {data?.verified && (
                          <div className="mt-[7px] ">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_2012_74470)">
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
                                <clipPath id="clip0_2012_74470">
                                  <rect width="12" height="12" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="font-light text-xs text-[#7C7C7C]">
                        @{data.seedsTag}
                      </p>

                      <p className="font-normal text-xs text-[#262626]">
                        {data.followers} Follower
                      </p>
                    </div>
                  </div>
                  <div>
                    <FollowButton
                      userId={data.id}
                      isFollowed={data.isFollowed}
                      customClass="bg-[#3AC4A0] flex gap-2 items-center justify-center rounded-full w-[147px] h-[42px] self-center text-[#FFFFFF] text-base font-semibold font-poppins normal-case z-20"
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </CCard>
    </PageGradient>
  );
}
