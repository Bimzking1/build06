import CCard from '@/components/CCard';
import { standartCurrency } from '@/helpers/currency';
import { type AssetI } from '@/utils/interfaces/play.interface';
import { Avatar } from '@material-tailwind/react';
interface AssetSocketI extends AssetI {
  socketPrice: number;
}
interface props {
  data: AssetSocketI;
  currency: string;
}

const CardPrice: React.FC<props> = ({ data, currency }) => {
  return (
    <CCard className="flex w-full p-4 border-none rounded-xl shadow-none bg-[#F9F9F9]">
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
        <div className="flex items-center">
          <p className="text-xl font-semibold text-black my-2">
            {currency ?? 'IDR'}{' '}
            {standartCurrency(data?.socketPrice ?? 0).replace('Rp', '')}
          </p>
        </div>
      </div>
    </CCard>
  );
};

export default CardPrice;
