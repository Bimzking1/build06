/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
'use client';
import {
  calculatePercentageDifference,
  formatAssetPrice
} from '@/helpers/currency';
import { type AssetItemType } from '@/pages/homepage/play/[id]';
import {
  getWatchlistById,
  updateWatchlist
} from '@/repository/market.repository';
import {
  type IDetailTournament,
  type UserInfo
} from '@/utils/interfaces/tournament.interface';
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { Avatar, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { XIcon } from 'public/assets/vector';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Modal from '../ui/modal/Modal';
import ModalAddAsset from './ModalAddAsset';

interface WatchlistForm {
  watchlistId: string;
  asset_list: string[];
}

interface Watchlist {
  id: string;
  imgUrl: string;
  name: string;
  play_id: string;
}

interface AssetList {
  id: string;
  name: string;
  exchange: string;
  logo: string;
  seedsTicker: string;
  priceBar: PriceBar;
  listedCountry: string;
}

interface PriceBar {
  close: number;
  high: number;
  low: number;
  open: number;
}

interface Props {
  onClose: () => void;
  data: Watchlist;
  userInfo: UserInfo;
  setUpdate?: React.Dispatch<React.SetStateAction<boolean>>;
  detailTournament?: IDetailTournament;
}

const ModalEditWatchlist: React.FC<Props> = ({
  onClose,
  data,
  userInfo,
  setUpdate,
  detailTournament
}) => {
  const { t } = useTranslation();
  const [isDetailModal, setIsDetailModal] = useState<boolean>(false);
  const [assets, setAssets] = useState<AssetItemType[]>([]);
  const [watchList] = useState<string[]>([]);
  const [form, setForm] = useState<WatchlistForm>({
    watchlistId: data?.id,
    asset_list: watchList
  });

  useEffect(() => {
    void fetchPlayWatchlist();
  }, [data?.id, userInfo?.preferredCurrency]);

  const fetchPlayWatchlist = async (): Promise<void> => {
    try {
      const response = await getWatchlistById(
        data?.id,
        userInfo?.preferredCurrency
      );
      setAssets(response?.watchlist?.assetList);

      response?.watchlist?.assetList.forEach((asset: AssetList) => {
        watchList.push(asset?.id);
      });
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      await updateWatchlist(form);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      onClose();
      if (setUpdate) {
        setUpdate(prev => !prev);
      }
    }
  };

  const handleArrow = (value: number): boolean => {
    if (value > 0) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      {isDetailModal && (
        <ModalAddAsset
          onClose={() => {
            setIsDetailModal(prev => !prev);
          }}
          setAssetList={(text: string[]) => {
            setForm({ ...form, asset_list: text });
          }}
          assetList={form?.asset_list}
          userInfo={userInfo}
          detailTournament={detailTournament}
        />
      )}

      <Modal
        onClose={onClose}
        backdropClasses="z-40 fixed top-0 left-0 w-full h-screen bg-black/75 flex justify-start items-start"
        modalClasses="z-50 animate-slide-down fixed bottom-0 md:top-[40%] md:left-[10%] md:right-[-10%] xl:left-[22.5%] xl:right-[-22.5%] mt-[-12.35rem] w-full md:w-[80%] xl:w-[60%] h-[430px] md:h-[410px] p-4 lg:rounded-3xl rounded-t-3xl shadow-[0 2px 8px rgba(0, 0, 0, 0.25)] bg-white"
      >
        <div className="flex justify-between">
          <Typography className="font-bold text-lg text-[#3AC4A0]">
            {data?.name ?? 'Watchlist'}
          </Typography>
          <Image
            src={XIcon}
            alt="X"
            width={30}
            height={30}
            onClick={onClose}
            className="hover:scale-110 transition ease-out cursor-pointer"
          />
        </div>
        <div className="w-full mt-4">
          <div
            onClick={() => {
              setIsDetailModal(true);
            }}
            className="w-full py-2 px-4 bg-[#3AC4A0] rounded-lg text-white flex justify-center items-center cursor-pointer"
          >
            {t('tournament.watchlist.changeAsset')}
          </div>
        </div>
        <div className="w-full gap-4 mt-4 lg:h-[220px] h-[235px] overflow-y-auto team-battle-scroll">
          {assets?.map(asset => (
            <div
              key={asset.id}
              className="w-full h-fit py-2 mb-2 bg-[#F7FBFA] flex justify-between pl-2 pr-4 md:pl-4"
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
        <div className="w-full flex justify-center items-center">
          <button
            className="w-full md:w-[200px] bg-[#3AC4A0] rounded-lg text-white mt-4 py-2 px-4"
            onClick={async () => {
              await handleSubmit();
            }}
          >
            {t('tournament.watchlist.save')}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ModalEditWatchlist;
