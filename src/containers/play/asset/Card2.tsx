import Information from '@/assets/play/tournament/informationsvg.svg';
import CCard from '@/components/CCard';
import { type AssetI } from '@/utils/interfaces/play.interface';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

interface props {
  data: AssetI;
  currency: string;
}

const KeystatCard: React.FC<props> = ({ data, currency }) => {
  const { t } = useTranslation();
  return (
    <CCard className="flex gap-8 w-full md:w-1/2 p-4 md:mt-5 md:rounded-lg border-none rounded-none">
      <div className="flex gap-2 items-center pt-4">
        <p className="text-sm items-center text-[#262626]">
          {t('play.keystat')}
        </p>
        <Image alt="" src={Information} className="h-[13] w-[13]" />
      </div>
      <div className="flex flex-row">
        <div className="flex-col w-1/3 text-left items-center">
          <p className="text-base font-light text-[#7C7C7C]">
            {t('playSimulation.open')}
          </p>
          <p className="text-base font-semibold text-black">
            {data?.lastPrice?.open !== undefined
              ? `${currency} ${new Intl.NumberFormat().format(
                  data?.lastPrice?.open
                )}`
              : '-'}
          </p>
        </div>
        <div className="flex-col w-1/3 text-left items-center">
          <p className="text-base font-light text-[#7C7C7C]">
            {t('playSimulation.dayHigh')}
          </p>
          <p className="text-base font-semibold text-black">
            {data?.lastPrice?.open !== undefined
              ? `${currency} ${new Intl.NumberFormat().format(
                  data?.lastPrice?.high
                )}`
              : '-'}
          </p>
        </div>
        <div className="flex-col w-1/3 text-left items-center">
          <p className="text-base font-light text-[#7C7C7C]">
            {t('playSimulation.dayLow')}
          </p>
          <p className="text-base font-semibold text-black">
            {data?.lastPrice?.open !== undefined
              ? `${currency} ${new Intl.NumberFormat().format(
                  data?.lastPrice?.low
                )}`
              : '-'}
          </p>
        </div>
      </div>
    </CCard>
  );
};

export default KeystatCard;
