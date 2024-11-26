/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
'use client';
import { postCloud } from '@/repository/cloud.repository';
import { createWatchlist } from '@/repository/market.repository';
import { type WatchlistForm } from '@/utils/interfaces/watchlist.interface';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { XIcon } from 'public/assets/vector';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Modal from '../ui/modal/Modal';
import ModalAddAsset from './ModalAddAsset';

interface Props {
  onClose: () => void;
  id: string;
}

const ModalAddWatchlist: React.FC<Props> = ({ onClose, id }) => {
  const { t } = useTranslation();
  const [updateAvatar, setAvatar] = useState<File>();
  const [isDetailModal, setIsDetailModal] = useState<boolean>(false);
  const [form, setForm] = useState<WatchlistForm>({
    play_id: id,
    name: '',
    image: '',
    asset_list: []
  });

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setForm({ ...form, name: event.target.value });
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      let updatedForm = { ...form };
      if (updateAvatar !== undefined && updateAvatar !== null) {
        const { path: cloudResponse } = await postCloud({
          file: updateAvatar,
          type: 'OTHER_URL'
        });
        updatedForm = {
          ...updatedForm,
          image: cloudResponse
        };
      }
      await createWatchlist(updatedForm);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      onClose();
    }
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    setAvatar(file);
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
        />
      )}

      <Modal
        onClose={onClose}
        backdropClasses="z-40 fixed top-0 left-0 w-full h-screen bg-black/75 flex justify-start items-start"
        modalClasses="z-50 animate-slide-down fixed bottom-0 md:top-[40%] md:left-[10%] md:right-[-10%] xl:left-[22.5%] xl:right-[-22.5%] mt-[-12.35rem] w-full md:w-[80%] xl:w-[60%] h-[50vh] p-4 rounded-3xl shadow-[0 2px 8px rgba(0, 0, 0, 0.25)] bg-white overflow-y-scroll"
      >
        <div className="flex justify-between">
          <Typography className="font-bold text-lg text-[#3AC4A0]">
            {t('tournament.watchlist.add')}
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
        <div className="mt-4 gap-2">
          <div className="w-full">
            <div className="my-2">{t('tournament.watchlist.name')}:</div>
            <div>
              <input
                id="search"
                type="text"
                value={form?.name ?? 'Watchlist'}
                onChange={e => {
                  handleInput(e);
                }}
                name="search"
                placeholder={`${t('tournament.watchlist.enter')}`}
                className="block w-full xl:w-1/3 text-[#262626] h-11 leading-4 placeholder:text-[#BDBDBD] focus:outline-0 disabled:bg-[#E9E9E9] p-3 pl-4 rounded-lg border border-[#BDBDBD]"
              />
            </div>
          </div>
          <div className="w-full">
            <div className="my-2">{t('tournament.watchlist.photo')}:</div>
            <div>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div
            onClick={() => {
              setIsDetailModal(true);
            }}
            className="text-center mt-4 py-2 px-4 bg-[#3AC4A0] rounded-lg text-white cursor-pointer"
          >
            {t('tournament.watchlist.addAsset')}
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
        </div>
      </Modal>
    </>
  );
};

export default ModalAddWatchlist;
