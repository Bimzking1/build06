import CancelAddAsset from '@/assets/play/tournament/cancel-add-asset.svg';
import SuccesAddAsset from '@/assets/play/tournament/success-asset.svg';
import { updateWatchlist } from '@/repository/market.repository';
import { type AssetWatchlist } from '@/utils/interfaces/watchlist.interface';
import { Button, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { XIcon } from 'public/assets/vector';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Modal from '../ui/modal/Modal';

interface Props {
  onClose: () => void;
  assetId: string;
  assetTicker: string;
  playId: string;
  assetName: string;
  fetchedWatchlists: AssetWatchlist[];
  checkboxState: string[];
  setCheckboxState: React.Dispatch<React.SetStateAction<string[]>>;
  isPlaySimulation: boolean;
  isTeamBattle: boolean;
  setIsRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalWatchlist: React.FC<Props> = ({
  onClose,
  assetId,
  assetTicker,
  playId,
  assetName,
  fetchedWatchlists,
  checkboxState,
  setCheckboxState,
  isPlaySimulation,
  isTeamBattle,
  setIsRefetch
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isOpenSuccessAddAsset, setIsOpenSuccessAddAsset] =
    useState<boolean>(false);
  const [isOpenCancelAddAsset, setIsOpenCancelAddAsset] =
    useState<boolean>(false);
  const [isOpenAlreadyExists, setIsOpenAlreadyExists] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [checkedWatchlist, setCheckedWatchlist] = useState<string[]>([
    ...checkboxState
  ]);

  const handleCheckboxChange = (
    watchlistId: string,
    isChecked: boolean
  ): void => {
    if (isChecked) {
      setCheckedWatchlist([...checkedWatchlist, watchlistId]);
    } else {
      setCheckedWatchlist(checkedWatchlist.filter(id => id !== watchlistId));
    }
  };

  const handleAddToWatchlist = async (): Promise<void> => {
    setIsLoading(true);
    let requestCount = 0;
    try {
      await Promise.all(
        fetchedWatchlists.map(async watchlist => {
          const watchlistId = watchlist.watchlist.id;
          const currentAssetList =
            watchlist.watchlist.assetList?.map(item => item.id) ?? [];
          const isChecked = checkedWatchlist.includes(watchlistId);
          const isAssetInWatchlist = currentAssetList.includes(assetId);

          if (isChecked && !isAssetInWatchlist) {
            const updatedAssets = [...currentAssetList, assetId];
            await updateWatchlist({
              watchlistId,
              asset_list: updatedAssets
            });
            requestCount++;
          } else if (!isChecked && isAssetInWatchlist) {
            const updatedAssets = currentAssetList.filter(id => id !== assetId);
            await updateWatchlist({
              watchlistId,
              asset_list: updatedAssets.length > 0 ? updatedAssets : []
            });
            requestCount++;
          }
        })
      );
      if (requestCount > 0) {
        setIsOpenSuccessAddAsset(true);
        setCheckboxState(checkedWatchlist);
        setIsRefetch(true);
      } else if (requestCount === 0 && checkedWatchlist.length > 0) {
        setIsOpenAlreadyExists(true);
        setCheckboxState(checkedWatchlist);
      } else {
        setIsOpenCancelAddAsset(true);
      }
    } catch (error) {
      toast.error(`Error adding ${assetName} to watchlist: ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAddAsset = (): void => {
    setIsOpenCancelAddAsset(true);
  };

  return (
    <Modal
      onClose={handleCancelAddAsset}
      backdropClasses="z-40 fixed top-0 left-0 w-full h-screen bg-black/75 flex justify-start items-start"
      modalClasses="z-50 animate-slide-down fixed bottom-0 md:top-[50%] md:left-[20%] md:right-[-20%] xl:left-[30%] xl:right-[-30%] mt-[-12.35rem] w-full md:w-[60%] xl:w-[40%] h-[390px] p-4 lg:rounded-2xl rounded-t-2xl shadow-[0 2px 8px rgba(0, 0, 0, 0.25)] bg-white"
    >
      {isLoading ? (
        <div className="flex items-center justify-center my-4">
          <div className="animate-spinner w-14 h-14 border-8 border-gray-200 border-t-seeds-button-green rounded-full" />
        </div>
      ) : !isOpenSuccessAddAsset &&
        !isOpenCancelAddAsset &&
        !isOpenAlreadyExists ? (
        <>
          <div className="flex justify-between items-center round mb-6">
            <Typography className="flex-1 text-center font-poppins font-semibold text-base">
              {t('tournament.watchlist.modalHeader')}
            </Typography>
            <Image
              src={XIcon}
              alt="X"
              width={30}
              height={30}
              onClick={handleCancelAddAsset}
              className="hover:scale-110 transition ease-out cursor-pointer"
            />
          </div>
          <div className="h-[150px] overflow-y-auto px-6 flex flex-col gap-2 mb-8 watchlist-scroll">
            {fetchedWatchlists.length > 0 ? (
              fetchedWatchlists.map(data => (
                <div
                  key={data?.watchlist?.id}
                  className="flex justify-between items-center bg-[#F9F9F9] p-2 rounded-lg sc"
                >
                  <Typography className="font-poppins font-normal text-base">
                    {data?.watchlist?.name}
                  </Typography>
                  <input
                    className="cursor-pointer w-5 h-5"
                    type="checkbox"
                    checked={checkedWatchlist.includes(data?.watchlist?.id)}
                    onChange={e => {
                      handleCheckboxChange(
                        data?.watchlist?.id,
                        e.target.checked
                      );
                    }}
                  />
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-full">
                <Typography className="font-poppins font-normal text-base">
                  {t('tournament.watchlist.noWatchlist')}
                </Typography>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center justify-center gap-4 px-6">
            <Button
              disabled={fetchedWatchlists.length === 0}
              onClick={handleAddToWatchlist}
              className="w-full rounded-full font-poppins font-semibold text-sm bg-seeds-button-green"
            >
              {t('tournament.watchlist.addToWatchlist')}
            </Button>
            <Button
              onClick={async () => {
                await router.push(
                  `${
                    isPlaySimulation && !isTeamBattle
                      ? `/homepage/play/${playId}/watchlist/create?assetTicker=${assetTicker}`
                      : isTeamBattle && !isPlaySimulation
                      ? `/play/team-battle/${playId}/watchlist/create?assetTicker=${assetTicker}`
                      : `/play/tournament/${playId}/watchlist/create?assetTicker=${assetTicker}`
                  }`
                );
              }}
              className="w-full rounded-full font-poppins font-semibold text-sm bg-white border-2 border-[#3ac4a0] text-seeds-button-green"
            >
              {t('tournament.watchlist.newWatchlist')}
            </Button>
          </div>
        </>
      ) : isOpenCancelAddAsset && !isOpenSuccessAddAsset ? (
        <div className="flex flex-col justify-center items-center gap-4 p-4">
          <div className="flex flex-col justify-center items-center gap-4">
            <Image
              src={CancelAddAsset}
              alt="success-seedy"
              width={160}
              height={160}
              className="mb-4"
            />
            <Typography className="font-poppins font-semibold text-base text-center">
              {t('tournament.watchlist.ops')}
            </Typography>
            <Typography className="font-poppins font-normal text-sm text-[#7C7C7C] text-center">
              {t('tournament.watchlist.cancelAddAsset')}
            </Typography>
          </div>
          <div className="flex flex-row gap-4 w-full">
            <Button
              onClick={() => {
                setIsOpenCancelAddAsset(prev => !prev);
              }}
              className="bg-red-500 w-full capitalize rounded-full font-poppins font-semibold text-sm"
            >
              {t('tournament.watchlist.no')}
            </Button>
            <Button
              onClick={onClose}
              className="bg-seeds-button-green w-full capitalize rounded-full font-poppins font-semibold text-sm"
            >
              {t('tournament.watchlist.yes')}
            </Button>
          </div>
        </div>
      ) : isOpenAlreadyExists && !isOpenSuccessAddAsset ? (
        <div className="flex flex-col justify-center items-center gap-4 p-4">
          <div className="flex flex-col justify-center items-center gap-4">
            <Image
              src={CancelAddAsset}
              alt="success-seedy"
              width={160}
              height={160}
              className="mb-4"
            />
            <Typography className="font-poppins font-semibold text-base text-center">
              {t('tournament.watchlist.ops')}
            </Typography>
            <Typography className="font-poppins font-normal text-sm text-[#7C7C7C] text-center">
              {t('tournament.watchlist.alreadyExist')}
            </Typography>
          </div>
          <Button
            onClick={onClose}
            className="bg-seeds-button-green w-full capitalize rounded-full font-poppins font-semibold text-sm"
          >
            {t('tournament.watchlist.ok')}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center gap-4 p-4">
          <div className="flex flex-col justify-center items-center gap-4">
            <Image
              src={SuccesAddAsset}
              alt="success-seedy"
              width={180}
              height={180}
              className="mb-4"
            />
            <Typography className="font-poppins font-semibold text-base text-center">
              {t('tournament.watchlist.horay')}
            </Typography>
            <Typography className="font-poppins font-normal text-sm text-[#7C7C7C] text-center">
              {`${t('tournament.watchlist.successAddAsset')}`}
            </Typography>
          </div>
          <Button
            onClick={onClose}
            className="bg-seeds-button-green w-full capitalize rounded-full font-poppins font-semibold text-sm"
          >
            {t('tournament.watchlist.continue')}
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default ModalWatchlist;
