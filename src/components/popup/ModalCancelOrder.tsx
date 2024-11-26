'use client';
import { Logout } from '@/constants/assets/images';
import { cancelOrderList } from '@/repository/play.repository';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { XIcon } from 'public/assets/vector';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Modal from '../ui/modal/Modal';

interface Props {
  onClose: () => void;
  orderId: string;
  playId: string;
}

const ModalCancelOrder: React.FC<Props> = ({ onClose, orderId, playId }) => {
  const { t } = useTranslation();

  const handleCancelOrder = async (): Promise<void> => {
    try {
      await cancelOrderList(playId, orderId);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      onClose();
    }
  };

  return (
    <Modal onClose={onClose}>
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
        <Image
          src={Logout.src}
          alt={Logout.alt}
          width={0}
          height={0}
          sizes="100vw"
          className="w-auto h-auto aspect-auto"
        />

        <Typography className="text-lg text-gray-500">
          {t('tournament.assets.cancelOrder')}
        </Typography>
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-[#3AC4A0] mt-5 w-full hover:bg-green-700 rounded-full hover:scale-105 transition ease-out">
          <Typography
            onClick={async () => {
              await handleCancelOrder();
            }}
            className="text-white text-lg font-bold text-center p-2"
          >
            {t('tournament.assets.yesCancel')}
          </Typography>
        </div>

        <Typography
          onClick={onClose}
          className="text-center cursor-pointer hover:scale-105 transition ease-out text-[#DD2525] text-lg font-bold"
        >
          {t('tournament.assets.noCancel')}
        </Typography>
      </div>
    </Modal>
  );
};

export default ModalCancelOrder;
