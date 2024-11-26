import CCard from '@/components/CCard';
import { formatAssetPrice } from '@/helpers/currency';
import { useAppSelector } from '@/store/redux/store';
import { Avatar } from '@material-tailwind/react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

interface props {
  data: DetailAsset;
  loading: boolean;
}
interface DetailAsset {
  providerName: string;
  realTicker: string;
  logo: string;
  name: string;
  lastPrice: LastPrice;
  socketPrice?: number;
}
interface LastPrice {
  open: number;
}

const SkeletonLoader = (): JSX.Element => {
  return (
    <div className="animate-pulse">
      <div className="flex justify-between">
        <div className="flex flex-row w-full">
          <div className="rounded-full bg-gray-300 h-10 w-10"></div>
          <div className="flex flex-col ml-4 w-full">
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mt-2"></div>
          </div>
        </div>
        <div className="h-4 bg-gray-300 rounded w-1/3 mt-2"></div>
      </div>
    </div>
  );
};

const CardPrice: React.FC<props> = ({ data, loading }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { preferredCurrency } = useAppSelector(state => state.user.dataUser);
  if (loading) {
    return (
      <CCard className="flex w-full p-4 border-none rounded-xl shadow-none bg-[#F9F9F9]">
        <SkeletonLoader />
      </CCard>
    );
  }
  return (
    <>
      <CCard className="flex w-full p-4 border-none rounded-xl shadow-none bg-[#E9E9E9]">
        {router.query.transaction === 'buy' ? (
          <h1 className="text-center text-lg mb-2 font-semibold font-poppins text-[#201B1C]">
            {t('buyAsset.text1')}
          </h1>
        ) : (
          <h1 className="text-center text-lg mb-2 font-semibold font-poppins text-[#201B1C]">
            {t('buyAsset.text2')}
          </h1>
        )}
        <CCard className="flex w-full p-4 border-none rounded-xl shadow-none bg-[#F9F9F9]">
          <div className="flex flex-row justify-center">
            <div className="flex flex-row">
              <Avatar
                size="md"
                variant="circular"
                src={data?.logo}
                alt="Avatar"
                className="mr-5"
              />
              <div className="flex flex-col w-full">
                <div className="flex flex-row gap-2">
                  <p className="text-base md:text-lg font-semibold font-poppins text-black">
                    {data?.realTicker}
                  </p>
                </div>
                <p className="text-base md:text-lg font-light text-[#7C7C7C] font-poppins">
                  {data?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center mx-3">
              <p className="text-lg font-semibold text-black my-2">
                {preferredCurrency} {formatAssetPrice(data.socketPrice ?? 0)}
              </p>
            </div>
          </div>
        </CCard>
      </CCard>
    </>
  );
};

export default CardPrice;
