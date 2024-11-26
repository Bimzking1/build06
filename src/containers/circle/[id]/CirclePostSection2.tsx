'use client';
import {
  getCirclePost,
  getCircleRecomend,
  getMemberCircle,
  getStatusCircle
} from '@/repository/circleDetail.repository';
import { getUserInfo } from '@/repository/profile.repository';
import {
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import {
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { SearchMember } from 'public/assets/circle';
import { TripleDots } from 'public/assets/vector';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import ModalMention from './ModalMention';
import PostSection from './PostSection';
interface props {
  open: boolean;
  handleOpen: () => void;
  circleId: string;
  setIsLoading: any;
  dataCircle: any;
  isJoined: boolean;
}

interface UserData {
  id: any;
  name: string;
  seedsTag: string;
  email: string;
  pin: string;
  avatar: string;
  bio: string;
  birthDate: string;
  phone: string;
  preferredLanguage: string;
  _pin: string;
  verified: boolean;
}

interface HashtagProps {
  name: string;
  onClose: () => void;
  role: string;
}

interface typeOfTab {
  name: string;
  value: string;
}

const Hashtag: React.FC<HashtagProps> = ({ name, onClose, role }) => {
  return (
    <span className="flex items-center bg-seeds-button-green rounded-md px-3 gap-2 py-1 mb-2">
      <Typography className="text-sm font-poppins text-white font-medium">
        # {name}
      </Typography>
      {role !== 'member' && (
        <button
          onClick={onClose}
          className="text-xs font-poppins text-white"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <g clip-path="url(#clip0_2078_23613)">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.9987 2.50016C5.85656 2.50016 2.4987 5.85803 2.4987 10.0002C2.4987 14.1423 5.85656 17.5002 9.9987 17.5002C14.1408 17.5002 17.4987 14.1423 17.4987 10.0002C17.4987 5.85803 14.1408 2.50016 9.9987 2.50016ZM0.832031 10.0002C0.832031 4.93755 4.93609 0.833496 9.9987 0.833496C15.0613 0.833496 19.1654 4.93755 19.1654 10.0002C19.1654 15.0628 15.0613 19.1668 9.9987 19.1668C4.93609 19.1668 0.832031 15.0628 0.832031 10.0002Z"
                fill="white"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M13.0906 6.91058C13.416 7.23602 13.416 7.76366 13.0906 8.08909L8.09056 13.0891C7.76512 13.4145 7.23748 13.4145 6.91205 13.0891C6.58661 12.7637 6.58661 12.236 6.91205 11.9106L11.912 6.91058C12.2375 6.58514 12.7651 6.58514 13.0906 6.91058Z"
                fill="white"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6.91205 6.91058C7.23748 6.58514 7.76512 6.58514 8.09056 6.91058L13.0906 11.9106C13.416 12.236 13.416 12.7637 13.0906 13.0891C12.7651 13.4145 12.2375 13.4145 11.912 13.0891L6.91205 8.08909C6.58661 7.76366 6.58661 7.23602 6.91205 6.91058Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_2078_23613">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>
      )}
    </span>
  );
};

const initialFilter = {
  limit: 10,
  page: 1
};

interface Filter {
  limit: number;
  page: number;
}

const initialUserInfo = {
  id: '',
  name: '',
  seedsTag: '',
  email: '',
  pin: '',
  avatar: '',
  bio: '',
  birthDate: '',
  phone: '',
  preferredLanguage: '',
  verified: false,
  _pin: ''
};

const dataTab: typeOfTab[] = [
  { name: 'Post', value: 'post' },
  { name: 'Recommended', value: 'recommended' },
  { name: 'Members', value: 'members' },
  { name: 'About', value: 'about' }
];

interface role {
  status: string;
  role: string;
}

const CirclePostSection2: React.FC<props> = ({
  open,
  handleOpen,
  setIsLoading,
  circleId,
  dataCircle,
  isJoined
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [tabs, setTabs] = useState<string>('post');
  const [member, setMember] = useState<any[]>([]);
  const [searchMember, setSearchMember] = useState<string>('');
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [isLoadingPost, setIsLoadingPost] = useState<boolean>(false);
  const [isLoadingMember, setIsLoadingMember] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [dataPost, setDataPost] = useState<any[]>([]);
  const [dataRecommend, setDataRecommend] = useState<any[]>([]);
  const [isIncrease, setIsIncrease] = useState(false);
  const [golId, setGolId] = useState<number>(1);
  const [userInfo, setUserInfo] = useState<UserData>(initialUserInfo);
  const [role, setRole] = useState<role>({
    status: '',
    role: ''
  });

  const fetchUserInfo = async (): Promise<void> => {
    try {
      const { data } = await getStatusCircle({ circleId });
      setRole(data);
    } catch (error) {
      toast.error(`Error fetching Circle Post: ${error as string}`);
    }
  };

  useEffect(() => {
    if (isJoined) {
      void fetchUserInfo();
    }
  }, [isJoined]);

  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): any => {
    const { value } = event.target;
    setSearchMember(value);
  };

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response = await getUserInfo();
        setUserInfo(response);
      } catch (error) {
        toast.error(`${error as string}`);
      }
    };
    void fetchData();
  }, []);

  const fetchCirclePost = async (): Promise<void> => {
    try {
      setIsLoadingPost(true);

      getCirclePost({
        circleId,
        page: filter.page,
        limit: filter.limit
      })
        .then(res => {
          const data: any[] = res.data;
          const total = res.metadata.total;

          if (res.data !== null) {
            setDataPost(prevState => [...prevState, ...data]);
            if (dataPost.length + data.length < total) {
              setHasMore(true);
            } else {
              setHasMore(false);
            }
          } else {
            setHasMore(false);
          }
          setIsIncrease(false);
          setIsLoadingPost(false);
        })
        .catch(err => {
          toast.error(`${err as string}`);
          setIsIncrease(false);
          setIsLoadingPost(false);
        });
    } catch (error) {
      setIsIncrease(false);
      setIsLoadingPost(false);
      toast.error(`Error fetching Circle Post: ${error as string}`);
    }
  };

  const fetchCircleRecommended = async (): Promise<void> => {
    try {
      setIsLoadingPost(true);

      getCircleRecomend({
        circleId,
        page: filter.page,
        limit: filter.limit
      })
        .then(res => {
          const data: any[] = res.data;
          const total = res.metadata.total;
          if (res.data !== null) {
            setDataRecommend(prevState => [...prevState, ...data]);
            if (dataRecommend.length + data.length < total) {
              setHasMore(true);
            } else {
              setHasMore(false);
            }
          } else {
            setHasMore(false);
          }
          setIsIncrease(false);
          setIsLoadingPost(false);
        })
        .catch(err => {
          toast.error(`${err as string}`);
          setIsIncrease(false);
          setIsLoadingPost(false);
        });
    } catch (error) {
      setIsIncrease(false);
      setIsLoadingPost(false);
      toast.error(`Error fetching Circle Recommendation: ${error as string}`);
    }
  };

  const fetchCircleMember = async (): Promise<void> => {
    try {
      setIsLoadingMember(true);

      const { data } = await getMemberCircle({ circleId });

      setMember(data);
    } catch (error) {
      toast.error(`Error fetching Circle Recommendation: ${error as string}`);
    } finally {
      setIsLoadingMember(false);
    }
  };

  useEffect(() => {
    void fetchCircleMember();
  }, []);

  const newData = Array.isArray(member)
    ? member.filter(el => {
        if (searchMember === '') return true;
        return el.name.toLowerCase().includes(searchMember.toLowerCase());
      })
    : [];

  const handleScroll = (): void => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 20 && !isLoadingPost) {
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

  useEffect(() => {
    if (hasMore) {
      if (tabs === 'post') {
        fetchCirclePost()
          .then()
          .catch(() => {});
      } else if (tabs === 'recommended') {
        fetchCircleRecommended()
          .then()
          .catch(() => {});
      }
    }
  }, [tabs, filter.page, hasMore]);

  useEffect(() => {
    setHasMore(true);
  }, [golId]);

  const renderLoading = (): JSX.Element => (
    <div className="flex justify-center h-10 pt-2">
      <div className="h-72 absolute">
        <div className="animate-spinner w-16 h-16 border-8 border-gray-200 border-t-seeds-button-green rounded-full" />
      </div>
    </div>
  );

  const handleChangeTab = (value: string): void => {
    setTabs(value);
    setDataPost([]);
    setDataRecommend([]);
    setHasMore(true);
    setFilter(prevState => ({
      ...prevState,
      page: 1
    }));
  };

  return (
    <>
      <ModalMention
        open={open}
        handleOpen={handleOpen}
        setIsLoading={setIsLoading}
        setIsLoadingPost={setIsLoadingPost}
        setFilter={setFilter}
        setData={
          tabs === 'post'
            ? setDataPost
            : tabs === 'recommended'
            ? setDataRecommend
            : undefined
        }
        setGolId={setGolId}
      />
      <div className="bg-white my-8 rounded-xl">
        <div className="h-fit w-full pt-4 md:px-14 md:ml-0 pb-8">
          {/* navigation */}
          <Tabs value={tabs}>
            <TabsHeader
              className="w-full xl:w-2/3 2xl:w-1/2 text-center justify-center rounded-none bg-transparent p-0"
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
                        ? 'text-[#4FE6AF] bg-gradient-to-t from-[#e5fcf3] to-white linier  font-semibold border-b-4 border-b-[#4FE6AF]'
                        : 'text-[#7C7C7C] text-sm font-normal border-b-[#BDBDBD] border-b-2'
                    }`}
                  >
                    {el.name === 'Post' && t('circleDetail.navigator.post')}
                    {el.name === 'Recommended' &&
                      t('circleDetail.navigator.recomend')}
                    {el.name === 'Members' &&
                      t('circleDetail.navigator.listMembers')}
                    {el.name === 'About' && t('circleDetail.navigator.about')}
                  </Tab>
                );
              })}
            </TabsHeader>
            <TabsBody className="pb-4">
              <TabPanel value="post">
                <div className="">
                  {dataPost !== undefined &&
                    dataPost !== null &&
                    dataPost.length > 0 &&
                    dataPost?.map((el: any) => {
                      return (
                        <PostSection
                          dataPost={el}
                          key={el.id}
                          setData={setDataPost}
                          userInfo={userInfo}
                        />
                      );
                    })}
                </div>

                {isLoadingPost && renderLoading()}
              </TabPanel>
              <TabPanel value="recommended">
                <div className="">
                  {dataRecommend !== undefined &&
                    dataRecommend !== null &&
                    dataRecommend.length > 0 &&
                    dataRecommend?.map((el: any) => {
                      return (
                        <PostSection
                          dataPost={el}
                          key={el.id}
                          setData={setDataRecommend}
                          userInfo={userInfo}
                        />
                      );
                    })}
                </div>
                {isLoadingPost && renderLoading()}
              </TabPanel>
              <TabPanel value="members">
                {isLoadingMember ? (
                  renderLoading()
                ) : (
                  <div className="flex flex-col ">
                    <div className="flex justify-between w-full pt-2">
                      <Typography className="text-black font-semibold font-poppins">
                        Participants
                      </Typography>
                      <Typography className="text-black font-normal font-poppins">
                        {member.length} Participants
                      </Typography>
                    </div>
                    <div className="flex justify-start mt-4">
                      <div className="flex justify-center flex-col absolute left-6 pt-2">
                        <Image
                          alt="Search"
                          src={SearchMember}
                          className="h-6 w-6 object-cover"
                        />
                      </div>
                      <input
                        type="text"
                        value={searchMember}
                        onChange={handleFormChange}
                        className="h-10 pl-10 focus:outline-none focus:outline focus:outline-seeds-green placeholder:text-neutral-soft rounded-xl w-full border border-neutral-ultrasoft"
                        placeholder="Search Member"
                      />
                    </div>
                    {role.role !== 'member' && (
                      <div className="flex justify-end pt-4">
                        <Button
                          variant="outlined"
                          onClick={() => {
                            router
                              .push(`/connect/add-member/${circleId}`)
                              .catch(err => {
                                toast.error(`${err as string}`);
                              });
                          }}
                          className="flex items-center gap-2 bg-seeds-green/20 px-4 py-2 rounded-full border cursor-pointer border-seeds-button-green"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M1.22039 12.8871C2.00179 12.1057 3.0616 11.6667 4.16667 11.6667H10C11.1051 11.6667 12.1649 12.1057 12.9463 12.8871C13.7277 13.6685 14.1667 14.7283 14.1667 15.8334V17.5001C14.1667 17.9603 13.7936 18.3334 13.3333 18.3334C12.8731 18.3334 12.5 17.9603 12.5 17.5001V15.8334C12.5 15.1704 12.2366 14.5345 11.7678 14.0656C11.2989 13.5968 10.663 13.3334 10 13.3334H4.16667C3.50363 13.3334 2.86774 13.5968 2.3989 14.0656C1.93006 14.5345 1.66667 15.1704 1.66667 15.8334V17.5001C1.66667 17.9603 1.29357 18.3334 0.833333 18.3334C0.373096 18.3334 0 17.9603 0 17.5001V15.8334C0 14.7283 0.438987 13.6685 1.22039 12.8871Z"
                              fill="#3AC4A0"
                            />
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M7.08464 3.33341C5.70392 3.33341 4.58464 4.4527 4.58464 5.83341C4.58464 7.21413 5.70392 8.33341 7.08464 8.33341C8.46535 8.33341 9.58464 7.21413 9.58464 5.83341C9.58464 4.4527 8.46535 3.33341 7.08464 3.33341ZM2.91797 5.83341C2.91797 3.53223 4.78345 1.66675 7.08464 1.66675C9.38582 1.66675 11.2513 3.53223 11.2513 5.83341C11.2513 8.1346 9.38582 10.0001 7.08464 10.0001C4.78345 10.0001 2.91797 8.1346 2.91797 5.83341Z"
                              fill="#3AC4A0"
                            />
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M16.6654 5.83325C17.1256 5.83325 17.4987 6.20635 17.4987 6.66659V11.6666C17.4987 12.1268 17.1256 12.4999 16.6654 12.4999C16.2051 12.4999 15.832 12.1268 15.832 11.6666V6.66659C15.832 6.20635 16.2051 5.83325 16.6654 5.83325Z"
                              fill="#3AC4A0"
                            />
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M13.332 9.16659C13.332 8.70635 13.7051 8.33325 14.1654 8.33325H19.1654C19.6256 8.33325 19.9987 8.70635 19.9987 9.16659C19.9987 9.62682 19.6256 9.99992 19.1654 9.99992H14.1654C13.7051 9.99992 13.332 9.62682 13.332 9.16659Z"
                              fill="#3AC4A0"
                            />
                          </svg>
                          <Typography className="font-poppins font-semibold text-xs text-seeds-button-green">
                            Add
                          </Typography>
                        </Button>
                      </div>
                    )}
                    <div className="grid grid-cols-1 gap-4 pt-4">
                      {newData.map((el: any) => {
                        return (
                          <div className="flex gap-2" key={el.id}>
                            <div className="hidden md:flex">
                              <div>
                                <Image
                                  src={el.avatar}
                                  alt="AVATAR"
                                  width={48}
                                  height={48}
                                  className="w-15 h-15 aspect-square rounded-full"
                                />
                              </div>
                            </div>
                            <div className="md:hidden flex">
                              <div>
                                <Image
                                  src={el?.avatar}
                                  alt="AVATAR"
                                  width={48}
                                  height={48}
                                  className=" w-11 h-11  rounded-full outline outline-black"
                                />
                              </div>
                            </div>

                            <div className="w-full">
                              <div className="flex justify-between">
                                <div className="flex items-start">
                                  <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                      <Typography className="font-bold md:text-lg font-poppins">
                                        {el?.name}
                                      </Typography>
                                      {el.verified === true && (
                                        <CheckCircleIcon
                                          width={20}
                                          height={20}
                                          color="#5E44FF"
                                        />
                                      )}
                                    </div>
                                    <div className="flex gap-1 items-center">
                                      <Typography className="text-xs md:text-sm font-poppins text-neutral-soft">
                                        @{el?.username}
                                      </Typography>
                                    </div>
                                  </div>
                                </div>
                                <Menu placement="left">
                                  <MenuHandler>
                                    <button type="button">
                                      <Image
                                        src={TripleDots.src}
                                        alt={TripleDots.alt}
                                        height={8}
                                        width={8}
                                        className="w-auto h-auto relative"
                                      />
                                    </button>
                                  </MenuHandler>
                                  <MenuList>
                                    {role.role === 'owner' && (
                                      <>
                                        <MenuItem onClick={() => {}}>
                                          <div className="flex flex-row">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="20"
                                              height="20"
                                              viewBox="0 0 20 20"
                                              className="mr-2"
                                              fill="none"
                                            >
                                              <path
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M1.22039 12.8871C2.00179 12.1057 3.0616 11.6667 4.16667 11.6667H10C11.1051 11.6667 12.1649 12.1057 12.9463 12.8871C13.7277 13.6685 14.1667 14.7283 14.1667 15.8334V17.5001C14.1667 17.9603 13.7936 18.3334 13.3333 18.3334C12.8731 18.3334 12.5 17.9603 12.5 17.5001V15.8334C12.5 15.1704 12.2366 14.5345 11.7678 14.0656C11.2989 13.5968 10.663 13.3334 10 13.3334H4.16667C3.50363 13.3334 2.86774 13.5968 2.3989 14.0656C1.93006 14.5345 1.66667 15.1704 1.66667 15.8334V17.5001C1.66667 17.9603 1.29357 18.3334 0.833333 18.3334C0.373096 18.3334 0 17.9603 0 17.5001V15.8334C0 14.7283 0.438987 13.6685 1.22039 12.8871Z"
                                                fill="#3AC4A0"
                                              />
                                              <path
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M7.08464 3.33341C5.70392 3.33341 4.58464 4.4527 4.58464 5.83341C4.58464 7.21413 5.70392 8.33341 7.08464 8.33341C8.46535 8.33341 9.58464 7.21413 9.58464 5.83341C9.58464 4.4527 8.46535 3.33341 7.08464 3.33341ZM2.91797 5.83341C2.91797 3.53223 4.78345 1.66675 7.08464 1.66675C9.38582 1.66675 11.2513 3.53223 11.2513 5.83341C11.2513 8.1346 9.38582 10.0001 7.08464 10.0001C4.78345 10.0001 2.91797 8.1346 2.91797 5.83341Z"
                                                fill="#3AC4A0"
                                              />
                                              <path
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M19.7546 6.91083C20.0801 7.23626 20.0801 7.7639 19.7546 8.08934L16.4213 11.4227C16.0958 11.7481 15.5682 11.7481 15.2428 11.4227L13.5761 9.756C13.2507 9.43057 13.2507 8.90293 13.5761 8.57749C13.9015 8.25206 14.4292 8.25206 14.7546 8.57749L15.832 9.6549L18.5761 6.91083C18.9015 6.58539 19.4292 6.58539 19.7546 6.91083Z"
                                                fill="#3AC4A0"
                                              />
                                            </svg>
                                            <Typography className="text-sm font-medium">
                                              Give Ownership
                                            </Typography>
                                          </div>
                                        </MenuItem>
                                        <hr />
                                      </>
                                    )}
                                    {role.role !== 'member' && (
                                      <>
                                        <MenuItem onClick={() => {}}>
                                          <div className="flex flex-row items-center">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="20"
                                              height="20"
                                              viewBox="0 0 20 20"
                                              fill="none"
                                              className="mr-2"
                                            >
                                              <path
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M1.22039 12.8871C2.00179 12.1057 3.0616 11.6667 4.16667 11.6667H10.8333C11.9384 11.6667 12.9982 12.1057 13.7796 12.8871C14.561 13.6685 15 14.7283 15 15.8334V17.5001C15 17.9603 14.6269 18.3334 14.1667 18.3334C13.7064 18.3334 13.3333 17.9603 13.3333 17.5001V15.8334C13.3333 15.1704 13.0699 14.5345 12.6011 14.0656C12.1323 13.5968 11.4964 13.3334 10.8333 13.3334H4.16667C3.50363 13.3334 2.86774 13.5968 2.3989 14.0656C1.93006 14.5345 1.66667 15.1704 1.66667 15.8334V17.5001C1.66667 17.9603 1.29357 18.3334 0.833333 18.3334C0.373096 18.3334 0 17.9603 0 17.5001V15.8334C0 14.7283 0.438987 13.6685 1.22039 12.8871Z"
                                                fill="#3AC4A0"
                                              />
                                              <path
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M7.4987 3.33341C6.11799 3.33341 4.9987 4.4527 4.9987 5.83341C4.9987 7.21413 6.11799 8.33341 7.4987 8.33341C8.87941 8.33341 9.9987 7.21413 9.9987 5.83341C9.9987 4.4527 8.87941 3.33341 7.4987 3.33341ZM3.33203 5.83341C3.33203 3.53223 5.19751 1.66675 7.4987 1.66675C9.79988 1.66675 11.6654 3.53223 11.6654 5.83341C11.6654 8.1346 9.79988 10.0001 7.4987 10.0001C5.19751 10.0001 3.33203 8.1346 3.33203 5.83341Z"
                                                fill="#3AC4A0"
                                              />
                                              <path
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M15.8587 12.4001C15.9738 11.9545 16.4283 11.6865 16.8739 11.8016C17.7678 12.0324 18.5597 12.5535 19.1253 13.2831C19.6909 14.0128 19.9982 14.9096 19.9989 15.8328L19.9989 17.5001C19.9989 17.9603 19.6258 18.3334 19.1656 18.3334C18.7053 18.3334 18.3322 17.9603 18.3322 17.5001L18.3322 15.8341C18.3322 15.834 18.3322 15.8341 18.3322 15.8341C18.3318 15.2802 18.1474 14.742 17.8081 14.3043C17.4687 13.8665 16.9936 13.5538 16.4572 13.4153C16.0116 13.3003 15.7436 12.8457 15.8587 12.4001Z"
                                                fill="#3AC4A0"
                                              />
                                              <path
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M12.5262 2.40174C12.6404 1.95588 13.0944 1.68699 13.5402 1.80114C14.4365 2.03062 15.2309 2.55188 15.7982 3.28272C16.3655 4.01356 16.6734 4.91243 16.6734 5.8376C16.6734 6.76278 16.3655 7.66165 15.7982 8.39249C15.2309 9.12333 14.4365 9.64458 13.5402 9.87406C13.0944 9.98822 12.6404 9.71932 12.5262 9.27347C12.4121 8.82761 12.681 8.37364 13.1268 8.25948C13.6646 8.12179 14.1412 7.80904 14.4816 7.37053C14.822 6.93203 15.0067 6.39271 15.0067 5.8376C15.0067 5.2825 14.822 4.74318 14.4816 4.30467C14.1412 3.86617 13.6646 3.55342 13.1268 3.41573C12.681 3.30157 12.4121 2.84759 12.5262 2.40174Z"
                                                fill="#3AC4A0"
                                              />
                                            </svg>
                                            <Typography className="text-sm font-medium max-w-[100px]">
                                              Make Circle Admin
                                            </Typography>
                                          </div>
                                        </MenuItem>
                                        <hr />
                                        <MenuItem onClick={() => {}}>
                                          <div className="flex flex-row items-center gap-2 text-[#DD2525]">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="20"
                                              height="20"
                                              viewBox="0 0 20 20"
                                              fill="none"
                                            >
                                              <path
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M1.22039 12.8869C2.00179 12.1055 3.0616 11.6665 4.16667 11.6665H10C11.1051 11.6665 12.1649 12.1055 12.9463 12.8869C13.7277 13.6683 14.1667 14.7281 14.1667 15.8332V17.4998C14.1667 17.9601 13.7936 18.3332 13.3333 18.3332C12.8731 18.3332 12.5 17.9601 12.5 17.4998V15.8332C12.5 15.1701 12.2366 14.5342 11.7678 14.0654C11.2989 13.5966 10.663 13.3332 10 13.3332H4.16667C3.50363 13.3332 2.86774 13.5966 2.3989 14.0654C1.93006 14.5342 1.66667 15.1701 1.66667 15.8332V17.4998C1.66667 17.9601 1.29357 18.3332 0.833333 18.3332C0.373096 18.3332 0 17.9601 0 17.4998V15.8332C0 14.7281 0.438987 13.6683 1.22039 12.8869Z"
                                                fill="#DD2525"
                                              />
                                              <path
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M7.08464 3.33317C5.70392 3.33317 4.58464 4.45246 4.58464 5.83317C4.58464 7.21388 5.70392 8.33317 7.08464 8.33317C8.46535 8.33317 9.58464 7.21388 9.58464 5.83317C9.58464 4.45246 8.46535 3.33317 7.08464 3.33317ZM2.91797 5.83317C2.91797 3.53198 4.78345 1.6665 7.08464 1.6665C9.38582 1.6665 11.2513 3.53198 11.2513 5.83317C11.2513 8.13436 9.38582 9.99984 7.08464 9.99984C4.78345 9.99984 2.91797 8.13436 2.91797 5.83317Z"
                                                fill="#DD2525"
                                              />
                                              <path
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M14.412 6.07757C14.7375 5.75214 15.2651 5.75214 15.5906 6.07757L19.7572 10.2442C20.0827 10.5697 20.0827 11.0973 19.7572 11.4228C19.4318 11.7482 18.9042 11.7482 18.5787 11.4228L14.412 7.25609C14.0866 6.93065 14.0866 6.40301 14.412 6.07757Z"
                                                fill="#DD2525"
                                              />
                                              <path
                                                fill-rule="evenodd"
                                                clip-rule="evenodd"
                                                d="M19.7572 6.07757C20.0827 6.40301 20.0827 6.93065 19.7572 7.25609L15.5906 11.4228C15.2651 11.7482 14.7375 11.7482 14.412 11.4228C14.0866 11.0973 14.0866 10.5697 14.412 10.2442L18.5787 6.07757C18.9042 5.75214 19.4318 5.75214 19.7572 6.07757Z"
                                                fill="#DA2D1F"
                                              />
                                            </svg>
                                            <Typography className="text-sm font-medium max-w-[100px]">
                                              Kick Member
                                            </Typography>
                                          </div>
                                        </MenuItem>
                                        <hr />
                                        <MenuItem onClick={() => {}}>
                                          <div className="flex flex-row text-[#DD2525] gap-2">
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="20"
                                              height="20"
                                              viewBox="0 0 20 20"
                                              fill="none"
                                            >
                                              <path
                                                d="M4.58333 4.58333L15.4167 15.4167M17.5 10C17.5 10.9849 17.306 11.9602 16.9291 12.8701C16.5522 13.7801 15.9997 14.6069 15.3033 15.3033C14.6069 15.9997 13.7801 16.5522 12.8701 16.9291C11.9602 17.306 10.9849 17.5 10 17.5C9.01509 17.5 8.03982 17.306 7.12987 16.9291C6.21993 16.5522 5.39314 15.9997 4.6967 15.3033C4.00026 14.6069 3.44781 13.7801 3.0709 12.8701C2.69399 11.9602 2.5 10.9849 2.5 10C2.5 8.01088 3.29018 6.10322 4.6967 4.6967C6.10322 3.29018 8.01088 2.5 10 2.5C11.9891 2.5 13.8968 3.29018 15.3033 4.6967C16.7098 6.10322 17.5 8.01088 17.5 10Z"
                                                stroke="#DD2525"
                                                strokeWidth="2"
                                              />
                                            </svg>
                                            <Typography className="text-sm font-medium max-w-[100px]">
                                              Ban Member
                                            </Typography>
                                          </div>
                                        </MenuItem>
                                        <hr />
                                      </>
                                    )}
                                    <MenuItem onClick={() => {}}>
                                      <div className="flex flex-row text-[#DD2525]">
                                        <ExclamationCircleIcon className="w-5 h-5 text-[#DD2525] mr-2" />
                                        <Typography className="text-sm font-medium max-w-[100px]">
                                          Report User
                                        </Typography>
                                      </div>
                                    </MenuItem>
                                  </MenuList>
                                </Menu>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </TabPanel>
              <TabPanel value="about">
                <div className="space-y-6  pt-4">
                  <div className="space-y-4 w-full border-b-2 border-neutral-ultrasoft pb-5">
                    <h1 className="text-base font-semibold font-poppins">
                      About this Circle
                    </h1>
                    <p className="text-neutral-medium font-normal font-poppins">
                      {dataCircle.description}
                    </p>
                  </div>
                  <div className="space-y-4 w-full border-b-2 border-neutral-ultrasoft pb-5">
                    <h1 className="text-base font-semibold font-poppins">
                      Circle Rules
                    </h1>
                    <p className="text-neutral-medium font-normal font-poppins">
                      {dataCircle.description_rules}
                    </p>
                  </div>
                  <div className="flex flex-wrap">
                    <h1 className="text-base font-semibold mb-4 w-full font-poppins">
                      Hashtag
                    </h1>
                    {dataCircle?.hashtags?.map((el: any, idx: number) => {
                      return (
                        <Hashtag
                          name={el.name}
                          role={role.role}
                          onClose={() => {}}
                          key={idx}
                        />
                      );
                    })}
                  </div>
                </div>
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default CirclePostSection2;
