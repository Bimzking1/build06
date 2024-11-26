import IconNoData from '@/assets/play/tournament/noData.svg';
import CCard from '@/components/CCard';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import PostSection from '@/containers/circle/[id]/PostSection';
import withAuth from '@/helpers/withAuth';
import { getUserInfo } from '@/repository/profile.repository';
import { getSavedPost } from '@/repository/social.respository';
import { type DataPost, type UserInfoI } from '@/utils/interfaces/social.interfaces';
import {
  Menu,
  MenuHandler,
  MenuList,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ArrowBackwardIcon } from 'public/assets/vector';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface SavedPostListParams {
  page: number;
  limit: number;
}

const SavedPost: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState<UserInfoI>();
  const [loading, setLoading] = useState<boolean>(false);
  const [savedPostData, setSavedPostData] = useState<DataPost[]>([]);
  const [mySavedPostParams, setMySavedPostParams] = useState({
    limit: 10,
    page: 1
  });

  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingPost, setIsLoadingPost] = useState<boolean>(false);
  const [isIncrease, setIsIncrease] = useState<boolean>(false);

  const handleScroll = (): void => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 20 && !isLoadingPost) {
      if (!isIncrease) {
        setIsIncrease(true);
        setTimeout(() => {
          setMySavedPostParams(prevState => ({
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
      void fetchMySavedPost(mySavedPostParams)
    }
  }, [mySavedPostParams.page]);

  const fetchMySavedPost = async (
    mySavedPostParams: SavedPostListParams
  ): Promise<void> => {
    try {
      setLoading(true)
      setIsLoadingPost(true);
      getSavedPost(mySavedPostParams)
        .then(res => {
          const data: DataPost[] = res?.data;
          const total = res?.metadata?.total;

          if (res?.data !== null) {
            setSavedPostData(prevState => savedPostData?.length === 0 ? [...data] : [...prevState, ...data]);
            if (savedPostData?.length + data?.length < total) {
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
        .catch((err: any) => {
          toast.error(err.message);
          setIsIncrease(false);
          setIsLoadingPost(false);
        });
    } catch (error: any) {
      toast.error('Error fetching data:', error.message);
    } finally {
      setLoading(false)
      setIsLoadingPost(false);
    }
  };

  const fetchData = async (): Promise<void> => {
    try {
      const myData = await getUserInfo();
      setUserInfo(myData);
    } catch (error: any) {
      toast.error('Error fetching data:', error.message);
    }
  };

  useEffect(() => {
    fetchData()
      .then()
      .catch(() => {});
  }, []);

  return (
    <PageGradient defaultGradient className="w-full">
      <CCard className="flex flec-col p-4 md:p-5 mt-5 md:rounded-lg border-none rounded-none pb-5">
        <div className="flex justify-start items-center gap-4 mb-4">
          <div
            onClick={async() => await router.push('/user-setting')}
            className='flex justify-center items-center w-[24px] h-[24px] hover:scale-125 duration-300 cursor-pointer'
          >
            <Image alt="" src={ArrowBackwardIcon} className="w-full h-auto" />
          </div>
          <Typography className="text-xl font-semibold font-poppins text-[#262626]">
            {t('setting.setting.savedPost.title')}
          </Typography>
          <Menu placement="bottom">
            <MenuHandler>
              <button className="flex items-center" type="button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z"
                    stroke="#3C49D6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 12V9"
                    stroke="#3C49D6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 6H9.0075"
                    stroke="#3C49D6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </MenuHandler>
            <MenuList className="rounded-2xl">
              <div className="flex flex-col p-2 max-w-[300px]">
                <div className="flex justify-between">
                  <Typography className="font-semibold text-xs font-poppins text-[#3AC4A0]">
                    {t('setting.setting.savedPost.info')}
                  </Typography>
                </div>
                <Typography className="font-normal text-xs font-poppins text-[#262626] mt-2">
                  {t('setting.setting.savedPost.infoMessage')}
                </Typography>
              </div>
            </MenuList>
          </Menu>
        </div>

        {/* Post Section */}
        {
          !loading ? (
            (savedPostData?.length > 0 && userInfo !== undefined) ?
            savedPostData?.map((el: DataPost, idx: number) => {
              return (
                <div className="flex flex-col" key={`${el.id} ${idx}`}>
                  {el.circle !== undefined && (
                    <div
                      className={`flex justify-between p-2 rounded-t-2xl px-4 ${
                        el?.circle?.status_joined
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
                          el?.circle?.status_joined
                            ? 'bg-[#BDBDBD] cursor-not-allowed'
                            : 'bg-seeds-button-green'
                        } rounded-full`}
                      >
                        <Typography
                          className={`text-sm ${
                            el?.circle?.status_joined
                              ? 'text-neutral-soft'
                              : 'text-white'
                          } px-2 py-1 font-bold`}
                          onClick={() => {
                            if (el?.circle?.status_joined === false) {
                              router
                                .push(`/connect/post/${el?.circle_id}`)
                                .catch((err: any) => {
                                  toast.error(err.message);
                                });
                            }
                          }}
                        >
                          {el?.circle?.status_joined
                            ? t('circleDetail.statusJoined')
                            : t('circleDetail.statusNotJoined')}
                        </Typography>
                      </button>
                    </div>
                  )}
                  <PostSection
                    dataPost={el}
                    setData={setSavedPostData}
                    userInfo={userInfo}
                  />
                </div>
              );
            })
            :
            <div className="bg-white flex flex-col justify-center items-center text-center lg:px-0">
              <Image alt="" src={IconNoData} className="w-[250px]" />
              <p className="font-semibold text-black text-lg">
                {t('setting.setting.savedPost.noData')}
              </p>
              <p className="text-[#7C7C7C] mb-8">{t('setting.setting.savedPost.noDataMessage')}</p>
            </div>
          ) : (
            <div className="w-full flex justify-center h-fit my-8">
              <div className="h-[60px]">
                <div className="animate-spinner w-16 h-16 border-8 border-gray-200 border-t-seeds-button-green rounded-full" />
              </div>
            </div>
          )
        }
      </CCard>
    </PageGradient>
  );
};

export default withAuth(SavedPost);
