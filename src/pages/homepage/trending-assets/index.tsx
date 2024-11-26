import ArtPagination from '@/components/ArtPagination';
import CCard from '@/components/CCard';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import type { AssetsInterface } from '@/containers/homepage/trending/AssetsPage';
import AssetTrendingCard from '@/containers/homepage/trending/AssetsTrendingCard';
import AssetTrendingCardSkeleton from '@/containers/homepage/trending/skeleton/AssetsCardSkeleton';
import { getTrendingAssets } from '@/repository/asset.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface AssetsListRoot {
  AssetList: AssetsInterface[];
  metadata: Metadata;
}

interface Metadata {
  current_page: number;
  limit: number;
  total_page: number;
  total_row: number;
}

interface Filter {
  search: string;
  limit: number;
  page: number;
  sortBy: string;
  currency: string;
}

const initialFilter: Filter = {
  search: '',
  limit: 10,
  page: 1,
  sortBy: 'rating',
  currency: ''
};

const initialMetadata: Metadata = {
  current_page: 1,
  limit: 10,
  total_page: 1,
  total_row: 10
};

const optionSortBy = [
  { label: 'All', value: '' },
  { label: 'Top Gainers', value: 'top gainers' },
  { label: 'Top Lowest', value: 'top lowest' },
  { label: 'Most Trades', value: 'most trades' }
];

export default function ListAssets(): React.ReactElement {
  const { t } = useTranslation();
  const [circle, setAssets] = useState<AssetsInterface[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [metadata, setMetadata] = useState<Metadata>(initialMetadata);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [userInfo, setUserInfo] = useState<any>();
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const dataInfo = await getUserInfo();

        setUserInfo(dataInfo);
      } catch (error: any) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData()
      .then()
      .catch(() => {});
  }, []);

  const fetchDataAssets = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await getTrendingAssets(filter);
      if (response.result === null) {
        setAssets([]);
      } else {
        setAssets(response.result);
        setMetadata(response.metadata);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (userInfo !== undefined) {
      setFilter(prevState => ({
        ...prevState,
        currency: (userInfo?.preferredCurrency as string) ?? 'IDR'
      }));
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo !== undefined && filter.currency !== '') {
      const fetchData = async (): Promise<void> => {
        await fetchDataAssets();
      };

      fetchData().catch(error => {
        console.error('Error in fetchData:', error);
      });
    }
  }, [filter, userInfo]);

  useEffect(() => {
    setFilter(prevParams => ({
      ...prevParams,
      search: searchInput,
      page: 1
    }));
  }, [searchInput]);

  useEffect(() => {
    if (searchInput.length === 0 && userInfo !== undefined) {
      void fetchDataAssets();
    }
  }, [searchInput.length]);

  return (
    <PageGradient defaultGradient className="w-full">
      <CCard className="flex flex-col w-full p-5 border-none rounded-xl bg-white">
        <div className="flex z-10 flex-col lg:flex-row justify-between">
          <div className="flex flex-col">
            <div className="text-3xl font-semibold bg-clip-text text-black">
              Asset List
            </div>
            <div className=" text-md font-normal text-gray-500">
              Discover the latest trending assets.
            </div>
          </div>
          <div className="lg:flex-col justify-end mt-4  ">
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
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setFilter(prevState => ({
                    ...prevState,
                    sortBy: e.target.value
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
              circle.map((data: AssetsInterface, idx: number) => {
                return (
                  <div key={idx} className="w-full mb-5">
                    <AssetTrendingCard
                      data={data}
                      isClick={true}
                      currency={userInfo?.preferredCurrency}
                    />
                  </div>
                );
              })
            ) : (
              <Typography className="text-base w-full font-semibold text-[#262626] text-center items-center">
                Data Not Found
              </Typography>
            )
          ) : (
            Array.from({ length: 10 }, (_, idx) => (
              <AssetTrendingCardSkeleton key={idx} />
            ))
          )}
        </div>

        <div className="flex justify-center mx-auto my-4">
          <ArtPagination
            currentPage={filter.page}
            totalPages={metadata.total_page}
            onPageChange={page => {
              setFilter({ ...filter, page });
            }}
          />
        </div>
      </CCard>
    </PageGradient>
  );
}
