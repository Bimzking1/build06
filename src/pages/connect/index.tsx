import CCard from '@/components/CCard';
import CardCircle from '@/components/circle/CardCircle';
import { SearchCircle } from '@/components/forms/searchCircle';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import BannerCircleList from '@/containers/circle/main/Banner';
import { isGuest } from '@/helpers/guest';
import withAuth from '@/helpers/withAuth';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import {
  getCircle,
  getCircleLeaderBoard
} from '@/repository/circle.repository';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import {
  Button,
  Card,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography
} from '@material-tailwind/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Settings } from 'react-slick';
import Slider from 'react-slick';

export interface CircleInterface {
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

interface Filter {
  search: string;
  limit: number;
  page: number;
  sort_by: string;
  type: string;
}

const initialFilter = {
  search: '',
  limit: 15,
  page: 1,
  sort_by: '',
  type: 'my_circle'
};

const dropdownValue = [
  {
    label: 'All',
    value: 'all'
  },
  {
    label: 'Rating',
    value: 'rating'
  },
  {
    label: 'Member',
    value: 'member'
  },
  {
    label: 'Post',
    value: 'post'
  }
];

const categoryItemClass =
  'py-1 rounded-full text-center w-fit text-md px-2 mr-8';

const settings: Settings = {
  slidesToShow: 3,
  speed: 500,
  slidesToScroll: 1,
  dots: true,
  infinite: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        dots: true,
        slidesToShow: 4
      }
    },
    {
      breakpoint: 768,
      settings: {
        dots: true,
        slidesToShow: 2
      }
    },
    {
      breakpoint: 480,
      settings: {
        dots: true,
        slidesToShow: 1
      }
    }
  ]
};

const Circle = (): React.ReactElement => {
  const [isLoadingLeaderBoard, setIsLoadingLeaderBoard] = useState(false);
  const [isLoadingCircle, setIsLoadingCircle] = useState(false);
  const [leaderBoards, setLeaderBoard] = useState<CircleInterface[]>();
  const [circle, setCircle] = useState<CircleInterface[]>([]);
  // const [circleCategory, setCircleCategory] = useState<any[]>([]);
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [activeTab, setActiveTab] = useState<string>(
    isGuest() ? 'all' : 'my_circle'
  );
  const [userInfo, setUserInfo] = useState<any>([]);
  const { t } = useTranslation();
  const width = useWindowInnerWidth();
  const router = useRouter();
  const [hasMore, setHasMore] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const dataTab = isGuest()
    ? [
        {
          label: 'Circle',
          value: 'all',
          data: circle
        }
      ]
    : [
        {
          label: 'MyCircle',
          value: 'my_circle',
          data: circle
        },
        {
          label: t('circle.leaderBoard.join'),
          value: 'joined',
          data: circle
        },
        {
          label: 'Circle',
          value: 'all',
          data: circle
        }
      ];

  const handleChangeFilter = (event: any): void => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    setFilter(prevState => ({
      ...prevState,
      [name]: value,
      page: 1
    }));

    if (value === '') {
      setHasMore(true);
    }
  };

  const handleChangeTab = (value: any): void => {
    setActiveTab(value);
    setCircle([]);
    setHasMore(true);
    setFilter(prevState => ({
      ...prevState,
      type: value,
      page: 1
    }));
  };

  const updateCategory = (newCategory: string): void => {
    setFilter(prevParams => ({
      ...prevParams,
      category: newCategory.toLowerCase(),
      page: 1
    }));

    setActiveCategory(newCategory);
  };

  const handleSortBy = (event: any): void => {
    setFilter(prevState => ({
      ...prevState,
      sort_by: event.target.value
    }));
  };

  const fetchCircleLeaderBoard = async (): Promise<void> => {
    try {
      setIsLoadingLeaderBoard(true);
      getCircleLeaderBoard()
        .then(res => {
          setLeaderBoard(res.data);
          setIsLoadingLeaderBoard(false);
        })
        .catch(err => {
          console.log(err);
          setIsLoadingLeaderBoard(false);
        });
    } catch (error: any) {
      setIsLoadingLeaderBoard(false);
      console.error('Error fetching circle data:', error.message);
    }
  };

  const fetchCircle = async (page: number, search: string): Promise<void> => {
    try {
      const response = await getCircle({ ...filter, page, search });
      const newData = response.data !== null ? response.data : [];

      if (filter.page === 1) {
        setCircle(newData);
      } else {
        setCircle(prevData => [...prevData, ...newData]);
      }

      if (newData.length < filter.limit) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching circle data:', error);
    } finally {
      setIsLoadingCircle(false);
    }
  };

  // Fitur belum berjalan. Creator: Redika

  // const fetchCircleCategory = async (): Promise<void> => {
  //   try {
  //     const response = await getCircleCategories({ page: 1, limit: 200 });
  //     console.log('rez : ', response)
  //     if (response.data === null) {
  //       setCircleCategory([]);
  //     } else {
  //       setCircleCategory(response.data);
  //     }
  //   } catch (error) {
  //     toast(error, { type: 'error' });
  //   }
  // };

  useEffect(() => {
    void fetchCircleLeaderBoard();
    setUserInfo([]);
  }, []);

  // useEffect(() => {
  //   void fetchCircleCategory();
  // }, [activeCategory]);

  useEffect(() => {
    void fetchCircle(1, filter.search);
  }, [filter, activeTab]);

  const handleScroll = (): void => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    if (
      scrollTop + clientHeight >= scrollHeight - 10 &&
      !isLoadingCircle &&
      hasMore
    ) {
      setIsLoadingCircle(true);
      void fetchCircle(filter.page + 1, filter.search);
      setFilter(prevFilter => ({ ...prevFilter, page: prevFilter.page + 1 }));
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const categories = [
    'All',
    'General',
    'Crypto',
    'Us Stocks',
    'Indo Stocks',
    'Commodities',
    'Indices',
    'Forex',
    'Finance'
  ];

  return (
    <PageGradient defaultGradient className="w-full">
      {!isGuest() && <BannerCircleList />}

      <CCard className="p-5 md:mt-5 md:rounded-lg border-none rounded-none">
        <Typography className="text-base font-semibold text-[#262626] text-left items-start lg:text-xl">
          {t('circle.leaderBoard.title')}
        </Typography>
        <Typography className="text-xs font-normal mb-5 text-[#7C7C7C] lg:text-lg">
          {t('circle.leaderBoard.description')}
        </Typography>
        <div className="">
          {isLoadingLeaderBoard ? (
            <Card
              shadow={false}
              className="h-[250px] max-w-full rounded-3xl overflow-hidden shadow-lg mr-3 relative"
            >
              <Typography className="flex items-center justify-center font-semibold text-xl">
                Loading...
              </Typography>
            </Card>
          ) : (
            <Slider {...settings}>
              {leaderBoards?.map((data, idx) => (
                <div key={idx} className="w-full lg:w-1/3">
                  <CardCircle data={data} cover={data.cover} userInfo={null} />
                </div>
              ))}
            </Slider>
          )}
        </div>
      </CCard>
      <CCard className="p-5 md:p-5 md:mt-5 md:rounded-lg border-none rounded-none">
        {width !== undefined && width >= 768 ? (
          <div className="absolute bg-[#9A76FE] blur-[130px] w-[200px] h-[200px] left-0 top-0 rounded-full"></div>
        ) : null}

        <Typography className="text-base font-semibold text-[#262626] text-left items-start lg:text-xl">
          {t('circle.list.title')}
        </Typography>
        <Typography className="text-xs font-normal mb-4 text-[#7C7C7C] lg:text-lg">
          {t('circle.list.description')}
        </Typography>

        {/* {width !== undefined && width < 768 ? (
          <SearchCircle
            name="search"
            type="outline"
            prefix={<MagnifyingGlassIcon className="w-5 h-5 text-[#262626]" />}
            onChange={e => {
              handleChangeFilter(e);
            }}
            placeholder="Search"
            value={filter.search}
          />
        ) : null} */}
        <div className="">
          <Tabs value={activeTab}>
            {/* Tab */}
            <div className="w-full justify-center">
              <TabsHeader
                className={
                  isGuest()
                    ? 'bg-transparent w-full mx-auto p-0 rounded-none border-b border-blue-gray-50'
                    : 'bg-transparent w-full md:w-1/2 mx-auto p-0 rounded-none border-b border-blue-gray-50'
                }
                indicatorProps={{
                  className:
                    'bg-transparent border-b-2 border-[#3AC4A0] shadow-none rounded-none'
                }}
              >
                {dataTab.map(({ label, value }) => (
                  <Tab
                    key={value}
                    value={value}
                    onClick={() => {
                      handleChangeTab(value);
                    }}
                    className={`${
                      activeTab === value ? 'text-[#3AC4A0] z-0' : ''
                    }`}
                  >
                    {label}
                  </Tab>
                ))}
              </TabsHeader>
            </div>

            {/* Searchbar */}
            {!isGuest() && (
              <div className="w-full md:w-3/4 justify-center mx-auto mt-5">
                <SearchCircle
                  name="search"
                  type="outline"
                  prefix={
                    <MagnifyingGlassIcon className="w-5 h-5 text-[#262626]" />
                  }
                  onChange={e => {
                    handleChangeFilter(e);
                  }}
                  placeholder="Search"
                  value={filter.search}
                />
              </div>
            )}

            {/* Sort By Create */}
            <div className="flex flex-row w-full justify-between mt-5">
              <div>
                <label htmlFor="sort_by">{t('circle.leaderBoard.sort')}</label>
                <select name="sort_by" id="sort_by" onChange={handleSortBy}>
                  {dropdownValue?.map((data, idx) => (
                    <option key={idx} value={data.value}>
                      {data.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Button
                  className="w-full text-xs font-semibold capitalize bg-[#3AC4A0] rounded-full"
                  onClick={() => {
                    void router.push(
                      isGuest() ? '/auth' : '/connect/create-circle'
                    );
                  }}
                >
                  Create Circle +
                </Button>
              </div>
            </div>

            {/* Categories */}
            <div className="mt-4">
              <Slider
                slidesToShow={5}
                slidesToScroll={2}
                speed={500}
                infinite={false}
                className="center"
                // initialSlide={1}
                responsive={[
                  {
                    breakpoint: 768,
                    settings: {
                      dots: false,
                      slidesToShow: 2,
                      slidesToScroll: 2
                    }
                  },
                  {
                    breakpoint: 480,
                    settings: {
                      dots: false,
                      slidesToShow: 2,
                      slidesToScroll: 1
                    }
                  }
                ]}
              >
                {categories.length !== 0
                  ? categories.map((data, key) => (
                      <div
                        key={key}
                        style={{ marginRight: '-25px', marginLeft: '-25px' }}
                        className={`${categoryItemClass} ${
                          activeCategory === data
                            ? 'bg-[#3AC4A0] text-white'
                            : 'text-[#3AC4A0] bg-[#F9F9F9]'
                        }`}
                        onClick={() => {
                          updateCategory(data);
                        }}
                      >
                        {data}
                      </div>
                    ))
                  : null}
              </Slider>
            </div>

            <TabsBody className="mt-10">
              {dataTab.map(({ value, data }) => (
                <TabPanel key={value} value={value}>
                  <div className="">
                    <div className="flex flex-wrap">
                      {circle?.length !== 0 ? (
                        circle?.map((data, idx) => (
                          <div
                            className={`w-${
                              idx === 0 ? 'full' : '1/2'
                            } mb-3 md:w-1/3`}
                            key={idx}
                          >
                            <CardCircle
                              data={data}
                              cover={data.cover}
                              userInfo={userInfo}
                            />
                          </div>
                        ))
                      ) : (
                        <Typography className="text-base w-full font-semibold text-[#262626] text-center items-center">
                          Data Not Found
                        </Typography>
                      )}
                      {isLoadingCircle && (
                        <Typography className="text-base w-full font-semibold text-[#262626] text-center items-center">
                          Loading...
                        </Typography>
                      )}
                    </div>
                  </div>
                </TabPanel>
              ))}
            </TabsBody>
          </Tabs>
        </div>
      </CCard>
    </PageGradient>
  );
};

export default withAuth(Circle);
