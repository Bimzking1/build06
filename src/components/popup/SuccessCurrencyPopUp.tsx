import { SuccessPlayOrder } from '@/assets/order-page';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

interface props {
  handleModal: () => void;
  open: boolean;
  currency: string;
}

const SuccessCurrencyPopup: React.FC<props> = ({
  handleModal,
  open,
  currency
}) => {
  const { t } = useTranslation();
  const width = useWindowInnerWidth();
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
            width={width !== undefined && width > 500 ? 280 : 180}
            height={width !== undefined && width > 500 ? 280 : 180}
          />
        </div>
      </DialogHeader>
      <DialogBody className="p-0 font-poppins">
        <div className="flex flex-col">
          <div className="flex justify-center">
            <Typography className="text-[#262626] font-semibold text-base md:text-lg">
              {`${t('chooseCurrency.yourCurrencyIs')} ${currency}`}
            </Typography>
          </div>
          <div className="flex justify-center">
            <Typography className="text-[#7C7C7C] text-center font-normal text-sm md:text-base">
              {t('chooseCurrency.successChangeCurrency').replace(
                /##/g,
                currency
              )}
            </Typography>
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="p-0">
        <Button
          className="rounded-full min-w-full capitalize font-semibold text-sm bg-[#3AC4A0] text-white font-poppins mt-4"
          onClick={() => {
            handleModal();
          }}
        >
          {t('chooseCurrency.buttonSuccess')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default SuccessCurrencyPopup;
