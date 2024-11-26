/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
'use-client';

import IconNoData from '@/assets/play/tournament/noData.svg';
import { calculatePercentageDifference } from '@/helpers/currency';
import { type AssetItemType } from '@/pages/homepage/play/[id]';
import { getMarketList } from '@/repository/market.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  assetType: string;
  subType: string;
  searchValue: string;
  sortBy: string;
}

const PlayAssetsList: React.FC<Props> = ({
  assetType,
  subType,
  searchValue,
  sortBy
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const id = router.query.id;
  const [assets, setAssets] = useState<AssetItemType[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo>();

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const fetchAssets = async () => {
    const assetsData = await getMarketList({
      type: assetType,
      sub_type: subType,
      search: searchValue,
      sort_by: sortBy,
      currency: userInfo?.preferredCurrency
    });
    setAssets(assetsData.marketAssetList);
  };

  useEffect(() => {
    fetchAssets();
  }, [assetType, subType, searchValue, sortBy]);

  const fetchData = async (): Promise<void> => {
    const dataInfo = await getUserInfo();
    setUserInfo(dataInfo);
  };
  
  useEffect(() => {
    fetchData()
      .then()
      .catch(() => {});
  }, []);

  const handleArrow = (value: number): boolean => {
    if (value > 0) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <div className="w-full flex flex-col justify-center items-center rounded-xl font-poppins bg-white">
        <div className="flex flex-col w-full">
          {
            assets !== null ?
              assets?.map((asset, index) => (
                <div
                  key={index}
                  className="flex justify-between w-full items-center p-2 md:p-4 mt-4 bg-[#F9F9F9] border border-[#E9E9E9] md:border-none rounded-lg"
                  onClick={() => {
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    router.push(`/play/tournament/${id}/${asset.id}`);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="flex gap-4">
                    <div className='flex justify-center items-center w-[40px] h-auto'>
                      <img
                        alt=""
                        src={asset.logo}
                        className="w-[35px] h-auto"
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="flex flex-col justify-center items-start">
                      <div className="flex justify-start items-center gap-1">
                        <Typography className="text-sm md:text-lg text-black font-poppins font-semibold">
                          {asset.seedsTicker} /
                        </Typography>
                        {asset?.assetType !== 'FOREX' ? (
                          <Typography className="font-normal ml-1 text-sm md:text-lg text-[#262626]">
                            {asset?.assetType === 'CRYPTO' && 'B'}
                            {userInfo?.preferredCurrency}
                          </Typography>
                        ) : null}
                      </div>
                      <Typography className="text-sm md:text-lg text-[#7C7C7C] font-poppins">
                        {asset.name}
                      </Typography>
                    </div>
                  </div>
                  <div className="ml-auto flex flex-col gap-0.5">
                    <div className="flex justify-end">
                      <Typography className="font-semibold text-sm text-[#262626]">
                        {userInfo?.preferredCurrency}{' '}
                        {asset.priceBar.close > 0.01
                          ? new Intl.NumberFormat().format(asset.priceBar.close)
                          : asset.priceBar.close}
                      </Typography>
                    </div>
                    <div className="flex justify-end">
                      <Typography
                        className={`flex font-normal text-sm ${
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
                            height={20}
                            width={20}
                            className="mr-2"
                          />
                        ) : (
                          <ArrowTrendingDownIcon
                            height={20}
                            width={20}
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
                </div>
              ))
          :
            <div className="bg-white flex flex-col justify-center items-center text-center lg:px-0">
              <Image alt="" src={IconNoData} className="w-[250px]" />
              <p className="font-semibold text-black">
                {t('tournament.assets.noAsset')}
              </p>
              <p className="text-[#7C7C7C] mb-8">{t('tournament.assets.noAssetMessage')}</p>
            </div>
          }
        </div>
      </div>
    </>
  );
};

export default PlayAssetsList;
