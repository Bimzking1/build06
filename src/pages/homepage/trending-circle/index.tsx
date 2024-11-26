import ArtPagination from '@/components/ArtPagination';
import CCard from '@/components/CCard';
import CardCircle from '@/components/circle/CardCircle';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import { getCircle } from '@/repository/circle.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export interface CircleListRoot {
  CircleList: Circle[];
  metadata: Metadata;
}

interface Circle {
  id: string;
  name: string;
  avatar: string;
  cover: string;
  description: string;
  description_rules: string;
  type: string;
  premium_fee: number;
  admin_fee: number;
  monthly_time: number;
  total_rating: number;
  total_member: number;
  total_post: number;
  created_at: string;
  updated_at: string;
}

export interface Metadata {
  currentPage: number;
  limit: number;
  totalPage: number;
  total: number;
}

interface Filter {
  search: string;
  limit: number;
  page: number;
  sort_by: string;
}

const initialFilter: Filter = {
  search: '',
  limit: 10,
  page: 1,
  sort_by: 'rating'
};

const initialMetadata: Metadata = {
  currentPage: 1,
  limit: 10,
  totalPage: 10,
  total: 100
};

const optionSortBy = [
  { label: 'All', value: 'all' },
  { label: 'Rating', value: 'rating' },
  { label: 'Member', value: 'member' },
  { label: 'Post', value: 'post' }
];

export default function ListCircle(): React.ReactElement {
  const { t } = useTranslation();
  const [circle, setCircle] = useState<Circle[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [metadata, setMetadata] = useState<Metadata>(initialMetadata);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [userInfo, setUserInfo] = useState<any>([]);

  const fetchDataCircle = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await getCircle(filter);
      if (response.data === null) {
        setCircle([]);
      } else {
        setCircle(response.data);
        setMetadata(response.metadata);
      }
      setIsLoading(false);
    } catch (error) {
      toast('Error fetching circles');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchDataCircle();
  }, [filter]);

  useEffect(() => {
    setFilter(prevParams => ({
      ...prevParams,
      search: searchInput,
      page: 1
    }));
  }, [searchInput]);

  useEffect(() => {
    if (searchInput.length === 0) {
      void fetchDataCircle();
    }
  }, [searchInput.length]);

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

  return (
    <PageGradient defaultGradient className="w-full">
      <CCard className="flex flex-col w-full p-5 border-none rounded-xl bg-white">
        <div className="flex z-10 flex-col lg:flex-row justify-between">
          <div className="flex flex-col">
            <div className="text-3xl font-semibold bg-clip-text text-black">
              {t('discover.circleList')}
            </div>
            <div className=" text-md font-normal text-gray-500">
              {t('discover.exploreCircleList')}
            </div>
          </div>
          <div className="lg:flex-col justify-end mt-4  ">
            <div className="w-full lg:w-[300px] lg:h-[40px] bg-white rounded-3xl flex border-black border-[1px] px-[8px] justify-between ">
              <input
                type="search"
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
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setFilter(prevState => ({
                    ...prevState,
                    sort_by: e.target.value
                  }));
                }}
              >
                {optionSortBy?.map((data, idx) => (
                  <option key={idx} value={data.value}>
                    {data.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="lg:hidden z-10 flex justify-end mt-5">
          <div className=" justify-end lg:hidden first-line:mt-2 font-normal text-base mx-3 text-[#7C7C7C]">
            {t('articleList.text3')}
          </div>
          <select
            className="me-5 justify-end bg-transparent mt-1 lg:hidden text-base font-semibold"
            aria-label="All"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setFilter(prevState => ({
                ...prevState,
                sort_by: e.target.value
              }));
            }}
          >
            {optionSortBy?.map((data, idx) => (
              <option key={idx} value={data.value}>
                {data.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap mt-6">
          {!isLoading ? (
            circle.length !== 0 ? (
              circle.map((data: Circle, idx: number) => {
                return (
                  <div key={idx} className="w-full md:w-1/2 mb-5">
                    <CardCircle
                      data={data}
                      cover={data.cover}
                      userInfo={userInfo}
                    />
                  </div>
                );
              })
            ) : (
              <Typography className="text-base w-full font-semibold text-[#262626] text-center items-center">
                {t('discover.dataNotFound')}
              </Typography>
            )
          ) : (
            <Typography className="text-base w-full font-semibold text-[#262626] text-center items-center">
              Loading...
            </Typography>
          )}
        </div>

        <div className="flex justify-center mx-auto my-4">
          <ArtPagination
            currentPage={filter.page}
            totalPages={metadata.totalPage}
            onPageChange={page => {
              setFilter({ ...filter, page });
            }}
          />
        </div>
      </CCard>
    </PageGradient>
  );
}
