import FollowButton from '@/components/FollowButton';
import { isGuest } from '@/helpers/guest';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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

export default function PeoplePage(): React.ReactElement {
  const { t } = useTranslation();

  const [people, setPeople] = useState<PeopleInterface[]>([]);
  async function fetchArticles(): Promise<void> {
    try {
      const response = await getTrendingPeople({
        page: 1,
        limit: 3,
        is_cache_enabled: false
      });
      console.log(response, 'k');

      if (response.status === 200) {
        setPeople(response.result);
      } else {
        console.error('Failed to fetch circles:', response);
      }
    } catch (error) {
      console.error('Error fetching circles:', error);
    }
  }

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await fetchArticles();
    };

    fetchData().catch(error => {
      console.error('Error in fetchData:', error);
    });
  }, []);

  return (
    <>
      <div className="flex flex-wrap w-full">
        {people.length !== 0 &&
          people?.map((data, idx) => (
            <div
              key={idx}
              className={'w-full p-3 mb-2 rounded-xl border border-[#E9E9E9]'}
            >
              <div className="flex justify-between">
                <div className="flex w-full items-center">
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
                  {isGuest() ? (
                    <></>
                  ) : (
                    <FollowButton
                      userId={data.id}
                      isFollowed={data.isFollowed}
                      customClass="bg-[#3AC4A0] flex gap-2 items-center justify-center rounded-full w-[147px] h-[42px] self-center text-[#FFFFFF] text-base font-semibold font-poppins normal-case"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="text-center justify-center mt-3">
        <Link
          href={isGuest() ? '/auth' : '/homepage/trending-people'}
          className="text-md mt-3 font-normal text-[#3AC4A0]"
        >
          {t('homepage.section2.text14')}
        </Link>
      </div>
    </>
  );
}
