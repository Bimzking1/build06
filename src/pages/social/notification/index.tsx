import CCard from '@/components/CCard';
import Loading from '@/components/popup/Loading';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import NotificationCard from '@/containers/social/notif/NotificationCard';
import withAuth from '@/helpers/withAuth';
import { getListNotification } from '@/repository/notification.repository';
import { getUserInfo } from '@/repository/profile.repository';
import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography
} from '@material-tailwind/react';
import {
  InformationLogo,
  PromotionLogo,
  SocialNotifLogo
} from 'public/assets/images';
import { useEffect, useState } from 'react';
interface typeOfTab {
  name: string;
  value: string;
}
interface DataItem {
  id: string;
  data: any;
  type: string;
  readed_at: string;
  created_at: string;
  updated_at: string;
}
interface Filter {
  limit: number;
  page: number;
  type: string;
}

const initialFilter: Filter = {
  limit: 10,
  page: 1,
  type: 'promotion'
};

const dataTab: typeOfTab[] = [
  { name: 'Promotions', value: 'promotion' },
  { name: 'Social', value: 'social' },
  { name: 'Information', value: 'information' }
];

const NotificationPage: React.FC = () => {
  const [tabs, setTabs] = useState<string>('promotion');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listNotification, setListNotification] = useState<DataItem[]>([]);
  const [isIncrease, setIsIncrease] = useState(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [userInfo, setUserInfo] = useState<any>();
  console.log(userInfo);

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

  const handleScroll = (): void => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 20 && !isLoading) {
      if (!isIncrease) {
        setIsIncrease(true);
        setTimeout(() => {
          setFilter(prevState => ({
            ...prevState,
            page: prevState.page + 1
          }));
        }, 1000);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const fetchListNotification = async (): Promise<void> => {
    try {
      setIsLoading(true);

      getListNotification(filter)
        .then(res => {
          const data: any[] = res.data;
          const total = res.metadata.total;

          if (res.data !== null) {
            setListNotification(prevState => [...prevState, ...data]);
            if (listNotification.length + data.length < total) {
              setHasMore(true);
            } else {
              setHasMore(false);
            }
          } else {
            setHasMore(false);
          }
          setIsIncrease(false);
          setIsLoading(false);
        })
        .catch(err => {
          console.log(err);
          setIsIncrease(false);
          setIsLoading(false);
        });
    } catch (error: any) {
      setIsIncrease(false);
      setIsLoading(false);
      console.error('Error fetching Circle Post:', error.message);
    }
  };

  const handleChangeTab = (value: string): void => {
    setTabs(value);
    setHasMore(true);
    setFilter(prevState => ({
      ...prevState,
      page: 1,
      type: value
    }));
    setListNotification([]);
  };

  useEffect(() => {
    if (hasMore) {
      fetchListNotification()
        .then()
        .catch(() => {});
    }
  }, [tabs, filter.page, hasMore]);

  function filterDataByDate(items: DataItem[]): {
    today: DataItem[];
    older: DataItem[];
  } {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate());

    const todayData: DataItem[] = [];
    const olderData: DataItem[] = [];

    items.forEach(item => {
      const createdAt = new Date(item.created_at);
      if (createdAt > yesterday) {
        todayData.push(item);
      } else {
        olderData.push(item);
      }
    });

    return { today: todayData, older: olderData };
  }

  return (
    <PageGradient defaultGradient className="w-full">
      {isLoading && <Loading />}
      <CCard className="flex flex-col w-full p-5 border-none rounded-xl">
        <Tabs value={tabs}>
          <div className="flex justify-center">
            <TabsHeader
              className="w-full text-center justify-center rounded-none bg-transparent p-0 gap-4"
              indicatorProps={{
                className: 'shadow-none rounded-none bg-transparent'
              }}
            >
              {dataTab.map((el: typeOfTab, i: number) => {
                return (
                  <Tab
                    value={el.value}
                    key={i}
                    onClick={() => {
                      handleChangeTab(el.value);
                    }}
                    className={`text-center z-0 text-sm md:text-lg bg-transparent font-poppins ${
                      tabs === el.value
                        ? 'text-black  font-semibold border-b-2 border-b-[#4FE6AF]'
                        : 'text-[#7C7C7C] text-sm font-normal'
                    }`}
                  >
                    {el.name}
                    {/* {el.value === 'promotion' &&
                      t('circleDetail.navigator.post')}
                    {el.value === 'social' &&
                      t('circleDetail.navigator.recomend')}
                    {el.value === 'information' &&
                      t('circleDetail.navigator.listMembers')} */}
                  </Tab>
                );
              })}
            </TabsHeader>
          </div>
          <TabsBody className="pb-4">
            <TabPanel value="promotion">
              {tabs === 'promotion' && (
                <div className="flex flex-col gap-4">
                  <Typography className="font-semibold text-base font-poppins text-black normal-case">
                    Today
                  </Typography>
                  {filterDataByDate(listNotification).today?.map(
                    (el: DataItem) => {
                      return (
                        <NotificationCard
                          data={el}
                          logo={PromotionLogo}
                          variant="normal"
                          key={el?.id}
                        />
                      );
                    }
                  )}
                  {filterDataByDate(listNotification).today.length === 0 && (
                    <Typography className="font-semibold text-sm text-center w-full font-poppins text-black normal-case">
                      {"There's no notification today"}
                    </Typography>
                  )}
                  <Typography className="font-semibold text-base font-poppins text-black normal-case">
                    This Week
                  </Typography>
                  {filterDataByDate(listNotification).older?.map(
                    (el: DataItem) => {
                      return (
                        <NotificationCard
                          data={el}
                          logo={PromotionLogo}
                          variant="normal"
                          key={el?.id}
                        />
                      );
                    }
                  )}
                  {filterDataByDate(listNotification).older.length === 0 && (
                    <Typography className="font-semibold text-sm text-center font-poppins text-black normal-case">
                      {"There's no notification this week"}
                    </Typography>
                  )}
                </div>
              )}
            </TabPanel>
            <TabPanel value="social">
              {tabs === 'social' && (
                <div className="flex flex-col gap-4">
                  <Typography className="font-semibold text-base font-poppins text-black normal-case">
                    Today
                  </Typography>
                  {filterDataByDate(listNotification).today?.map(
                    (el: DataItem) => {
                      return (
                        <NotificationCard
                          data={el}
                          logo={SocialNotifLogo}
                          variant="normal"
                          key={el?.id}
                        />
                      );
                    }
                  )}
                  {filterDataByDate(listNotification).today.length === 0 && (
                    <Typography className="font-semibold text-sm text-center w-full font-poppins text-black normal-case">
                      {"There's no notification today"}
                    </Typography>
                  )}
                  <Typography className="font-semibold text-base font-poppins text-black normal-case">
                    This Week
                  </Typography>
                  {filterDataByDate(listNotification).older?.map(
                    (el: DataItem) => {
                      return (
                        <NotificationCard
                          data={el}
                          logo={SocialNotifLogo}
                          variant="normal"
                          key={el?.id}
                        />
                      );
                    }
                  )}
                  {filterDataByDate(listNotification).older.length === 0 && (
                    <Typography className="font-semibold text-sm text-center font-poppins text-black normal-case">
                      {"There's no notification this week"}
                    </Typography>
                  )}
                </div>
              )}
            </TabPanel>
            <TabPanel value="information">
              {tabs === 'information' && (
                <div className="flex flex-col gap-4">
                  <Typography className="font-semibold text-base font-poppins text-black normal-case">
                    Today
                  </Typography>
                  {filterDataByDate(listNotification).today?.map(
                    (el: DataItem) => {
                      if (
                        el?.type === 'play_joined' ||
                        el?.type === 'circle_send_invitation' ||
                        el?.type === 'discover_earn' ||
                        el?.type === 'play_sell_asset' ||
                        el?.type === 'play_buy_asset' ||
                        el?.type === 'play_winner_simulation'
                      ) {
                        return (
                          <NotificationCard
                            data={el}
                            logo={InformationLogo}
                            variant={el?.type}
                            key={el?.id}
                          />
                        );
                      }
                      return (
                        <NotificationCard
                          data={el}
                          logo={InformationLogo}
                          variant="normal"
                          key={el?.id}
                        />
                      );
                    }
                  )}
                  {filterDataByDate(listNotification).today.length === 0 && (
                    <Typography className="font-semibold text-sm text-center w-full font-poppins text-black normal-case">
                      {"There's no notification today"}
                    </Typography>
                  )}
                  <Typography className="font-semibold text-base font-poppins text-black normal-case">
                    This Week
                  </Typography>
                  {filterDataByDate(listNotification).older?.map(
                    (el: DataItem) => {
                      if (
                        el?.type === 'play_joined' ||
                        el?.type === 'circle_send_invitation' ||
                        el?.type === 'discover_earn' ||
                        el?.type === 'play_sell_asset' ||
                        el?.type === 'play_buy_asset' ||
                        el?.type === 'play_winner_simulation'
                      ) {
                        return (
                          <NotificationCard
                            data={el}
                            logo={InformationLogo}
                            variant={el?.type}
                            key={el?.id}
                          />
                        );
                      }
                      return (
                        <NotificationCard
                          data={el}
                          logo={InformationLogo}
                          variant="normal"
                          key={el?.id}
                        />
                      );
                    }
                  )}
                  {filterDataByDate(listNotification).older.length === 0 && (
                    <Typography className="font-semibold text-sm text-center font-poppins text-black normal-case">
                      {"There's no notification this week"}
                    </Typography>
                  )}
                </div>
              )}
            </TabPanel>
          </TabsBody>
        </Tabs>
      </CCard>
    </PageGradient>
  );
};

export default withAuth(NotificationPage);
