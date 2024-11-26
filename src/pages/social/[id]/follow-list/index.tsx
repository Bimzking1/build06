import SearchIcon from '@/assets/SearchIcon.svg';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import { getFollowList, getUserInfo } from '@/repository/profile.repository';
import { follow } from '@/repository/user.repository';
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
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Follow: React.FC = () => {
  const router = useRouter();
  const { type, id } = router.query;
  const [search, setSearch] = useState('');
  const [dataInfo, setDataInfo] = useState<any>([]);
  const [followData, setFollowData] = useState<any>([]);
  const [change, setChange] = useState(false);

  const _handleChange = (): void => {
    setChange(!change);
  };
  const _handleSearchChange = (event: any): void => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const dataInfo = await getUserInfo();
        setDataInfo(dataInfo);
        const followResponse = await getFollowList(id, type);
        setFollowData(followResponse);
      } catch (error: any) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData()
      .then()
      .catch(() => {});
  }, [type, change]);
  const data = [
    {
      label: 'Followers',
      value: 'followers',
      content: (
        <section className="flex flex-col gap-8">
          <div className="flex flex-row-reverse gap-8 justify-center 2xl:justify-between flex-wrap">
            <div className="flex gap-2 border border-[#E9E9E9] rounded-[10px] max-w-[400px] min-w-full sm:min-w-[375px]">
              <Image src={SearchIcon} alt="SearchIcon" />
              <input
                type="text"
                placeholder="Search"
                className="focus:outline-none placeholder:text-[#BDBDBD] placeholder:text-xs placeholder:font-poppins placeholder:font-normal w-full bg-transparent"
                value={search}
                onChange={_handleSearchChange}
              />
            </div>
            <div className="w-2/5 max-w-[400px] min-w-full sm:min-w-[375px] bg-transparent hidden xl:flex">
              <br />
            </div>
          </div>

          <div className="flex gap-8 justify-center 2xl:justify-between flex-wrap">
            {followData?.data
              ?.filter((item: any) =>
                item.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((item: any, index: any) => {
                return (
                  <div
                    className="flex flex-row w-2/5 max-w-[400px] min-w-full sm:min-w-[375px] items-center justify-between"
                    key={index}
                  >
                    <div className="flex gap-[11px]">
                      <Link
                        href={`/social/${item.id as string}`}
                        className="flex gap-2"
                      >
                        <img
                          src={item.avatar}
                          alt="avatar"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                          <Typography className="font-semibold font-poppins text-base text-[#262626]">
                            {item.name}
                          </Typography>
                          <Typography className="font-normal font-poppins text-sm text-[#7C7C7C]">
                            @{item.seeds_tag}
                          </Typography>
                        </div>
                      </Link>

                      {item.is_followed === true ? null : item.id ===
                        dataInfo.id ? null : (
                        <Button
                          ripple={false}
                          className="bg-transparent shadow-none hover:shadow-none py-[4.78px] px-[7.17px] h-fit font-semibold font-poppins text-[10px] text-[#7B8BFC] leading-[9.56px] capitalize z-10"
                          onClick={async () => {
                            await follow(item.id);
                            _handleChange();
                          }}
                        >
                          Follow
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      )
    },
    {
      label: 'Following',
      value: 'followings',
      content: (
        <section className="flex flex-col gap-8">
          <div className="flex flex-row-reverse gap-8 justify-center 2xl:justify-between flex-wrap">
            <div className="flex gap-2 border border-[#E9E9E9] rounded-[10px] max-w-[400px] min-w-full sm:min-w-[375px]">
              <Image src={SearchIcon} alt="SearchIcon" />
              <input
                type="text"
                placeholder="Search"
                className="focus:outline-none placeholder:text-[#BDBDBD] placeholder:text-xs placeholder:font-poppins placeholder:font-normal w-full bg-transparent"
                value={search}
                onChange={_handleSearchChange}
              />
            </div>
            <div className="w-2/5 max-w-[400px] min-w-full sm:min-w-[375px] bg-transparent hidden xl:flex">
              <br />
            </div>
          </div>

          <div className="flex gap-8 justify-center 2xl:justify-between flex-wrap">
            {followData?.data
              ?.filter((item: any) =>
                item.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((item: any, index: any) => {
                return (
                  <div
                    className="flex flex-row w-2/5 max-w-[400px] min-w-full sm:min-w-[375px] items-center justify-between"
                    key={index}
                  >
                    <div className="flex gap-[11px]">
                      <Link
                        href={`/social/${item.id as string}`}
                        className="flex gap-2"
                      >
                        <img
                          src={item.avatar}
                          alt="avatar"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                          <Typography className="font-semibold font-poppins text-base text-[#262626]">
                            {item.name}
                          </Typography>
                          <Typography className="font-normal font-poppins text-sm text-[#7C7C7C]">
                            @{item.seeds_tag}
                          </Typography>
                        </div>
                      </Link>
                      {item.is_followed === true ? null : item.id ===
                        dataInfo.id ? null : (
                        <Button
                          ripple={false}
                          className="bg-transparent shadow-none hover:shadow-none py-[4.78px] px-[7.17px] h-fit font-semibold font-poppins text-[10px] text-[#7B8BFC] leading-[9.56px] capitalize z-10"
                          onClick={async () => {
                            await follow(item.id);
                            _handleChange();
                          }}
                        >
                          Follow
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      )
    }
  ];

  return (
    <PageGradient defaultGradient className="w-full">
      <Card shadow={false}>
        <Tabs value={type}>
          <TabsHeader
            className="p-0 bg-transparent h-12 border-b border-[#BDBDBD] rounded-none"
            indicatorProps={{
              className:
                'bg-transparent border-b-4 border-[#27A590] shadow-none rounded-sm'
            }}
          >
            {data.map(({ label, value }) => (
              <Tab
                key={value}
                value={value}
                onClick={async () => {
                  await router.push({
                    pathname: `/social/${id as string}/follow-list`,
                    query: {
                      type: `${
                        value === 'followers' ? 'followers' : 'followings'
                      }`
                    }
                  });
                  setSearch('');
                }}
                className={`${
                  type === value ? 'text-[#27A590]' : 'text-[#7C7C7C]'
                } mx-[40px] text-base font-poppins font-semibold z-10`}
              >
                {label}
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody>
            {data.map(({ value, content }) => (
              <TabPanel key={value} value={value} className="px-5 py-8">
                {content}
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
      </Card>
    </PageGradient>
  );
};

export default Follow;
