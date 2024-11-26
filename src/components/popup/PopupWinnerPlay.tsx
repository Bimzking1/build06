import { LosserPopup, WinnerPopup } from '@/constants/assets/images';
import { getPlayResult } from '@/repository/play.repository';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { XIcon } from 'public/assets/vector';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Modal from '../ui/modal/Modal';

export interface PopupProps {
  playId: string;
  onClose: () => void;
}

interface PlayResult {
  name: string;
  avatar_url: string;
  asset: number;
  gain: number;
  rank: number;
  medal: string;
  prize: number;
}

export const PopupWinnerPlay: React.FC<PopupProps> = ({ playId, onClose }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [dataResult, setDataResult] = useState<PlayResult>({
    name: '',
    avatar_url: '',
    asset: 0,
    gain: 0,
    rank: 0,
    medal: '',
    prize: 0
  });

  useEffect(() => {
    void fetchDataResult();
  }, [playId]);

  const fetchDataResult = async (): Promise<void> => {
    try {
      const result = await getPlayResult(playId);
      setDataResult(result.data);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };
  return (
    <Modal>
      <div className="flex justify-end">
        <Image
          src={XIcon}
          alt="X"
          width={30}
          height={30}
          onClick={onClose}
          className="hover:scale-110 transition ease-out cursor-pointer"
        />
      </div>

      <div className="flex flex-col gap-3 justify-center  px-8 pt-2 items-center text-center">
        <Typography className=" md:block font-poppins font-semibold text-2xl text-center text-wrap text-[#262626]">
          {dataResult?.prize > 0
            ? t('tournament.winnerModalTitle')
            : `${t('tournament.looseModalTitle')} ${dataResult?.rank}`}
        </Typography>
        {dataResult?.prize > 0 ? (
          <Image
            src={WinnerPopup.src}
            alt={WinnerPopup.alt}
            width={0}
            height={0}
            sizes="100vw"
            className="w-auto h-auto aspect-auto"
          />
        ) : (
          <Image
            src={LosserPopup.src}
            alt={LosserPopup.alt}
            width={0}
            height={0}
            sizes="100vw"
            className="w-auto h-auto aspect-auto"
          />
        )}
        <Typography className="font-poppins text-lg text-[#262626] mb-4 text-center px-8">
          {dataResult.prize > 0
            ? t('quiz.tax')
            : "Don't give up! Let's boost your investing knowledge from the experts"}
        </Typography>
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-[#3AC4A0] mt-5 w-full hover:bg-green-700 rounded-full hover:scale-105 transition ease-out">
          <Typography
            onClick={() => {
              void router.push(`/play/tournament/${playId}/notification`);
            }}
            className="text-white text-lg font-bold text-center p-2"
          >
            See Detail
          </Typography>
        </div>
      </div>
    </Modal>
  );
};
