import { SuccessPlayOrder } from '@/assets/order-page';
import { type SuccessOrderData } from '@/utils/interfaces/play.interface';
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
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

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
  const { playId } = router.query;
  const { t } = useTranslation();
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
      {successData?.lot !== undefined &&
        successData?.asset?.asset_name !== undefined && (
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
                  {`${successData?.lot ?? 0} ${
                    successData?.asset?.asset_name ?? ''
                  }`}
                </Typography>
              </div>
            </div>
          </DialogBody>
        )}
      <DialogFooter className="p-0">
        <Button
          className="rounded-full min-w-full capitalize font-semibold text-sm bg-[#3AC4A0] text-white font-poppins mt-4"
          onClick={() => {
            router
              .push(`/homepage/play/${playId as string}/portfolio`)
              .catch(err => {
                toast.error(`${err as string}`);
              });
          }}
        >
          Done
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default SuccessOrderModal;
