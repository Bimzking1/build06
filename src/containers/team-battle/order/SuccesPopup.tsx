/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { SuccessPlayOrder } from '@/assets/order-page';
import IconShare from '@/assets/play/tournament/share.svg';
import Loading from '@/components/popup/Loading';
import ModalMention from '@/containers/circle/[id]/ModalMention';
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface SuccessOrderData {
  id: string;
  battle_id: string;
  participant_id: string;
  asset: any;
  type: 'BUY' | 'SELL';
  total_assets: number;
  bid_price: number;
  stop_loss: number;
  pnl?: number;
  created_at: string;
  updated_at: string;
}

interface props {
  handleModal: () => void;
  open: boolean;
  successData: SuccessOrderData;
}

const SuccessOrderModal: React.FC<props> = ({
  handleModal,
  open,
  successData
}) => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [golId, setGolId] = useState<number>(1);

  const handleOpen = (): void => {
    if (isOpen) {
      document.body.classList.remove('modal-open');
    } else {
      document.body.classList.add('modal-open');
    }
    setIsOpen(!isOpen);
  };

  return (
    <Dialog
      className="p-4 py-5 md:py-0 md:p-8 m-0 max-w-sm self-end sm:self-center md:self-center lg:self-center rounded-none rounded-t-2xl sm:rounded-2xl md:rounded-2xl lg:rounded-2xl"
      dismiss={{
        outsidePress: false
      }}
      open={open}
      size={'sm'}
      handler={handleModal}
    >
      <div className="w-full h-full flex justify-end mr-3 cursor-pointer">
        <Image
          alt=""
          src={IconShare}
          className="w-[40px]"
          onClick={() => {
            setIsOpen(true);
          }}
        />
      </div>
      {isLoading && <Loading />}
      <div className="hidden">{golId}</div>
      <ModalMention
        open={isOpen}
        handleOpen={handleOpen}
        assetShare={successData}
        setIsLoading={setIsLoading}
        setGolId={setGolId}
      />
      <DialogHeader className="p-0 font-poppins">
        <div className="min-w-full flex items-center justify-center">
          <Image
            src={SuccessPlayOrder.src}
            alt="success play order"
            className="cursor-pointer"
            width={280}
            height={280}
          />
        </div>
      </DialogHeader>
      <DialogBody className="p-0 font-poppins">
        <div className="flex flex-col">
          <div className="flex justify-center">
            <Typography className="text-[#262626] font-semibold text-lg">
              {t('playSimulation.orderCompleted')}
            </Typography>
          </div>
          <div className="flex justify-center">
            <Typography className="text-[#7C7C7C] font-normal text-base">
              {successData?.type === 'BUY'
                ? t('playSimulation.orderCompletedBuy')
                : t('playSimulation.orderCompletedSell')}{' '}
              {`${successData?.total_assets} ${
                successData?.asset?.asset_name as string
              }`}
            </Typography>
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="p-0">
        <Button
          className="rounded-full min-w-full capitalize font-semibold text-sm bg-[#3AC4A0] text-white font-poppins mt-4"
          onClick={() => {
            router
              .push(`/play/team-battle/${id as string}/portfolio`)
              .catch(err => {
                toast.error(`Error fetching data: ${err as string}`);
              });
          }}
        >
          {t('buyAsset.text3')}
        </Button>
        <Button
          className="rounded-full min-w-full capitalize font-semibold text-sm  bg-white text-[#7555DA] font-poppins mt-4"
          onClick={() => {
            router
              .push(`/play/team-battle/${id as string}/asset-list`)
              .catch(err => {
                toast.error(`Error fetching data: ${err as string}`);
              });
          }}
        >
          {t('buyAsset.text4')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default SuccessOrderModal;
