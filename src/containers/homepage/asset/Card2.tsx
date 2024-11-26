import CCard from '@/components/CCard';
import CountdownTimer from '@/components/play/CountdownTimer';
import { formatAssetPrice } from '@/helpers/currency';
import { getPlayById } from '@/repository/play.repository';
import { type AssetI } from '@/utils/interfaces/play.interface';
import { type IDetailTournament } from '@/utils/interfaces/tournament.interface';
import { Typography } from '@material-tailwind/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface props {
  data: AssetI;
  currency: string;
}

const Card2: React.FC<props> = ({ data, currency }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { playId } = router.query;
  const [detailTournament, setDetailTournament] = useState<IDetailTournament>();

  useEffect(() => {
    if (playId !== undefined) {
      void fetchDetailTournament();
    }
  }, [playId]);

  const fetchDetailTournament = async (): Promise<void> => {
    try {
      const resp: IDetailTournament = await getPlayById(playId as string);
      setDetailTournament(resp);
    } catch (error) {
      toast(`Error fetch detail tournament ${error as string}`);
    }
  };

  return (
    <CCard className="flex w-full md:w-1/2 p-2 md:mt-5 md:rounded-lg border-none rounded-none">
      <p className="text-sm text-center items-center text-[#262626]">
        {t('playSimulation.remainingTime')} :
      </p>
      {detailTournament?.end_time !== undefined ? (
        <CountdownTimer
          className="text-sm font-semibold text-center items-center text-[#3AC4A0] font-poppins"
          deadline={detailTournament?.end_time.toString()}
        />
      ) : (
        <Typography className="text-sm font-semibold text-center items-center text-[#3AC4A0] font-poppins">
          Loading...
        </Typography>
      )}
      <hr className="my-3" />
      <div className="flex flex-row">
        <div className="flex-col w-1/3 text-center items-center">
          <p className="text-sm md:text-base font-semibold text-black">
            {currency ?? 'IDR'} {formatAssetPrice(data?.lastPrice?.open ?? 0)}
          </p>
          <p className="text-sm md:text-base font-light text-[#7C7C7C]">
            {t('playSimulation.open')}
          </p>
        </div>
        <div className="flex-col w-1/3 text-center items-center">
          <p className="text-sm md:text-base font-semibold text-black">
            {currency ?? 'IDR'} {formatAssetPrice(data?.lastPrice?.high ?? 0)}
          </p>
          <p className="text-sm md:text-base font-light text-[#7C7C7C]">
            {t('playSimulation.dayHigh')}
          </p>
        </div>
        <div className="flex-col w-1/3 text-center items-center">
          <p className="text-sm md:text-base font-semibold text-black">
            {currency ?? 'IDR'} {formatAssetPrice(data?.lastPrice?.low ?? 0)}
          </p>
          <p className="text-sm md:text-base font-light text-[#7C7C7C]">
            {t('playSimulation.dayLow')}
          </p>
        </div>
      </div>
    </CCard>
  );
};

export default Card2;
