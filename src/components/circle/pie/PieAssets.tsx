import { SearchCircle } from '@/components/forms/searchCircle';
import { getMarketList } from '@/repository/market.repository';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { Avatar, Button, Typography } from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CardAsset from './CardAsset';

interface props {
  changeToAsset: any;
  handleSelectedAsset: any;
  selectedAsset: any[];
  removeSelectedAsset: any;
  setPages: any;
}

interface AssetInterface {
  id: string;
  quote: string;
  currency: string;
  image: string;
  name: string;
  price: number;
  regularPercentage: number;
}

const initialFilterMarket = {
  page: 1,
  limit: 10,
  currency: '',
  search: '',
  type: 'ALL',
  sub_type: 'ALL'
};

const PieAssets: React.FC<props> = ({
  changeToAsset,
  selectedAsset,
  handleSelectedAsset,
  removeSelectedAsset,
  setPages
}) => {
  const { t } = useTranslation();
  const [asset, setAsset] = useState<any[]>();
  const [filterAsset, setFilterAsset] = useState(initialFilterMarket);
  const [isLoadingAsset, setIsLoadingAsset] = useState<boolean>(false);
  const tabValue = [
    {
      label: t('social.pieSection.overview'),
      value: 'ALL'
    },
    {
      label: t('social.pieSection.stocks'),
      value: 'STOCK'
    },
    {
      label: t('social.pieSection.crypto'),
      value: 'CRYPTO'
    }
  ];
  const handleChangeFilter = (event: any): void => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    setFilterAsset(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const fetchTopAsset = async (): Promise<void> => {
    try {
      setIsLoadingAsset(true);
      getMarketList(filterAsset)
        .then(res => {
          setAsset(res.marketAssetList);
          setIsLoadingAsset(false);
        })
        .catch(err => {
          setIsLoadingAsset(false);
          console.log(err);
        });
    } catch (error: any) {
      setIsLoadingAsset(false);
      console.error('Error fetching asset data:', error.message);
    }
  };

  const handleDefaultChecked = (data: AssetInterface): boolean => {
    const isDataExist = selectedAsset?.some(item => item.id === data.id);
    if (isDataExist) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    fetchTopAsset()
      .then()
      .catch(() => {});
  }, [filterAsset]);

  return (
    <div>
      <div>
        <h1 className="font-bold text-xl text-black">
          {t('social.pieSection.selectAsset')}
        </h1>
      </div>
      <button
        className="absolute top-5 right-5 text-gray-600 hover:text-gray-800 text-md"
        onClick={setPages}
      >
        <XMarkIcon className="cursor-pointer" width={30} height={30} />
      </button>

      <div className="flex flex-row mb-5">
        {selectedAsset.length !== 0
          ? selectedAsset.map((data, idx) => (
              <div
                className="relative flex flex-col mr-5 items-center justify-center"
                key={idx}
              >
                <Avatar
                  size="md"
                  variant="circular"
                  src={data.logo}
                  alt="Avatar"
                  className="mb-2"
                />
                <XCircleIcon
                  className="w-6 h-6 z-10 absolute transform top-[-20px] text-[#9E9E9E] border-white translate-x-1/2 translate-y-1/2"
                  onClick={() => removeSelectedAsset(idx)}
                />
              </div>
            ))
          : null}
      </div>

      <div>
        <div className="flex flex-row w-full gap-2 items-center justify-start my-2 text-sm">
          {tabValue.map((data, idx) => (
            <Button
              variant={filterAsset.type === data.value ? 'filled' : 'outlined'}
              name="type"
              value={data.value}
              className={`${
                filterAsset.type === data.value
                  ? 'bg-[#3AC4A0] text-white'
                  : 'border-[#3AC4A0] text-[#3AC4A0]'
              }`}
              key={idx}
              onClick={handleChangeFilter}
            >
              {data.label}
            </Button>
          ))}
        </div>

        <SearchCircle
          name="search"
          type="outline"
          prefix={<MagnifyingGlassIcon className="w-5 h-5 text-[#262626]" />}
          onChange={e => {
            handleChangeFilter(e);
          }}
          placeholder="Search"
          value={filterAsset.search}
        />

        {!isLoadingAsset ? (
          asset?.length !== 0 ? (
            asset?.map((data, idx) => (
              <CardAsset
                data={data}
                key={idx}
                handleSelectedAsset={handleSelectedAsset}
                isDefaultChecked={handleDefaultChecked}
              />
            ))
          ) : (
            <Typography className="text-base w-full font-semibold text-[#262626] text-center items-center my-3">
              Data Not Found
            </Typography>
          )
        ) : (
          <Typography className="text-base w-full font-semibold text-[#262626] text-center items-center my-3">
            Loading...
          </Typography>
        )}
      </div>

      <div className="flex items-center justify-center">
        <button
          className="text-white font-semibold font-poppins bg-seeds-button-green p-2 rounded-full mt-2 w-1/2"
          onClick={changeToAsset}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default PieAssets;
