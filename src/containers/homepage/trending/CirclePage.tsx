import { isGuest } from '@/helpers/guest';
import { getTrendingCircle } from '@/repository/asset.repository';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import CircleTrendingCard from './CircleTrendingCard';

export interface CircleInterface {
  banner: string;
  id: string;
  image: string;
  is_liked: false;
  name: string;
  totalMember: number;
  totalPost: number;
  totalRating: number;
  total_like: number;
}

export default function CirclePage(): React.ReactElement {
  const [circle, setCircle] = useState<CircleInterface[]>([]);
  async function fetchArticles(): Promise<void> {
    try {
      const response = await getTrendingCircle({
        page: 1,
        limit: 3
      });
      if (response.status === 200) {
        setCircle(response.result);
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
        {circle.length !== 0 &&
          circle?.map((data, idx) => (
            <div key={idx} className="w-full sm:w-1/2 lg:w-1/3 mb-5">
              <CircleTrendingCard
                data={data}
                cover={data.banner}
                isResponsive
              />
            </div>
          ))}
      </div>
      <div className="text-center justify-center mt-3">
        <Link
          href={isGuest() ? '/auth' : '/homepage/trending-circle'}
          className="text-md mt-3 font-normal text-[#3AC4A0]"
        >
          See More
        </Link>
      </div>
    </>
  );
}
