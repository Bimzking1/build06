import SeedyPINModal from '@/assets/my-profile/editProfile/SeedyPINModal.png';
import {
  Button,
  Dialog,
  DialogBody,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import Link from 'next/link';

interface IPINModal {
  open: boolean;
  handleOpen: any;
}

const PINModal: React.FC<IPINModal> = ({ open, handleOpen }: IPINModal) => {
  return (
    <Dialog
      open={open}
      handler={handleOpen}
      size="lg"
      className="bg-[#3AC4A0] flex justify-center"
      dismiss={{ enabled: false }}
    >
      <DialogBody className="flex flex-col gap-8 items-center w-[48%]">
        <div className="flex flex-col gap-4 items-center">
          <Typography className="font-semibold font-poppins text-3xl text-white text-center">
            You have successfully changed your PIN
          </Typography>
          <Typography className="font-normal font-poppins text-base text-white">
            Don&apos;t forget your PIN, OK?
          </Typography>
          <Image
            src={SeedyPINModal}
            alt="SeedyPINModal"
            className="w-[317.45px]"
          />
        </div>
        <Link href={'/my-profile'} className="w-full">
          <Button
            onClick={handleOpen}
            className="bg-[#7555DA] font-semibold font-poppins text-sm text-white rounded-full w-full"
          >
            ok
          </Button>
        </Link>
      </DialogBody>
    </Dialog>
  );
};

export default PINModal;
