import SuccesAddAsset from '@/assets/play/tournament/success-asset.svg';
import { Button, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/modal/Modal';

interface Props {
  assetId: string;
  playId: string;
  isPlaySimulation: boolean;
  isTeamBattle: boolean;
}

const ModalSuccesAddWatchlist: React.FC<Props> = ({
  assetId,
  playId,
  isPlaySimulation,
  isTeamBattle
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <Modal
      backdropClasses="z-40 fixed top-0 left-0 w-full h-screen bg-black/75 flex justify-start items-start"
      modalClasses="z-50 animate-slide-down fixed bottom-0 md:top-[50%] md:left-[20%] md:right-[-20%] xl:left-[35%] xl:right-[-35%] mt-[-14.35rem] w-full md:w-[40%] xl:w-[30%] h-[440px] p-4 lg:rounded-2xl rounded-t-2xl shadow-[0 2px 8px rgba(0, 0, 0, 0.25)] bg-white"
    >
      <div className="flex flex-col justify-center items-center gap-4 p-4">
        <div className="flex flex-col justify-center items-center gap-4">
          <Image
            src={SuccesAddAsset}
            alt="success-seedy"
            width={180}
            height={180}
          />
          <Typography className="font-poppins font-semibold text-base text-center">
            {t('tournament.watchlist.horay')}
          </Typography>
          <Typography className="font-poppins font-normal text-sm text-[#7C7C7C] text-center">
            {t('tournament.watchlist.successWatchlist')}
          </Typography>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <Button
            onClick={async () => {
              await router.push(
                `${
                  isPlaySimulation && !isTeamBattle
                    ? `/homepage/assets/${assetId}?playId=${playId}`
                    : isTeamBattle && !isPlaySimulation
                    ? `/play/team-battle/${playId}/${assetId}`
                    : `/play/tournament/${playId}/${assetId}`
                }`
              );
            }}
            className="bg-seeds-button-green w-full capitalize rounded-full font-poppins font-semibold text-sm"
          >
            {t('tournament.watchlist.backToAsset')}
          </Button>
          <Button
            onClick={async () => {
              await router.push(
                `${
                  isPlaySimulation && !isTeamBattle
                    ? `/homepage/play/${playId}/watchlist`
                    : isTeamBattle && !isPlaySimulation
                    ? `/play/team-battle/${playId}/watchlist`
                    : `/play/tournament/${playId}/watchlist`
                }`
              );
            }}
            className="bg-white text-seeds-green border-2 border-seeds-green w-full capitalize rounded-full font-poppins font-semibold text-sm"
          >
            {t('tournament.watchlist.seeWatchlist')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalSuccesAddWatchlist;
