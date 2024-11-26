/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
'use-client';

import NoData from '@/assets/play/tournament/assetNoData.svg';
import Verified from '@/assets/play/tournament/verifiedIcon.svg';
import Loading from '@/components/popup/Loading';
import SocialWallPagination from '@/components/SocialWallPagination';
import ModalMentionPlay from '@/containers/circle/[id]/ModalMentionPlay';
import PostSection from '@/containers/circle/[id]/PostSection';
import withAuth from '@/helpers/withAuth';
import { getPlayById, getPlayPostList } from '@/repository/play.repository';
import { getUserInfo } from '@/repository/profile.repository';
import {
  type IDetailTournament,
  type PostData
} from '@/utils/interfaces/tournament.interface';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

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

interface UserInfo {
  id: string;
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

interface Filter {
  page: number;
  limit: number;
  type: string;
  sort_by: string;
}

const initialFilter = {
  page: 1,
  limit: 10,
  type: 'all',
  sort_by: ''
};

interface Metadata {
  current_page: number;
  limit: number;
  totalPage: number;
  totalRow: number;
}

const SocialWall = (): React.ReactElement => {
  const router = useRouter();
  const id = router.query.id;
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState<UserInfo>(initialUserInfo);
  const [dataPost, setDataPost] = useState<PostData[]>([]);
  const [metadata, setMetadata] = useState<Metadata>();
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [golId, setGolId] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingPlayId, setIsLoadingPlayId] = useState<boolean>(false);
  const [loadingPostList, setLoadingPostList] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [playData, setPlayData] = useState<IDetailTournament>();
  const [postListParams, setPostListParams] = useState({
    play_id: id as string,
    limit: 10,
    page: 1
  });

  useEffect(() => {
    fetchData()
      .then()
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (id !== null && userInfo !== undefined) {
      void fetchPlayById();
    }
  }, [id, userInfo]);

  useEffect(() => {
    if (id !== null && userInfo !== undefined) {
      void fetchPlayPostList();
    }
  }, [id, userInfo, golId, filter, postListParams?.page]);

  const fetchData = async (): Promise<void> => {
    try {
      const dataInfo = await getUserInfo();

      setUserInfo(dataInfo);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  const fetchPlayPostList = async (): Promise<void> => {
    try {
      setLoadingPostList(true);
      const response = await getPlayPostList({ ...postListParams });
      setDataPost(response?.data);
      setMetadata(response?.metadata);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      setLoadingPostList(false);
    }
  };

  const fetchPlayById = async (): Promise<void> => {
    try {
      setIsLoadingPlayId(true);
      const response = await getPlayById(id as string);
      setPlayData(response);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      setIsLoadingPlayId(true);
    }
  };

  const handleOpen = (): void => {
    if (isOpen) {
      document.body.classList.remove('modal-open');
    } else {
      document.body.classList.add('modal-open');
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isLoading && loadingPostList && isLoadingPlayId && <Loading />}
      <ModalMentionPlay
        open={isOpen}
        handleOpen={handleOpen}
        setIsLoading={setIsLoading}
        setFilter={setFilter}
        setData={setDataPost}
        setGolId={setGolId}
        playId={id as string}
      />
      <div className="w-full flex flex-col justify-center items-center rounded-xl font-poppins p-5 bg-white">
        {/* Social Wall Title */}
        <div className="flex justify-start md:justify-between w-full">
          <Typography className="text-xl font-semibold">
            {playData?.name ?? 'Social Wall'}
          </Typography>
          {playData !== undefined && (
            <Typography className="hidden md:flex text-sm md:text-md text-[#BDBDBD] italic">
              {playData?.total_participants}{' '}
              {playData?.total_participants > 1
                ? `${t('tournament.social.members')}`
                : `${t('tournament.social.member')}`}
            </Typography>
          )}
        </div>

        {/* Social Wall Description */}
        <div className="flex justify-start w-full mt-2">
          <Typography className="text-sm md:text-md text-[#7C7C7C]">
            {t('tournament.social.description')}
          </Typography>
        </div>

        {/* Social Highlights */}
        <div className="flex w-full mt-4 overflow-x-scroll gap-2 pb-4 border-b-2 border-[#E2E2E2]">
          {/* Highlight Card */}
          {isLoadingPlayId ? (
            <>
              {playData?.participants?.map((participant, index) => {
                return (
                  <>
                    <div
                      key={index}
                      onClick={async () =>
                        await router.push(
                          userInfo?.id === participant?.id
                            ? `/my-profile`
                            : `/social/${participant?.id}`
                        )
                      }
                      className="shrink border border-[#E9E9E9] rounded-lg flex flex-col justify-start gap-2 p-2 w-full min-w-[280px] cursor-pointer hover:bg-[#F2F2F2] duration-300"
                    >
                      <div className="flex w-full justify-start items-center gap-2">
                        <div className="w-[40px] h-[40px] flex justify-center items-center rounded-full border border-1 overflow-hidden">
                          <img
                            src={participant?.photo_url}
                            alt={participant?.name}
                            className="w-full h-full"
                          />
                        </div>
                        <div className="font-semibold text-sm md:text-base">
                          @
                          {participant?.seeds_tag?.length < 20
                            ? participant?.seeds_tag
                            : `${participant?.seeds_tag?.slice(0, 19)}...`}
                        </div>
                        {participant?.verified && (
                          <div className="w-[20px] h-[40px] flex justify-center items-center">
                            <Image
                              src={Verified}
                              alt={participant?.name}
                              width={100}
                              height={100}
                              className="w-[15px] h-[15px]"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex w-full justify-center items-center gap-2">
                        <div className="w-fit h-[60px] p-2 flex flex-col justify-center items-center">
                          <div className="text-sm md:text-md text-[#7C7C7C]">
                            {participant?.total_play > 1 ? 'Plays' : 'Play'}
                          </div>
                          <div className="text-md md:text-xl font-semibold">
                            {participant?.total_play}
                          </div>
                        </div>
                        <div className="w-fit h-[60px] p-2 flex flex-col justify-center items-center border-l-2 border-r-2 border-[#E2E2E2]">
                          <div className="text-sm md:text-md text-[#7C7C7C]">
                            {participant?.total_win > 1 ? 'Wins' : 'Win'}
                          </div>
                          <div className="text-md md:text-xl font-semibold">
                            {participant?.total_win}
                          </div>
                        </div>
                        <div className="w-fit h-[60px] p-2 flex flex-col justify-center items-center">
                          <div className="text-sm md:text-md text-[#7C7C7C]">
                            Win Rate
                          </div>
                          <div className="text-md md:text-xl font-semibold">
                            {participant?.win_rate}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            </>
          ) : (
            <div className="w-full flex justify-center h-fit my-8">
              <div className="h-[60px]">
                <div className="animate-spinner w-16 h-16 border-8 border-gray-200 border-t-seeds-button-green rounded-full" />
              </div>
            </div>
          )}
        </div>

        {/* Social Posts */}
        <div className="w-full">
          {!loadingPostList ? (
            dataPost?.length !== 0 ? (
              <>
                {dataPost.map(el => {
                  return (
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    <div className="flex flex-col" key={`${el?.id} ${el?.id}`}>
                      <PostSection
                        dataPost={el}
                        setData={setDataPost}
                        userInfo={userInfo}
                      />
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="bg-white flex flex-col justify-center items-center text-center lg:px-0 mt-8">
                <Image
                  alt=""
                  src={NoData}
                  className="w-[250px]"
                  width={100}
                  height={100}
                />
                <p className="font-semibold text-black mt-4">
                  {t('tournament.social.sorry')}
                </p>
                <p className="text-[#7C7C7C]">
                  {t('tournament.social.noData')}
                </p>
              </div>
            )
          ) : (
            <div className="w-full flex justify-center h-fit my-8">
              <div className="h-[60px]">
                <div className="animate-spinner w-16 h-16 border-8 border-gray-200 border-t-seeds-button-green rounded-full" />
              </div>
            </div>
          )}
        </div>

        {/* Social Play Pagination */}
        <div className="flex justify-center mx-auto my-8">
          <SocialWallPagination
            currentPage={postListParams.page}
            totalPages={metadata?.totalPage ?? 0}
            onPageChange={page => {
              setPostListParams({ ...postListParams, page });
            }}
          />
        </div>
      </div>

      {/* Modal Add Post */}
      <div className="fixed bottom-10 right-10 z-20">
        <div className="bg-[#3AC4A0] p-2 rounded-full">
          <PlusIcon
            width={50}
            height={50}
            className="text-white cursor-pointer"
            onClick={() => {
              handleOpen();
            }}
          />
        </div>
      </div>
    </>
  );
};

export default withAuth(SocialWall);
