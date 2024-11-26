'use client';
// import Barcode from '@/assets/play/tournament/barcode.svg';
import CopyLink from '@/assets/play/tournament/copyTournamentLink.svg';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { XIcon } from 'public/assets/vector';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-qr-code';
import { toast } from 'react-toastify';
import Modal from '../ui/modal/Modal';

interface Props {
  onClose: () => void;
  url: string;
  playId: string;
}

const ModalShareTournament: React.FC<Props> = ({ onClose, url, playId }) => {
  const { t } = useTranslation();
  const baseUrl =
    process.env.NEXT_PUBLIC_DOMAIN ?? 'https://user-dev-gcp.seeds.finance';
  const handleCopyClick = async (): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const textToCopy = `${baseUrl}/play/tournament/${url}`;
    await navigator.clipboard.writeText(textToCopy).then(() => {
      toast("Tournament's link copied!");
    });
  };

  return (
    <Modal
      onClose={onClose}
      backdropClasses="z-40 fixed top-0 left-0 w-full h-screen bg-black/50 flex justify-start items-start"
    >
      <div className="flex justify-between">
        <Typography className="font-bold text-lg text-black">
          {t('tournament.shareArena')}
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

      <div className="flex flex-col gap-3 justify-center px-2 lg:px-8 pt-2 items-center text-center">
        <Typography className="text-lg text-black">
          {t('tournament.playId')} : {playId}
        </Typography>
        <div
          style={{ height: 'auto', margin: '0 auto' }}
          className="w-[80%] md:w-[50%]"
        >
          <QRCode
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
            value={`${baseUrl}/play/tournament/${url}`}
            viewBox={`0 0 256 256`}
          />
        </div>

        <Typography className="font-bold text-lg text-black">
          {t('tournament.shareLinks')}
        </Typography>

        <div className="w-full h-fit flex mb-4">
          <input
            id="search"
            type="text"
            name="search"
            placeholder=""
            readOnly={true}
            disabled={false}
            value={`${baseUrl}/play/tournament/${url}`}
            className="block w-full text-[#262626] h-11 leading-4 placeholder:text-[#BDBDBD] focus:outline-0 disabled:bg-[#E9E9E9] p-3 pl-8 rounded-xl border border-[#BDBDBD]"
          />
          <div
            onClick={handleCopyClick}
            className="w-[50px] cursor-pointer flex justify-center items-center"
          >
            <Image alt="" src={CopyLink} className="w-[20px]" />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalShareTournament;
