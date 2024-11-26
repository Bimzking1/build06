/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
'use-client';

import delet from '@/assets/more-option/delete.svg';
import edit from '@/assets/more-option/edit.svg';
import more_vertical from '@/assets/more-option/more_vertical.svg';
import WatchlistNoData from '@/assets/play/tournament/watchlistNoData.svg';
import AssetPagination from '@/components/AssetPagination';
import ModalEditWatchlist from '@/components/popup/ModalEditWatchlist';
import withAuth from '@/helpers/withAuth';
import { deleteWatchlist, getWatchlist } from '@/repository/market.repository';
import { getPlayById } from '@/repository/play.repository';
import { getUserInfo } from '@/repository/profile.repository';
import {
  type IDetailTournament,
  type UserInfo
} from '@/utils/interfaces/tournament.interface';
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ArrowBackwardIcon } from 'public/assets/vector';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface Watchlist {
  id: string;
  imgUrl: string;
  name: string;
  play_id: string;
}

const TournamentHome: React.FC = () => {
  const router = useRouter();
  const id = router.query.id;
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [detailTournament, setDetailTournament] = useState<IDetailTournament>();
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
  const [deletePost, setDeletePost] = useState<boolean>(false);
  const [deletedWatchlist, setDeletedWatchlist] = useState<string>('');
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [watchList, setWatchlist] = useState<Watchlist[]>([]);
  const [editedWatchlist, setEditedWatchlist] = useState<Watchlist>({
    id: '',
    play_id: '',
    name: '',
    imgUrl: ''
  });
  const [watchlistParams, setWatchlistParams] = useState({
    page: 1,
    startIndex: 0,
    endIndex: 8
  });

  useEffect(() => {
    if (id !== null && userInfo !== undefined) {
      void fetchPlayWatchlist();
    }
  }, [id, userInfo, watchlistParams, isDeleted, isEditModal]);

  const fetchPlayWatchlist = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await getWatchlist({ play_id: id as string });
      setWatchlist(response?.listWatchlist);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async (): Promise<void> => {
    try {
      const dataInfo = await getUserInfo();
      setUserInfo(dataInfo);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  useEffect(() => {
    fetchData()
      .then()
      .catch(() => {});
  }, []);

  const fetchDetailTournament = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await getPlayById(id as string);
      setDetailTournament(response);
    } catch (error) {
      toast.error(`Error fetching data tournament: ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id !== undefined) {
      void fetchDetailTournament();
    }
  }, [id]);

  const handleOpenDelete = (value: boolean): void => {
    setDeletePost(value);
  };

  const handleOpenEdit = (data: Watchlist): void => {
    setIsEditModal(true);
    setEditedWatchlist(data);
  };

  const handleSubmitDeleteWatchlist = async (): Promise<void> => {
    try {
      await deleteWatchlist(deletedWatchlist);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      handleOpenDelete(false);
      setDeletedWatchlist('');
      setIsDeleted(!isDeleted);
    }
  };

  return (
    <>
      {isEditModal && userInfo && (
        <ModalEditWatchlist
          onClose={() => {
            setIsEditModal(prev => !prev);
          }}
          data={editedWatchlist}
          userInfo={userInfo}
          detailTournament={detailTournament}
        />
      )}

      <div className="w-full rounded-xl p-5 bg-white">
        {/* Page Title */}
        <div className="flex flex-col justify-start w-full gap-[5px]">
          <div className="flex justify-between ">
            <Image
              onClick={async () => {
                await router.push(`/homepage/play/${id as string}`);
              }}
              src={ArrowBackwardIcon}
              alt="ArrowBackwardIcon"
              width={30}
              height={30}
              className="cursor-pointer"
            />
            <Typography className="flex-1 text-center lg:text-xl text-base font-semibold font-poppins">
              {t('tournament.watchlist.myWatchlist')}
            </Typography>
          </div>
          <Typography className="lg:text-base text-sm font-normal text-[#7C7C7C] font-poppins">
            {t('tournament.watchlist.myWatchlistDescription')}
          </Typography>
        </div>

        {/* Watchlists */}
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="animate-spinner w-10 h-10" />
          </div>
        ) : (
          <div className="flex flex-col justify-start w-full gap-2 mt-4">
            {watchList !== null ? (
              <>
                {watchList
                  ?.slice(watchlistParams.startIndex, watchlistParams.endIndex)
                  .map(watchLists => (
                    <div
                      key={watchLists?.id}
                      className="flex items-center w-full p-2 gap-4 rounded-lg hover:bg-[#F2F2F2] duration-300 cursor-pointer"
                    >
                      <div
                        onClick={() => {
                          router.push(
                            `/homepage/play/${id as string}/watchlist/${
                              watchLists?.id
                            }`
                          );
                        }}
                        className="w-full flex items-center gap-5"
                      >
                        <Typography className="font-poppins text-base font-semibold">
                          {watchLists?.name}
                        </Typography>
                      </div>
                      <Menu placement="left-start">
                        <MenuHandler>
                          <Image
                            src={more_vertical}
                            alt="threeDots"
                            className="cursor-pointer"
                          />
                        </MenuHandler>
                        <MenuList className="flex list-none flex-col font-poppins gap-2 p-2 text-sm font-normal leading-5">
                          <MenuItem
                            className={`flex py-2 gap-2 cursor-pointer`}
                            style={{ color: '#000000' }}
                            onMouseEnter={e =>
                              (e.currentTarget.style.color = '#000000')
                            }
                            onClick={() => {
                              handleOpenEdit(watchLists);
                            }}
                          >
                            <Image src={edit} alt="editPost" />
                            {t('tournament.watchlist.editWatchlist')}
                          </MenuItem>
                          <MenuItem
                            className={`flex py-2 gap-2 cursor-pointer`}
                            style={{ color: '#FF3838' }}
                            onMouseEnter={e =>
                              (e.currentTarget.style.color = '#FF3838')
                            }
                            onClick={() => {
                              handleOpenDelete(true);
                              setDeletedWatchlist(watchLists?.id ?? '');
                            }}
                          >
                            <Image src={delet} alt="deletePost" />
                            {t('tournament.watchlist.delete')}
                          </MenuItem>
                        </MenuList>
                      </Menu>

                      {/* Modal Delete Watchlist */}
                      <Dialog
                        dismiss={{
                          outsidePress: false
                        }}
                        open={deletePost}
                        size={'xs'}
                        handler={handleOpenDelete}
                        className="text-center p-5 m-0 max-w-full sm:max-w-xs self-end sm:self-center md:self-center lg:self-center rounded-none rounded-t-2xl sm:rounded-2xl"
                      >
                        <DialogBody className="p-0 mb-6 font-poppins">
                          <p className="text-base font-semibold leading-6 text-gray-900 p-0 mb-4">
                            {t('tournament.watchlist.delete')}
                          </p>
                          <p className="font-normal text-sm">
                            {t('tournament.watchlist.deleteConfirm')}
                          </p>
                        </DialogBody>
                        <DialogFooter className="p-0">
                          <button
                            className="rounded-full min-w-full bg-[#DD2525] h-10 text-sm font-semibold capitalize text-white transition-all mb-6 font-poppins"
                            data-ripple-light="true"
                            onClick={async () => {
                              await handleSubmitDeleteWatchlist();
                            }}
                          >
                            {t('tournament.watchlist.delete')}
                          </button>
                          <Button
                            variant="text"
                            color="white"
                            onClick={() => {
                              handleOpenDelete(false);
                            }}
                            className="min-w-full hover:bg-transparent focus:bg-transparent text-[#3AC4A0] text-sm font-semibold rounded-full capitalize p-0 font-poppins"
                          >
                            <span>{t('tournament.watchlist.cancel')}</span>
                          </Button>
                        </DialogFooter>
                      </Dialog>
                    </div>
                  ))}
              </>
            ) : (
              <div className="bg-white flex flex-col justify-center items-center text-center lg:px-0 mt-8">
                <Image
                  alt=""
                  src={WatchlistNoData}
                  className="w-[250px]"
                  width={100}
                  height={100}
                />
                <p className="font-semibold text-black mt-4">
                  {t('tournament.watchlist.noData')}
                </p>
                <p className="text-[#7C7C7C] mt-2">
                  {t('tournament.watchlist.create')}
                </p>
                <div
                  onClick={() => {
                    router.push(
                      `/homepage/play/${id as string}/watchlist/create`
                    );
                  }}
                  className="bg-[#3AC4A0] mt-8 py-4 px-16 rounded-full text-white cursor-pointer font-poppins font-semibold"
                >
                  {t('tournament.watchlist.createWatchlist')}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Watchlist Pagination */}
        <div className="flex justify-center mx-auto my-8">
          <AssetPagination
            currentPage={watchlistParams.page}
            totalPages={Math.ceil(watchList?.length / 8)}
            onPageChange={page => {
              setWatchlistParams({
                page,
                startIndex: page * 8 - 8,
                endIndex: page * 8
              });
            }}
          />
        </div>
      </div>
    </>
  );
};

export default withAuth(TournamentHome);
