import CCard from '@/components/CCard';
import CardCircle from '@/components/circle/CardCircle';
import CardAsset from '@/components/circle/pie/CardAsset';
import CardHashtag from '@/components/social/CardHashtag';
import CardPeople from '@/components/social/CardPeople';
import CardPlay from '@/components/social/CardPlay';
import CardPromo from '@/components/social/CardPromo';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import { KopKen } from '@/constants/assets/images';
import withAuth from '@/helpers/withAuth';
import { getCircle } from '@/repository/circle.repository';
import { searchHashtag } from '@/repository/circleDetail.repository';
import { getMarketList } from '@/repository/market.repository';
import { searchUser, trendingUser } from '@/repository/people.repository';
import { getPlayAll } from '@/repository/play.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { getHashtagSocial } from '@/repository/social.respository';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography
} from '@material-tailwind/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface Filter {
  search: string;
  limit: number;
  page: number;
  sort_by: string;
}

const dataTab = [
  { label: 'People', value: 'people' },
  { label: 'Play', value: 'play' },
  { label: 'Circle', value: 'circle' },
  { label: 'Asset', value: 'asset' },
  { label: 'Promo', value: 'promo' },
  { label: 'Hashtag', value: 'hashtag' }
];

const optionSortBy = [
  { label: 'All', value: 'all' },
  { label: 'Rating', value: 'rating' },
  { label: 'Member', value: 'member' },
  { label: 'Post', value: 'post' }
];

const initialFilter = {
  search: '',
  limit: 10,
  page: 1,
  sort_by: ''
};

const PROMO_DUMMY = [
  {
    title: 'Kopi Kenangan',
    image: KopKen.src,
    amount: '3 Voucher',
    voucher: [
      '25% discount Kopi Kenangan using e-wallet payment...',
      '25% discount Kopi Kenangan using e-wallet payment...',
      '25% discount Kopi Kenangan using e-wallet payment...'
    ]
  },
  {
    title: 'Burger King',
    image: KopKen.src,
    amount: '3 Voucher',
    voucher: [
      '10% discount Burger King using e-wallet payment...',
      '10% discount Burger King using e-wallet payment...',
      '10% discount Burger King using e-wallet payment...'
    ]
  },
  {
    title: 'Hypermart',
    image: KopKen.src,
    amount: '3 Voucher',
    voucher: [
      '5% discount Hypermart using e-wallet payment...',
      '5% discount Hypermart using e-wallet payment...',
      '5% discount Hypermart using e-wallet payment...'
    ]
  },
  {
    title: 'Miniso',
    image: KopKen.src,
    amount: '3 Voucher',
    voucher: [
      '15% discount Miniso using e-wallet payment...',
      '15% discount Miniso using e-wallet payment...',
      '15% discount Miniso using e-wallet payment...'
    ]
  }
];

const Search: React.FC = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<string>('people');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<any[]>([]);
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [userInfo, setUserInfo] = useState<any>();

  const removeQuery = (): void => {
    if (router.query.hashtags !== undefined) {
      const urlWithoutQuery = '/social/search';
      router
        .replace(urlWithoutQuery, undefined, { shallow: true })
        .catch(err => {
          console.log(err);
        });
      setFilter(prevState => ({
        ...prevState,
        search: ''
      }));
    }
  };

  useEffect(() => {
    if (router.query.hashtags !== undefined) {
      setActiveTab('hashtag');
      setFilter(prevState => ({
        ...prevState,
        search: router.query.hashtags as string
      }));
    }
  }, []);

  const handleChangeTab = (value: string): void => {
    setActiveTab(value);
    removeQuery();
    if (value === 'people') {
      if (filter.search !== '') {
        void fetchDataSearchPeople();
      } else {
        void fetchDataPeople();
      }
    }

    if (value === 'play') {
      void fetchDataPlay();
    }

    if (value === 'circle') {
      void fetchDataCircle();
    }

    if (value === 'asset') {
      void fetchDataAsset();
    }

    if (value === 'hashtag') {
      void fetchDataHashtag();
      if (filter.search !== '') {
        void fetchDataSearchHashtag();
      } else {
        void fetchDataHashtag();
      }
    }

    if (value === 'promo') {
      void fetchDataPromo();
    }
  };

  const handleChangeFilter = (event: any): void => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    setFilter(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const fetchDataPromo = async (): Promise<void> => {
    setData(PROMO_DUMMY);
  };

  const fetchDataCircle = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await getCircle(filter);
      if (response.data === null) {
        setData([]);
      } else {
        setData(response.data);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const fetchDataPlay = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await getPlayAll(filter);
      if (response.playList === null) {
        setData([]);
      } else {
        setData(response.playList);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const fetchDataHashtag = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await getHashtagSocial(filter);
      if (response.data === null) {
        setData([]);
      } else {
        setData(response.data);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const fetchDataAsset = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await getMarketList(filter);
      setData(response.marketAssetList);
      if (response.marketAssetList === null) {
        setData([]);
      } else {
        setData(response.marketAssetList);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const fetchDataPeople = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await trendingUser();
      setData(response.result);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const fetchDataSearchPeople = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await searchUser(filter);
      setData(response.result);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const fetchDataSearchHashtag = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await searchHashtag(filter);
      const newData = response.data.map((data: any) => ({
        frequency: data.counter,
        hashtag: data.hashtag
      }));
      setData(newData);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const fetchUserInfo = async (): Promise<void> => {
    try {
      const response = await getUserInfo();
      setUserInfo(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    void fetchUserInfo();
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearch(filter.search);
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [filter.search]);

  useEffect(() => {
    if (activeTab === 'people') {
      if (filter.search !== '') {
        void fetchDataSearchPeople();
      } else {
        void fetchDataPeople();
      }
    }

    if (activeTab === 'play') {
      void fetchDataPlay();
    }

    if (activeTab === 'circle') {
      void fetchDataCircle();
    }

    if (activeTab === 'asset') {
      void fetchDataAsset();
    }

    if (activeTab === 'hashtag') {
      if (filter.search !== '') {
        void fetchDataSearchHashtag();
      } else {
        void fetchDataHashtag();
      }
    }
  }, [debouncedSearch]);

  return (
    <PageGradient defaultGradient className="w-full">
      <CCard className="flex p-2 md:mt-5 md:rounded-lg border-none rounded-none">
        <div className="flex flex-row items-center justify-center w-full mb-2">
          <div className="mr-2 w-1/2">
            <div className="relative">
              <input
                type="text"
                name="search"
                value={filter.search}
                onChange={e => {
                  handleChangeFilter(e);
                }}
                placeholder="Search"
                readOnly={false}
                disabled={false}
                className="block w-full text-[#262626] h-11 leading-4 placeholder:text-[#BDBDBD] focus:outline-0 disabled:bg-[#E9E9E9] p-3 rounded-lg border border-[#BDBDBD]"
              />

              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="w-5 h-5 text-[#262626]" />
              </div>
            </div>
          </div>
        </div>
        <Tabs value={activeTab}>
          <TabsHeader
            className="bg-transparent flex justify-between w-full rounded-none border-b border-blue-gray-50"
            indicatorProps={{
              className: `${
                router.query.hashtags !== undefined
                  ? 'bg-transparent shadow-none'
                  : 'bg-transparent border-b-2 border-[#3AC4A0] shadow-none rounded-none'
              }`
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
                  activeTab === value ? 'text-[#3AC4A0]' : 'text-[#7C7C7C]'
                } text-base z-0 font-semibold`}
              >
                {label}
              </Tab>
            ))}
          </TabsHeader>
          <div className="flex justify-end mt-2">
            <label htmlFor="sort_by">Sort by:</label>
            <select name="sort_by" id="sort_by">
              {optionSortBy?.map((data, idx) => (
                <option key={idx} value={data.value}>
                  {data.label}
                </option>
              ))}
            </select>
          </div>
          <TabsBody>
            {dataTab.map(({ value }) => (
              <TabPanel key={value} value={value}>
                <div className="flex flex-wrap">
                  {!isLoading ? (
                    data.length !== 0 ? (
                      data?.map((data, idx) => (
                        <>
                          {activeTab === 'circle' ? (
                            <div key={idx} className="w-full md:w-1/2 mb-5">
                              <CardCircle
                                data={data}
                                cover={data.cover}
                                userInfo={userInfo}
                              />
                            </div>
                          ) : activeTab === 'asset' ? (
                            <div key={idx} className="w-full">
                              <CardAsset data={data} isClick={true} />
                            </div>
                          ) : activeTab === 'hashtag' ? (
                            <div key={idx} className="w-full">
                              <CardHashtag data={data} />
                            </div>
                          ) : activeTab === 'people' ? (
                            <div key={idx} className="w-full">
                              {userInfo?.id !== data.id ? (
                                <CardPeople data={data} />
                              ) : null}
                            </div>
                          ) : activeTab === 'play' ? (
                            <div key={idx} className="w-full lg:w-1/2">
                              <CardPlay data={data} />
                            </div>
                          ) : (
                            <div key={idx} className="w-full">
                              <CardPromo data={data} />
                            </div>
                          )}
                        </>
                      ))
                    ) : (
                      <Typography className="text-base w-full font-semibold text-[#262626] text-center items-center">
                        Data Not Found
                      </Typography>
                    )
                  ) : (
                    <Typography className="text-base w-full font-semibold text-[#262626] text-center items-center">
                      Loading...
                    </Typography>
                  )}
                </div>
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
      </CCard>
    </PageGradient>
  );
};

export default withAuth(Search);
