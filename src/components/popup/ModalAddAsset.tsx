/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
'use client';
import {
  calculatePercentageDifference,
  formatAssetPrice
} from '@/helpers/currency';
import { getMarketList } from '@/repository/market.repository';
import {
  type IDetailTournament,
  type UserInfo
} from '@/utils/interfaces/tournament.interface';
import { type DetailAsset } from '@/utils/interfaces/watchlist.interface';
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

interface Props {
  onClose: () => void;
  setAssetList: (text: string[]) => void;
  assetList: string[];
  setDisplayAssetList?: React.Dispatch<React.SetStateAction<DetailAsset[]>>;
  userInfo?: UserInfo;
  detailTournament?: IDetailTournament;
}

const ModalAddAsset: React.FC<Props> = ({
  onClose,
  setAssetList,
  assetList,
  setDisplayAssetList,
  userInfo,
  detailTournament
}) => {
  const { t } = useTranslation();
  const [checkboxState, setCheckboxState] = useState<string[]>(assetList);
  const [assetState, setAssetState] = useState<DetailAsset[]>([]);
  const [assets, setAssets] = useState<DetailAsset[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>(
    detailTournament?.category ?? ''
  );
  const [filter, setFilter] = useState({
    search: searchQuery,
    limit: 5,
    page: 1,
    type: detailTournament?.category,
    currency: ''
  });

  const handleCheckboxChange = (
    asset: DetailAsset,
    id: string,
    checked: boolean
  ): void => {
    if (checked) {
      setCheckboxState([...checkboxState, id]);
      setAssetState(prev => [...prev, asset]);
    } else {
      setCheckboxState(checkboxState.filter((item: string) => item !== id));
      setAssetState(prev => prev.filter(item => item.id !== asset?.id));
    }
  };

  const handleSave = (): void => {
    setAssetList(checkboxState);
    if (setDisplayAssetList) {
      setDisplayAssetList(prev => [...prev, ...assetState]);
    }
    onClose();
  };

  useEffect(() => {
    if (userInfo !== undefined) {
      setFilter(prevState => ({
        ...prevState,
        currency: userInfo?.preferredCurrency ?? 'IDR'
      }));
    }
  }, [userInfo]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(event.target.value);
  };

  const fetchDataAssets = async (): Promise<void> => {
    try {
      const response = await getMarketList({
        ...filter,
        search: searchQuery
      });
      if (response.result === null) {
        setAssets([]);
      } else {
        setAssets(response.marketAssetList);
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (userInfo !== undefined && filter.currency !== '') {
      const fetchData = async (): Promise<void> => {
        await fetchDataAssets();
      };

      fetchData().catch(error => {
        toast.error('Error fetching data:', error);
      });
    }
  }, [filter, userInfo, searchQuery]);

  const handleArrow = (value: number): boolean => {
    if (value > 0) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Modal
      backdropClasses="z-40 fixed top-0 left-0 w-full h-screen bg-black/75 flex justify-start items-start"
      modalClasses="z-50 animate-slide-down fixed bottom-0 md:top-[40%] md:left-[10%] md:right-[-10%] xl:left-[22.5%] xl:right-[-22.5%] mt-[-12.35rem] w-full md:w-[80%] xl:w-[60%] h-[430px] md:h-[410px] p-4 lg:rounded-3xl rounded-t-3xl shadow-[0 2px 8px rgba(0, 0, 0, 0.25)] bg-white"
    >
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <Typography className="font-bold text-lg text-[#3AC4A0]">
            {t('tournament.watchlist.addAsset')}
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
        <div className="flex flex-row items-center gap-2 overflow-x-auto xs sm:w-full w-[285px] sm:h-[50px] h-[30px]">
          {detailTournament?.category === 'ALL' && (
            <div
              onClick={() => {
                setActiveFilter(detailTournament?.category);
                setFilter(prevState => ({
                  ...prevState,
                  type: detailTournament?.category
                }));
              }}
              className={`${
                activeFilter === detailTournament?.category
                  ? 'bg-seeds-green text-white'
                  : 'text-seeds-green'
              } flex items-center border-2 border-seeds-green lg:px-2 px-1 lg:py-1 font-poppins lg:text-sm text-xs rounded-lg cursor-pointer`}
            >
              {detailTournament?.category}
            </div>
          )}
          {detailTournament?.all_category.map(category => (
            <div
              key={category}
              onClick={() => {
                setActiveFilter(category);
                setFilter(prevState => ({ ...prevState, type: category }));
              }}
              className={`${
                activeFilter === category
                  ? 'bg-seeds-green text-white'
                  : 'text-seeds-green'
              } text-nowrap border-2 border-seeds-green lg:px-2 px-1 lg:py-1 font-poppins lg:text-sm text-xs rounded-lg cursor-pointer`}
            >
              {category?.replace(/_/g, ' ')}
            </div>
          ))}
        </div>
        <div className="w-full flex gap-2">
          <input
            id="search"
            type="text"
            name="search"
            value={searchQuery}
            onChange={e => {
              handleSearch(e);
            }}
            placeholder={`${t('tournament.watchlist.search')}`}
            className="block w-full text-[#262626] h-10 leading-4 placeholder:text-[#BDBDBD] focus:outline-0 disabled:bg-[#E9E9E9] p-3 pl-8 rounded-xl border border-[#BDBDBD]"
          />
        </div>
      </div>
      <div className="w-full gap-4 lg:h-[175px] h-[195px] overflow-y-auto lg:mt-0 mt-3">
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
                    ? `${asset.name.slice(0, 15)}...`
                    : asset?.name}
                </Typography>
              </div>
            </div>
            <div className="flex gap-[6px] items-center">
              <div className="flex flex-col items-end">
                <Typography className="font-poppins text-xs font-semibold">
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
              <input
                className="ml-4"
                type="checkbox"
                checked={!!checkboxState.includes(asset?.id)}
                onChange={e => {
                  handleCheckboxChange(asset, asset?.id, e.target.checked);
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="gap-2 w-full">
        <button
          onClick={() => {
            handleSave();
          }}
          className="bg-[#3AC4A0] rounded-lg text-white mt-4 py-2 px-4 w-full"
        >
          {t('tournament.watchlist.save')}
        </button>
      </div>
    </Modal>
  );
};

export default ModalAddAsset;
