'use client';
import likeCircle from '@/assets/my-profile/circle/likeCircle.svg';
import memberCircle from '@/assets/my-profile/circle/memberCircle.svg';
import postCircle from '@/assets/my-profile/circle/postCircle.svg';
import info from '@/assets/my-profile/play/info.svg';
import { chrownCirclePremium } from '@/constants/assets/icons';
import PostSection from '@/containers/circle/[id]/PostSection';
import TrackerEvent from '@/helpers/GTM';
import { isGuest } from '@/helpers/guest';
import { getUserInfo } from '@/repository/profile.repository';
import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
interface DataItem {
  label: string;
  value: string;
  content: React.ReactNode;
}

interface Params {
  profileData: any;
  circleData: any;
  playData: any;
  postData: any;
  setData: any;
  handleSubmitBlockUser?: any;
}

interface Item {
  cover?: string;
  type?: string;
  avatar?: string;
  name?: string;
  total_like?: any;
  total_member?: any;
  total_post?: any;
  percentage?: number;
  logo?: any;
  ticker?: any;
  exchange?: any;
  id?: string;
}

interface MyStyle extends React.CSSProperties {
  '--image-url': string;
}

const UnderLineTab = ({
  profileData,
  circleData,
  playData,
  postData,
  setData,
  handleSubmitBlockUser
}: Params): JSX.Element => {
  const [myInfo, setMyInfo] = useState();
  const { t } = useTranslation();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('post');
  const data: DataItem[] = [
    {
      label: 'Post',
      value: 'post',
      content: (
        <div className="bg-white w-full mx-5">
          {postData?.map((el: any, idx: number) => {
            return (
              <div className="flex flex-col" key={`${el.id as string} ${idx}`}>
                {el.circle !== undefined && (
                  <div
                    className={`flex justify-between p-2 rounded-t-2xl px-4 ${
                      el?.circle?.status_joined === true
                        ? 'bg-[#E9E9E9]'
                        : 'bg-[#DCFCE4]'
                    } mt-5`}
                  >
                    <div className="flex items-center">
                      <img
                        src={el?.circle?.avatar}
                        alt="image"
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <Typography
                        className={`text-sm text-black px-2 py-1 font-bold`}
                      >
                        {el?.circle?.name}
                      </Typography>
                    </div>
                    <button
                      className={`${
                        el?.circle?.status_joined === true
                          ? 'bg-[#BDBDBD] cursor-not-allowed'
                          : 'bg-seeds-button-green'
                      } rounded-full`}
                    >
                      <Typography
                        className={`text-sm ${
                          el?.circle?.status_joined === true
                            ? 'text-neutral-soft'
                            : 'text-white'
                        } px-2 py-1 font-bold`}
                        onClick={() => {
                          if (el?.circle?.status_joined === false) {
                            router
                              .push(`/connect/post/${el?.circle_id as string}`)
                              .catch((err: any) => {
                                console.error(err);
                              });
                          }
                        }}
                      >
                        {el?.circle?.status_joined === true
                          ? t('circleDetail.statusJoined')
                          : t('circleDetail.statusNotJoined')}
                      </Typography>
                    </button>
                  </div>
                )}
                <PostSection
                  dataPost={el}
                  setData={setData}
                  userInfo={profileData}
                  handleSubmitBlockUser={handleSubmitBlockUser}
                  myInfo={myInfo}
                />
              </div>
            );
          })}
        </div>
      )
    },
    {
      label: 'Circle',
      value: 'circle',
      content: (
        <div className="flex flex-wrap gap-x-3 gap-y-4 justify-center py-4 lg:border-solid border-t border-[#E9E9E9] border-none 2xl:w-[900px] lg:w-[596px] w-[292px]">
          {circleData?.data?.map((item: Item, index: any) => {
            const myStyle: MyStyle = {
              '--image-url': `url(${item.cover ?? ''})`
            };
            return (
              <Card
                shadow={false}
                className="lg:w-[292px] lg:h-[152.81px] w-[343px] h-[177px] cursor-pointer"
                key={index}
                onClick={() => {
                  router
                    .push(
                      isGuest()
                        ? '/auth'
                        : `/connect/post/${item?.id as string}`
                    )
                    .catch(error => {
                      toast(error, { type: 'error' });
                    });
                  TrackerEvent({
                    event: `SW__circle_page_detail`,
                    userData: myInfo,
                    circleData: item
                  });
                }}
              >
                <CardHeader
                  shadow={false}
                  color="transparent"
                  style={myStyle}
                  className={`absolute m-0 h-full w-full bg-cover bg-center bg-[image:var(--image-url)] py-[13.46px] px-[16.87px]`}
                >
                  {item.type !== 'free' ? (
                    <div className="flex w-[65.63px] h-[19.35px] absolute top-0 right-0 mr-[16.87px] mt-[13.46px] bg-white rounded-full gap-[3.37px] items-center justify-center">
                      <Image
                        src={chrownCirclePremium.src}
                        alt="crown"
                        width={10}
                        height={10}
                      />
                      <Typography className="text-[6.73px] leading-[13.46px] text-[#3AC4A0] font-semibold font-poppins">
                        Premium
                      </Typography>
                    </div>
                  ) : null}
                </CardHeader>
                <CardBody className="p-0 relative flex flex-col items-center my-auto gap-1.5">
                  <Avatar
                    alt="circleAvatar"
                    className="border-[1.68px] border-white w-16 h-16 bg-cover"
                    src={`${item.avatar ?? ''}`}
                  />
                  <Typography className="text-white text-sm font-poppins font-semibold">
                    {item.name}
                  </Typography>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-[1.68px]">
                      <Image src={likeCircle} alt="likeCircle" />
                      <Typography className="text-white text-[10px] font-poppins font-normal leading-[13.46px]">
                        {item.total_like}
                      </Typography>
                    </div>
                    <div className="flex items-center gap-[1.68px]">
                      <Image src={memberCircle} alt="memberCircle" />
                      <Typography className="text-white text-[10px] font-poppins font-normal leading-[13.46px]">
                        {item.total_member}
                      </Typography>
                    </div>
                    <div className="flex items-center gap-[1.68px]">
                      <Image src={postCircle} alt="postCircle" />
                      <Typography className="text-white text-[10px] font-poppins font-normal leading-[13.46px]">
                        {item.total_post}
                      </Typography>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )
    },
    {
      label: 'Play',
      value: 'play',
      content: (
        <div className="flex flex-col gap-8 mx-5 w-full py-4 lg:border-solid border-t border-[#E9E9E9] border-none">
          <div className="flex flex-col gap-4">
            <Typography className="text-lg text-[#262626] font-semibold font-poppins">
              Total Play :{' '}
              <span className="text-sm text-[#7C7C7C] font-normal font-poppins">
                {`${playData?.data?.play_total as string} tournament`}
              </span>
            </Typography>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              {playData?.data?.win_percentages
                ?.sort((a: any, b: any) => a.type - b.type)
                .map((item: Item, index: any) => {
                  return (
                    <Card
                      shadow={false}
                      className={`flex justify-center border border-[#3AC4A0] bg-[#DCFCE4] sm:w-[164px] sm:mx-0 h-[92px] ${
                        item?.type === 'ALL' ? 'w-[192px] mx-16' : 'w-[164px]'
                      }`}
                      key={item.type}
                    >
                      <CardBody className="p-0 flex flex-col items-center gap-2">
                        <div className="flex gap-[5px]">
                          <Image src={info} alt="information" />
                          <Typography className="text-[#3AC4A0] text-xs font-normal font-poppins">
                            {`${
                              item?.type === 'ALL'
                                ? 'Win Percentage'
                                : `${
                                    item?.type?.charAt(0).toUpperCase() ?? ''
                                  }${item?.type?.slice(1).toLowerCase() ?? ''}`
                            }`}
                          </Typography>
                        </div>

                        <Typography className="text-[#3AC4A0] text-3xl font-semibold font-poppins">
                          {`${item.percentage ?? ''}%`}
                        </Typography>
                      </CardBody>
                    </Card>
                  );
                })}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Typography className="text-lg text-[#262626] font-semibold font-poppins">
              Top 3 Assets Returns
            </Typography>
            <div className="flex gap-[16.28px] flex-wrap">
              {playData?.data?.asset_returns
                ?.sort((a: any, b: any) => b.percentage - a.percentage)
                .slice(0, 3)
                .map((item: Item, index: any) => {
                  return (
                    <div
                      className="flex justify-between p-[12.21px] lg:w-[286.15px] w-full bg-[#F9F9F9] border border-[#E9E9E9] rounded-lg"
                      key={index}
                    >
                      <div className="flex h-[40.69px] gap-[12.21px]">
                        <img
                          src={item?.logo}
                          alt={item?.name}
                          width={40.69}
                          height={40.69}
                        />
                        <div className="flex flex-col gap-[9.42px] justify-center">
                          <Typography className="font-montserrat text-[12.21px] leading-[14.88px] font-bold text-[#424242]">
                            {item?.ticker}/
                            <span className="font-normal text-[#585858]">
                              {item?.exchange}
                            </span>
                          </Typography>
                          <Typography className="text-[12.21px] leading-[16.28px] text-[#BDBDBD] font-poppins font-normal">
                            {(item?.name?.length ?? 0) >= 20 &&
                            (window.innerWidth ?? 0) >= 1024
                              ? `${item?.name?.slice(0, 20) ?? ''}...`
                              : item.name}
                          </Typography>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Typography className="text-[#3AC4A0] text-[14.24px] leading-[20.35px] font-poppins font-semibold">
                          {item?.percentage}%
                        </Typography>
                        <Typography className="text-[#7555DA] text-[12.21px] leading-[16.28px] font-poppins font-normal">
                          {`${item?.type?.charAt(0).toUpperCase() ?? ''}${
                            item?.type?.slice(1).toLowerCase() ?? ''
                          }`}
                        </Typography>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )
    }
  ];
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const myData = await getUserInfo();
        setMyInfo(myData);
      } catch (error: any) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData()
      .then()
      .catch(() => {});
  }, []);
  return (
    <Tabs value={activeTab}>
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
            onClick={() => {
              setActiveTab(value);
            }}
            className={`${
              activeTab === value ? 'text-[#27A590]' : 'text-[#7C7C7C]'
            } mx-[30px] text-base font-poppins font-semibold z-10`}
          >
            {label}
          </Tab>
        ))}
      </TabsHeader>
      <TabsBody>
        {data.map(({ value, content }) => (
          <TabPanel
            key={value}
            value={value}
            className="flex justify-center p-0 my-4"
          >
            {content}
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  );
};

export default UnderLineTab;
