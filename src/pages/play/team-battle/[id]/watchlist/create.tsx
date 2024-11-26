import Loading from '@/components/popup/Loading';
import ModalAddAsset from '@/components/popup/ModalAddAsset';
import ModalSuccesAddWatchlist from '@/components/popup/ModalSuccesAddWatchlist';
import {
  calculatePercentageDifference,
  formatAssetPrice
} from '@/helpers/currency';
import withAuth from '@/helpers/withAuth';
import { createWatchlist, getMarketList } from '@/repository/market.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { getBattleArena } from '@/repository/team-battle.repository';
import {
  type IDetailTournament,
  type UserInfo
} from '@/utils/interfaces/tournament.interface';
import {
  type DetailAsset,
  type WatchlistForm
} from '@/utils/interfaces/watchlist.interface';
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { Avatar, Button, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ArrowBackwardIcon } from 'public/assets/vector';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const CreateWatchlist: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id, assetTicker } = router.query;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState<boolean>(false);
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [detailTournament, setDetailTournament] = useState<IDetailTournament>();
  const [watchlistForm, setWatchlistForm] = useState<WatchlistForm>({
    play_id: id as string,
    name: '',
    image: '',
    asset_list: []
  });
  const [assetList, setAssetList] = useState<DetailAsset[]>([]);

  const fetchSelectedAsset = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await getMarketList({ search: assetTicker as string });
      const newAsset = response.marketAssetList[0];

      const isAlreadyInList = assetList.some(
        (asset: DetailAsset) => asset.id === newAsset.id
      );

      if (!isAlreadyInList) {
        setAssetList(prev => [...prev, newAsset]);
        setWatchlistForm(prev => ({
          ...prev,
          asset_list: [...prev.asset_list, newAsset.id]
        }));
      }
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDetailTournament = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await getBattleArena(id as string);
      setDetailTournament(response);
    } catch (error) {
      toast.error(`Error fetching data tournament: ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setWatchlistForm({ ...watchlistForm, name: event.target.value });
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await createWatchlist(watchlistForm);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      setIsLoading(false);
      setIsOpenSuccessModal(true);
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
    if (assetTicker !== undefined) {
      void fetchSelectedAsset();
    }
  }, [assetTicker]);

  useEffect(() => {
    fetchData()
      .then()
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (id !== undefined) {
      void fetchDetailTournament();
    }
  }, [id]);

  const handleArrow = (value: number): boolean => {
    if (value > 0) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="w-full bg-white p-5 rounded-2xl">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <Image
              onClick={() => {
                router.back();
              }}
              src={ArrowBackwardIcon}
              alt="ArrowBackwardIcon"
              width={30}
              height={30}
              className="cursor-pointer"
            />
            <Typography className="flex-1 text-center lg:text-xl text-lg font-poppins font-semibold">
              {t('tournament.watchlist.createWatchlist')}
            </Typography>
          </div>
          <div className="flex flex-col gap-1 mb-4">
            <Typography className="lg:text-xl text-base font-poppins font-semibold">
              {t('tournament.watchlist.createNewWatchlist')}
            </Typography>
            <Typography className="text-[#7C7C7C] lg:text-base text-sm font-poppins font-normal">
              {t('tournament.watchlist.descNewWatchlist')}
            </Typography>
          </div>
          <div className="flex flex-row gap-3 items-center mb-4">
            <div className="border-2 border-[#BDBDBD] flex flex-col gap-1 p-2 rounded-[10px] w-full">
              <Typography className="font-poppins font-semibold text-xs">
                {t('tournament.watchlist.watchlistName')}
              </Typography>
              <input
                className="text-[#7C7C7C] font-normal font-poppins text-xs focus:outline-none"
                type="text"
                placeholder={t('tournament.watchlist.groupName') ?? ''}
                onChange={e => {
                  handleInput(e);
                }}
                value={watchlistForm?.name}
              />
            </div>
          </div>
          <div className="flex flex-row items-center justify-between mb-4">
            <Typography className="lg:font-semibold font-bold lg:font-poppins font-montserrat lg:text-xl text-base">
              {t('tournament.watchlist.assets')}
            </Typography>
            <Button
              onClick={() => {
                setIsAssetModalOpen(true);
              }}
              className="bg-seeds-button-green rounded-full font-poppins capitalize"
            >
              {t('tournament.watchlist.btnEditAsset')}
            </Button>
          </div>
          <div className="my-2 mb-4 overflow-y-auto max-h-[250px] watchlist-scroll">
            {assetList.map((asset: DetailAsset) => (
              <div
                key={asset?.id}
                className="w-full flex items-center justify-between bg-[#F9F9F9] p-2 rounded-lg gap-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar src={asset?.logo} alt="logo" width={40} height={40} />
                  <div className="flex flex-col gap-[6px]">
                    <Typography className="font-poppins lg:text-sm text-xs font-semibold">
                      {asset?.realTicker} /{' '}
                      <span className="font-normal text-xs">
                        {userInfo?.preferredCurrency ?? 'IDR'}
                      </span>
                    </Typography>
                    <Typography className="text-[#7C7C7C] font-normal text-xs font-poppins">
                      {asset?.name !== undefined && asset.name.length > 18
                        ? `${asset.name.slice(0, 18)}...`
                        : asset?.name}
                    </Typography>
                  </div>
                </div>
                <div className="flex flex-col gap-[6px] items-end">
                  <Typography className="font-poppins text-sm font-semibold">
                    {userInfo?.preferredCurrency}{' '}
                    {new Intl.NumberFormat().format(
                      formatAssetPrice(asset?.priceBar?.close)
                    ) ?? 0}
                  </Typography>
                  <Typography
                    className={`flex font-normal text-xs ${
                      handleArrow(
                        calculatePercentageDifference(
                          asset?.priceBar?.open,
                          asset?.priceBar?.close
                        ).value
                      )
                        ? 'text-[#3AC4A0]'
                        : 'text-red-500'
                    }`}
                  >
                    {handleArrow(
                      calculatePercentageDifference(
                        asset?.priceBar?.open,
                        asset?.priceBar?.close
                      ).value
                    ) ? (
                      <ArrowTrendingUpIcon
                        height={15}
                        width={15}
                        className="mr-2"
                      />
                    ) : (
                      <ArrowTrendingDownIcon
                        height={15}
                        width={15}
                        className="mr-2"
                      />
                    )}
                    (
                    {
                      calculatePercentageDifference(
                        asset?.priceBar?.open,
                        asset?.priceBar?.close
                      )?.value
                    }{' '}
                    %)
                  </Typography>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Button
              disabled={
                watchlistForm.name.length < 2 ||
                watchlistForm.asset_list.length === 0
              }
              onClick={async () => {
                await handleSubmit();
              }}
              className="bg-seeds-button-green rounded-full font-poppins capitalize"
            >
              {t('tournament.watchlist.btnNewWatchlist')}
            </Button>
          </div>
          {isAssetModalOpen && (
            <ModalAddAsset
              onClose={() => {
                setIsAssetModalOpen(prev => !prev);
              }}
              setAssetList={(text: string[]) => {
                setWatchlistForm({ ...watchlistForm, asset_list: text });
              }}
              assetList={watchlistForm?.asset_list}
              setDisplayAssetList={setAssetList}
              userInfo={userInfo}
              detailTournament={detailTournament}
            />
          )}
          {isOpenSuccessModal && (
            <ModalSuccesAddWatchlist
              assetId={assetList[0]?.id}
              playId={id as string}
              isPlaySimulation={false}
              isTeamBattle={true}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default withAuth(CreateWatchlist);
