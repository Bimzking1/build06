import FavoriteAdded from '@/assets/play/tournament/favorite-asset-checked.svg';
import Favorite from '@/assets/play/tournament/favorite-asset.svg';
import CCard from '@/components/CCard';
import ModalWatchlist from '@/components/popup/ModalWatchlist';
import {
  calculatePercentageDifference,
  formatAssetPrice
} from '@/helpers/currency';
import { getWatchlist, getWatchlistById } from '@/repository/market.repository';
import { type AssetI } from '@/utils/interfaces/play.interface';
import {
  type AssetWatchlist,
  type Watchlist
} from '@/utils/interfaces/watchlist.interface';
import { Avatar } from '@material-tailwind/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface AssetSocketI extends AssetI {
  socketPrice: number;
}
interface props {
  data: AssetSocketI;
  currency: string;
  playId: string;
  assetId: string;
  playSimulation: boolean;
  playTeamBattle: boolean;
}

const Card1: React.FC<props> = ({
  data,
  currency,
  playId,
  assetId,
  playSimulation,
  playTeamBattle
}) => {
  const { t } = useTranslation();
  const [watchList, setWatchlist] = useState<Watchlist[]>([]);
  const [isOpenModalWatchlist, setIsOpenModalWatchlist] =
    useState<boolean>(false);
  const [checkboxState, setCheckboxState] = useState<string[]>([]);
  const [fetchedWatchlists, setFetchedWatchlists] = useState<AssetWatchlist[]>(
    []
  );
  const [isRefetch, setIsRefetch] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchPlayWatchlist = async (): Promise<void> => {
    try {
      const response = await getWatchlist({ play_id: playId });
      setWatchlist(response?.listWatchlist);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  const fetchWatchlists = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const watchlistData = await Promise.allSettled(
        watchList.map(async watchlist => await getWatchlistById(watchlist.id))
      );
      const fulfilledWatchlists = watchlistData
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value) as AssetWatchlist[];
      setFetchedWatchlists(fulfilledWatchlists);
      const initialCheckboxState = fulfilledWatchlists
        .filter(watchlist =>
          watchlist.watchlist.assetList?.some(asset => asset.id === assetId)
        )
        .map(watchlist => watchlist.watchlist.id);

      setCheckboxState(initialCheckboxState);
      setIsRefetch(false);
    } catch (error) {
      toast.error(`Error fetching watchlists ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (playId !== undefined) {
      void fetchPlayWatchlist();
    }
  }, [playId]);

  useEffect(() => {
    if (watchList?.length > 0 && assetId !== undefined) {
      void fetchWatchlists();
    }
  }, [watchList, assetId]);

  useEffect(() => {
    void fetchWatchlists();
  }, [isRefetch]);

  const isAssetInWatchlist = checkboxState.length > 0;

  return (
    <CCard className="flex w-full md:w-1/2 p-4 md:mt-5 md:rounded-lg border-none rounded-none">
      <div className="flex flex-row justify-between">
        <div className="flex flex-row">
          <Avatar
            size="md"
            variant="circular"
            src={data?.logo}
            alt="Avatar"
            className="mr-5"
          />
          <div className="flex flex-col w-full">
            <p className="text-lg font-semibold font-poppins text-black">
              {data?.name ?? 'Loading...'}
            </p>
            <div className="flex flex-row gap-2">
              <p className="text-base font-semibold font-poppins text-black">
                {data?.realTicker} / {data?.assetType === 'CRYPTO' && 'B'}
                <span className="text-[#7C7C7C] font-normal">
                  {currency ?? 'IDR'}
                </span>
              </p>
            </div>
          </div>
        </div>
        {!isLoading && (
          <div
            onClick={() => {
              setIsOpenModalWatchlist(prev => !prev);
            }}
            className="cursor-pointer"
          >
            <Image
              src={isAssetInWatchlist ? FavoriteAdded : Favorite}
              alt="favorite"
              className="w-5 h-5"
            />
          </div>
        )}
      </div>
      <p className="text-xl font-semibold text-black my-2">
        {currency ?? 'IDR'} {formatAssetPrice(data?.socketPrice ?? 0)}
      </p>
      <div className="w-full flex flex-row justify-between">
        <p className="text-sm font-normal text-[#5E44FF]">
          {currency ?? 'IDR'} {formatAssetPrice(data?.lastPrice?.close ?? 0)} (
          {
            calculatePercentageDifference(
              data?.lastPrice?.open ?? 0,
              data?.lastPrice?.close ?? 0
            )?.value
          }{' '}
          %) - {t('playSimulation.today')}
        </p>
      </div>
      {isOpenModalWatchlist && (
        <ModalWatchlist
          assetName={data?.name}
          assetId={assetId}
          assetTicker={data?.realTicker}
          playId={playId}
          onClose={() => {
            setIsOpenModalWatchlist(prev => !prev);
          }}
          fetchedWatchlists={fetchedWatchlists}
          checkboxState={checkboxState}
          setCheckboxState={setCheckboxState}
          isPlaySimulation={playSimulation}
          isTeamBattle={playTeamBattle}
          setIsRefetch={setIsRefetch}
        />
      )}
    </CCard>
  );
};

export default Card1;
