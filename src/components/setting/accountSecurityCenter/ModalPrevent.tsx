import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Typography
} from '@material-tailwind/react';
import { useTranslation } from 'react-i18next';

interface IModalPrevent {
  open: boolean;
  handleOpen: () => void;
  text: string;
}

const ModalPrevent: React.FC<IModalPrevent> = ({
  open,
  handleOpen,
  text
}: IModalPrevent) => {
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      handler={handleOpen}
      size="sm"
      className="flex flex-col gap-8 md:rounded-[17px] rounded-t-[17px] rounded-b-none md:p-16 p-4 items-center md:relative absolute bottom-0 m-0 min-w-full"
      dismiss={{ enabled: false }}
    >
      <DialogBody className="flex flex-col gap-2 text-center p-0">
        <Typography className="font-poppins font-semibold text-xl text-[#262626]">
          {t('setting.setting.accountSecure.prevent.title')}
        </Typography>
        <Typography className="font-poppins font-light text-base text-[#7C7C7C]">
          {text}
        </Typography>
      </DialogBody>
      <DialogFooter className="p-0 w-full">
        <Button
          onClick={handleOpen}
          className="bg-[#3AC4A0] rounded-full w-full"
        >
          <Typography className="capitalize font-poppins font-semibold text-sm text-white">
            {t('setting.setting.accountSecure.confirm')}
          </Typography>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ModalPrevent;
